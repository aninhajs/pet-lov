import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PetServices } from "../services/PetServices";

// Função para otimizar URLs de imagem
const optimizeImageUrl = (url, width = 400, height = 300) => {
  if (!url) return null;

  // Se for uma imagem do Placeholder.com, ajusta o tamanho
  if (url.includes("placeholder.com")) {
    return url.replace(/\d+x\d+/, `${width}x${height}`);
  }

  // Se for base64 ou URL normal, retorna como está
  return url;
};

const Pets = () => {
  const [selectedFilter, setSelectedFilter] = useState("todos");
  const [cityMenu, setCityMenu] = useState(null); // null | "fortaleza-ce" | "aquiraz-ce"
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [currentImageIndexes, setCurrentImageIndexes] = useState({});
  const [modalImageIndex, setModalImageIndex] = useState(0);

  // Carregar todos os pets do backend
  useEffect(() => {
    const carregarPets = async () => {
      try {
        const response = await PetServices.getAllPets();
        if (response.success && response.data?.data) {
          console.log("📦 Dados brutos do backend:", response.data.data);

          // Formatar dados do backend para o formato esperado pelo frontend
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
            localizacao: pet.localizacao,
            status: pet.status,
            // Extrair URLs das imagens
            imagens: pet.imagens?.map((img) => img.url_imagem) || [],
            imagem: pet.imagens?.[0]?.url_imagem || null,
          }));
          setPets(petsFormatados);
          console.log("\u2705 Pets carregados do backend:", petsFormatados);
          console.log(
            "📍 Pet Esmeralda com localização:",
            petsFormatados.find((p) => p.nome === "Esmeralda")
          );
          console.log(
            "\ud83d\udcf8 Exemplo de pet com imagens:",
            petsFormatados[0]
          );
        }
      } catch (error) {
        console.error("\u274c Erro ao carregar pets:", error);
      }
    };

    carregarPets();
  }, []);

  // Funções do modal
  const openModal = (pet) => {
    console.log("🔍 Pet selecionado:", pet);
    console.log("📍 Localização do pet:", pet.localizacao);
    setSelectedPet(pet);
    setModalImageIndex(0);
  };

  const closeModal = () => {
    setSelectedPet(null);
    setModalImageIndex(0);
  };

  // Funções para navegar no carrossel
  const handlePrevImage = (petId, e) => {
    e.stopPropagation();
    setCurrentImageIndexes((prev) => ({
      ...prev,
      [petId]: Math.max(0, (prev[petId] || 0) - 1),
    }));
  };

  const handleNextImage = (petId, totalImages, e) => {
    e.stopPropagation();
    setCurrentImageIndexes((prev) => ({
      ...prev,
      [petId]: Math.min(totalImages - 1, (prev[petId] || 0) + 1),
    }));
  };

  const filteredPets = pets.filter((pet) => {
    // Normalizar para comparação (remove acentos e converte para minúsculas)
    const normalizarTexto = (texto) => {
      return texto
        ?.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
    };

    // Filtros combinados de cidade + tipo (aceita "cao" ou "cão")
    if (selectedFilter === "fortaleza-ce-cão") {
      return (
        (normalizarTexto(pet.localizacao)?.includes("fortaleza") ||
          normalizarTexto(pet.localizacao)?.includes("fortaleza-ce")) &&
        ["cao", "cão"].includes(normalizarTexto(pet.tipo))
      );
    }
    if (selectedFilter === "fortaleza-ce-gato") {
      return (
        (normalizarTexto(pet.localizacao)?.includes("fortaleza") ||
          normalizarTexto(pet.localizacao)?.includes("fortaleza-ce")) &&
        normalizarTexto(pet.tipo) === "gato"
      );
    }
    if (selectedFilter === "aquiraz-ce-cão") {
      return (
        (normalizarTexto(pet.localizacao)?.includes("aquiraz") ||
          normalizarTexto(pet.localizacao)?.includes("aquiraz-ce")) &&
        ["cao", "cão"].includes(normalizarTexto(pet.tipo))
      );
    }
    if (selectedFilter === "aquiraz-ce-gato") {
      return (
        (normalizarTexto(pet.localizacao)?.includes("aquiraz") ||
          normalizarTexto(pet.localizacao)?.includes("aquiraz-ce")) &&
        normalizarTexto(pet.tipo) === "gato"
      );
    }

    // Filtros por tipo (aceita "cao" ou "cão")
    if (selectedFilter === "cão") {
      const tipoNormalizado = normalizarTexto(pet.tipo);
      return ["cao", "cão"].includes(tipoNormalizado);
    }
    if (selectedFilter === "gato") {
      const tipoNormalizado = normalizarTexto(pet.tipo);
      return tipoNormalizado === "gato";
    }

    // Filtros por status
    if (
      selectedFilter === "disponivel" ||
      selectedFilter === "em_processo" ||
      selectedFilter === "adotado"
    ) {
      return pet.status === selectedFilter;
    }

    // Filtros por cidade simples
    if (selectedFilter === "fortaleza-ce") {
      return (
        normalizarTexto(pet.localizacao)?.includes("fortaleza") ||
        normalizarTexto(pet.localizacao)?.includes("fortaleza-ce")
      );
    }
    if (selectedFilter === "aquiraz-ce") {
      return (
        normalizarTexto(pet.localizacao)?.includes("aquiraz") ||
        normalizarTexto(pet.localizacao)?.includes("aquiraz-ce")
      );
    }

    // Todos
    if (selectedFilter === "todos") return true;
    return true;
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f4f0e4" }}>
      {/* Header customizado para Pets - sem botão "Ver Pets" */}
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
              <h1
                className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-sky-600 to-sky-700 bg-clip-text text-transparent leading-tight break-words max-w-[120px] sm:max-w-none"
                style={{ wordBreak: "break-word" }}
              >
                Abrace Uma Causa Animal
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
              <Link
                to="/"
                className="text-gray-700 hover:text-sky-600 px-3 py-2 rounded-md text-sm font-medium transition-colors text-center"
              >
                Início
              </Link>
              <Link
                to="/questionnaire"
                className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-md transition-all text-center"
              >
                Adotar Pet
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Título e filtros */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Todos os Pets ({pets.length})
          </h1>
          {/* <h2 className="text-2xl font-bold mb-6">
            <span className="bg-gradient-to-r from-sky-500 via-yellow-400 to-green-400 bg-clip-text text-transparent drop-shadow-lg">
              Como posso ajudar?
            </span>
          </h2> */}
          <p className="text-gray-600 mb-4">
            Veja todos os pets cadastrados - disponíveis, em processo de adoção
            e já adotados
          </p>

          {/* Contador de pets por status */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-200 via-green-100 to-green-50 p-3 sm:p-4 rounded-xl text-center shadow-md border border-green-400">
              <div className="flex flex-col items-center justify-center">
                <span className="text-2xl sm:text-3xl font-extrabold text-green-700 flex items-center gap-2">
                  🟢 {pets.filter((pet) => pet.status === "disponivel").length}
                </span>
                <span className="text-base sm:text-lg font-bold text-green-800 mt-1 tracking-wide">
                  Disponíveis
                </span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-yellow-200 via-yellow-100 to-yellow-50 p-3 sm:p-4 rounded-xl text-center shadow-md border border-yellow-400">
              <div className="flex flex-col items-center justify-center">
                <span className="text-2xl sm:text-3xl font-extrabold text-yellow-700 flex items-center gap-2">
                  ⏳ {pets.filter((pet) => pet.status === "em_processo").length}
                </span>
                <span className="text-base sm:text-lg font-bold text-yellow-800 mt-1 tracking-wide">
                  Em Processo
                </span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-200 via-gray-100 to-gray-50 p-3 sm:p-4 rounded-xl text-center shadow-md border border-gray-400">
              <div className="flex flex-col items-center justify-center">
                <span className="text-2xl sm:text-3xl font-extrabold text-gray-700 flex items-center gap-2">
                  ❤️ {pets.filter((pet) => pet.status === "adotado").length}
                </span>
                <span className="text-base sm:text-lg font-bold text-gray-800 mt-1 tracking-wide">
                  Adotados
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 w-full mb-2">
              Filtrar por tipo:
            </h3>
            <button
              onClick={() => setSelectedFilter("todos")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedFilter === "todos"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Todos os tipos
            </button>
            <button
              onClick={() => setSelectedFilter("cão")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedFilter === "cão"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Cães
            </button>
            <button
              onClick={() => setSelectedFilter("gato")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedFilter === "gato"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Gatos
            </button>
            {/* Filtros por cidade com submenu */}
            <div className="relative inline-block">
              <button
                onClick={() =>
                  setCityMenu(
                    cityMenu === "fortaleza-ce" ? null : "fortaleza-ce"
                  )
                }
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedFilter.startsWith("fortaleza-ce")
                    ? "bg-blue-700 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Pets Fortaleza-CE
              </button>
              {cityMenu === "fortaleza-ce" && (
                <div className="absolute left-0 mt-2 bg-white border rounded-lg shadow-lg z-20 min-w-[140px]">
                  <button
                    onClick={() => {
                      setSelectedFilter("fortaleza-ce-cão");
                      setCityMenu(null);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm rounded-t-lg ${
                      selectedFilter === "fortaleza-ce-cão"
                        ? "bg-blue-100 text-blue-800"
                        : "hover:bg-blue-50"
                    }`}
                  >
                    Cães
                  </button>
                  <button
                    onClick={() => {
                      setSelectedFilter("fortaleza-ce-gato");
                      setCityMenu(null);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm rounded-b-lg ${
                      selectedFilter === "fortaleza-ce-gato"
                        ? "bg-blue-100 text-blue-800"
                        : "hover:bg-blue-50"
                    }`}
                  >
                    Gatos
                  </button>
                </div>
              )}
            </div>
            <div className="relative inline-block">
              <button
                onClick={() =>
                  setCityMenu(cityMenu === "aquiraz-ce" ? null : "aquiraz-ce")
                }
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedFilter.startsWith("aquiraz-ce")
                    ? "bg-blue-700 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Pets Aquiraz-CE
              </button>
              {cityMenu === "aquiraz-ce" && (
                <div className="absolute left-0 mt-2 bg-white border rounded-lg shadow-lg z-20 min-w-[140px]">
                  <button
                    onClick={() => {
                      setSelectedFilter("aquiraz-ce-cão");
                      setCityMenu(null);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm rounded-t-lg ${
                      selectedFilter === "aquiraz-ce-cão"
                        ? "bg-blue-100 text-blue-800"
                        : "hover:bg-blue-50"
                    }`}
                  >
                    Cães
                  </button>
                  <button
                    onClick={() => {
                      setSelectedFilter("aquiraz-ce-gato");
                      setCityMenu(null);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm rounded-b-lg ${
                      selectedFilter === "aquiraz-ce-gato"
                        ? "bg-blue-100 text-blue-800"
                        : "hover:bg-blue-50"
                    }`}
                  >
                    Gatos
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <h3 className="text-lg font-semibold text-gray-900 w-full mb-2">
              Filtrar por status:
            </h3>
            <button
              onClick={() => setSelectedFilter("disponivel")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedFilter === "disponivel"
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              🟢 Disponíveis
            </button>
            <button
              onClick={() => setSelectedFilter("em_processo")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedFilter === "em_processo"
                  ? "bg-yellow-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              ⏳ Em Processo
            </button>
            <button
              onClick={() => setSelectedFilter("adotado")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedFilter === "adotado"
                  ? "bg-gray-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              ❤️ Adotados
            </button>
          </div>
        </div>

        {/* Grid de pets */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredPets.map((pet) => (
            <div
              key={pet.id}
              className="rounded-xl overflow-hidden transition-shadow cursor-pointer border-[3px] bg-[#f4f0e4]"
              style={{
                borderImage:
                  "linear-gradient(90deg, rgb(102,178,255), rgb(255,255,153), rgb(153,255,204)) 1",
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)")
              }
              onClick={() => openModal(pet)}
            >
              {/* Imagem do pet */}
              <div className="relative w-full h-48 bg-gradient-to-br from-sky-50 to-yellow-50 overflow-hidden rounded-t-lg group flex items-center justify-center">
                <div
                  className="absolute inset-0 w-full h-full"
                  style={{ background: "#f4f0e4", zIndex: 0 }}
                ></div>
                {pet.imagens && pet.imagens.length > 0 ? (
                  <>
                    <img
                      src={optimizeImageUrl(
                        pet.imagens[currentImageIndexes[pet.id] || 0],
                        400,
                        320
                      )}
                      alt={`${pet.nome} - Foto ${
                        (currentImageIndexes[pet.id] || 0) + 1
                      }`}
                      className="w-full h-full object-contain transition-all duration-300 group-hover:scale-105 relative"
                      loading="lazy"
                      style={{ zIndex: 1 }}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextElementSibling.style.display = "flex";
                      }}
                    />

                    {/* Setas de navegação */}
                    {pet.imagens.length > 1 && (
                      <>
                        <button
                          onClick={(e) => handlePrevImage(pet.id, e)}
                          disabled={
                            !currentImageIndexes[pet.id] ||
                            currentImageIndexes[pet.id] === 0
                          }
                          className={`absolute left-1 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-lg transition-all z-10
                            ${
                              !currentImageIndexes[pet.id] ||
                              currentImageIndexes[pet.id] === 0
                                ? "opacity-30 cursor-not-allowed"
                                : "opacity-80 hover:opacity-100 hover:scale-110"
                            }`}
                        >
                          <svg
                            className="w-5 h-5 text-gray-800"
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
                          onClick={(e) =>
                            handleNextImage(pet.id, pet.imagens.length, e)
                          }
                          disabled={
                            currentImageIndexes[pet.id] >=
                            pet.imagens.length - 1
                          }
                          className={`absolute right-1 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-lg transition-all z-10
                            ${
                              currentImageIndexes[pet.id] >=
                              pet.imagens.length - 1
                                ? "opacity-30 cursor-not-allowed"
                                : "opacity-80 hover:opacity-100 hover:scale-110"
                            }`}
                        >
                          <svg
                            className="w-5 h-5 text-gray-800"
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
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                          {pet.imagens.map((_, index) => (
                            <div
                              key={index}
                              className={`h-2 rounded-full transition-all ${
                                index === (currentImageIndexes[pet.id] || 0)
                                  ? "bg-white w-6"
                                  : "bg-white/60 w-2"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : pet.imagem ? (
                  <img
                    src={optimizeImageUrl(pet.imagem, 400, 320)}
                    alt={pet.nome}
                    className="w-full h-full object-contain transition-all duration-300 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextElementSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                {/* Fallback quando não há imagem */}
                <div
                  className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-sky-100 to-yellow-100"
                  style={{
                    display:
                      pet.imagens?.length > 0 || pet.imagem ? "none" : "flex",
                  }}
                >
                  <span className="text-6xl opacity-50">
                    {pet.tipo === "cão"
                      ? "🐕"
                      : pet.tipo === "gato"
                      ? "🐱"
                      : "🐾"}
                  </span>
                </div>

                {/* Badge de status no canto da imagem */}
                <div className="absolute top-2 right-4 z-20 flex justify-end w-full pointer-events-none">
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium shadow-sm pointer-events-auto ${
                      pet.status === "disponivel"
                        ? "bg-green-500 text-white"
                        : pet.status === "adotado"
                        ? "bg-gray-500 text-white"
                        : "bg-yellow-500 text-white"
                    }`}
                    style={{ minWidth: 70, textAlign: "center" }}
                  >
                    {pet.status === "disponivel"
                      ? "🟢 Disponível"
                      : pet.status === "adotado"
                      ? "❤️ Adotado"
                      : "⏳ Em Processo"}
                  </span>
                </div>
              </div>

              {/* Informações principais - apenas nome e idade */}
              <div className="p-4 text-center">
                <h3 className="font-semibold text-gray-900 text-lg mb-1">
                  {pet.nome}
                </h3>
                {pet.localizacao && (
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <svg
                      className="w-4 h-4 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-green-700 font-medium text-xs">
                      {pet.localizacao}
                    </span>
                  </div>
                )}
                <p className="text-gray-600 text-sm">{pet.idade}</p>
                <div className="mt-3 text-gray-900 text-sm font-medium">
                  Clique para ver mais →
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPets.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🐾</div>
            <p className="text-gray-500 text-lg mb-2">
              {pets.length === 0
                ? "Nenhum pet disponível para adoção no momento."
                : "Nenhum pet encontrado com o filtro selecionado."}
            </p>
            {pets.length === 0 && (
              <p className="text-gray-400 text-sm">
                Novos pets são cadastrados regularmente. Volte em breve!
              </p>
            )}
            {selectedFilter !== "todos" && pets.length > 0 && (
              <button
                onClick={() => setSelectedFilter("todos")}
                className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Ver todos os pets disponíveis
              </button>
            )}
          </div>
        )}
      </main>

      {/* Modal de detalhes do pet */}
      {selectedPet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            className="rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            style={{
              backgroundColor: "#f4f0e4",
              borderWidth: "4px",
              borderColor: "#4a4a4a",
              borderStyle: "solid",
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 4px rgba(74, 74, 74, 0.15)",
            }}
          >
            <div className="relative">
              {/* Botão fechar */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Imagem do pet */}
              <div className="relative w-full h-80 bg-gradient-to-br from-sky-50 to-yellow-50 overflow-hidden rounded-t-xl flex items-center justify-center">
                <div
                  className="absolute inset-0 w-full h-full"
                  style={{ background: "#f4f0e4", zIndex: 0 }}
                ></div>
                {selectedPet.imagens && selectedPet.imagens.length > 0 ? (
                  <>
                    <img
                      src={optimizeImageUrl(
                        selectedPet.imagens[modalImageIndex],
                        600,
                        400
                      )}
                      alt={`${selectedPet.nome} - Foto ${modalImageIndex + 1}`}
                      className="w-full h-full object-contain relative"
                      style={{ zIndex: 1 }}
                    />

                    {/* Setas de navegação no modal */}
                    {selectedPet.imagens.length > 1 && (
                      <>
                        <button
                          onClick={() =>
                            setModalImageIndex(Math.max(0, modalImageIndex - 1))
                          }
                          disabled={modalImageIndex === 0}
                          className={`absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all z-10
                            ${
                              modalImageIndex === 0
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
                          onClick={() =>
                            setModalImageIndex(
                              Math.min(
                                selectedPet.imagens.length - 1,
                                modalImageIndex + 1
                              )
                            )
                          }
                          disabled={
                            modalImageIndex >= selectedPet.imagens.length - 1
                          }
                          className={`absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all z-10
                            ${
                              modalImageIndex >= selectedPet.imagens.length - 1
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
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                          {selectedPet.imagens.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setModalImageIndex(index)}
                              className={`h-2.5 rounded-full transition-all ${
                                index === modalImageIndex
                                  ? "bg-white w-8"
                                  : "bg-white/60 w-2.5 hover:bg-white/80"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : selectedPet.imagem ? (
                  <img
                    src={optimizeImageUrl(selectedPet.imagem, 600, 400)}
                    alt={selectedPet.nome}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-sky-100 to-yellow-100">
                    <span className="text-8xl opacity-50">
                      {selectedPet.tipo === "cão"
                        ? "🐕"
                        : selectedPet.tipo === "gato"
                        ? "🐱"
                        : "🐾"}
                    </span>
                  </div>
                )}
              </div>

              {/* Conteúdo do modal - Formato organizado */}
              <div className="p-6">
                {/* Nome do pet */}
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {selectedPet.nome}
                  </h2>

                  {/* Status em destaque */}
                  <span
                    className={`inline-flex items-center px-4 py-2 rounded-full font-medium text-sm ${
                      selectedPet.status === "disponivel"
                        ? "bg-green-100 text-green-800"
                        : selectedPet.status === "adotado"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {selectedPet.status === "disponivel"
                      ? "🟢 Disponível para Adoção"
                      : selectedPet.status === "adotado"
                      ? "❤️ Já Adotado"
                      : "⏳ Em Processo de Adoção"}
                  </span>
                </div>

                {/* Localização em destaque logo após o status */}
                {selectedPet.localizacao && (
                  <div className="mb-4 bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-3 text-center max-w-md mx-auto shadow-lg">
                    <div className="flex items-center justify-center gap-2 text-white">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-bold text-base">
                        📍 {selectedPet.localizacao}
                      </span>
                    </div>
                  </div>
                )}

                {/* Informações básicas em grid */}
                <div className="grid grid-cols-3 gap-2 mb-4 max-w-lg mx-auto">
                  {selectedPet.sexo && (
                    <div className="bg-sky-50 rounded-lg p-2 text-center">
                      <p className="text-xs text-gray-500">Sexo</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {selectedPet.sexo}
                      </p>
                    </div>
                  )}
                  {selectedPet.idade && (
                    <div className="bg-yellow-50 rounded-lg p-2 text-center">
                      <p className="text-xs text-gray-500">Idade</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {selectedPet.idade}
                      </p>
                    </div>
                  )}
                  {selectedPet.porte && (
                    <div className="bg-sky-50 rounded-lg p-2 text-center">
                      <p className="text-xs text-gray-500">Porte</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {selectedPet.porte}
                      </p>
                    </div>
                  )}
                  {selectedPet.tipo && (
                    <div className="bg-yellow-50 rounded-lg p-2 text-center">
                      <p className="text-xs text-gray-500">Tipo</p>
                      <p className="text-sm font-semibold text-gray-900 capitalize">
                        {selectedPet.tipo}
                      </p>
                    </div>
                  )}
                  {selectedPet.cor && (
                    <div className="bg-sky-50 rounded-lg p-2 text-center">
                      <p className="text-xs text-gray-500">Cor</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {selectedPet.cor}
                      </p>
                    </div>
                  )}
                  {selectedPet.peso && (
                    <div className="bg-yellow-50 rounded-lg p-2 text-center">
                      <p className="text-xs text-gray-500">Peso</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {selectedPet.peso}
                      </p>
                    </div>
                  )}
                </div>

                {/* Tags de situação */}
                <div className="flex gap-2 justify-center mb-6 flex-wrap">
                  {selectedPet.castrado ? (
                    <span className="bg-green-100 text-green-800 text-xs px-3 py-1.5 rounded-full font-medium">
                      ✓ Castrado(a)
                    </span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1.5 rounded-full font-medium">
                      ⏳ A castrar
                    </span>
                  )}
                  {selectedPet.vacinado && (
                    <span className="bg-sky-100 text-sky-800 text-xs px-3 py-1.5 rounded-full font-medium">
                      ✓ Vacinado(a)
                    </span>
                  )}
                  {selectedPet.vermifugado && (
                    <span className="bg-purple-100 text-purple-800 text-xs px-3 py-1.5 rounded-full font-medium">
                      ✓ Vermifugado(a)
                    </span>
                  )}
                  {selectedPet.situacao && (
                    <span
                      className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                        selectedPet.situacao === "Resgatada"
                          ? "bg-yellow-100 text-yellow-800"
                          : selectedPet.situacao === "Órfão"
                          ? "bg-orange-100 text-orange-800"
                          : selectedPet.situacao === "Maltratado"
                          ? "bg-red-100 text-red-800"
                          : selectedPet.situacao === "Filhote"
                          ? "bg-pink-100 text-pink-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedPet.situacao}
                    </span>
                  )}
                </div>

                {/* Descrição do pet */}
                {selectedPet.descricao && (
                  <div className="mb-6 bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Sobre o pet
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {selectedPet.descricao}
                    </p>
                  </div>
                )}

                {/* Botão de adoção - mesmo estilo da página Home */}
                <div className="text-center space-y-3">
                  {selectedPet.status === "disponivel" ? (
                    <Link
                      to={`/questionnaire?petId=${selectedPet.id}&petName=${encodeURIComponent(
                        selectedPet.nome
                      )}`}
                      className="inline-flex items-center bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white px-6 py-2.5 rounded-lg text-base font-semibold transition-all shadow-lg"
                      onClick={closeModal}
                    >
                      💖 Quero Adotar {selectedPet.nome}
                    </Link>
                  ) : selectedPet.status === "adotado" ? (
                    <div className="inline-flex items-center bg-gray-400 text-white px-6 py-2.5 rounded-lg text-base font-semibold">
                      ❤️ Pet já adotado
                    </div>
                  ) : (
                    <div className="inline-flex items-center bg-yellow-500 text-white px-6 py-2.5 rounded-lg text-base font-semibold">
                      ⏳ Em processo de adoção
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pets;
