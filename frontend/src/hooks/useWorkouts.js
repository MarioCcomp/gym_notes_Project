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

  const updateWorkoutName = async (routine, name) => {
    const response = await axios.put(`http://localhost:8080/api/routine/name/${routine.id}`,
      {name}
    );

    console.log(response.data);
    setRoutines(prev => prev.map((rout) => {
      if(rout.id !== routine.id) return rout;

      return response.data;
    }))
  }

  return { saveWorkout, updateWorkoutName };
};


