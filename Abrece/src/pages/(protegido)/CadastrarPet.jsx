import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PetServices } from "../../services/PetServices";

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
    localizacao: "",
    imagens: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);

  // Função para comprimir e redimensionar imagem
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Criar canvas para redimensionar
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Definir tamanho máximo (800px na maior dimensão)
          const maxSize = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;

          // Desenhar imagem redimensionada
          ctx.drawImage(img, 0, 0, width, height);

          // Converter para base64 com qualidade reduzida (70%)
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
          resolve(compressedBase64);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 0) {
      // Limitar a 5 fotos
      const maxFiles = 5;
      const remainingSlots = maxFiles - formData.imagens.length;
      const filesToProcess = files.slice(0, remainingSlots);

      if (filesToProcess.length === 0) {
        alert(`Você já selecionou o máximo de ${maxFiles} fotos`);
        return;
      }

      setIsCompressing(true);

      try {
        // Comprimir todas as imagens
        const compressedImages = await Promise.all(
          filesToProcess.map((file) => compressImage(file))
        );

        setFormData({
          ...formData,
          imagens: [...formData.imagens, ...compressedImages],
        });
      } catch (error) {
        console.error("Erro ao comprimir imagens:", error);
        alert("Erro ao processar as imagens. Tente novamente.");
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imagens: formData.imagens.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Validação do peso conforme o porte
    const peso = formData.peso ? parseFloat(formData.peso) : null;
    if (formData.porte && peso !== null) {
      if (
        (formData.porte === "pequeno" && peso > 15) ||
        (formData.porte === "medio" && (peso <= 15 || peso > 30)) ||
        (formData.porte === "grande" && peso <= 30)
      ) {
        setIsSubmitting(false);
        setError(
          "O peso informado não corresponde ao porte selecionado.\n" +
            "Pequeno: até 15kg | Médio: 15-30kg | Grande: acima de 30kg."
        );
        return;
      }
    }

    try {
      // Preparar dados para envio ao backend
      const petData = {
        nome: formData.nome,
        tipo: formData.tipo, // Já está em lowercase
        idade: formData.idade,
        porte: formData.porte, // Já está em lowercase
        sexo: formData.sexo, // Já está em lowercase
        cor:
          formData.cor && formData.cor.trim() !== ""
            ? formData.cor
            : "Não informada",
        peso: formData.peso ? parseFloat(formData.peso) : null,
        descricao: formData.descricao,
        temperamento: formData.temperamento || null,
        castrado: formData.castrado,
        vacinado: formData.vacinado,
        vermifugado: formData.vermifugado,
        necessidades_especiais: formData.necessidadesEspeciais || null,
        historia: formData.historia || null,
        localizacao: formData.localizacao || null,
        // Enviar imagens como array de objetos com url base64
        imagens: formData.imagens.map((img, index) => ({
          url: img,
          nome: `pet-${formData.nome.replace(
            /\s+/g,
            "-"
          )}-${Date.now()}-${index}.jpg`,
          tipo: "image/jpeg",
        })),
      };

      console.log("📤 Enviando dados para o backend:", {
        ...petData,
        imagens: `${petData.imagens.length} imagem(ns)`, // Não mostrar base64 completo
      });

      // Enviar para o backend
      const response = await PetServices.createPet(petData);

      console.log("📥 Resposta do backend:", response);

      if (response.success) {
        console.log("✅ Pet cadastrado com sucesso no backend:", response.data);
        setShowSuccess(true);
      } else {
        // Log detalhado do erro antes de lançar
        console.error("❌ Falha na resposta:", response);
        console.error("📋 Dados do erro:", response.error || response.data);
        throw new Error(response.message || "Erro ao cadastrar pet");
      }
    } catch (error) {
      console.error("❌ Erro ao cadastrar pet:", error);
      console.error("📋 Detalhes completos do erro:", error.response?.data);

      // Extrair mensagem de erro mais detalhada
      let errorMessage = "Erro ao cadastrar pet. Tente novamente.";

      if (error.response?.data?.error?.details) {
        // Erros de validação
        const details = error.response.data.error.details;
        errorMessage = details.map((d) => d.msg).join(", ");
      } else if (error.response?.data?.error?.message) {
        errorMessage = error.response.data.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#f4f0e4" }}
      >
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl p-8 text-center border-2 border-sky-200">
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
              className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white px-6 py-3 rounded-md font-medium inline-block text-center shadow-lg transition-all hover:scale-105"
            >
              Voltar ao Dashboard
            </Link>
            <Link
              to="/admin/gerenciar-pets"
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-md font-medium inline-block text-center shadow-lg transition-all hover:scale-105"
            >
              Ver Pets Cadastrados
            </Link>
            <Link
              to="/admin/cadastrar-pet"
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 px-6 py-3 rounded-md font-medium inline-block text-center shadow-lg transition-all hover:scale-105"
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
    <div className="min-h-screen" style={{ backgroundColor: "#f4f0e4" }}>
      {/* Header */}
      <header
        className="shadow-lg border-b-2 border-yellow-300"
        style={{ backgroundColor: "#f4f0e4" }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/admin" className="flex items-center space-x-3">
              <img
                src="/logoabrace.jpg"
                alt="Abrace Uma Causa Animal"
                className="w-14 h-14 rounded-full object-cover shadow-lg border-2 border-yellow-200"
              />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-sky-700 bg-clip-text text-transparent">
                Abrace Uma Causa Animal
              </h1>
            </Link>
            <div className="flex space-x-3">
              <Link
                to="/admin"
                className="text-gray-700 hover:text-sky-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                🏠 Dashboard
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

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="text-red-600 mr-2">⚠️</div>
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Informações Básicas */}
            <div>
              <h2 className="text-xl font-semibold bg-gradient-to-r from-sky-600 to-sky-700 bg-clip-text text-transparent mb-4">
                Informações Básicas
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Pet *
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  >
                    <option value="">Selecione...</option>
                    <option value="cao">Cão</option>
                    <option value="gato">Gato</option>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  >
                    <option value="">Selecione...</option>
                    <option value="pequeno">Pequeno (até 15kg)</option>
                    <option value="medio">Médio (15-30kg)</option>
                    <option value="grande">Grande (30kg+)</option>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  >
                    <option value="">Selecione...</option>
                    <option value="macho">Macho</option>
                    <option value="femea">Fêmea</option>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="Ex: 12.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Localização
                  </label>
                  <input
                    type="text"
                    name="localizacao"
                    value={formData.localizacao}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="Ex: São Paulo - SP, Belo Horizonte - MG"
                  />
                </div>
              </div>
            </div>

            {/* Status de Saúde */}
            <div>
              <h2 className="text-xl font-semibold bg-gradient-to-r from-sky-600 to-sky-700 bg-clip-text text-transparent mb-4">
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
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-sky-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Castrado</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="vacinado"
                      checked={formData.vacinado}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-sky-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Vacinado</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="vermifugado"
                      checked={formData.vermifugado}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-sky-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Vermifugado
                    </span>
                  </label>
                </div>

                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Necessidades Especiais
                  </label>
                  <input
                    type="text"
                    name="necessidadesEspeciais"
                    value={formData.necessidadesEspeciais}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="Descreva se há alguma necessidade especial"
                  />
                </div> */}
              </div>
            </div>

            {/* Descrições */}
            <div>
              <h2 className="text-xl font-semibold bg-gradient-to-r from-sky-600 to-sky-700 bg-clip-text text-transparent mb-4">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="Descreva a personalidade e características do pet..."
                  />
                </div>

                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    História do Pet
                  </label>
                  <textarea
                    name="historia"
                    value={formData.historia}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="Como o pet chegou até a ONG..."
                  />
                </div> */}
              </div>
            </div>

            {/* Upload de Imagem */}
            <div>
              <h2 className="text-xl font-semibold bg-gradient-to-r from-sky-600 to-sky-700 bg-clip-text text-transparent mb-4">
                Foto do Pet
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Fotos do Pet (até 5 fotos)
                  </label>

                  {/* Botão customizado para upload */}
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      multiple
                      disabled={isCompressing || formData.imagens.length >= 5}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg transition-colors duration-200 ${
                        isCompressing || formData.imagens.length >= 5
                          ? "border-gray-300 bg-gray-100 cursor-not-allowed"
                          : "border-sky-300 bg-sky-50 hover:bg-sky-100 cursor-pointer"
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {isCompressing ? (
                          <>
                            <div className="animate-spin rounded-full h-8 w-8 border-4 border-sky-500 border-t-transparent mb-2"></div>
                            <p className="text-sm text-sky-600 font-medium">
                              Comprimindo imagens...
                            </p>
                          </>
                        ) : formData.imagens.length >= 5 ? (
                          <>
                            <svg
                              className="w-8 h-8 mb-2 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            <p className="text-sm text-gray-500 font-medium">
                              Limite máximo atingido
                            </p>
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-8 h-8 mb-2 text-sky-500"
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
                            <p className="mb-1 text-sm text-sky-600 font-medium">
                              <span>Clique para fazer upload múltiplo</span>
                            </p>
                            <p className="text-xs text-sky-500">
                              PNG, JPG, JPEG (serão comprimidas automaticamente)
                            </p>
                          </>
                        )}
                      </div>
                    </label>
                  </div>
                </div>

                {formData.imagens && formData.imagens.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-700">
                        {formData.imagens.length} foto(s) selecionada(s):
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, imagens: [] })
                        }
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Remover todas
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {formData.imagens.map((img, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={img}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                          />
                          {/* Badge com número da foto */}
                          <div className="absolute top-2 left-2 bg-sky-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md">
                            {index + 1}
                          </div>
                          {/* Botão para remover foto individual */}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-700"
                          >
                            <svg
                              className="w-4 h-4"
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
                        </div>
                      ))}
                    </div>

                    <p className="text-xs text-gray-500">
                      💡 Dica: A primeira foto será a foto principal do card.
                      Máximo de 5 fotos.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-md font-semibold shadow-lg transition-all hover:scale-105 flex items-center justify-center"
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
                className="flex-1 bg-white hover:bg-sky-50 text-sky-600 px-6 py-3 rounded-md font-medium border-2 border-sky-600 transition-all hover:scale-105 text-center shadow-md"
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
