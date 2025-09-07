import axios from "axios";
import { useMuscles } from "../context/MusclesContext";
import { useToken } from "../context/TokenContext";
import api from "../config/axiosConfig";

export const useExercises = () => {
  const { routines, setRoutines, updateRoutine } = useMuscles();
  const { token } = useToken();

  const addWorkoutExercises = async (newRoutine) => {
    setRoutines((prev) =>
      prev.map((routine) =>
        routine.name === newRoutine.name
          ? { ...routine, exercises: [...newRoutine.exercises] }
          : routine
      )
    );

    console.log("chegou aq a nova rotina", newRoutine);

    const response = await api.put(
      `/api/routine/${newRoutine.id}`,
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
        `/api/${workout.id}/exercises/${exerciseBeingEdited.id}`,
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
        `/api/${workout.id}/exercises/${exerciseBeingEdited.id}`,
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
      console.error(err.message);
      alert("Falha ao salvar alterações");
    }
  };

  return {
    addWorkoutExercises,
    deleteWorkoutExercises,
    updateWorkoutExercises,
  };
};
