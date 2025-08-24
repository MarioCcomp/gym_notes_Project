import "./MyWorkouts.css";
import gymNotes from "../assets/gymnotes.png";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddWorkout from "./AddWorkout";
import { useMuscles } from "../context/MusclesContext";

const MyWorkouts = () => {
  const navigate = useNavigate();

  // Estrutura q vem do banco eh assim

  const [routiness, setRoutines] = useState([
    {
      id: "68a9172219a9ae8c2604b7e0",
      exercises: [
        {
          exercise: {
            id: "68a910a0e86ef2168078cac3",
            name: "Rosca direta",
            targetMuscle: {
              id: "68a90a4d34d6a3f84d91f6ff",
              name: "biceps",
            },
          },
          plannedSets: 4,
          sessions: [],
        },
        {
          exercise: {
            id: "68a910a0e86ef2168078cac4",
            name: "Rosca martelo",
            targetMuscle: {
              id: "68a90a4d34d6a3f84d91f6ff",
              name: "biceps",
            },
          },
          plannedSets: 4,
          sessions: [],
        },
      ],
    },
  ]);

  const handleBack = () => {
    if (isCreatingWorkout) {
      setIsCreatingWorkout(false);
      return;
    }
    navigate("/");
  };

  const { exercises, routines } = useMuscles();

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

  //  -----------------

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
              </li>
            ))}
        </ul>
      )}

      {isCreatingWorkout && <AddWorkout />}
    </div>
  );
};

export default MyWorkouts;
