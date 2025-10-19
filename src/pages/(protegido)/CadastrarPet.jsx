import React, { useState } from "react";
import { Link } from "react-router-dom";

const CadastrarPet = () => {
  const [formData, setFormData] = useState({
    nome: "",
    tipo: "",
    idade: "",
    porte: "",
    sexo: "",
    cor: "",
    peso: "",
    descricao: "",
    temperamento: "",
    castrado: false,
    vacinado: false,
    vermifugado: false,
    necessidadesEspeciais: "",
    historia: "",
    imagem: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({
          ...formData,
          imagem: e.target.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simula salvamento
    setTimeout(() => {
      // Salvar no localStorage (em um app real, seria enviado para o backend)
      const pets = JSON.parse(localStorage.getItem("pets") || "[]");
      const newPet = {
        ...formData,
        id: Date.now(),
        datacadastro: new Date().toISOString(),
        status: "disponivel",
      };
      pets.push(newPet);
      localStorage.setItem("pets", JSON.stringify(pets));

      setIsSubmitting(false);
      setShowSuccess(true);
    }, 1000);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Pet Cadastrado!
          </h1>
          <p className="text-gray-600 mb-6">
            O pet foi cadastrado com sucesso e está disponível para adoção.
          </p>
          <div className="space-y-3">
            <Link
              to="/admin"
              className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white px-6 py-3 rounded-full font-medium inline-block text-center transition-all duration-200 shadow-lg hover:shadow-xl border-2 border-yellow-300"
            >
              Voltar ao Dashboard
            </Link>
            <Link
              to="/admin/gerenciar-pets"
              className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium inline-block text-center"
            >
              Ver Pets Cadastrados
            </Link>
            <Link
              to="/admin/cadastrar-pet"
              className="w-full bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md font-medium inline-block text-center"
              onClick={() => window.location.reload()}
            >
              Cadastrar Outro Pet
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-yellow-50 to-sky-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-sky-50 to-yellow-50 shadow-lg border-b-2 border-sky-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/admin" className="flex items-center space-x-3">
              <img
                src="/logoabrace.jpg"
                alt="Pet Lov Logo"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover shadow-lg border-2 border-yellow-200"
              />
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-sky-600 to-sky-700 bg-clip-text text-transparent">
                Pet Lov Admin
              </h1>
            </Link>
            <div className="flex space-x-3">
              <Link
                to="/admin"
                className="text-sky-700 hover:text-sky-800 hover:bg-yellow-100 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border border-transparent hover:border-yellow-300"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("isAdminLoggedIn");
                  window.location.href = "/";
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sair
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Cadastrar Novo Pet
          </h1>
          <p className="text-gray-600 mb-8">
            Preencha as informações do pet para disponibilizá-lo para adoção
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Informações Básicas */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Informações Básicas
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="pet-nome"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nome do Pet *
                  </label>
                  <input
                    type="text"
                    id="pet-nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 hover:border-yellow-400"
                    placeholder="Ex: Luna"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo *
                  </label>
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Selecione...</option>
                    <option value="cão">Cão</option>
                    <option value="gato">Gato</option>
                    <option value="coelho">Coelho</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Idade *
                  </label>
                  <input
                    type="text"
                    name="idade"
                    value={formData.idade}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Ex: 2 anos, 6 meses"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Porte *
                  </label>
                  <select
                    name="porte"
                    value={formData.porte}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Selecione...</option>
                    <option value="Pequeno">Pequeno (até 15kg)</option>
                    <option value="Médio">Médio (15-30kg)</option>
                    <option value="Grande">Grande (30kg+)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sexo *
                  </label>
                  <select
                    name="sexo"
                    value={formData.sexo}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Selecione...</option>
                    <option value="Macho">Macho</option>
                    <option value="Fêmea">Fêmea</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cor
                  </label>
                  <input
                    type="text"
                    name="cor"
                    value={formData.cor}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Ex: Marrom e branco"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Peso (kg)
                  </label>
                  <input
                    type="number"
                    name="peso"
                    value={formData.peso}
                    onChange={handleChange}
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Ex: 12.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Temperamento
                  </label>
                  <input
                    type="text"
                    name="temperamento"
                    value={formData.temperamento}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Ex: Dócil, brincalhão, protetor"
                  />
                </div>
              </div>
            </div>

            {/* Status de Saúde */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Status de Saúde
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="castrado"
                      checked={formData.castrado}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Castrado</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="vacinado"
                      checked={formData.vacinado}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Vacinado</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="vermifugado"
                      checked={formData.vermifugado}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Vermifugado
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Necessidades Especiais
                  </label>
                  <input
                    type="text"
                    name="necessidadesEspeciais"
                    value={formData.necessidadesEspeciais}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Descreva se há alguma necessidade especial"
                  />
                </div>
              </div>
            </div>

            {/* Descrições */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Descrições
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição do Pet *
                  </label>
                  <textarea
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Descreva a personalidade e características do pet..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    História do Pet
                  </label>
                  <textarea
                    name="historia"
                    value={formData.historia}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Como o pet chegou até a ONG..."
                  />
                </div>
              </div>
            </div>

            {/* Upload de Imagem */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Foto do Pet
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Foto Principal
                  </label>

                  {/* Botão customizado para upload */}
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-indigo-300 rounded-lg cursor-pointer bg-indigo-50 hover:bg-indigo-100 transition-colors duration-200"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 mb-2 text-indigo-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <p className="mb-1 text-sm text-indigo-600 font-medium">
                          <span>Clique para fazer upload</span>
                        </p>
                        <p className="text-xs text-indigo-500">
                          PNG, JPG, JPEG até 10MB
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {formData.imagem && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-700">
                        Preview da imagem:
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, imagem: null })
                        }
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Remover
                      </button>
                    </div>
                    <div className="relative inline-block">
                      <img
                        src={formData.imagem}
                        alt="Preview do pet"
                        className="w-40 h-40 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                      />
                      <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 disabled:from-sky-300 disabled:to-sky-400 text-white px-6 py-3 rounded-full font-medium transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl border-2 border-yellow-300"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Cadastrando...
                  </>
                ) : (
                  "Cadastrar Pet"
                )}
              </button>

              <Link
                to="/admin"
                className="flex-1 bg-white hover:bg-yellow-50 text-sky-700 px-6 py-3 rounded-full font-medium border-2 border-sky-300 hover:border-yellow-400 transition-all duration-200 text-center shadow-md hover:shadow-lg"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CadastrarPet;
