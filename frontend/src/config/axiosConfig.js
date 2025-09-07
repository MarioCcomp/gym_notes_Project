import axios from "axios";
import { useToken } from "../context/TokenContext";

const api = axios.create({
  baseURL: "http://localhost:8080", // seu backend
});

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
