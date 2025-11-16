import api from "./api";

export const VacinaServices = {
  // Listar todas as vacinas ou filtrar por pet_id
  getAllVacinas: async (params = {}) => {
    try {
      const response = await api.get("/admin/cartao-vacina", { params });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("❌ Erro ao buscar vacinas:", error);
      return {
        success: false,
        message:
          error.response?.data?.error?.message || "Erro ao buscar vacinas",
        error: error.response?.data,
      };
    }
  },

  // Buscar vacinas de um pet específico
  getVacinasPorPet: async (petId) => {
    try {
      const response = await api.get(`/admin/cartao-vacina/pet/${petId}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("❌ Erro ao buscar vacinas do pet:", error);
      return {
        success: false,
        message:
          error.response?.data?.error?.message ||
          "Erro ao buscar vacinas do pet",
        error: error.response?.data,
      };
    }
  },

  // Cadastrar uma única vacina
  createVacina: async (vacinaData) => {
    try {
      const response = await api.post("/admin/cartao-vacina", vacinaData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("❌ Erro ao cadastrar vacina:", error);
      return {
        success: false,
        message:
          error.response?.data?.error?.message || "Erro ao cadastrar vacina",
        error: error.response?.data,
      };
    }
  },

  // Cadastrar múltiplas vacinas de uma vez
  createVacinasLote: async (petId, vacinas) => {
    try {
      const response = await api.post("/admin/cartao-vacina/lote", {
        pet_id: petId,
        vacinas,
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("❌ Erro ao cadastrar vacinas em lote:", error);
      return {
        success: false,
        message:
          error.response?.data?.error?.message || "Erro ao cadastrar vacinas",
        error: error.response?.data,
      };
    }
  },

  // Atualizar uma vacina
  updateVacina: async (id, vacinaData) => {
    try {
      const response = await api.put(`/admin/cartao-vacina/${id}`, vacinaData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("❌ Erro ao atualizar vacina:", error);
      return {
        success: false,
        message:
          error.response?.data?.error?.message || "Erro ao atualizar vacina",
        error: error.response?.data,
      };
    }
  },

  // Deletar uma vacina
  deleteVacina: async (id) => {
    try {
      const response = await api.delete(`/admin/cartao-vacina/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("❌ Erro ao deletar vacina:", error);
      return {
        success: false,
        message:
          error.response?.data?.error?.message || "Erro ao deletar vacina",
        error: error.response?.data,
      };
    }
  },
};
