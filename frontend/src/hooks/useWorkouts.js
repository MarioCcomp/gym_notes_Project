import { useMuscles } from "../context/MusclesContext";
import axios from "axios";

export const useWorkouts = () => {
  const { routines, setRoutines } = useMuscles();

  const saveWorkout = async (newRoutine) => {
    const response = await axios.post(
      "http://localhost:8080/api/routine",
      newRoutine
    );

    
    console.log("novo treino", response.data);

    setRoutines((prev) => [...prev, newRoutine]);
  };

  return { saveWorkout };
};


