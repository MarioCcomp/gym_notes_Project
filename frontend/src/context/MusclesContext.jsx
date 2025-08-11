import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const MusclesContext = createContext();

export const useMuscles = () => useContext(MusclesContext);

export const MusclesProvider = ({ children }) => {
  const [muscles, setMuscles] = useState([]);
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const musclesRes = await axios.get("http://localhost:8080/api/muscles");
        const exercisesRes = await axios.get("http://localhost:8080/api/exercises");
        setMuscles(musclesRes.data);
        setExercises(exercisesRes.data);
        console.log(exercisesRes.data);
      } catch (err) {
        console.error("Erro ao buscar músculos ou exercícios:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <MusclesContext.Provider value={{ muscles, exercises }}>
      {children}
    </MusclesContext.Provider>
  );
};
