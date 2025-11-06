import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

// 🔗 Centralize aqui o link do seu Google Forms
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

const Home = () => {
  const [selectedPet, setSelectedPet] = useState(null);
  const [pets, setPets] = useState([]);

  useEffect(() => {
    const petsStorage = JSON.parse(localStorage.getItem("pets") || "[]");
    setPets(petsStorage);
  }, []);

  const openModal = (pet) => setSelectedPet(pet);
  const closeModal = () => setSelectedPet(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-yellow-50 to-sky-100">
      {/* Header customizado para Home - sem botão "Ver Pets" */}
      <header className="bg-gradient-to-r from-sky-50 to-yellow-50 shadow-lg border-b-2 border-sky-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center space-x-3">
              <img
                src="/logoabrace.jpg"
                alt="Abrace Uma Causa Animal"
                className="w-14 h-14 rounded-full object-cover shadow-lg border-2 border-yellow-200"
              />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-sky-700 bg-clip-text text-transparent">
                Abrace Uma Causa Animal
              </h1>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/pets"
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 px-4 py-2 rounded-md text-sm font-medium shadow-md transition-all"
              >
                Ver Pets
              </Link>
              {/* 🔁 Alterado para <a> externo (Google Forms) */}
              <a
                href={GOOGLE_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-md transition-all"
              >
                Adotar Pet
              </a>
            </div>
          </div>
        </nav>
      </header>
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8">
            Encontre seu novo
            <span className="bg-gradient-to-r from-sky-600 to-yellow-500 bg-clip-text text-transparent">
              {" "}
              melhor amigo
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Conectamos corações e patas! Descubra pets incríveis esperando por
            uma família amorosa. Cada adoção é uma segunda chance para a
            felicidade.
          </p>

          {/* Pets em Destaque */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Pets Esperando por Você
              </h2>
              <p className="text-gray-600 text-lg">
                Conheça alguns dos nossos pets que estão procurando um lar
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 auto-rows-fr">
              {pets.slice(0, 4).map((pet) => (
                <div
                  key={pet.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 hover:scale-105 group cursor-pointer"
                  onClick={() => openModal(pet)}
                >
                  <div className="relative w-full h-56 bg-gray-100 overflow-hidden flex items-center justify-center">
                    {pet.imagem ? (
                      <img
                        src={optimizeImageUrl(pet.imagem, 400, 320)}
                        alt={pet.nome}
                        className="absolute inset-0 w-full h-full object-cover transition-all duration-300 group-hover:scale-110 group-hover:brightness-110"
                        loading="lazy"
                        style={{
                          objectPosition: "center center",
                          objectFit: "cover",
                          minHeight: "100%",
                          minWidth: "100%",
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          if (e.currentTarget.nextElementSibling) {
                            e.currentTarget.nextElementSibling.style.display =
                              "flex";
                          }
                        }}
                      />
                    ) : null}
                    {/* Fallback quando não há imagem */}
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-sky-100 to-yellow-100"
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">
                      {pet.nome}
                    </h3>
                    <p className="text-gray-600 text-sm">{pet.idade}</p>
                    <div className="mt-3 text-sky-600 text-sm font-medium">
                      Clique para ver mais →
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {pets.length === 0 && (
              <div className="text-center py-12 mb-12">
                <div className="text-6xl mb-4">🐾</div>
                <p className="text-gray-500 text-lg mb-2">
                  Nenhum pet disponível para adoção no momento.
                </p>
                <p className="text-gray-400 text-sm">
                  Novos pets são cadastrados regularmente. Volte em breve!
                </p>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Como posso ajudar?
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 bg-gradient-to-br from-sky-50 to-yellow-50 rounded-lg shadow-lg border-2 border-sky-200">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">💰</div>
                  <h3 className="text-2xl font-bold text-sky-600 mb-3">
                    Sua Nota Tem Valor
                  </h3>
                </div>
                <div className="text-gray-700 space-y-3 text-sm">
                  <div className="bg-white/80 p-3 rounded-lg border-l-4 border-sky-500">
                    <p>
                      <strong className="text-sky-600">1. CADASTRO:</strong>{" "}
                      Acesse o App Sua Nota Tem Valor ou pelo site
                      suanotatemvalor.ce.gov.br
                    </p>
                  </div>
                  <div className="bg-white/80 p-3 rounded-lg border-l-4 border-yellow-400">
                    <p>
                      <strong className="text-yellow-600">
                        2. ESCOLHA A ONG ABRAÇE:
                      </strong>{" "}
                      Na tela de cadastro, escolha a ONG ABRACE para apoiar
                    </p>
                  </div>
                  <div className="bg-white/80 p-3 rounded-lg border-l-4 border-sky-500">
                    <p>
                      <strong className="text-sky-600">
                        3. PEÇA CPF NA NOTA:
                      </strong>{" "}
                      A cada R$ 50 solicite o CPF na Nota Fiscal. Você ganha 1
                      ponto, concorre a prêmios de até R$ 25 mil e tem 5% de
                      desconto no IPVA
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-sky-50 to-yellow-50 rounded-lg shadow-lg border-2 border-sky-200">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">🛍️</div>
                  <h3 className="text-2xl font-bold text-sky-600 mb-3">
                    Campanha do Bazar Solidário
                  </h3>
                  <p className="text-gray-900 font-semibold mb-3">
                    O que você pode doar?
                  </p>
                </div>
                <div className="text-gray-700 space-y-3 text-sm">
                  <div className="bg-white/80 p-3 rounded-lg border-l-4 border-sky-500">
                    <p>
                      <strong className="text-sky-600">01</strong> roupas e
                      sapatos
                    </p>
                  </div>
                  <div className="bg-white/80 p-3 rounded-lg border-l-4 border-yellow-400">
                    <p>
                      <strong className="text-yellow-600">02</strong> acessórios
                      pet
                    </p>
                  </div>
                  <div className="bg-white/80 p-3 rounded-lg border-l-4 border-sky-500">
                    <p>
                      <strong className="text-sky-600">03</strong> bijuterias
                    </p>
                  </div>
                  <div className="bg-white/80 p-3 rounded-lg border-l-4 border-yellow-400">
                    <p>
                      <strong className="text-yellow-600">04</strong> livros,
                      etc.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-sky-50 to-yellow-50 rounded-lg shadow-lg border-2 border-sky-200">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">�</div>
                  <h3 className="text-2xl font-bold text-sky-600 mb-3">
                    DOE RAÇÃO
                  </h3>
                </div>
                <div className="text-gray-700 space-y-3 text-sm">
                  <div className="bg-white/80 p-3 rounded-lg border-l-4 border-sky-500">
                    <p>
                      Precisamos muito de ração para cães e gatos adultos e
                      filhotes, além de misturinha (fígado, miúdos de frango,
                      sachês, latinhas) para os animais debilitados.
                    </p>
                  </div>
                  <div className="bg-white/80 p-3 rounded-lg border-l-4 border-yellow-400">
                    <p className="font-semibold text-yellow-600">
                      Ajude a encher mais de 150 barriguinhas! Doe!
                    </p>
                  </div>
                  <div className="bg-white/80 p-3 rounded-lg border-l-4 border-sky-500 text-center">
                    <p className="font-semibold text-sky-600 mb-1">CHAVE PIX</p>
                    <p className="font-bold text-lg text-sky-700">ONG ABRACE</p>
                    <p className="font-mono text-gray-900 font-semibold">
                      24287894000100
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      {/* Modal flutuante para detalhes do pet */}
      {selectedPet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg sm:max-w-xl md:max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header do modal */}
            <div className="relative">
              <div className="h-40 sm:h-44 md:h-48 overflow-hidden rounded-t-2xl bg-gray-100 flex items-center justify-center">
                {selectedPet.imagem ? (
                  <img
                    src={optimizeImageUrl(selectedPet.imagem, 600, 400)}
                    alt={`${selectedPet.nome} - Pet para adoção`}
                    className="max-w-full max-h-full object-contain"
                    style={{
                      objectFit: "contain",
                      objectPosition: "center center",
                    }}
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
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold transition-all shadow-lg"
                aria-label="Fechar"
                title="Fechar"
              >
                ×
              </button>
            </div>

            {/* Conteúdo do modal */}
            <div className="p-4">
              {/* Nome e informações básicas */}
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {selectedPet.nome}
                </h2>

                {/* Status do pet */}
                {selectedPet.status && (
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full font-medium text-sm mb-3 ${
                      selectedPet.status === "disponivel"
                        ? "bg-green-100 text-green-800"
                        : selectedPet.status === "adotado"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {selectedPet.status === "disponivel"
                      ? "🟢 Disponível"
                      : selectedPet.status === "adotado"
                      ? "❤️ Adotado"
                      : "⏳ Em Processo"}
                  </span>
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
                <div className="flex gap-2 justify-center mb-4 flex-wrap">
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
                      className={`text-xs px-2 py-1 rounded-full ${
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
              </div>

              {/* Descrição do pet */}
              {selectedPet.descricao && (
                <div className="mb-4 bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Sobre o pet
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {selectedPet.descricao}
                  </p>
                </div>
              )}

              {/* Botão de adoção (EXTERNO) */}
              <div className="text-center">
                <a
                  href={GOOGLE_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white px-6 py-2.5 rounded-lg text-base font-semibold transition-all shadow-lg"
                  onClick={closeModal}
                >
                  💖 Quero Adotar {selectedPet.nome}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      Link discreto para login admin (apenas para desenvolvimento)
      <div className="fixed bottom-4 right-4">
        <Link
          to="/login"
          className="bg-gray-800 hover:bg-gray-900 text-white text-xs px-3 py-1 rounded-full opacity-50 hover:opacity-100 transition-opacity"
        >
          Admin
        </Link>
      </div>
    </div>
  );
};

export default Home;
