import React, { useState } from "react";

const ModalEditarPet = ({ pet, onClose, onSave, isSubmitting }) => {
  const [formData, setFormData] = useState({ ...pet });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    // Validações
    if (!formData.nome || !formData.tipo) {
      setError("Nome e tipo são obrigatórios.");
      return;
    }
    if (formData.descricao && formData.descricao.length < 10) {
      setError("A descrição deve ter pelo menos 10 caracteres.");
      return;
    }
    if (formData.descricao && formData.descricao.length > 500) {
      setError("A descrição deve ter no máximo 500 caracteres.");
      return;
    }
    try {
      await onSave(formData);
    } catch (err) {
      if (err?.response?.data?.error?.details) {
        setError(err.response.data.error.details.map((d) => d.msg).join(", "));
      } else if (err?.response?.data?.error?.message) {
        setError(err.response.data.error.message);
      } else if (err?.message) {
        setError(err.message);
      } else {
        setError("Erro ao atualizar pet.");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-600 text-2xl"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4 text-sky-700">Editar Pet</h2>
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nome"
            value={formData.nome || ""}
            onChange={handleChange}
            placeholder="Nome"
            className="w-full border rounded p-2"
            required
          />
          <select
            name="tipo"
            value={formData.tipo || ""}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="">Selecione o tipo</option>
            <option value="cao">Cão</option>
            <option value="gato">Gato</option>
            <option value="outros">Outros</option>
          </select>
          <input
            type="text"
            name="idade"
            value={formData.idade || ""}
            onChange={handleChange}
            placeholder="Idade"
            className="w-full border rounded p-2"
          />
          <select
            name="porte"
            value={formData.porte || ""}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="">Selecione o porte</option>
            <option value="pequeno">Pequeno</option>
            <option value="medio">Médio</option>
            <option value="grande">Grande</option>
          </select>
          <select
            name="sexo"
            value={formData.sexo || ""}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="">Selecione o sexo</option>
            <option value="macho">Macho</option>
            <option value="femea">Fêmea</option>
          </select>
          <input
            type="text"
            name="cor"
            value={formData.cor || ""}
            onChange={handleChange}
            placeholder="Cor"
            className="w-full border rounded p-2"
          />
          <input
            type="text"
            name="localizacao"
            value={formData.localizacao || ""}
            onChange={handleChange}
            placeholder="Localização"
            className="w-full border rounded p-2"
          />
          <input
            type="number"
            name="peso"
            value={formData.peso || ""}
            onChange={handleChange}
            placeholder="Peso (kg)"
            className="w-full border rounded p-2"
          />
          <div>
            <textarea
              name="descricao"
              value={formData.descricao || ""}
              onChange={handleChange}
              placeholder="Descrição (mínimo 10 caracteres)"
              className="w-full border rounded p-2"
              rows={3}
            />
            <div className="text-sm text-gray-500 mt-1">
              {(formData.descricao || "").length}/500 caracteres
              {(formData.descricao || "").length < 10 &&
                (formData.descricao || "").length > 0 && (
                  <span className="text-red-500 ml-2">
                    Mínimo 10 caracteres
                  </span>
                )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="castrado"
                checked={!!formData.castrado}
                onChange={handleChange}
              />
              Castrado
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="vacinado"
                checked={!!formData.vacinado}
                onChange={handleChange}
              />
              Vacinado
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="vermifugado"
                checked={!!formData.vermifugado}
                onChange={handleChange}
              />
              Vermifugado
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-sky-500 to-sky-600 text-white py-2 rounded font-semibold mt-2 disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Salvando..." : "Salvar Alterações"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarPet;
