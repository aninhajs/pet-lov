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

  // Carregar todos os pets do localStorage
  useEffect(() => {
    const petsStorage = JSON.parse(localStorage.getItem("pets") || "[]");
    setPets(petsStorage);
  }, []);

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
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative w-full h-56 bg-gray-100 overflow-hidden rounded-t-lg group">
                {pet.imagem ? (
                  <img
                    src={optimizeImageUrl(pet.imagem, 400, 350)}
                    alt={pet.nome}
                    className="w-full h-full object-cover object-center transition-all duration-300 group-hover:scale-105 group-hover:brightness-110"
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
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {pet.nome}
                  </h3>
                  <span className="text-sm text-gray-500">{pet.sexo}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                  <div>Idade: {pet.idade}</div>
                  <div>Porte: {pet.porte}</div>
                </div>

                <p className="text-gray-600 mb-4 text-sm">{pet.descricao}</p>

                <div className="flex gap-2 mb-4">
                  {/* Badge de Status */}
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      pet.status === "disponivel"
                        ? "bg-green-100 text-green-800"
                        : pet.status === "adotado"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {pet.status === "disponivel"
                      ? "🟢 Disponível"
                      : pet.status === "adotado"
                      ? "❤️ Adotado"
                      : "⏳ Em Processo"}
                  </span>

                  {pet.castrado && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Castrado
                    </span>
                  )}
                  {pet.vacinado && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      Vacinado
                    </span>
                  )}
                </div>

                {/* Botão condicional baseado no status */}
                {pet.status === "disponivel" ? (
                  <Link
                    to="/questionnaire"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors inline-block text-center"
                  >
                    Quero Adotar
                  </Link>
                ) : pet.status === "adotado" ? (
                  <div className="w-full bg-gray-300 text-gray-600 px-4 py-2 rounded-md text-sm font-medium text-center">
                    Pet já adotado ❤️
                  </div>
                ) : (
                  <div className="w-full bg-yellow-300 text-yellow-800 px-4 py-2 rounded-md text-sm font-medium text-center">
                    Processo em andamento ⏳
                  </div>
                )}
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
    </div>
  );
};

export default Pets;
