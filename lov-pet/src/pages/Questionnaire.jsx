import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";

const Questionnaire = () => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
    tipoMoradia: "",
    tempoDisponivel: "",
    experienciaPets: "",
    motivacao: "",
    petPreferido: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados do formulário:", formData);
    setSubmitted(true);
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Endereço *
                  </label>
                  <input
                    type="text"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Moradia *
                </label>
                <select
                  name="tipoMoradia"
                  value={formData.tipoMoradia}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tempo disponível para o pet diariamente *
                  </label>
                  <select
                    name="tempoDisponivel"
                    value={formData.tempoDisponivel}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Já teve pets antes? *
                  </label>
                  <textarea
                    name="experienciaPets"
                    value={formData.experienciaPets}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Por que quer adotar um pet? *
                  </label>
                  <textarea
                    name="motivacao"
                    value={formData.motivacao}
                    onChange={handleChange}
                    required
                    rows={3}
                    placeholder="Conte sua motivação para adotar..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tem algum pet específico em mente?
                  </label>
                  <input
                    type="text"
                    name="petPreferido"
                    value={formData.petPreferido}
                    onChange={handleChange}
                    placeholder="Nome do pet ou 'Qualquer um'"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
              >
                Enviar Formulário
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
