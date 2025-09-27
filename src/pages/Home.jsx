import React, { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const Home = () => {
  const [selectedPet, setSelectedPet] = useState(null);

  // Dados dos pets
  const petsData = {
    luna: {
      nome: "Luna",
      idade: "2 anos",
      sexo: "Fêmea",
      porte: "Médio",
      foto: "/cachorro.png",
      historia:
        "Resgatada das ruas após abandono. Chegou desnutrida mas se recuperou completamente com muito amor.",
      cuidados:
        "Precisa de exercícios diários e socialização. Ideal para famílias ativas.",
      castrado: true,
      vacinado: true,
      situacao: "Resgatada",
    },
    milo: {
      nome: "Milo",
      idade: "1 ano",
      sexo: "Macho",
      porte: "Pequeno",
      foto: "/gatinho1.webp",
      historia:
        "Encontrado órfão muito novo. Foi cuidado com mamadeira e hoje é um gato saudável e sociável.",
      cuidados:
        "Gosta de ambientes tranquilos. Precisa de arranhador e brinquedos para se entreter.",
      castrado: true,
      vacinado: true,
      situacao: "Órfão",
    },
    thor: {
      nome: "Thor",
      idade: "3 anos",
      sexo: "Macho",
      porte: "Grande",
      foto: "/cachorro2.jpg",
      historia:
        "Sofreu maus-tratos no passado. Com paciência e amor, voltou a confiar nas pessoas e é muito grato.",
      cuidados:
        "Precisa de dono experiente e ambiente seguro. Não gosta de barulhos altos inicialmente.",
      castrado: true,
      vacinado: true,
      situacao: "Maltratado",
    },
    bella: {
      nome: "Bella",
      idade: "6 meses",
      sexo: "Fêmea",
      porte: "Pequeno",
      foto: "/gatinho2.png",
      historia:
        "Nasceu em um lar temporário. Mãe foi resgatada grávida e todos os filhotes foram bem cuidados.",
      cuidados:
        "Por ser jovem, precisa de estímulos e brincadeiras. Castração agendada quando atingir idade ideal.",
      castrado: false,
      vacinado: true,
      situacao: "Filhote",
    },
  };

  const openModal = (petKey) => {
    setSelectedPet(petsData[petKey]);
  };

  const closeModal = () => {
    setSelectedPet(null);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header customizado para Home - sem botão "Ver Pets" */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-3">
              <img
                src="/logoPet.jpeg"
                alt="Pet Lov Logo"
                className="w-12 h-12 rounded-full object-cover"
              />
              <h1 className="text-2xl font-bold text-indigo-600">
                Amor Por Animais De Estimação
              </h1>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/questionnaire"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
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
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8">
            Encontre seu novo
            <span className="text-indigo-600"> melhor amigo</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Conectamos corações e patas! Descubra pets incríveis esperando por
            uma família amorosa. Cada adoção é uma segunda chance para a
            felicidade.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center ">
            <Link
              to="/pets"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors inline-flex items-center justify-center overflow-hidden"
            >
              🐕 Ver Pets Disponíveis
            </Link>
            <Link
              to="/questionnaire"
              className="bg-indigo-600  text-white px-8 py-4 rounded-lg text-lg font-semibold border-2 border-indigo-600 transition-colors inline-flex items-center justify-center"
            >
              📝 Quero Adotar
            </Link>
          </div>
        </div>

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
            {/* Pet 1 */}
            <div
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 hover:scale-105 group cursor-pointer"
              onClick={() => openModal("luna")}
            >
              <div className="relative w-full h-56 bg-gray-100 overflow-hidden flex items-center justify-center">
                <img
                  src="/cachorro.png"
                  alt="Luna - Cachorrinha para adoção"
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-300 group-hover:scale-110 group-hover:brightness-110"
                  loading="lazy"
                  style={{
                    objectPosition: "center center",
                    objectFit: "cover",
                    minHeight: "100%",
                    minWidth: "100%",
                  }}
                  onError={(e) => {
                    e.target.parentElement.innerHTML =
                      '<div class="h-56 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center"><span class="text-6xl">🐕</span></div>';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-4 text-center">
                <h3 className="font-semibold text-gray-900 text-lg mb-1">
                  Luna
                </h3>
                <p className="text-gray-600 text-sm">2 anos</p>
                <div className="mt-3 text-indigo-600 text-sm font-medium">
                  Clique para ver mais →
                </div>
              </div>
            </div>

            {/* Pet 2 */}
            <div
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 hover:scale-105 group cursor-pointer"
              onClick={() => openModal("milo")}
            >
              <div className="relative w-full h-56 bg-gray-100 overflow-hidden flex items-center justify-center">
                <img
                  src="/gatinho1.webp"
                  alt="Milo - Gatinho para adoção"
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-300 group-hover:scale-110 group-hover:brightness-110"
                  loading="lazy"
                  style={{
                    objectPosition: "center center",
                    objectFit: "cover",
                    minHeight: "100%",
                    minWidth: "100%",
                  }}
                  onError={(e) => {
                    e.target.parentElement.innerHTML =
                      '<div class="h-56 bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center"><span class="text-6xl">🐱</span></div>';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-4 text-center">
                <h3 className="font-semibold text-gray-900 text-lg mb-1">
                  Milo
                </h3>
                <p className="text-gray-600 text-sm">1 ano</p>
                <div className="mt-3 text-indigo-600 text-sm font-medium">
                  Clique para ver mais →
                </div>
              </div>
            </div>

            {/* Pet 3 */}
            <div
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 hover:scale-105 group cursor-pointer"
              onClick={() => openModal("thor")}
            >
              <div className="relative w-full h-56 bg-gray-100 overflow-hidden flex items-center justify-center">
                <img
                  src="/cachorro2.jpg"
                  alt="Thor - Cachorro para adoção"
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-300 group-hover:scale-110 group-hover:brightness-110"
                  loading="lazy"
                  style={{
                    objectPosition: "50% 30%",
                    objectFit: "cover",
                    minHeight: "100%",
                    minWidth: "100%",
                  }}
                  onError={(e) => {
                    e.target.parentElement.innerHTML =
                      '<div class="h-56 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center"><span class="text-6xl">🐕</span></div>';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-4 text-center">
                <h3 className="font-semibold text-gray-900 text-lg mb-1">
                  Thor
                </h3>
                <p className="text-gray-600 text-sm">3 anos</p>
                <div className="mt-3 text-indigo-600 text-sm font-medium">
                  Clique para ver mais →
                </div>
              </div>
            </div>

            {/* Pet 4 */}
            <div
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 hover:scale-105 group cursor-pointer"
              onClick={() => openModal("bella")}
            >
              <div className="relative w-full h-56 bg-gray-100 overflow-hidden flex items-center justify-center">
                <img
                  src="/gatinho2.png"
                  alt="Bella - Gatinha para adoção"
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-300 group-hover:scale-110 group-hover:brightness-110"
                  loading="lazy"
                  style={{
                    objectPosition: "center center",
                    objectFit: "cover",
                    minHeight: "100%",
                    minWidth: "100%",
                  }}
                  onError={(e) => {
                    e.target.parentElement.innerHTML =
                      '<div class="h-56 bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center"><span class="text-6xl">🐱</span></div>';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-4 text-center">
                <h3 className="font-semibold text-gray-900 text-lg mb-1">
                  Bella
                </h3>
                <p className="text-gray-600 text-sm">6 meses</p>
                <div className="mt-3 text-indigo-600 text-sm font-medium">
                  Clique para ver mais →
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Por que Adotar?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="text-4xl mb-4">🏠</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Adoção Responsável
              </h3>
              <p className="text-gray-600">
                Processo cuidadoso para garantir que cada pet encontre o lar
                perfeito
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="text-4xl mb-4">❤️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Amor Incondicional
              </h3>
              <p className="text-gray-600">
                Pets resgatados prontos para oferecer todo seu amor e
                companheirismo
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nova Vida
              </h3>
              <p className="text-gray-600">
                Dê uma segunda chance e transforme duas vidas: a sua e a do seu
                novo pet
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
                <img
                  src={selectedPet.foto}
                  alt={`${selectedPet.nome} - Pet para adoção`}
                  className="max-w-full max-h-full object-contain"
                  style={{
                    objectFit: "contain",
                    objectPosition: "center center",
                  }}
                />
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
                <div className="flex items-center justify-center gap-3 text-gray-600 mb-3 text-sm">
                  <span>{selectedPet.sexo}</span>
                  <span>•</span>
                  <span>{selectedPet.idade}</span>
                  <span>•</span>
                  <span>Porte {selectedPet.porte}</span>
                </div>

                {/* Tags de situação */}
                <div className="flex gap-1 justify-center mb-4 flex-wrap">
                  {selectedPet.castrado ? (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Castrado(a)
                    </span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      A castrar
                    </span>
                  )}
                  {selectedPet.vacinado && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      Vacinado(a)
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

              {/* História */}
              <div className="mb-4">
                <h3 className="text-orange-600 text-base font-semibold mb-2 flex items-center">
                  📖 Sua História
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {selectedPet.historia}
                </p>
              </div>

              {/* Cuidados necessários */}
              <div className="mb-5">
                <h3 className="text-purple-600 text-base font-semibold mb-2 flex items-center">
                  💜 Cuidados Especiais
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {selectedPet.cuidados}
                </p>
              </div>

              {/* Botão de adoção */}
              <div className="text-center">
                <Link
                  to="/questionnaire"
                  className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-base font-semibold transition-colors"
                  onClick={closeModal}
                >
                  💖 Quero Adotar {selectedPet.nome}
                </Link>
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
