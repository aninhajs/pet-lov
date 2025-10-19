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

  const openModal = (pet) => {
    setSelectedPet(pet);
  };

  const closeModal = () => {
    setSelectedPet(null);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-yellow-50 to-sky-100">
      {/* Header customizado para Home - sem botão "Ver Pets" */}
      <header className="bg-gradient-to-r from-sky-50 to-yellow-50 shadow-lg border-b-2 border-sky-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-3">
              <img
                src="/logoabrace.jpg"
                alt="logo-abrace"
                className="w-12 h-12 rounded-full object-cover shadow-lg border-2 border-yellow-200"
              />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-sky-700 bg-clip-text text-transparent">
                Abrace uma causa animal
              </h1>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/pets"
                className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border-2 border-yellow-300"
              >
                Ver Pets Disponíveis
              </Link>
              <Link
                to="https://forms.gle/Vs2Arsu5bwi5h3wA9"
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-sky-900 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 border-2 border-sky-300"
              >
                Adotar Pet
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-sky-600 mb-8">
            Encontre seu novo
            <span className="bg-gradient-to-r from-sky-600 to-yellow-500 bg-clip-text text-transparent">
              {" "}
              melhor amigo
            </span>
          </h1>
          <p className="text-xl text-sky-700 mb-12 max-w-3xl mx-auto">
            Conectamos corações e patas! Descubra pets incríveis esperando por
            uma família amorosa. Cada adoção é uma segunda chance para a
            felicidade.
          </p>
        </div>

        {/* Pets em Destaque */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-sky-600 mb-4">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-bold text-gray-900 text-lg mb-1">
                    {pet.nome}
                  </h3>
                  <p className="text-gray-600 text-sm font-medium">
                    {pet.idade}
                  </p>
                  <div className="mt-3 bg-gradient-to-r from-sky-600 to-sky-700 bg-clip-text text-transparent text-sm font-semibold">
                    Clique para ver mais →
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pets.length === 0 && (
            <div className="text-center py-12 mb-12">
              <div className="text-6xl mb-4">�</div>
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
              Como Ajudar?
            </h2>
          </div>

          {/* Cards informativos sobre como ajudar */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Adoção Responsável */}
            <div className="bg-gradient-to-br from-sky-50 to-yellow-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-sky-200">
              <div className="text-center mb-3">
                <div className="text-3xl mb-2">📄</div>
                <h2 className="text-lg font-bold text-sky-800 mb-2">
                  Sua nota tem valor - passo a passo
                </h2>
              </div>
              <h3 className="text-base font-bold text-gray-800 mb-1">
                Cadastro
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                Cadastra-se pelos aplicativos{" "}
                <span className="text-black font-semibold">
                  Ceará App, Sua Nota Tem Valor
                </span>
                , ou pelo site{" "}
                <span className="text-black font-semibold">
                  <a
                    href="https://suanotatemvalor.ce.gov.br"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    suanotatemvalor.ce.gov.br
                  </a>
                </span>
              </p>

              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Escolha a ong Abrece
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                No ato do cadastro, escolha a{" "}
                <span className="text-black font-semibold">ong Abrece</span>{" "}
                (Amigos e Benfeitores Reabilitando Animais no Ceará) como sua
                ong favorita.
              </p>

              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Peça cpf na nota
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                A cada compra que você fizer, solicite o{" "}
                <span className="text-black font-semibold">CPF na nota</span>{" "}
                fiscal.
              </p>
            </div>

            {/* Cuidados Essenciais */}
            <div className="bg-gradient-to-br from-yellow-50 to-sky-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-yellow-200">
              <div className="text-center mb-3">
                <div className="text-3xl mb-2">💝</div>
                <h2 className="text-lg font-bold text-yellow-800 mb-2">
                  Seja uma madrinha ou padrinho
                </h2>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                Doe a partir de{" "}
                <span className="text-black font-semibold">
                  R$50,00 por mês
                </span>{" "}
                e nos ajude a cuidar dos animais do Lar Abrece através do
                programa de apadrinhamento.
              </p>

              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Como funciona?
              </h3>
              <ul className="text-gray-600 text-sm space-y-2 mb-4">
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2 mt-1">•</span>
                  <span>
                    Escolha um valor mensal a partir de{" "}
                    <span className="text-black font-semibold">R$50,00</span>
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2 mt-1">•</span>
                  <span>
                    Sua doação ajuda com ração, medicamentos e cuidados
                    veterinários
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2 mt-1">•</span>
                  <span>
                    Receba relatórios mensais sobre como sua contribuição está
                    fazendo a diferença
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2 mt-1">•</span>
                  <span>
                    Visite o lar quando quiser para conhecer os animais
                  </span>
                </li>
              </ul>
            </div>

            {/* Doação */}
            <div className="bg-gradient-to-br from-sky-50 to-yellow-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-sky-200">
              <div className="text-center mb-3">
                <div className="text-3xl mb-2">🍽️</div>
                <h2 className="text-lg font-bold text-sky-800 mb-2">
                  Doe Ração e Suprimentos
                </h2>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                Precisamos muito de{" "}
                <span className="text-black font-semibold">ração</span> para{" "}
                <span className="text-black font-semibold">
                  cães e gatos adultos e filhotes
                </span>
                , além de{" "}
                <span className="text-black font-semibold">misturinhas</span>,
                fígado, miúdos de frango, sachês, latinhas para os animais
                debilitados.
              </p>

              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Outros itens essenciais:
              </h3>
              <ul className="text-gray-600 text-sm space-y-2 mb-4">
                <li className="flex items-start">
                  <span className="text-sky-600 mr-2 mt-1">•</span>
                  <span>
                    <span className="text-black font-semibold">
                      Medicamentos
                    </span>{" "}
                    e vitaminas
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-sky-600 mr-2 mt-1">•</span>
                  <span>
                    <span className="text-black font-semibold">
                      Material de limpeza
                    </span>{" "}
                    e higiene
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-sky-600 mr-2 mt-1">•</span>
                  <span>
                    <span className="text-black font-semibold">
                      Cobertores e toalhas
                    </span>{" "}
                    usadas
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-sky-600 mr-2 mt-1">•</span>
                  <span>
                    <span className="text-black font-semibold">Brinquedos</span>{" "}
                    e casinhas
                  </span>
                </li>
              </ul>

              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                Ajude a encher mais de{" "}
                <span className="text-black font-semibold">
                  150 barriguinhas
                </span>{" "}
                que diariamente são alimentadas no Lar Abrece.
              </p>
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
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold transition-all shadow-lg"
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

                {/* Tags de situação */}
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
                  {selectedPet.situacao && (
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
                  )}
                </div>

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
              </div>

              {/* Botão de adoção */}
              <div className="text-center">
                <a
                  href={GOOGLE_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-sky-900 px-6 py-2.5 rounded-full text-base font-semibold transition-all duration-200 shadow-lg hover:shadow-xl border-2 border-sky-300"
                  onClick={closeModal}
                >
                  💖 Quero Adotar {selectedPet.nome}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Link discreto para login admin (apenas para desenvolvimento)
      <div className="fixed bottom-4 right-4">
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
