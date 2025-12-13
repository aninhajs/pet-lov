import axios from "axios";

// Permite configurar a URL da API via variáveis de ambiente do Vite.
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptador para adicionar token de autenticação automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptador para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido ou expirado
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

// Função para cadastrar um pet
export const createPet = async (petData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(petData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao cadastrar pet");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao cadastrar pet:", error);
    throw error;
  }
};

// Função alternativa usando axios
export const createPetWithAxios = async (petData) => {
  try {
    const response = await api.post("/pets", petData);
    return {
      success: true,
      data: response.data,
      message: "Pet cadastrado com sucesso",
    };
  } catch (error) {
    console.error("Erro ao cadastrar pet:", error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || "Erro ao cadastrar pet",
      error: error.message,
    };
  }
};

// Função para cadastrar um admin
export const createAdmin = async (adminData) => {
  try {
    const response = await api.post("/auth/register-admin", adminData);
    return {
      success: true,
      data: response.data,
      message: "Admin cadastrado com sucesso",
    };
  } catch (error) {
    console.error("Erro ao cadastrar admin:", error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || "Erro ao cadastrar admin",
      error: error.message,
    };
  }
};
