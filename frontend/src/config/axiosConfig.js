import axios from "axios";
import { useToken } from "../context/TokenContext";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // seu backend
});

console.log("👉 API Base URL usada:", import.meta.env.VITE_API_URL);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;
