import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";

// 🔗 URL do Google Forms para adoção - centralizada aqui
const GOOGLE_FORM_URL = "https://forms.gle/Vs2Arsu5bwi5h3wA9";

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

              {/* Informações principais - nome e idade */}
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

                {/* Informações básicas em cards coloridos */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="flex flex-wrap justify-center gap-3">
                    {selectedPet.sexo && (
                      <div className="bg-gradient-to-r from-blue-100 to-blue-200 px-4 py-2 rounded-lg shadow-sm border border-blue-300">
                        <span className="text-blue-800 font-bold text-sm">
                          {selectedPet.sexo}
                        </span>
                      </div>
                    )}
                    {selectedPet.porte && (
                      <div className="bg-gradient-to-r from-purple-100 to-purple-200 px-4 py-2 rounded-lg shadow-sm border border-purple-300">
                        <span className="text-purple-800 font-bold text-sm">
                          Porte {selectedPet.porte}
                        </span>
                      </div>
                    )}
                    {selectedPet.tipo && (
                      <div className="bg-gradient-to-r from-green-100 to-green-200 px-4 py-2 rounded-lg shadow-sm border border-green-300">
                        <span className="text-green-800 font-bold text-sm capitalize">
                          {selectedPet.tipo}
                        </span>
                      </div>
                    )}
                    {selectedPet.cor && (
                      <div className="bg-gradient-to-r from-orange-100 to-orange-200 px-4 py-2 rounded-lg shadow-sm border border-orange-300">
                        <span className="text-orange-800 font-bold text-sm">
                          {selectedPet.cor}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status médicos com visual melhorado */}
                <div className="flex gap-3 justify-center mb-6 flex-wrap">
                  {selectedPet.castrado ? (
                    <span className="bg-gradient-to-r from-emerald-400 to-emerald-500 text-white text-sm px-4 py-2 rounded-full font-bold shadow-lg transform hover:scale-105 transition-all duration-200">
                      ✓ Castrado(a)
                    </span>
                  ) : (
                    <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-white text-sm px-4 py-2 rounded-full font-bold shadow-lg transform hover:scale-105 transition-all duration-200">
                      ⚠ A castrar
                    </span>
                  )}
                  {selectedPet.vacinado && (
                    <span className="bg-gradient-to-r from-cyan-400 to-cyan-500 text-white text-sm px-4 py-2 rounded-full font-bold shadow-lg transform hover:scale-105 transition-all duration-200">
                      💉 Vacinado(a)
                    </span>
                  )}
                  {selectedPet.vermifugado && (
                    <span className="bg-gradient-to-r from-violet-400 to-violet-500 text-white text-sm px-4 py-2 rounded-full font-bold shadow-lg transform hover:scale-105 transition-all duration-200">
                      🛡️ Vermifugado(a)
                    </span>
                  )}
                </div>

                {/* Situação do pet com visual melhorado */}
                {selectedPet.situacao && (
                  <div className="text-center mb-6">
                    <span
                      className={`text-sm px-4 py-2 rounded-full font-bold shadow-lg transform hover:scale-105 transition-all duration-200 ${
                        selectedPet.situacao === "Resgatada"
                          ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white"
                          : selectedPet.situacao === "Órfão"
                          ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white"
                          : selectedPet.situacao === "Maltratado"
                          ? "bg-gradient-to-r from-red-400 to-red-500 text-white"
                          : selectedPet.situacao === "Filhote"
                          ? "bg-gradient-to-r from-pink-400 to-pink-500 text-white"
                          : "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
                      }`}
                    >
                      {selectedPet.situacao === "Resgatada" && "🏠 "}
                      {selectedPet.situacao === "Órfão" && "👶 "}
                      {selectedPet.situacao === "Maltratado" && "💔 "}
                      {selectedPet.situacao === "Filhote" && "🐾 "}
                      {selectedPet.situacao}
                    </span>
                  </div>
                )}

                {/* Descrição do pet */}
                {selectedPet.descricao && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">
                      📝 Sobre {selectedPet.nome}
                    </h3>
                    <div className="bg-gradient-to-r from-sky-50 to-yellow-50 rounded-lg p-4 border border-sky-200">
                      <p className="text-gray-700 text-sm leading-relaxed text-center">
                        {selectedPet.descricao}
                      </p>
                    </div>
                  </div>
                )}

                {/* Botão de adoção - igual ao da página Home */}
                <div className="text-center space-y-3">
                  {selectedPet.status === "disponivel" ? (
                    <a
                      href={GOOGLE_FORM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white px-6 py-2.5 rounded-full text-base font-bold transition-all duration-200 shadow-md hover:shadow-lg border-2 border-yellow-300 hover:border-yellow-400"
                      onClick={closeModal}
                    >
                      💖 Quero Adotar {selectedPet.nome}
                    </a>
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
