// src/lib/api.js
import axios from "axios";

// Usar variável de ambiente se existir, senão fallback
const API_BASE_URL = import.meta.env.VITE_API_URL;
import.meta.env.PROD
  ? "https://pet-lov.onrender.com/api"
  : "http://localhost:8081/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
