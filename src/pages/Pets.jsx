import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";

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
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);

  // Carregar todos os pets do localStorage
  useEffect(() => {
    const petsStorage = JSON.parse(localStorage.getItem("pets") || "[]");
    setPets(petsStorage);
  }, []);

  // Funções do modal
  const openModal = (pet) => {
    setSelectedPet(pet);
  };

  const closeModal = () => {
    setSelectedPet(null);
  };

  const filteredPets = pets.filter((pet) => {
    if (selectedFilter === "todos") return true;

    // Filtros por tipo
    if (selectedFilter === "cão" || selectedFilter === "gato") {
      return pet.tipo?.toLowerCase() === selectedFilter.toLowerCase();
    }

    // Filtros por status
    if (
      selectedFilter === "disponivel" ||
      selectedFilter === "em_processo" ||
      selectedFilter === "adotado"
    ) {
      return pet.status === selectedFilter;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Título e filtros */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Todos os Pets ({pets.length})
          </h1>
          <p className="text-gray-600 mb-4">
            Veja todos os pets cadastrados - disponíveis, em processo de adoção
            e já adotados
          </p>

          {/* Contador de pets por status */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">
                {pets.filter((pet) => pet.status === "disponivel").length}
              </div>
              <div className="text-sm text-green-700">Disponíveis</div>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {pets.filter((pet) => pet.status === "em_processo").length}
              </div>
              <div className="text-sm text-yellow-700">Em Processo</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-600">
                {pets.filter((pet) => pet.status === "adotado").length}
              </div>
              <div className="text-sm text-gray-700">Adotados</div>
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
              🐕 Cães
            </button>
            <button
              onClick={() => setSelectedFilter("gato")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedFilter === "gato"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              🐱 Gatos
            </button>
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
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPets.map((pet) => (
            <div
              key={pet.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => openModal(pet)}
            >
              {/* Imagem do pet */}
              <div className="relative w-full h-48 bg-gray-100 overflow-hidden rounded-t-lg group">
                {pet.imagem ? (
                  <img
                    src={optimizeImageUrl(pet.imagem, 400, 320)}
                    alt={pet.nome}
                    className="w-full h-full object-cover object-center transition-all duration-300 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextElementSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                {/* Fallback quando não há imagem */}
                <div
                  className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100"
                  style={{ display: pet.imagem ? "none" : "flex" }}
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
                <div className="absolute top-2 right-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium shadow-sm ${
                      pet.status === "disponivel"
                        ? "bg-green-500 text-white"
                        : pet.status === "adotado"
                        ? "bg-gray-500 text-white"
                        : "bg-yellow-500 text-white"
                    }`}
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
                <p className="text-gray-600 text-sm">{pet.idade}</p>
                <div className="mt-3 text-indigo-600 text-sm font-medium">
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
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
              <div className="relative w-full h-80 bg-gray-100 overflow-hidden rounded-t-xl">
                {selectedPet.imagem ? (
                  <img
                    src={optimizeImageUrl(selectedPet.imagem, 600, 400)}
                    alt={selectedPet.nome}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-indigo-100 to-purple-100">
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

                {/* Informações básicas em linha */}
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center text-gray-700 text-lg font-medium flex-wrap gap-3">
                    <span>{selectedPet.sexo}</span>
                    <span className="text-gray-400">•</span>
                    <span>{selectedPet.idade}</span>
                    <span className="text-gray-400">•</span>
                    <span>Porte {selectedPet.porte}</span>
                  </div>
                </div>

                {/* Status médicos */}
                <div className="flex justify-center gap-4 mb-6">
                  {selectedPet.castrado && (
                    <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full border border-green-200">
                      <span className="text-green-600">✅</span>
                      <span className="text-green-800 font-medium">
                        Castrado(a)
                      </span>
                    </div>
                  )}
                  {selectedPet.vacinado && (
                    <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
                      <span className="text-blue-600">💉</span>
                      <span className="text-blue-800 font-medium">
                        Vacinado(a)
                      </span>
                    </div>
                  )}
                </div>

                {/* Situação do pet */}
                {selectedPet.situacao && (
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full border border-orange-200">
                      <span className="text-orange-600">🏷️</span>
                      <span className="text-orange-800 font-medium">
                        {selectedPet.situacao}
                      </span>
                    </div>
                  </div>
                )}

                {/* História do pet */}
                {(selectedPet.descricao || selectedPet.historia) && (
                  <div className="mb-6 bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">📖</span>
                      <h3 className="text-lg font-bold text-gray-900">
                        Sua História
                      </h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedPet.historia || selectedPet.descricao}
                    </p>
                  </div>
                )}

                {/* Cuidados especiais */}
                {selectedPet.cuidados && (
                  <div className="mb-6 bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">💜</span>
                      <h3 className="text-lg font-bold text-purple-900">
                        Cuidados Especiais
                      </h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedPet.cuidados}
                    </p>
                  </div>
                )}

                {/* Botão de adoção - mesmo estilo da página Home */}
                <div className="text-center space-y-3">
                  {selectedPet.status === "disponivel" ? (
                    <Link
                      to="/questionnaire"
                      className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-base font-semibold transition-colors"
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
