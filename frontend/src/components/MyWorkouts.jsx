import "./MyWorkouts.css";
import gymNotes from "../assets/gymnotes.png";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddWorkout from "./AddWorkout";
import { useMuscles } from "../context/MusclesContext";
import { useWorkouts } from "../hooks/useWorkouts";

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
  const [optionsExpanded, setOptionsExpanded] = useState({});
  const [isEditingRoutine, setIsEditingRoutine] = useState(false);
  const [routineBeingEdited, setRoutineBeingEdited] = useState();

  const { updateWorkoutName } = useWorkouts();

  const toggleEditingRoutine = () => {
    setIsEditingRoutine(!isEditingRoutine);
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

  const handleClickOptions = (e, routine) => {
    e.stopPropagation();

    if (optionsExpanded.name === routine.name) {
      setOptionsExpanded({});
      return;
    }

    setOptionsExpanded(routine);
  };

  const handleClose = () => {
    setOptionsExpanded({});
  };

  const handleEditRoutine = (e) => {
    e.preventDefault();
    const name = e.target[0].value;
    updateWorkoutName(routineBeingEdited, name);
    toggleEditingRoutine();
    setRoutineBeingEdited({});
    // setRoutines(prev => prev.map((routine) => {
    //   if(routine.name !== routineBeingEdited.name) return routine;

    //     const newRoutine = {
    //       ...routine,
    //       name: name,
    //     }

    // }))
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
        {isEditingRoutine && (
          <div
            className="overlay"
            onClick={() => {
              toggleEditingRoutine();
              setRoutineBeingEdited(null);
            }}
          >
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <form onSubmit={handleEditRoutine}>
                <label>Digite o novo apelido para o seu treino </label>
                <input type="text" />
                <div className="actions">
                  <button type="submit">Salvar</button>
                  <button
                    onClick={() => {
                      setRoutineBeingEdited(null);
                      toggleEditingRoutine();
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {!isCreatingWorkout && (
        <ul className="buttons">
          {routines &&
            routines.map((routine, index) => (
              <div className="workouts">
                <li
                  key={routine.id}
                  onClick={() => navigate(`/workouts/${routine.name}`)}
                >
                  {routine.name ? routine.name : "Treino " + (index + 1)}
                  <p
                    className="options"
                    onClick={(e) => {
                      handleClickOptions(e, routine);
                      // setSelectedWorkout(routine);
                      // e.stopPropagation();
                      // toggleConfirmDelete();
                    }}
                  >
                    ⋮
                  </p>
                </li>
                {optionsExpanded.name &&
                  optionsExpanded.name == routine.name && (
                    <div className="options-workout">
                      <p onClick={handleClose}>X</p>
                      <button
                        onClick={(e) => {
                          setSelectedWorkout(routine);
                          e.stopPropagation();
                          toggleConfirmDelete();
                        }}
                      >
                        Excluir treino
                      </button>
                      <button
                        onClick={() => {
                          setRoutineBeingEdited(routine);
                          toggleEditingRoutine();
                        }}
                      >
                        Editar treino
                      </button>
                    </div>
                  )}
              </div>
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
