import axios from "axios";
import { useMuscles } from "../context/MusclesContext";

export const useExercises = () => {
    const { routines, setRoutines, updateRoutine } = useMuscles();
  const addWorkoutExercises = async (newRoutine) => {
    

    
    setRoutines(prev => prev.map(routine => routine.name === newRoutine.name ? {...routine, exercises: [...newRoutine.exercises]} : routine));

    console.log("chegou aq a nova rotina", newRoutine);

    const response = await axios.put(
      `http://localhost:8080/api/routine/${newRoutine.name}`,
      newRoutine
    );
  };

  const deleteWorkoutExercises = async (workout, exerciseBeingEdited) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/${workout.name}/exercises/${exerciseBeingEdited.id}`
      );

      updateRoutine(response.data);
      return response;
    } catch (err) {
      console.log(err.message);
    }
  }

  const updateWorkoutExercises = async (workout, exerciseBeingEdited, newPlannedSets) => {
    try {
      const res = await axios.put(
        `http://localhost:8080/api/${workout.name}/exercises/${exerciseBeingEdited.id}`,
        { plannedSets: Number(newPlannedSets) }
      );

      const updatedRoutine = res.data;

      updateRoutine(updatedRoutine);
      return res;
     
    } catch (err) {
      console.error(err);
      alert("Falha ao salvar alterações");
    }
  }

  return { addWorkoutExercises, deleteWorkoutExercises, updateWorkoutExercises };
};
