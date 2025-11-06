import axios from "axios";
import { API_URL } from "./config";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Interceptor de requisição: adiciona token
api.interceptors.request.use(
  (config) => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const { token } = JSON.parse(savedUser);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de resposta: logout automático em 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Token expirado ou inválido. Redirecionando para login...");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;