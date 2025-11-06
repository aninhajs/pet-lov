import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const GerenciarPets = () => {
  const [pets, setPets] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [petSelecionado, setPetSelecionado] = useState(null);

  // Carregar pets do localStorage
  useEffect(() => {
    console.log("GerenciarPets: Carregando pets do localStorage");
    const petsStorage = JSON.parse(localStorage.getItem("pets") || "[]");
    console.log("GerenciarPets: Pets carregados:", petsStorage);
    setPets(petsStorage);
  }, []);

  const petsFiltrados =
    filtroStatus === "todos"
      ? pets
      : pets.filter(
          (pet) => pet.status?.toLowerCase() === filtroStatus.toLowerCase()
        );

  const alterarStatusPet = (id, novoStatus) => {
    const petsAtualizados = pets.map((pet) =>
      pet.id === id ? { ...pet, status: novoStatus } : pet
    );
    setPets(petsAtualizados);
    localStorage.setItem("pets", JSON.stringify(petsAtualizados));
  };

  const excluirPet = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este pet?")) {
      // Excluir o pet
      const petsAtualizados = pets.filter((pet) => pet.id !== id);
      setPets(petsAtualizados);
      localStorage.setItem("pets", JSON.stringify(petsAtualizados));

      // Excluir vacinas do pet
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
      const atividadesAtualizadas = atividadesStorage.filter((atividade) => {
        // Remove atividades de vacina deste pet
        if (atividade.tipo === "vacina") {
          const petExcluido = pets.find((p) => p.id === id);
          return atividade.petNome !== petExcluido?.nome;
        }
        return true;
      });
      localStorage.setItem("atividades", JSON.stringify(atividadesAtualizadas));

      setPetSelecionado(null);

      console.log(`Pet ${id} excluído junto com suas vacinas e atividades`);
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
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/admin" className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">
                🐾 Pet Lov Admin
              </h1>
            </Link>
            <div className="flex space-x-4">
              <Link
                to="/admin"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/admin/cadastrar-pet"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                + Novo Pet
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("isAdminLoggedIn");
                  window.location.href = "/";
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sair
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Título e filtros */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Gerenciar Pets
          </h1>
          <p className="text-gray-600 mb-6">
            Visualize e gerencie todos os pets cadastrados
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFiltroStatus("todos")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filtroStatus === "todos"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Todos ({pets.length})
            </button>
            <button
              onClick={() => setFiltroStatus("disponivel")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filtroStatus === "disponivel"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Disponíveis (
              {pets.filter((p) => p.status === "disponivel").length})
            </button>
            <button
              onClick={() => setFiltroStatus("em_processo")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filtroStatus === "em_processo"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Em Processo (
              {pets.filter((p) => p.status === "em_processo").length})
            </button>
            <button
              onClick={() => setFiltroStatus("adotado")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filtroStatus === "adotado"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Adotados ({pets.filter((p) => p.status === "adotado").length})
            </button>
          </div>
        </div>

        {/* Lista de pets */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Pets Cadastrados ({petsFiltrados.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {petsFiltrados.map((pet) => (
              <div key={pet.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden shadow-sm">
                      {pet.imagem ? (
                        <img
                          src={pet.imagem}
                          alt={pet.nome}
                          className="w-full h-full object-cover object-center hover:scale-110 transition-transform duration-200"
                          loading="lazy"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextElementSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className={`absolute inset-0 flex items-center justify-center ${
                          pet.imagem ? "hidden" : "flex"
                        }`}
                      >
                        <span className="text-2xl opacity-60">
                          {pet.tipo === "cão"
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
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm transition-colors"
                    >
                      Ver Detalhes
                    </button>

                    {pet.status === "disponivel" && (
                      <button
                        onClick={() => alterarStatusPet(pet.id, "em_processo")}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Em Processo
                      </button>
                    )}

                    {pet.status === "em_processo" && (
                      <>
                        <button
                          onClick={() => alterarStatusPet(pet.id, "adotado")}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Adotado
                        </button>
                        <button
                          onClick={() => alterarStatusPet(pet.id, "disponivel")}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Disponível
                        </button>
                      </>
                    )}

                    {pet.status === "adotado" && (
                      <button
                        onClick={() => alterarStatusPet(pet.id, "disponivel")}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Reativar
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
                  className="mt-4 inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Cadastrar Primeiro Pet
                </Link>
              )}
              {filtroStatus !== "todos" && pets.length > 0 && (
                <button
                  onClick={() => setFiltroStatus("todos")}
                  className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Ver todos os pets
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modal de detalhes */}
      {petSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Detalhes do Pet
              </h2>
              <button
                onClick={() => setPetSelecionado(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div className="text-center">
                <div className="relative w-64 h-64 mx-auto overflow-hidden rounded-xl shadow-lg bg-gradient-to-br from-gray-100 to-gray-200">
                  {petSelecionado.imagem ? (
                    <img
                      src={petSelecionado.imagem}
                      alt={petSelecionado.nome}
                      className="w-full h-full object-cover object-center"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextElementSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className={`absolute inset-0 flex items-center justify-center ${
                      petSelecionado.imagem ? "hidden" : "flex"
                    }`}
                  >
                    <span className="text-8xl opacity-50">
                      {petSelecionado.tipo === "cão"
                        ? "🐕"
                        : petSelecionado.tipo === "gato"
                        ? "🐱"
                        : "🐾"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    Informações Básicas
                  </h3>
                  <div className="bg-gray-50 p-3 rounded space-y-1 text-sm">
                    <p>
                      <strong>Nome:</strong> {petSelecionado.nome}
                    </p>
                    <p>
                      <strong>Tipo:</strong> {petSelecionado.tipo}
                    </p>
                    <p>
                      <strong>Idade:</strong> {petSelecionado.idade}
                    </p>
                    <p>
                      <strong>Sexo:</strong> {petSelecionado.sexo}
                    </p>
                    <p>
                      <strong>Porte:</strong> {petSelecionado.porte}
                    </p>
                    {petSelecionado.cor && (
                      <p>
                        <strong>Cor:</strong> {petSelecionado.cor}
                      </p>
                    )}
                    {petSelecionado.peso && (
                      <p>
                        <strong>Peso:</strong> {petSelecionado.peso}kg
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    Status de Saúde
                  </h3>
                  <div className="bg-gray-50 p-3 rounded space-y-1 text-sm">
                    <p>
                      <strong>Castrado:</strong>{" "}
                      {petSelecionado.castrado ? "Sim" : "Não"}
                    </p>
                    <p>
                      <strong>Vacinado:</strong>{" "}
                      {petSelecionado.vacinado ? "Sim" : "Não"}
                    </p>
                    <p>
                      <strong>Vermifugado:</strong>{" "}
                      {petSelecionado.vermifugado ? "Sim" : "Não"}
                    </p>
                    {petSelecionado.necessidadesEspeciais && (
                      <p>
                        <strong>Necessidades Especiais:</strong>{" "}
                        {petSelecionado.necessidadesEspeciais}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Descrição</h3>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <p>{petSelecionado.descricao}</p>
                </div>
              </div>

              {petSelecionado.historia && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">História</h3>
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <p>{petSelecionado.historia}</p>
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Status Atual</h3>
                <span
                  className={`px-3 py-1 text-sm rounded-full ${getStatusColor(
                    petSelecionado.status
                  )}`}
                >
                  {getStatusText(petSelecionado.status)}
                </span>
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
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded font-medium transition-colors"
                >
                  {petSelecionado.status === "disponivel" &&
                    "Marcar como Em Processo"}
                  {petSelecionado.status === "em_processo" &&
                    "Marcar como Adotado"}
                  {petSelecionado.status === "adotado" && "Reativar Pet"}
                </button>

                <button
                  onClick={() => excluirPet(petSelecionado.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium transition-colors"
                >
                  Excluir
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
