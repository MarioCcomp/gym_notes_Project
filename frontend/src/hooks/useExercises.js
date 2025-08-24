import axios from "axios";
import { useMuscles } from "../context/MusclesContext";

export const useExercises = () => {
    const { routines, setRoutines } = useMuscles();
  const addWorkoutExercises = async (newRoutine) => {
    

    
    setRoutines(prev => prev.map(routine => routine.name === newRoutine.name ? {...routine, exercises: [...newRoutine.exercises]} : routine));

    console.log("chegou aq a nova rotina", newRoutine);

    const response = await axios.put(
      `http://localhost:8080/api/routine/${newRoutine.name}`,
      newRoutine
    );
  };

  return { addWorkoutExercises };
};
