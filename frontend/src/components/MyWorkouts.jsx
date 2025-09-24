import "./MyWorkouts.css";
import gymNotes from "../assets/gymnotes.png";
import axios from "axios";
import { SlOptions } from "react-icons/sl";
import { IoClose } from "react-icons/io5";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddWorkout from "./AddWorkout";
import { useMuscles } from "../context/MusclesContext";
import { IoReturnUpBack } from "react-icons/io5";
import { useWorkouts } from "../hooks/useWorkouts";
import { useToken } from "../context/TokenContext";
import api from "../config/axiosConfig";

const MyWorkouts = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (isCreatingWorkout) {
      setIsCreatingWorkout(false);
      return;
    }
    navigate("/home");
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
  const [notification, setNotification] = useState(null);
  const { token } = useToken();

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
      const response = api.delete(`/api/${selectedWorkout.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRoutines((prev) =>
        prev.filter((routine) => routine.name !== selectedWorkout.name)
      );
      setSelectedWorkout(null);
      toggleConfirmDelete();
      setNotification({
        type: "success",
        message: "Treino excluído com sucesso!",
      });

      setTimeout(() => {
        setNotification(null);
      }, 3000);
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
    setNotification({
      type: "success",
      message: "Treino editado com sucesso!",
    });

    setTimeout(() => {
      setNotification(null);
    }, 3000);
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
      {notification && (
        <div className={`notification ${notification?.type || ""}`}>
          {notification.message}
        </div>
      )}
      <button className="back" onClick={handleBack}>
        <IoReturnUpBack />
      </button>
      {!isCreatingWorkout && (
        <button
          className="createWorkout"
          onClick={() => setIsCreatingWorkout(true)}
        >
          Criar novo treino
        </button>
      )}
      <div className="header">
        <img src={gymNotes} alt="" />
        {isCreatingWorkout && <p>Crie seu treino abaixo</p>}
        {!isCreatingWorkout && (
          <p>
            {" "}
            {routines.length > 0
              ? "Aqui estão suas rotinas de treinos"
              : "Crie um treino para visualiza-lo"}
          </p>
        )}

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
                <input type="text" required />
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

      <div className="workouts">
        {!isCreatingWorkout &&
          routines &&
          routines.map((routine, index) => (
            <div key={routine.id || index}>
              <ul className="buttons">
                <li onClick={() => navigate(`/workouts/${routine.name}`)}>
                  {routine.name}
                  <p
                    className="options"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClickOptions(e, routine);
                    }}
                  >
                    <SlOptions size={13} />
                  </p>
                </li>
              </ul>

              {optionsExpanded.name &&
                optionsExpanded.name === routine.name && (
                  <div className="overlay" onClick={handleClose}>
                    <div className="lis" onClick={(e) => e.stopPropagation()}>
                      <p onClick={handleClose} className="close-btn">
                        <IoClose size={20} />
                      </p>
                      <ul>
                        <li
                          onClick={() => {
                            setSelectedWorkout(routine);
                            toggleConfirmDelete();
                            handleClose();
                          }}
                        >
                          Excluir treino
                        </li>
                        <li
                          onClick={() => {
                            setRoutineBeingEdited(routine);
                            toggleEditingRoutine();
                            handleClose();
                          }}
                        >
                          Editar treino
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
            </div>
          ))}
      </div>

      {isCreatingWorkout && (
        <AddWorkout setIsAddingWorkout={setIsCreatingWorkout} />
      )}
    </div>
  );
};

export default MyWorkouts;
