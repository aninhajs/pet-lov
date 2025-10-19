import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "../components/Header";

const Questionnaire = () => {
  const location = useLocation();
  const { petName } = location.state || {};

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
    tipo_moradia: "",
    tempo_disponivel: "",
    experiencia_pets: "",
    motivacao: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Limpar erro ao digitar
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simular um delay de envio
    setTimeout(() => {
      // Salvar no localStorage
      const candidatos = JSON.parse(localStorage.getItem("candidatos") || "[]");
      const novoCandidato = {
        id: Date.now(),
        ...formData,
        petInteresse: petName || null,
        dataEnvio: new Date().toISOString(),
      };

      candidatos.push(novoCandidato);
      localStorage.setItem("candidatos", JSON.stringify(candidatos));

      console.log("Formulário enviado:", novoCandidato);
      setSubmitted(true);
      setLoading(false);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Formulário Enviado!
          </h1>
          <p className="text-gray-600 mb-6">
            Obrigado pelo seu interesse em adotar! Entraremos em contato em
            breve.
          </p>
          <div className="space-y-3">
            <Link
              to="/pets"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium inline-block"
            >
              Ver Mais Pets
            </Link>
            <Link
              to="/"
              className="w-full bg-white hover:bg-gray-50 text-indigo-600 px-4 py-2 rounded-md font-medium border border-indigo-600 inline-block"
            >
              Voltar ao Início
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Formulário de Adoção
          </h1>
          <p className="text-gray-600 mb-8">
            Preencha as informações abaixo para iniciar o processo de adoção.
            Queremos garantir que você e seu novo pet sejam perfeitos um para o
            outro! ❤️
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Pessoais */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Informações Pessoais
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="quest-nome"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    id="quest-nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="quest-email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="quest-email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="quest-telefone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    id="quest-telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="quest-endereco"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Endereço *
                  </label>
                  <input
                    type="text"
                    id="quest-endereco"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Informações sobre Moradia */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Sobre sua Moradia
              </h2>
              <div>
                <label
                  htmlFor="quest-tipo-moradia"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Tipo de Moradia *
                </label>
                <select
                  id="quest-tipo-moradia"
                  name="tipo_moradia"
                  value={formData.tipo_moradia}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Selecione...</option>
                  <option value="casa-quintal">Casa com quintal</option>
                  <option value="casa-sem-quintal">Casa sem quintal</option>
                  <option value="apartamento">Apartamento</option>
                  <option value="sitio-chacara">Sítio/Chácara</option>
                </select>
              </div>
            </div>

            {/* Experiência com Pets */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Experiência com Pets
              </h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="quest-tempo-disponivel"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Tempo disponível para o pet diariamente *
                  </label>
                  <select
                    id="quest-tempo-disponivel"
                    name="tempo_disponivel"
                    value={formData.tempo_disponivel}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Selecione...</option>
                    <option value="1-2h">1-2 horas</option>
                    <option value="3-4h">3-4 horas</option>
                    <option value="5-6h">5-6 horas</option>
                    <option value="dia-todo">O dia todo</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="quest-experiencia-pets"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Já teve pets antes? *
                  </label>
                  <textarea
                    id="quest-experiencia-pets"
                    name="experiencia_pets"
                    value={formData.experiencia_pets}
                    onChange={handleChange}
                    required
                    rows={3}
                    placeholder="Conte sobre sua experiência com pets..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Motivação */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Sobre a Adoção
              </h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="quest-motivacao"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Por que quer adotar um pet? *
                  </label>
                  <textarea
                    id="quest-motivacao"
                    name="motivacao"
                    value={formData.motivacao}
                    onChange={handleChange}
                    required
                    rows={3}
                    placeholder="Conte sua motivação para adotar..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {petName && (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <span className="text-blue-400 text-xl">💝</span>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">
                          Pet de interesse
                        </h3>
                        <div className="mt-2 text-sm text-blue-700">
                          <p>
                            Você está interessado em adotar:{" "}
                            <strong>{petName}</strong>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mensagem de erro */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="text-red-400 text-xl">⚠️</span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Erro no envio
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-6 py-3 rounded-md font-medium transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Enviando...
                  </>
                ) : (
                  "Enviar Formulário"
                )}
              </button>
              <Link
                to="/pets"
                className="flex-1 bg-white hover:bg-gray-50 text-indigo-600 px-6 py-3 rounded-md font-medium border border-indigo-600 transition-colors text-center"
              >
                Voltar aos Pets
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Questionnaire;
