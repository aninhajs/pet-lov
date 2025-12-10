// src/lib/api.js
import axios from "axios";

// Configurar URL da API baseada no ambiente
const API_BASE_URL = import.meta.env.PROD 
  ? "https://pet-lov-api.onrender.com/api"  // URL do backend no Render (você vai atualizar depois)
  : "http://localhost:8081/api";  // URL local

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
