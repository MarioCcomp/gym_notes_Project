import "./MyWorkouts.css";
import gymNotes from "../assets/gymnotes.png";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddWorkout from "./AddWorkout";
import { useMuscles } from "../context/MusclesContext";

const MyWorkouts = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (isCreatingWorkout) {
      setIsCreatingWorkout(false);
      return;
    }
    navigate("/");
  };

  const { exercises, routines, setRoutines } = useMuscles();

  const [isCreatingWorkout, setIsCreatingWorkout] = useState(false);

  // --------------

  const [newRoutineName, setNewRoutineName] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("");
  const [selectedExercise, setSelectedExercise] = useState("");
  const [plannedSets, setPlannedSets] = useState("");
  const [addedExercises, setAddedExercises] = useState([]);

  const handleAddExercise = () => {
    if (!selectedExercise || !plannedSets) return;

    const exercise = exercises.find((ex) => ex.name === selectedExercise);

    if (!exercise) return;

    setAddedExercises([
      ...addedExercises,
      {
        name: exercise.name,
        targetMuscle: selectedMuscle,
        plannedSets: Number(plannedSets),
      },
    ]);

    // Reset campos
    setSelectedExercise("");
    setPlannedSets("");
  };

  const handleSaveWorkout = () => {
    if (!newRoutineName) return;

    const newRoutine = {
      id: Date.now(),
      name: newRoutineName,
      exercises: addedExercises,
    };

    setRoutines([...routines, newRoutine]);

    // Resetar estados
    setNewRoutineName("");
    setSelectedMuscle("");
    setSelectedExercise("");
    setPlannedSets("");
    setAddedExercises([]);
    setIsCreatingWorkout(false);
  };

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState({});

  //  -----------------

  const toggleConfirmDelete = () => {
    setConfirmDelete(!confirmDelete);
  };

  const confirmDeleteWorkout = () => {
    try {
      const response = axios.delete(
        `http://localhost:8080/api/${selectedWorkout.name}`
      );
      setRoutines((prev) =>
        prev.filter((routine) => routine.name !== selectedWorkout.name)
      );
      setSelectedWorkout(null);
      toggleConfirmDelete();
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="main mainWorkouts">
      <div className="back" onClick={handleBack}>
        Voltar
      </div>
      {!isCreatingWorkout && (
        <div
          className="createWorkout"
          onClick={() => setIsCreatingWorkout(true)}
        >
          Criar novo treino
        </div>
      )}
      <div className="header">
        <img src={gymNotes} alt="" />
        <p>
          {isCreatingWorkout
            ? "Crie seu treino abaixo"
            : "Aqui estão suas rotinas de treinos"}
        </p>
        {confirmDelete && (
          <div className="overlay" onClick={toggleConfirmDelete}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <p>
                Tem certeza que deseja excluir esse treino? Todo progresso será
                excluido
              </p>
              <div className="actions">
                <button
                  onClick={() => {
                    confirmDeleteWorkout();
                  }}
                >
                  Sim, desejo excluir
                </button>
                <button
                  onClick={() => {
                    toggleConfirmDelete();
                    setSelectedWorkout(null);
                  }}
                >
                  Não
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {!isCreatingWorkout && (
        <ul className="buttons">
          {routines &&
            routines.map((routine, index) => (
              <li
                key={routine.id}
                onClick={() => navigate(`/workouts/${routine.name}`)}
              >
                {routine.name ? routine.name : "Treino " + (index + 1)}
                <p
                  className="options"
                  onClick={(e) => {
                    setSelectedWorkout(routine);
                    e.stopPropagation();
                    toggleConfirmDelete();
                  }}
                >
                  🗑️
                </p>
              </li>
            ))}
        </ul>
      )}

      {isCreatingWorkout && (
        <AddWorkout setIsAddingWorkout={setIsCreatingWorkout} />
      )}
    </div>
  );
};

export default MyWorkouts;
