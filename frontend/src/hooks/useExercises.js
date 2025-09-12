import axios from "axios";
import { useMuscles } from "../context/MusclesContext";
import { useToken } from "../context/TokenContext";
import api from "../config/axiosConfig";

export const useExercises = () => {
  const { routines, setRoutines, updateRoutine } = useMuscles();
  const { token } = useToken();

  const addWorkoutExercises = async (newRoutine) => {
    const response = await api.put(
      `/api/routine/${newRoutine.id}`,
      newRoutine,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setRoutines((prev) =>
      prev.map((routine) =>
        routine.name === newRoutine.name
          ? { ...routine, exercises: [...newRoutine.exercises] }
          : routine
      )
    );

    return response;
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
  };

  return {
    addWorkoutExercises,
    deleteWorkoutExercises,
    updateWorkoutExercises,
  };
};
