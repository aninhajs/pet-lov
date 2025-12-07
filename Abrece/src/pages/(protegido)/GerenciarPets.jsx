import React, { useState, useEffect } from "react";
import api from "../../lib/api";
import ModalEditarPet from "../../components/ModalEditarPet";
import { Link } from "react-router-dom";
import { PetServices } from "../../services/PetServices";
import { AdoptionServices } from "../../services/AdoptionServices";

const GerenciarPets = () => {
  const [pets, setPets] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState("disponivel");
  const [filtroNome, setFiltroNome] = useState("");
  const [petSelecionado, setPetSelecionado] = useState(null);
  const [currentImageIndexes, setCurrentImageIndexes] = useState({});
  const [petEditando, setPetEditando] = useState(null);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);

  // Função para abrir modal de edição
  const abrirModalEditar = (pet) => {
    setPetEditando(pet);
  };

  // Função para fechar modal de edição
  const fecharModalEditar = () => {
    setPetEditando(null);
  };

  // Função para salvar edição
  const salvarEdicaoPet = async (dadosEditados) => {
    setIsEditSubmitting(true);
    try {
      // Remover campos 'imagem' e 'imagens' se existirem
      // const { imagem, imagens, ...dadosParaEnviar } = dadosEditados;
      const response = await PetServices.updatePet(
        dadosEditados.id,
        dadosEditados
      );
      if (response.success) {
        // Atualizar lista local
        setPets((prev) =>
          prev.map((pet) =>
            pet.id === dadosEditados.id ? { ...pet, ...dadosEditados } : pet
          )
        );
        fecharModalEditar();
      } else {
        alert(response.message || "Erro ao atualizar pet.");
      }
    } catch {
      alert("Erro ao atualizar pet.");
    } finally {
      setIsEditSubmitting(false);
    }
  };

  // Carregar pets do backend
  useEffect(() => {
    const carregarPets = async () => {
      console.log("🔄 Carregando pets do backend...");
      try {
        const response = await PetServices.getAllPets();
        if (response.success && response.data?.data) {
          // Formatar dados do backend para o formato esperado
          const petsFormatados = response.data.data.map((pet) => ({
            id: pet.id,
            nome: pet.nome,
            tipo: pet.tipo,
            idade: pet.idade,
            porte: pet.porte,
            sexo: pet.sexo,
            cor: pet.cor,
            peso: pet.peso,
            descricao: pet.descricao,
            castrado: pet.castrado,
            vacinado: pet.vacinado,
            vermifugado: pet.vermifugado,
            status: pet.status,
            imagem: pet.imagens?.[0]?.url_imagem || null,
            imagens: pet.imagens?.map((img) => img.url_imagem) || [],
          }));
          setPets(petsFormatados);
          console.log("\u2705 Pets carregados:", petsFormatados);
          console.log("\ud83d\udcf8 Pet exemplo:", petsFormatados[0]);
          if (petsFormatados[0]?.imagens) {
            console.log(
              "\ud83d\udcf8 Quantidade de imagens:",
              petsFormatados[0].imagens.length
            );
          }
        }
      } catch (error) {
        console.error("\u274c Erro ao carregar pets:", error);
      }
    };

    carregarPets();
  }, []);

  const petsFiltrados = pets
    .filter(
      (pet) =>
        filtroStatus === "todos" ||
        pet.status?.toLowerCase() === filtroStatus.toLowerCase()
    )
    .filter(
      (pet) =>
        !filtroNome ||
        pet.nome?.toLowerCase().includes(filtroNome.toLowerCase())
    );

  const alterarStatusPet = async (id, novoStatus) => {
    try {
      // Se for adoção, buscar candidato aprovado/interessado para o pet
      if (novoStatus === "adotado") {
        // Buscar interesses do pet para encontrar o candidato aprovado/interessado
        const interessesResp = await api.get(`/pet-interests/pet/${id}`);
        const interesses = interessesResp.data?.data || [];
        // Prioriza status aprovado, depois interessado
        const interesseAprovado = interesses.find(
          (i) => i.status === "aprovado"
        );
        const interesseInteressado = interesses.find(
          (i) => i.status === "interessado"
        );
        const interesse = interesseAprovado || interesseInteressado;
        if (!interesse || !interesse.candidato_id) {
          alert(
            "Não foi possível encontrar um candidato aprovado/interessado para este pet."
          );
          return;
        }
        // Chama o endpoint de adoção
        try {
          await AdoptionServices.createAdoption({
            pet_id: id,
            candidato_id: interesse.candidato_id,
            observacoes: "Adoção realizada via painel admin",
          });
        } catch (err) {
          alert(
            "Erro ao registrar adoção: " +
              (err?.response?.data?.error?.message || err.message)
          );
          return;
        }
      }

      // Atualizar status no backend
      const response = await PetServices.updatePet(id, { status: novoStatus });

      if (response.success) {
        // Atualizar lista local
        const petsAtualizados = pets.map((pet) =>
          pet.id === id ? { ...pet, status: novoStatus } : pet
        );
        setPets(petsAtualizados);
        console.log(`✅ Status do pet ${id} alterado para ${novoStatus}`);

        // Se o pet foi adotado, remover suas vacinas do sistema local
        if (novoStatus === "adotado") {
          const vacinasStorage = JSON.parse(
            localStorage.getItem("vacinas") || "[]"
          );
          const vacinasAtualizadas = vacinasStorage.filter(
            (vacina) => vacina.petId.toString() !== id.toString()
          );
          localStorage.setItem("vacinas", JSON.stringify(vacinasAtualizadas));

          const atividadesStorage = JSON.parse(
            localStorage.getItem("atividades") || "[]"
          );
          const petAdotado = pets.find((p) => p.id === id);
          const atividadesAtualizadas = atividadesStorage.filter(
            (atividade) => {
              if (atividade.tipo === "vacina") {
                return atividade.petNome !== petAdotado?.nome;
              }
              return true;
            }
          );
          localStorage.setItem(
            "atividades",
            JSON.stringify(atividadesAtualizadas)
          );

          console.log(`Pet ${id} adotado - vacinas removidas do sistema`);
        }
      } else {
        alert(`Erro ao alterar status: ${response.message}`);
      }
    } catch (error) {
      console.error("❌ Erro ao alterar status do pet:", error);
      alert("Erro ao alterar status do pet. Tente novamente.");
    }
  };

  const excluirPet = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este pet?")) {
      try {
        // Excluir do backend
        const response = await PetServices.deletePet(id);

        if (response.success) {
          // Atualizar lista local
          const petsAtualizados = pets.filter((pet) => pet.id !== id);
          setPets(petsAtualizados);

          // Excluir vacinas do localStorage
          const vacinasStorage = JSON.parse(
            localStorage.getItem("vacinas") || "[]"
          );
          const vacinasAtualizadas = vacinasStorage.filter(
            (vacina) => vacina.petId.toString() !== id.toString()
          );
          localStorage.setItem("vacinas", JSON.stringify(vacinasAtualizadas));

          // Excluir atividades de vacina do pet
          const atividadesStorage = JSON.parse(
            localStorage.getItem("atividades") || "[]"
          );
          const atividadesAtualizadas = atividadesStorage.filter(
            (atividade) => {
              if (atividade.tipo === "vacina") {
                const petExcluido = pets.find((p) => p.id === id);
                return atividade.petNome !== petExcluido?.nome;
              }
              return true;
            }
          );
          localStorage.setItem(
            "atividades",
            JSON.stringify(atividadesAtualizadas)
          );

          setPetSelecionado(null);
          console.log(
            `✅ Pet ${id} excluído junto com suas vacinas e atividades`
          );
        } else {
          alert(`Erro ao excluir pet: ${response.message}`);
        }
      } catch (error) {
        console.error("❌ Erro ao excluir pet:", error);
        alert("Erro ao excluir pet. Tente novamente.");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "disponivel":
        return "bg-green-100 text-green-800";
      case "adotado":
        return "bg-blue-100 text-blue-800";
      case "em_processo":
        return "bg-yellow-100 text-yellow-800";
      case "indisponivel":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "disponivel":
        return "Disponível";
      case "adotado":
        return "Adotado";
      case "em_processo":
        return "Em Processo";
      case "indisponivel":
        return "Indisponível";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f4f0e4" }}>
      {/* Header */}
      <header
        className="shadow-lg border-b-2 border-yellow-300"
        style={{ backgroundColor: "#f4f0e4" }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center h-auto sm:h-20 py-2 sm:py-0 gap-2">
            <div className="flex items-center space-x-3 w-full sm:w-auto mb-2 sm:mb-0">
              <img
                src="/logoabrace.jpg"
                alt="Abrace Uma Causa Animal"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover shadow-lg border-2 border-yellow-200 flex-shrink-0"
              />
              <div className="min-w-0">
                <h1
                  className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-sky-600 to-sky-700 bg-clip-text text-transparent leading-tight break-words max-w-[120px] sm:max-w-none"
                  style={{ wordBreak: "break-word" }}
                >
                  Central de Gerenciamento
                </h1>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <Link
                to="/admin"
                className="text-white bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 px-3 py-2 rounded-md text-sm font-medium transition-colors text-center"
              >
                🏠 Dashboard
              </Link>
              <Link
                to="/admin/cadastrar-pet"
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium shadow-md transition-all text-center"
              >
                ➕ Novo Pet
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  window.location.href = "/login";
                }}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-md transition-all text-center"
              >
                🚪 Sair
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Título e filtros */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-sky-600 to-yellow-500 bg-clip-text text-transparent">
              Gerenciar Pets 🐾
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Visualize e gerencie todos os pets cadastrados
          </p>

          <div className="flex flex-wrap gap-3">
            {/* Removed 'Todos' filter per request - only Disponíveis / Em Processo / Adotados remain */}
            <button
              onClick={() => setFiltroStatus("disponivel")}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold shadow-md transition-all ${
                filtroStatus === "disponivel"
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white scale-105"
                  : "bg-white text-gray-700 hover:bg-green-50 hover:text-green-600 hover:scale-105"
              }`}
            >
              ✅ Disponíveis (
              {pets.filter((p) => p.status === "disponivel").length})
            </button>
            <button
              onClick={() => setFiltroStatus("em_processo")}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold shadow-md transition-all ${
                filtroStatus === "em_processo"
                  ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 scale-105"
                  : "bg-white text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 hover:scale-105"
              }`}
            >
              ⏳ Em Processo (
              {pets.filter((p) => p.status === "em_processo").length})
            </button>
            <button
              onClick={() => setFiltroStatus("adotado")}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold shadow-md transition-all ${
                filtroStatus === "adotado"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white scale-105"
                  : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:scale-105"
              }`}
            >
              ❤️ Adotados ({pets.filter((p) => p.status === "adotado").length})
            </button>
          </div>
        </div>

        {/* Lista de pets */}
        <div className="bg-white shadow-xl rounded-xl overflow-hidden border-2 border-sky-200">
          <div className="px-6 py-5 border-b-2 border-sky-100 bg-gradient-to-r from-sky-50 to-yellow-50 flex items-center justify-between">
            <h2 className="text-xl font-bold text-sky-700">
              🐾 Pets Cadastrados ({petsFiltrados.length})
            </h2>
            <input
              type="text"
              placeholder="Pesquisar por nome..."
              className="ml-4 px-4 py-2 rounded-lg border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm w-64"
              value={filtroNome}
              onChange={(e) => setFiltroNome(e.target.value)}
            />
          </div>

          <div className="divide-y divide-gray-200">
            {petsFiltrados.map((pet) => (
              <div
                key={pet.id}
                className="px-6 py-5 hover:bg-gradient-to-r hover:from-sky-50 hover:to-yellow-50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-20 h-20 bg-gradient-to-br from-sky-50 to-yellow-50 rounded-lg overflow-hidden shadow-sm flex items-center justify-center group">
                      {pet.imagens && pet.imagens.length > 0 ? (
                        <>
                          <img
                            src={pet.imagens[currentImageIndexes[pet.id] || 0]}
                            alt={`${pet.nome} - Foto ${
                              (currentImageIndexes[pet.id] || 0) + 1
                            }`}
                            className="w-full h-full object-contain hover:scale-105 transition-transform duration-200"
                            loading="lazy"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextElementSibling.style.display =
                                "flex";
                            }}
                          />

                          {/* Setas de navegação - só aparecem se tiver mais de 1 foto */}
                          {pet.imagens.length > 1 && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentImageIndexes((prev) => ({
                                    ...prev,
                                    [pet.id]: Math.max(
                                      0,
                                      (prev[pet.id] || 0) - 1
                                    ),
                                  }));
                                }}
                                disabled={
                                  !currentImageIndexes[pet.id] ||
                                  currentImageIndexes[pet.id] === 0
                                }
                                className={`absolute left-0.5 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1 shadow-md transition-all opacity-0 group-hover:opacity-100 ${
                                  !currentImageIndexes[pet.id] ||
                                  currentImageIndexes[pet.id] === 0
                                    ? "cursor-not-allowed opacity-40"
                                    : ""
                                }`}
                              >
                                <svg
                                  className="w-3 h-3 text-gray-800"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                  />
                                </svg>
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentImageIndexes((prev) => ({
                                    ...prev,
                                    [pet.id]: Math.min(
                                      pet.imagens.length - 1,
                                      (prev[pet.id] || 0) + 1
                                    ),
                                  }));
                                }}
                                disabled={
                                  currentImageIndexes[pet.id] >=
                                  pet.imagens.length - 1
                                }
                                className={`absolute right-0.5 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1 shadow-md transition-all opacity-0 group-hover:opacity-100 ${
                                  currentImageIndexes[pet.id] >=
                                  pet.imagens.length - 1
                                    ? "cursor-not-allowed opacity-40"
                                    : ""
                                }`}
                              >
                                <svg
                                  className="w-3 h-3 text-gray-800"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </button>

                              {/* Indicador de quantidade de fotos */}
                              <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded-full">
                                {(currentImageIndexes[pet.id] || 0) + 1}/
                                {pet.imagens.length}
                              </div>
                            </>
                          )}
                        </>
                      ) : pet.imagem ? (
                        <img
                          src={pet.imagem}
                          alt={pet.nome}
                          className="w-full h-full object-contain hover:scale-105 transition-transform duration-200"
                          loading="lazy"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextElementSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className={`absolute inset-0 flex items-center justify-center ${
                          pet.imagens?.length > 0 || pet.imagem
                            ? "hidden"
                            : "flex"
                        }`}
                      >
                        <span className="text-2xl opacity-60">
                          {pet.tipo === "cao"
                            ? "🐕"
                            : pet.tipo === "gato"
                            ? "🐱"
                            : "🐾"}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-gray-900">
                          {pet.nome}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                            pet.status
                          )}`}
                        >
                          {getStatusText(pet.status)}
                        </span>
                      </div>

                      <div className="mt-1 text-sm text-gray-600">
                        <p>
                          {pet.tipo} • {pet.sexo} • {pet.idade} • {pet.porte}
                        </p>
                        <p className="mt-1">{pet.descricao}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => setPetSelecionado(pet)}
                      className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md transition-all hover:scale-105"
                    >
                      Detalhes
                    </button>
                    <button
                      onClick={() => abrirModalEditar(pet)}
                      className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 px-4 py-2 rounded-lg text-sm font-medium shadow-md transition-all hover:scale-105"
                    >
                      Editar
                    </button>
                    {/* Modal de edição de pet */}
                    {petEditando && (
                      <ModalEditarPet
                        pet={petEditando}
                        onClose={fecharModalEditar}
                        onSave={salvarEdicaoPet}
                        isSubmitting={isEditSubmitting}
                      />
                    )}

                    {pet.status === "disponivel" && (
                      <button
                        onClick={() => alterarStatusPet(pet.id, "em_processo")}
                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 px-4 py-2 rounded-lg text-sm font-medium shadow-md transition-all hover:scale-105"
                      >
                        Em Processo
                      </button>
                    )}

                    {pet.status === "em_processo" && (
                      <>
                        <button
                          onClick={() => alterarStatusPet(pet.id, "adotado")}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md transition-all hover:scale-105"
                        >
                          ❤️ Adotado
                        </button>
                        <button
                          onClick={() => alterarStatusPet(pet.id, "disponivel")}
                          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md transition-all hover:scale-105"
                        >
                          ✅ Disponível
                        </button>
                      </>
                    )}

                    {pet.status === "adotado" && (
                      <button
                        onClick={() => alterarStatusPet(pet.id, "disponivel")}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md transition-all hover:scale-105"
                      >
                        🔄 Reativar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {petsFiltrados.length === 0 && (
            <div className="px-6 py-8 text-center">
              <div className="text-4xl mb-4">🐾</div>
              <p className="text-gray-500 mb-2">
                {pets.length === 0
                  ? "Nenhum pet cadastrado ainda."
                  : `Nenhum pet encontrado com o status "${filtroStatus}".`}
              </p>
              {pets.length === 0 && (
                <Link
                  to="/admin/cadastrar-pet"
                  className="mt-4 inline-block bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white px-6 py-3 rounded-lg text-sm font-semibold shadow-lg transition-all hover:scale-105"
                >
                  ➕ Cadastrar Primeiro Pet
                </Link>
              )}
              {filtroStatus !== "disponivel" && pets.length > 0 && (
                <button
                  onClick={() => setFiltroStatus("disponivel")}
                  className="mt-4 text-sky-600 hover:text-sky-700 font-semibold"
                >
                  ✅ Ver disponíveis
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modal de detalhes */}
      {petSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-sky-200">
            <div className="px-6 py-5 border-b-2 border-sky-100 bg-gradient-to-r from-sky-50 to-yellow-50 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-sky-700 flex items-center">
                🐾 Detalhes do Pet
              </h2>
              <div className="flex items-center gap-4">
                {/* Status Atual */}
                <div className="flex items-center">
                  <span className="text-base mr-2 text-sky-700 ">
                    📊 Status Atual:
                  </span>
                  <span
                    className={`px-3 py-1 text-sm rounded-full font-semibold shadow-sm ${getStatusColor(
                      petSelecionado.status
                    )}`}
                  >
                    {getStatusText(petSelecionado.status)}
                  </span>
                </div>
                <button
                  onClick={() => setPetSelecionado(null)}
                  className="text-gray-400 hover:text-sky-600 text-2xl transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div className="text-center">
                <div className="relative w-64 h-64 mx-auto overflow-hidden rounded-xl shadow-lg bg-gradient-to-br from-sky-50 to-yellow-50 flex items-center justify-center">
                  {petSelecionado.imagens &&
                  petSelecionado.imagens.length > 0 ? (
                    <>
                      <img
                        src={
                          petSelecionado.imagens[
                            currentImageIndexes[petSelecionado.id] || 0
                          ]
                        }
                        alt={`${petSelecionado.nome} - Foto ${
                          (currentImageIndexes[petSelecionado.id] || 0) + 1
                        }`}
                        className="w-full h-full object-contain"
                        loading="lazy"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextElementSibling?.style &&
                            (e.target.nextElementSibling.style.display =
                              "flex");
                        }}
                      />

                      {/* Setas de navegação no modal */}
                      {petSelecionado.imagens.length > 1 && (
                        <>
                          <button
                            onClick={() => {
                              setCurrentImageIndexes((prev) => ({
                                ...prev,
                                [petSelecionado.id]: Math.max(
                                  0,
                                  (prev[petSelecionado.id] || 0) - 1
                                ),
                              }));
                            }}
                            disabled={
                              !currentImageIndexes[petSelecionado.id] ||
                              currentImageIndexes[petSelecionado.id] === 0
                            }
                            className={`absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all ${
                              !currentImageIndexes[petSelecionado.id] ||
                              currentImageIndexes[petSelecionado.id] === 0
                                ? "opacity-40 cursor-not-allowed"
                                : "hover:scale-110"
                            }`}
                          >
                            <svg
                              className="w-6 h-6 text-gray-800"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                              />
                            </svg>
                          </button>

                          <button
                            onClick={() => {
                              setCurrentImageIndexes((prev) => ({
                                ...prev,
                                [petSelecionado.id]: Math.min(
                                  petSelecionado.imagens.length - 1,
                                  (prev[petSelecionado.id] || 0) + 1
                                ),
                              }));
                            }}
                            disabled={
                              currentImageIndexes[petSelecionado.id] >=
                              petSelecionado.imagens.length - 1
                            }
                            className={`absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all ${
                              currentImageIndexes[petSelecionado.id] >=
                              petSelecionado.imagens.length - 1
                                ? "opacity-40 cursor-not-allowed"
                                : "hover:scale-110"
                            }`}
                          >
                            <svg
                              className="w-6 h-6 text-gray-800"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </button>

                          {/* Indicadores */}
                          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                            {petSelecionado.imagens.map((_, index) => (
                              <button
                                key={index}
                                onClick={() =>
                                  setCurrentImageIndexes((prev) => ({
                                    ...prev,
                                    [petSelecionado.id]: index,
                                  }))
                                }
                                className={`h-2.5 rounded-full transition-all ${
                                  index ===
                                  (currentImageIndexes[petSelecionado.id] || 0)
                                    ? "bg-white w-8"
                                    : "bg-white/60 w-2.5 hover:bg-white/80"
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : petSelecionado.imagem ? (
                    <img
                      src={petSelecionado.imagem}
                      alt={petSelecionado.nome}
                      className="w-full h-full object-contain"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextElementSibling?.style &&
                          (e.target.nextElementSibling.style.display = "flex");
                      }}
                    />
                  ) : null}
                  <div
                    className={`absolute inset-0 flex items-center justify-center ${
                      petSelecionado.imagens?.length > 0 ||
                      petSelecionado.imagem
                        ? "hidden"
                        : "flex"
                    }`}
                  >
                    <span className="text-8xl opacity-50">
                      {petSelecionado.tipo === "cao"
                        ? "🐕"
                        : petSelecionado.tipo === "gato"
                        ? "🐱"
                        : "🐾"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 min-w-[260px]">
                  <h3 className="font-semibold text-sky-700 mb-3 text-base flex items-center">
                    ℹ️ Informações Básicas
                  </h3>
                  <div className="bg-gradient-to-br from-sky-50 to-blue-50 p-4 rounded-lg space-y-2 text-sm border border-sky-100">
                    <p className="flex justify-between">
                      <span className="text-gray-600">Nome:</span>
                      <strong className="text-gray-900">
                        {petSelecionado.nome}
                      </strong>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">Tipo:</span>
                      <strong className="text-gray-900">
                        {petSelecionado.tipo}
                      </strong>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">Idade:</span>
                      <strong className="text-gray-900">
                        {petSelecionado.idade}
                      </strong>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">Sexo:</span>
                      <strong className="text-gray-900">
                        {petSelecionado.sexo}
                      </strong>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">Porte:</span>
                      <strong className="text-gray-900">
                        {petSelecionado.porte}
                      </strong>
                    </p>
                    {petSelecionado.cor && (
                      <p className="flex justify-between">
                        <span className="text-gray-600">Cor:</span>
                        <strong className="text-gray-900">
                          {petSelecionado.cor}
                        </strong>
                      </p>
                    )}
                    {petSelecionado.peso && (
                      <p className="flex justify-between">
                        <span className="text-gray-600">Peso:</span>
                        <strong className="text-gray-900">
                          {petSelecionado.peso}kg
                        </strong>
                      </p>
                    )}
                  </div>
                  {/* Status de Saúde logo abaixo das informações básicas */}
                  <div className="mt-6">
                    <h3 className="font-semibold text-sky-700 mb-3 text-base flex items-center">
                      💊 Status de Saúde
                    </h3>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg space-y-2 text-sm border border-green-100">
                      <p className="flex justify-between items-center">
                        <span className="text-gray-600">Castrado:</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            petSelecionado.castrado
                              ? "bg-green-200 text-green-800"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {petSelecionado.castrado ? "✓ Sim" : "✗ Não"}
                        </span>
                      </p>
                      <p className="flex justify-between items-center">
                        <span className="text-gray-600">Vacinado:</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            petSelecionado.vacinado
                              ? "bg-green-200 text-green-800"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {petSelecionado.vacinado ? "✓ Sim" : "✗ Não"}
                        </span>
                      </p>
                      <p className="flex justify-between items-center">
                        <span className="text-gray-600">Vermifugado:</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            petSelecionado.vermifugado
                              ? "bg-green-200 text-green-800"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {petSelecionado.vermifugado ? "✓ Sim" : "✗ Não"}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sky-700 mb-2 text-base">
                  📝 Descrição
                </h3>
                <div className="bg-gradient-to-br from-sky-50 to-yellow-50 p-4 rounded-lg text-sm border border-sky-100">
                  <p className="text-gray-700 leading-relaxed">
                    {petSelecionado.descricao}
                  </p>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    if (petSelecionado.status === "disponivel") {
                      alterarStatusPet(petSelecionado.id, "em_processo");
                    } else if (petSelecionado.status === "em_processo") {
                      alterarStatusPet(petSelecionado.id, "adotado");
                    } else if (petSelecionado.status === "adotado") {
                      alterarStatusPet(petSelecionado.id, "disponivel");
                    }
                    setPetSelecionado(null);
                  }}
                  className="flex-1 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all hover:scale-105"
                >
                  {petSelecionado.status === "disponivel" &&
                    "⏳ Marcar como Em Processo"}
                  {petSelecionado.status === "em_processo" &&
                    "❤️ Marcar como Adotado"}
                  {petSelecionado.status === "adotado" && "🔄 Reativar Pet"}
                </button>

                <button
                  onClick={() => excluirPet(petSelecionado.id)}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all hover:scale-105"
                >
                  🗑️ Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GerenciarPets;
