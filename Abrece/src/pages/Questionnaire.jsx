import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

// 🔗 Link do Google Forms (mesmo usado na Home)
const GOOGLE_FORM_URL = "https://forms.gle/Vs2Arsu5bwi5h3wA9";

const Questionnaire = () => {
  const navigate = useNavigate();

  const handleStartAdoption = () => {
    // Redireciona para o Google Forms
    window.open(GOOGLE_FORM_URL, "_blank");
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f4f0e4" }}>
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header da página */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">💖</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Questionário de Adoção
            </h1>
            <p className="text-gray-600 text-lg">
              Queremos conhecer você melhor para encontrar o pet perfeito!
            </p>
          </div>

          {/* Informações sobre o processo */}
          <div className="space-y-6 mb-8">
            <div className="bg-gradient-to-r from-sky-50 to-yellow-50 rounded-lg p-6 border-l-4 border-sky-500">
              <h3 className="font-bold text-sky-700 mb-2 flex items-center">
                <span className="text-2xl mr-2">📋</span>O que vamos perguntar?
              </h3>
              <ul className="text-gray-700 space-y-2 ml-8">
                <li>• Informações pessoais e de contato</li>
                <li>• Sobre sua residência e família</li>
                <li>• Experiência com animais de estimação</li>
                <li>• Preferências sobre o pet que deseja adotar</li>
                <li>• Condições para cuidar do animal</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-sky-50 rounded-lg p-6 border-l-4 border-yellow-500">
              <h3 className="font-bold text-yellow-700 mb-2 flex items-center">
                <span className="text-2xl mr-2">⏱️</span>
                Tempo estimado
              </h3>
              <p className="text-gray-700 ml-8">
                O questionário leva cerca de <strong>5-10 minutos</strong> para
                ser completado.
              </p>
            </div>

            <div className="bg-gradient-to-r from-sky-50 to-yellow-50 rounded-lg p-6 border-l-4 border-sky-500">
              <h3 className="font-bold text-sky-700 mb-2 flex items-center">
                <span className="text-2xl mr-2">🔒</span>
                Privacidade garantida
              </h3>
              <p className="text-gray-700 ml-8">
                Suas informações são confidenciais e usadas apenas para avaliar
                a compatibilidade com nossos pets.
              </p>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleStartAdoption}
              className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg transition-all hover:scale-105"
            >
              Iniciar Questionário
            </button>
            <button
              onClick={() => navigate("/pets")}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-lg font-semibold text-lg transition-all"
            >
              Ver Pets Disponíveis
            </button>
          </div>

          {/* Informação adicional */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Após enviar o questionário, nossa equipe entrará em contato em até
              48 horas.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Questionnaire;
