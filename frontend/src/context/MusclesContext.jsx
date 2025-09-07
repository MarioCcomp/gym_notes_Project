import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useToken } from "./TokenContext";
import { useNavigate } from "react-router-dom";
import api from "../config/axiosConfig";

const MusclesContext = createContext();

export const useMuscles = () => useContext(MusclesContext);

export const MusclesProvider = ({ children }) => {
  const [muscles, setMuscles] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [routines, setRoutines] = useState([]);

  const navigate = useNavigate();

  const { token } = useToken();

  const fetchData = async (authToken = token) => {
    if (!authToken) return;
    try {
      const musclesRes = await api.get(`/api/muscles`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const exercisesRes = await api.get(`/api/exercises`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const routinesRes = await api.get(`/api/routines`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      setMuscles(musclesRes.data);
      setExercises(exercisesRes.data);
      setRoutines(routinesRes.data);
      console.log(exercisesRes.data);
    } catch (err) {
      console.error("Erro ao buscar músculos ou exercícios ou rotinas:", err);
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    } else {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        fetchData(savedToken);
      } else {
        navigate("/");
      }
    }
  }, [token]);

  const updateRoutine = (updatedRoutine) => {
    setRoutines((prev) =>
      prev.map((r) => (r.name === updatedRoutine.name ? updatedRoutine : r))
    );
  };

  const addRoutine = (newRoutine) => {
    setRoutines((prev) => [...prev, newRoutine]);
  };

  const removeRoutine = (name) => {
    setRoutines((prev) => prev.filter((r) => r.name !== name));
  };

  return (
    <MusclesContext.Provider
      value={{
        muscles,
        exercises,
        routines,
        setRoutines,
        updateRoutine,
        fetchData,
      }}
    >
      {children}
    </MusclesContext.Provider>
  );
};
