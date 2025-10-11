import axios from "axios";
import { useAuthStore } from "../store/auth";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  const token = typeof useAuthStore.getState === "function"
    ? useAuthStore.getState().token
    : localStorage.getItem('token'); // fallback
  console.log("Axios token (interceptor) =>", !!token);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (!config.headers["Content-Type"] && !(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
}, (error) => Promise.reject(error));

export default api;