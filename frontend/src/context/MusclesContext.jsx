import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const MusclesContext = createContext();

export const useMuscles = () => useContext(MusclesContext);

export const MusclesProvider = ({ children }) => {
  const [muscles, setMuscles] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [routines, setRoutines] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const musclesRes = await axios.get("http://localhost:8080/api/muscles");
        const exercisesRes = await axios.get(
          "http://localhost:8080/api/exercises"
        );
        const routinesRes = await axios.get(
          "http://localhost:8080/api/routines"
        );
        setMuscles(musclesRes.data);
        setExercises(exercisesRes.data);
        setRoutines(routinesRes.data);
        console.log(exercisesRes.data);
      } catch (err) {
        console.error("Erro ao buscar músculos ou exercícios ou rotinas:", err);
      }
    };

    fetchData();
  }, []);

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
      value={{ muscles, exercises, routines, setRoutines, updateRoutine }}
    >
      {children}
    </MusclesContext.Provider>
  );
};
