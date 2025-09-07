import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useMuscles } from "./MusclesContext";
import api from "../config/axiosConfig";

const TokenContext = createContext();

export const useToken = () => useContext(TokenContext);

export const TokenProvider = ({ children }) => {
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const login = async (username, password) => {
    const body = {
      username: username,
      password: password,
    };

    try {
      const response = await api.post("http://localhost:8080/auth/login", body);
      if (response.data.token) {
        setToken(response.data.token);
        setUsername(username);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", username);
        return response.data.token;
      }
      return false;
    } catch (error) {
      return error.message;
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
      const response = await api.post(
        "http://localhost:8080/auth/register",
        body
      );
      if (response.status >= 200 && response.status <= 299) {
        return true;
      }
      return false;
    } catch (error) {
      return error.message;
    }
  };

  const logout = () => {
    setToken(null);
    setUsername("");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  };

  return (
    <TokenContext.Provider value={{ username, token, login, register }}>
      {children}
    </TokenContext.Provider>
  );
};
