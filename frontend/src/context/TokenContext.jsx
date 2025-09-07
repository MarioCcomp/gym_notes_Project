import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useMuscles } from "./MusclesContext";
import api from "../config/axiosConfig";
import { useNavigate } from "react-router-dom";

const TokenContext = createContext();

export const useToken = () => useContext(TokenContext);

export const TokenProvider = ({ children }) => {
  const [nickname, setNickname] = useState("Usuário");
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);
  const { navigate } = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setNickname(null);
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNickname(response.data.nickname);
      } catch (err) {
        console.error("Erro ao buscar usuário:", err);
        setToken(null);
        localStorage.removeItem("token");
        setNickname(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (username, password) => {
    const body = {
      username: username,
      password: password,
    };

    try {
      const response = await api.post(`/auth/login`, body);
      setNickname(response.data.nickname);
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);

      return {
        type: response.data.type,
        message: response.data.message,
        token: response.data.token,
      };
    } catch (error) {
      return {
        type: error.response?.data?.type,
        message: error.response?.data?.message,
      };
    }
  };

  const register = async (username, nickname, email, password) => {
    const body = {
      username: username,
      nickname: nickname,
      email: email,
      password: password,
    };

    try {
      const response = await api.post(`/auth/register`, body);

      return {
        type: response.data.type,
        message: response.data.message,
      };
    } catch (error) {
      return {
        type: error.response?.data?.type,
        message: error.response?.data?.message,
      };
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <TokenContext.Provider value={{ logout, nickname, token, login, register, loading }}>
      {children}
    </TokenContext.Provider>
  );
};
