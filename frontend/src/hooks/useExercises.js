import axios from "axios";
import { useMuscles } from "../context/MusclesContext";
import { useToken } from "../context/TokenContext";
import api from "../config/axiosConfig";


export const useExercises = () => {
  const { routines, setRoutines, updateRoutine } = useMuscles();
  const addWorkoutExercises = async (newRoutine) => {
    setRoutines((prev) =>
      prev.map((routine) =>
        routine.name === newRoutine.name
          ? { ...routine, exercises: [...newRoutine.exercises] }
          : routine
      )
    );

    console.log("chegou aq a nova rotina", newRoutine);
    const { token } = useToken();

    const response = await api.put(
      `http://localhost:8080/api/routine/${newRoutine.name}`,
      newRoutine,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  const deleteWorkoutExercises = async (workout, exerciseBeingEdited) => {
    try {
      const response = await api.delete(
        `http://localhost:8080/api/${workout.name}/exercises/${exerciseBeingEdited.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      updateRoutine(response.data);
      return response;
    } catch (err) {
      console.log(err.message);
    }
  };

  const updateWorkoutExercises = async (
    workout,
    exerciseBeingEdited,
    newPlannedSets
  ) => {
    try {
      const res = await api.put(
        `http://localhost:8080/api/${workout.name}/exercises/${exerciseBeingEdited.id}`,
        { plannedSets: Number(newPlannedSets) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedRoutine = res.data;

      updateRoutine(updatedRoutine);
      return res;
    } catch (err) {
      console.error(err);
      alert("Falha ao salvar alterações");
    }
  };

  return {
    addWorkoutExercises,
    deleteWorkoutExercises,
    updateWorkoutExercises,
  };
};
