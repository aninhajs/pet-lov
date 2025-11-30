import React, { useState, useEffect } from "react";
// CSS para animação das patinhas
const pawAnimationStyle = `
@keyframes pawUp {
  0% { transform: translateY(40px) scale(0.7); opacity: 0; }
  40% { opacity: 1; }
  100% { transform: translateY(-10px) scale(1); opacity: 1; }
}
.paw-anim {
  display: inline-block;
  font-size: 5rem;
  margin: 0 1.1rem;
  animation: pawUp 2.4s cubic-bezier(.4,0,.2,1) infinite alternate;
  color: #b8860b;
  filter: drop-shadow(0 2px 7px #b8860b88);
}
.paw-anim-right {
  animation-delay: 0.8s;
}
`;
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { PetServices } from "../services/PetServices";

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
  const [currentImageIndexes, setCurrentImageIndexes] = useState({});
  const [modalImageIndex, setModalImageIndex] = useState(0);

  useEffect(() => {
    const carregarPets = async () => {
      try {
        const response = await PetServices.getAllPets();
        if (response.success && response.data?.data) {
          // Filtrar apenas pets disponíveis e formatar
          const petsDisponiveis = response.data.data
            .filter((pet) => pet.status === "disponivel")
            .map((pet) => ({
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
              imagens: pet.imagens?.map((img) => img.url_imagem) || [],
              imagem: pet.imagens?.[0]?.url_imagem || null,
            }));
          setPets(petsDisponiveis);
          console.log(
            "✅ Pets disponíveis carregados na Home:",
            petsDisponiveis.length
          );
          console.log("📸 Primeiro pet com imagens:", petsDisponiveis[0]);
        }
      } catch (error) {
        console.error("❌ Erro ao carregar pets na Home:", error);
      }
    };

    carregarPets();
  }, []);

  const openModal = (pet) => {
    setSelectedPet(pet);
    setModalImageIndex(0);
  };

  const closeModal = () => {
    setSelectedPet(null);
    setModalImageIndex(0);
  };

  // Funções para navegar no carrossel
  const handlePrevImage = (petId, e) => {
    e.stopPropagation(); // Evita abrir o modal
    setCurrentImageIndexes((prev) => ({
      ...prev,
      [petId]: Math.max(0, (prev[petId] || 0) - 1),
    }));
  };

  const handleNextImage = (petId, totalImages, e) => {
    e.stopPropagation(); // Evita abrir o modal
    setCurrentImageIndexes((prev) => ({
      ...prev,
      [petId]: Math.min(totalImages - 1, (prev[petId] || 0) + 1),
    }));
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f4f0e4" }}>
      {/* Header customizado para Home - sem botão "Ver Pets" */}
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
                <br className="block sm:hidden" />
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
              <Link
                to="/pets"
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 px-4 py-2 rounded-md text-sm font-medium shadow-md transition-all text-center"
              >
                Ver Pets
              </Link>
              <a
                href={GOOGLE_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-md transition-all text-center"
              >
                Adotar Pet
              </a>
            </div>
          </div>
        </nav>
      </header>
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Estilos de animação das patinhas */}
        <style>{pawAnimationStyle}</style>
        <div className="text-center">
          <h1
            className="text-4xl xs:text-5xl sm:text-6xl md:text-8xl font-extrabold mb-8 flex items-center justify-center gap-2"
            style={{
              lineHeight: "1.05",
              fontFamily: "Inter, sans-serif",
              position: "relative",
            }}
          >
            <span className="paw-anim" role="img" aria-label="patinha">
              🐾
            </span>
            <span>
              <span className="text-yellow-500">E</span>
              <span className="text-blue-500">n</span>
              <span className="text-red-500">c</span>
              <span className="text-green-500">o</span>
              <span className="text-yellow-500">n</span>
              <span className="text-blue-500">t</span>
              <span className="text-red-500">r</span>
              <span className="text-green-500">e</span>
              <span className="text-yellow-500"> </span>
              <span className="text-blue-500">s</span>
              <span className="text-red-500">e</span>
              <span className="text-green-500">u</span>
              <span className="text-yellow-500"> </span>
              <span className="text-blue-500">n</span>
              <span className="text-red-500">o</span>
              <span className="text-green-500">v</span>
              <span className="text-yellow-500">o</span>
              <span className="text-blue-500"> </span>
              <span className="text-red-500">m</span>
              <span className="text-green-500">e</span>
              <span className="text-yellow-500">l</span>
              <span className="text-blue-500">h</span>
              <span className="text-red-500">o</span>
              <span className="text-green-500">r</span>
              <br className="block md:hidden" />
              <span className="text-yellow-500"> </span>
              <span className="text-blue-500">a</span>
              <span className="text-red-500">m</span>
              <span className="text-green-500">i</span>
              <span className="text-yellow-500">g</span>
              <span className="text-blue-500">o</span>
            </span>
            <span
              className="paw-anim paw-anim-right"
              role="img"
              aria-label="patinha"
            >
              🐾
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto font-bold">
            Conectamos corações e patas! Descubra pets incríveis esperando por
            uma família amorosa. Cada adoção é uma segunda chance para a
            felicidade.
          </p>

          {/* Pets em Destaque */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold mb-4">
                <span className="bg-gradient-to-r from-sky-500 via-yellow-400 to-green-400 bg-clip-text text-transparent drop-shadow-lg">
                  Pets Esperando por Você
                </span>
              </h1>
              {/* <h2 className="text-2xl font-bold mb-6">
                <span className="bg-gradient-to-r from-sky-500 via-yellow-400 to-green-400 bg-clip-text text-transparent drop-shadow-lg">
                  Como posso ajudar?
                </span>
              </h2> */}
              <p className="text-gray-600 text-lg font-bold">
                Conheça alguns dos nossos pets que estão procurando um lar
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-12 auto-rows-fr">
              {pets.slice(0, 10).map((pet) => (
                <div
                  key={pet.id}
                  className="rounded-md overflow-hidden transition-all duration-300 hover:scale-105 group cursor-pointer border-[3px]"
                  style={{
                    backgroundColor: "#f4f0e4",
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
                  <div className="relative w-full h-56 bg-gradient-to-br from-sky-50 to-yellow-50 overflow-hidden flex items-center justify-center">
                    {/* Debug - remover depois */}
                    {pet.imagens &&
                      console.log(
                        `🐾 ${pet.nome} tem ${pet.imagens.length} imagem(ns)`
                      )}

                    {pet.imagens && pet.imagens.length > 0 ? (
                      <>
                        <div
                          style={{ backgroundColor: "#f4f0e4" }}
                          className="w-full h-full flex items-center justify-center"
                        >
                          <img
                            src={optimizeImageUrl(
                              pet.imagens[currentImageIndexes[pet.id] || 0],
                              400,
                              320
                            )}
                            alt={`${pet.nome} - Foto ${
                              (currentImageIndexes[pet.id] || 0) + 1
                            }`}
                            className="w-full h-full object-contain transition-all duration-300 group-hover:scale-105"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              if (e.currentTarget.nextElementSibling) {
                                e.currentTarget.nextElementSibling.style.display =
                                  "flex";
                              }
                            }}
                          />
                        </div>

                        {/* Setas de navegação - aparecem apenas se houver mais de 1 foto */}
                        {pet.imagens.length > 1 && (
                          <>
                            {/* Seta Esquerda */}
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

                            {/* Seta Direita */}
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

                            {/* Indicadores de foto (pontinhos) */}
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
                          e.currentTarget.style.display = "none";
                          if (e.currentTarget.nextElementSibling) {
                            e.currentTarget.nextElementSibling.style.display =
                              "flex";
                          }
                        }}
                      />
                    ) : null}
                    {/* Fallback quando não há nenhuma imagem */}
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-sky-100 to-yellow-100"
                      style={{
                        display:
                          pet.imagens?.length > 0 || pet.imagem
                            ? "none"
                            : "flex",
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
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
              <h2 className="text-3xl font-bold mb-4">
                <span className="bg-gradient-to-r from-sky-500 via-yellow-400 to-green-400 bg-clip-text text-transparent drop-shadow-lg">
                  Como posso ajudar?
                </span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-5 bg-gradient-to-br from-green-50 to-yellow-50 rounded-lg shadow-lg border-2 border-green-300">
                <div className="text-center mb-3">
                  <h3 className="text-xl font-bold text-green-600 mb-2">
                    Sua Nota Tem Valor
                  </h3>
                </div>
                <div className="text-gray-700 space-y-2 text-xs">
                  <div className="bg-white/80 p-2 rounded-lg border-l-4 border-green-500">
                    <p>
                      <strong className="text-green-600">1. CADASTRO:</strong>{" "}
                      <strong>Acesse o app ou </strong>
                      <a
                        href="https://suanotatemvalor.sefaz.ce.gov.br/"
                        className="text-green-600 hover:text-green-700 underline"
                      >
                        <strong>site</strong>
                      </a>
                    </p>
                  </div>
                  <div className="bg-white/80 p-2 rounded-lg border-l-4 border-yellow-400">
                    <p>
                      <strong className="text-yellow-600">2. ESCOLHA:</strong>{" "}
                      <strong>Na tela de cadastro, escolha a ONG ABRACE</strong>
                    </p>
                  </div>
                  <div className="bg-white/80 p-2 rounded-lg border-l-4 border-green-500">
                    <p>
                      <strong className="text-green-600">3. PEÇA CPF:</strong>{" "}
                      <strong>
                        A cada R$ 50 solicite CPF na nota. Ganhe pontos e 5%
                        desconto no IPVA
                      </strong>
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-gradient-to-br from-green-50 to-yellow-50 rounded-lg shadow-lg border-2 border-green-300">
                <div className="text-center mb-3">
                  <h3 className="text-xl font-bold text-green-600 mb-2">
                    Bazar Solidário
                  </h3>
                  <p className="text-gray-900 font-semibold text-sm mb-2">
                    O que você pode doar?
                  </p>
                </div>
                <div className="text-gray-700 space-y-2 text-xs">
                  <div className="bg-white/80 p-2 rounded-lg border-l-4 border-green-500">
                    <p>
                      <strong className="text-green-600">01</strong>
                      <strong> roupas e sapatos </strong>
                    </p>
                  </div>
                  <div className="bg-white/80 p-2 rounded-lg border-l-4 border-yellow-400">
                    <p>
                      <strong className="text-yellow-600">02</strong>
                      <strong> acessórios pet</strong>
                    </p>
                  </div>
                  <div className="bg-white/80 p-2 rounded-lg border-l-4 border-green-500">
                    <p>
                      <strong className="text-green-600">03</strong>
                      <strong> bijuterias</strong>
                    </p>
                  </div>
                  <div className="bg-white/80 p-2 rounded-lg border-l-4 border-yellow-400">
                    <p>
                      <strong className="text-yellow-600">04</strong>
                      <strong> livros e mais</strong>
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-gradient-to-br from-green-50 to-yellow-50 rounded-lg shadow-lg border-2 border-green-300">
                <div className="text-center mb-3">
                  <h3 className="text-xl font-bold text-green-600 mb-2">
                    DOE RAÇÃO
                  </h3>
                </div>
                <div className="text-gray-700 space-y-2 text-xs">
                  <div className="bg-white/80 p-2 rounded-lg border-l-4 border-green-500">
                    <p>
                      <strong>
                        Precisamos de ração para cães e gatos, além de
                        misturinha para animais debilitados.
                      </strong>
                    </p>
                  </div>
                  <div className="bg-white/80 p-2 rounded-lg border-l-4 border-yellow-400">
                    <p className="font-semibold text-yellow-600">
                      Ajude a encher mais de 150 barriguinhas!
                    </p>
                  </div>
                  <div className="bg-white/80 p-2 rounded-lg border-l-4 border-green-500 text-center">
                    <p className="font-semibold text-green-600 mb-1 text-xs">
                      CHAVE PIX
                    </p>
                    <p className="font-bold text-sm text-green-700">
                      ONG ABRACE
                    </p>
                    <p className="font-mono text-gray-900 font-semibold text-xs">
                      24287894000100
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-gradient-to-br from-green-50 to-yellow-50 rounded-lg shadow-lg border-2 border-green-300">
                <div className="text-center mb-3">
                  <h3 className="text-xl font-bold text-green-600 mb-2">
                    Campanha Nosso Lar
                  </h3>
                  <p className="text-gray-600 text-xs font-medium">
                    Vaquinha criada em: 22/08/2025
                  </p>
                </div>
                <div className="text-gray-700 space-y-2 text-xs">
                  <div className="bg-white/80 p-2 rounded-lg border-l-4 border-green-500">
                    <p>
                      <strong>
                        Há 13 anos resgatamos cães e gatos em situação de
                        abandono em Fortaleza-CE.
                      </strong>
                    </p>
                  </div>
                  <div className="bg-white/80 p-2 rounded-lg border-l-4 border-yellow-400">
                    <p className="font-semibold text-yellow-600">
                      Nosso sonho: ter um espaço fixo e seguro para abrigar
                      todos os resgatados.
                    </p>
                  </div>
                  <div className="bg-white/80 p-2 rounded-lg border-l-4 border-green-500">
                    <p>
                      <strong className="text-green-600">Meta:</strong>{" "}
                      <strong>
                        R$ 500 mil para comprar um terreno e construir nosso
                        lar.
                      </strong>
                    </p>
                  </div>
                  <div className="bg-white/80 p-2 rounded-lg border-l-4 border-yellow-400 text-center">
                    <p className="font-semibold text-yellow-600 mb-1 text-xs">
                      CONTRIBUA
                    </p>
                    <p className="font-mono text-gray-900 font-semibold text-xs break-all">
                      5692750@vakinha.com.br
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
          <div
            className="rounded-2xl max-w-lg sm:max-w-xl md:max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            style={{
              backgroundColor: "#f4f0e4",
              borderWidth: "4px",
              borderColor: "#4a4a4a",
              borderStyle: "solid",
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 4px rgba(74, 74, 74, 0.15)",
            }}
          >
            {/* Header do modal */}
            <div className="relative">
              <div className="h-40 sm:h-44 md:h-48 overflow-hidden rounded-t-2xl bg-gray-100 flex items-center justify-center">
                {selectedPet.imagens && selectedPet.imagens.length > 0 ? (
                  <>
                    <div
                      style={{ backgroundColor: "#f4f0e4" }}
                      className="w-full h-full flex items-center justify-center"
                    >
                      <img
                        src={optimizeImageUrl(
                          selectedPet.imagens[modalImageIndex],
                          600,
                          400
                        )}
                        alt={`${selectedPet.nome} - Foto ${
                          modalImageIndex + 1
                        }`}
                        className="max-w-full max-h-full object-contain"
                        style={{
                          objectFit: "contain",
                          objectPosition: "center center",
                        }}
                      />
                    </div>

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
      {/* <div className="fixed bottom-4 right-4">
        <Link
          to="/login"
          className="bg-gray-800 hover:bg-gray-900 text-white text-xs px-3 py-1 rounded-full opacity-50 hover:opacity-100 transition-opacity"
        >
          Admin
        </Link>
      </div> */}
    </div>
  );
};

export default Home;
