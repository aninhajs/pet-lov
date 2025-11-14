import api from "./api.js";

export const PetServices = {
  // Buscar todos os pets
  getAllPets: async () => {
    try {
      const response = await api.get("/pets");
      return {
        success: true,
        data: response.data,
        message: "Pets carregados com sucesso",
      };
    } catch (error) {
      console.error("Erro ao buscar pets:", error);
      return {
        success: false,
        data: [],
        message: "Erro ao buscar pets",
        error: error.message,
      };
    }
  },

  // Buscar pet por ID
  getPetById: async (id) => {
    try {
      const response = await api.get(`/pets/${id}`);
      return {
        success: true,
        data: response.data,
        message: "Pet encontrado com sucesso",
      };
    } catch (error) {
      console.error("Erro ao buscar pet:", error);
      return {
        success: false,
        data: null,
        message: "Erro ao buscar pet",
        error: error.message,
      };
    }
  },

  // Criar novo pet
  createPet: async (petData) => {
    try {
      const response = await api.post("/pets", petData);
      return {
        success: true,
        data: response.data,
        message: "Pet cadastrado com sucesso",
      };
    } catch (error) {
      console.error("Erro ao cadastrar pet:", error);
      console.error("Resposta do servidor:", error.response?.data);

      // Extrair mensagem de erro do backend
      const backendError = error.response?.data?.error;
      let errorMessage = "Erro ao cadastrar pet";

      if (backendError?.details && Array.isArray(backendError.details)) {
        // Erros de validação
        errorMessage = backendError.details
          .map((d) => `${d.path}: ${d.msg}`)
          .join(", ");
      } else if (backendError?.message) {
        errorMessage = backendError.message;
      }

      return {
        success: false,
        data: null,
        message: errorMessage,
        error: error.response?.data || error.message,
        validationErrors: backendError?.details || null,
      };
    }
  },

  // Atualizar pet
  updatePet: async (id, petData) => {
    try {
      const response = await api.put(`/pets/${id}`, petData);
      return {
        success: true,
        data: response.data,
        message: "Pet atualizado com sucesso",
      };
    } catch (error) {
      console.error("Erro ao atualizar pet:", error);
      return {
        success: false,
        data: null,
        message: "Erro ao atualizar pet",
        error: error.message,
      };
    }
  },

  // Deletar pet
  deletePet: async (id) => {
    try {
      const response = await api.delete(`/pets/${id}`);
      return {
        success: true,
        data: response.data,
        message: "Pet removido com sucesso",
      };
    } catch (error) {
      console.error("Erro ao deletar pet:", error);
      return {
        success: false,
        data: null,
        message: "Erro ao deletar pet",
        error: error.message,
      };
    }
  },

  // Buscar pets por status
  getPetsByStatus: async (status) => {
    try {
      const response = await api.get(`/pets?status=${status}`);
      return {
        success: true,
        data: response.data,
        message: "Pets filtrados com sucesso",
      };
    } catch (error) {
      console.error("Erro ao buscar pets por status:", error);
      return {
        success: false,
        data: [],
        message: "Erro ao buscar pets por status",
        error: error.message,
      };
    }
  },
};

// Buscar pets com filtros
export const getPetsWithFilters = async (filters) => {
  try {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/pets?${params}`);
    return {
      success: true,
      data: response.data,
      message: "Pets filtrados com sucesso",
    };
  } catch (error) {
    console.error("Erro ao buscar pets com filtros:", error);
    return {
      success: false,
      data: [],
      message: "Erro ao buscar pets com filtros",
      error: error.message,
    };
  }
};

// Exportar como função individual também para compatibilidade
export const createPet = PetServices.createPet;
