import { useMuscles } from "../context/MusclesContext";
import axios from "axios";
import { useToken } from "../context/TokenContext";
import api from "../config/axiosConfig";

export const useWorkouts = () => {
  const { routines, setRoutines } = useMuscles();
  const { token } = useToken();

  const saveWorkout = async (newRoutine) => {
    const response = await api.post(
      `/api/routine`,
      newRoutine,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("novo treino", response.data);

    setRoutines((prev) => [...prev, response.data]);
  };

  const updateWorkoutName = async (routine, name) => {
    const response = await api.put(
      `/api/routine/name/${routine.id}`,
      { name },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response.data);
    setRoutines((prev) =>
      prev.map((rout) => {
        if (rout.id !== routine.id) return rout;

        return response.data;
      })
    );
  };

  return { saveWorkout, updateWorkoutName };
};
