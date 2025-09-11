import { useNavigate, useParams } from "react-router-dom";
import "./Workout.css";
import axios from "axios";
import gymNotes from "../../assets/gymnotes.png";
import { MdTimeline } from "react-icons/md";
import { useState, useEffect } from "react";
import { FaLongArrowAltDown } from "react-icons/fa";
import { FaLongArrowAltRight } from "react-icons/fa";
import { useMuscles } from "../../context/MusclesContext";
import AddExercises from "./AddExercises";
import { useExercises } from "../../hooks/useExercises";
import { IoReturnUpBack } from "react-icons/io5";
import { SlOptions } from "react-icons/sl";
import { capitalizeWords } from "../../utils/utils";
import ConfirmEdit from "../notifications/ConfirmEdit";
import ConfirmDeleteExercise from "../notifications/ConfirmDeleteExercise";
import ConfirmSaveIncompleteWorkout from "../notifications/ConfirmSaveIncompleteWorkout";
import ConfirmCancelWorkout from "../notifications/ConfirmCancelWorkout";

import ExpandedSet from "../workoutComponents/ExpandedSet";
import InfoBox from "../workoutComponents/InfoBox";
import OptionsExpanded from "../workoutComponents/OptionsExpanded";
import ExerciseGraphic from "../graphic/ExerciseGraphic";

import Graphic from "./Graphic";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../../config/axiosConfig";
import { useToken } from "../../context/TokenContext";

const Workout = ({}) => {
  // ------------------------------------------------------

  const { routines, updateRoutine } = useMuscles();
  const { token } = useToken();

  const exercisesPerPage = 5;

  const [isWorkoutRunning, setIsWorkoutRunning] = useState(false);

  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [plannedSets, setPlannedSets] = useState("");
  const [editingSets, setEditingSets] = useState({});
  const [notification, setNotification] = useState(null);
  const [optionsExpanded, setOptionsExpanded] = useState({});
  const [isGraphicVisible, setIsGraphicVisible] = useState(false);

  const { workoutName } = useParams();

  const navigate = useNavigate();

  const [workout, setWorkout] = useState(
    routines.find((routine) => routine.name === workoutName)
  );
  const [exercises, setExercises] = useState([]);

  const {
    addWorkoutExercises,
    deleteWorkoutExercises,
    updateWorkoutExercises,
  } = useExercises();

  useEffect(() => {
    if (workout) {
      setExercises([...workout.exercises]);
    }
  }, [workout]);

  useEffect(() => {
    setWorkout(routines.find((routine) => routine.name === workoutName));
  }, [routines]);

  const [expandedExercises, setExpandedExercises] = useState({});
  const [infoBox, setInfoBox] = useState({
    open: false,
    exerciseId: null,
    setIndex: null,
  });

  const toggleExercise = (exerciseName) => {
    setExpandedExercises((prev) => ({
      ...prev,
      [exerciseName]: !prev[exerciseName],
    }));
  };

  const handleInfoBtn = (index, exercise) => {
    setInfoBox({
      open: true,
      exerciseId: exercise.exercise.id,
      setIndex: index,
    });
  };

  const closeInfoBox = () => {
    setInfoBox({ open: false, exerciseId: null, setIndex: null });
  };

  const getLastSet = () => {
    if (!infoBox.exerciseId) return null;

    const exercise = exercises.find(
      (ex) => ex.exercise.id === infoBox.exerciseId
    );
    if (!exercise || exercise.sessions.length === 0) return null;

    const minus = isWorkoutRunning ? 1 : 0;
    const last =
      exercise.sessions.length > 1
        ? exercise.sessions[exercise.sessions.length - 1 - minus]
        : exercise.sessions[exercise.sessions.length - 1];
    return last.sets[infoBox.setIndex];
  };

  const handleStart = () => {
    setIsWorkoutRunning(true);
    setExercises((prev) =>
      prev.map((ex) => {
        const today = new Date().toISOString().split("T")[0];
        const newSession = {
          date: today,
          sets: Array.from({ length: Number(ex.plannedSets) }, () => ({
            weight: "",
            reps: "",
            rir: "",
            notes: "",
          })),
        };

        const newExercise = {
          ...ex,
          sessions: [...ex.sessions, newSession],
        };

        return newExercise;
      })
    );
  };

  const [confirmSaveModal, setConfirmSaveModal] = useState(null);

  const handleFinish = () => {
    let exercisesNotCompleted = [];

    exercises.forEach((ex) => {
      const lastSession = ex.sessions[ex.sessions.length - 1];
      const incompleteSet = lastSession.sets.find(
        (set) => set.weight === "" || set.reps === ""
      );

      if (incompleteSet) {
        exercisesNotCompleted.push(ex.exercise.name);
      }
    });

    if (exercisesNotCompleted.length > 0) {
      setConfirmSaveModal(exercisesNotCompleted);
      return;
    }

    saveWorkout();
    setEditingSets({});
  };

  const saveWorkout = () => {
    setIsWorkoutRunning(false);
    const updatedRoutine = {
      ...workout,
      exercises: exercises,
    };

    addWorkoutExercises(updatedRoutine);
    setNotification({
      type: "success",
      message: "✅ Treino salvo com sucesso!",
    });

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleSaveSet = (e, index, exercise) => {
    e.preventDefault();

    const today = new Date().toISOString().split("T")[0];
    const formData = new FormData(e.target);

    const newSet = {
      weight: formData.get("weight"),
      reps: formData.get("reps"),
      rir: formData.get("rir"),
      notes: formData.get("notes"),
    };

    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.exercise.id !== exercise.exercise.id) return ex;

        const newSessions = ex.sessions.map((session, i) => {
          if (i + 1 !== ex.sessions.length) return session;

          const updatedSets = session.sets.map((set, i) =>
            i === index ? newSet : set
          );

          return {
            ...session,
            sets: updatedSets,
          };
        });

        const updatedExercise = {
          ...ex,
          sessions: newSessions,
        };

        console.log("exercicio atualizado", updatedExercise);

        return updatedExercise;
      })
    );

    const key = getSetKey(exercise.exercise.id, index);
    setEditingSets((prev) => ({ ...prev, [key]: false }));
    setNotification({
      type: "success",
      message: "✅ Série salva com sucesso!",
    });

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const getSetKey = (exerciseId, setIndex) => `${exerciseId}-${setIndex}`;

  const handleEditSet = (index, exercise) => {
    const key = getSetKey(exercise.exercise.id, index);
    setEditingSets((prev) => ({ ...prev, [key]: true }));
  };

  const [confirmCancel, setConfirmCancel] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isEditingExercise, setIsEditingExercise] = useState(false);
  const [exerciseBeingEdited, setExerciseBeingEdited] = useState();

  const toggleEditingExercise = () => {
    setIsEditingExercise(!isEditingExercise);
  };

  const toggleConfirmDelete = () => {
    setConfirmDelete(!confirmDelete);
  };

  const handleCancelClick = () => {
    setConfirmCancel(true);
  };

  const confirmCancelWorkout = () => {
    setIsWorkoutRunning(false);
    setInfoBox({ open: false, exerciseId: null, setIndex: null });
    setConfirmCancel(false);
    setExercises([...workout.exercises]);
  };

  const closeCancelModal = () => {
    setConfirmCancel(false);
  };

  const confirmDeleteExercise = async () => {
    const response = deleteWorkoutExercises(workout, exerciseBeingEdited);

    setWorkout(response.data);

    toggleConfirmDelete();
    setOptionsExpanded((prev) => ({
      ...prev,
      [exerciseBeingEdited.index]: false,
    }));
    setNotification({
      type: "success",
      message: "✅ Exercicio excluído com sucesso!",
    });

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };
  useEffect(() => {
    setExpandedExercises({});
  }, [isWorkoutRunning, isAddingExercise]);

  const handleExpandOptions = (index) => {
    setOptionsExpanded((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleEditExercise = async (e) => {
    e.preventDefault();

    const newPlannedSets = e.target[0].value;
    if (!exerciseBeingEdited) return;

    const res = updateWorkoutExercises(
      workout,
      exerciseBeingEdited,
      newPlannedSets
    );

    const updatedRoutine = res.data;
    setWorkout(updatedRoutine);
    setExerciseBeingEdited(null);
    toggleEditingExercise();
    setOptionsExpanded((prev) => ({
      ...prev,
      [exerciseBeingEdited.index]: false,
    }));

    setNotification({
      type: "success",
      message: "✅ Exercício editado com sucesso!",
    });

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const [graphicData, setGraphicData] = useState(null);

  const handleGraphic = async (exercise, e) => {
    // dps jogo isso pra um arquivo so com requisicao
    e.preventDefault();

    try {
      const response = await api.get(
        `http://${import.meta.env.VITE_API_URL}:8080/api/${
          workout.id
        }/exercises/${exercise.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setGraphicData(response.data);
      console.log(response.data);
      setIsGraphicVisible(true);
    } catch (err) {
      console.error("Erro ao buscar gráfico:", err);
    }

    // setIsGraphicVisible(true);
  };

  return (
    <div className="main main-workout">
      {/* <Graphic /> */}

      <div className="top">
        <button
          className="back"
          onClick={() => {
            if (isAddingExercise) setIsAddingExercise(false);
            else navigate("/workouts");
          }}
        >
          <IoReturnUpBack />
        </button>

        {!isAddingExercise && (
          <button
            className="addExerciseBtn"
            onClick={() => setIsAddingExercise(true)}
          >
            Adicionar exercício
          </button>
        )}

        <div className="header">
          <img className="img-workout" src={gymNotes} alt="" />
          {!isAddingExercise ? (
            <h2>
              {workout ? (
                <>
                  <span>{capitalizeWords(workout.name)}</span>
                </>
              ) : (
                "Carregando treino..."
              )}
            </h2>
          ) : (
            <h3 className="addExerciseTitle">Adicione exercicios abaixo</h3>
          )}
          {!isAddingExercise &&
            (exercises.length > 0 ? (
              isWorkoutRunning ? (
                <button className="cancelBtn" onClick={handleCancelClick}>
                  Cancelar
                </button>
              ) : (
                <button className="startBtn" onClick={handleStart}>
                  Iniciar Treino
                </button>
              )
            ) : (
              <p>Adicione exercícios para poder iniciar seu treino</p>
            ))}

          {/* notificacoes */}

          {/* confirm cancel workout */}

          <ConfirmCancelWorkout
            confirmCancel={confirmCancel}
            closeCancelModal={closeCancelModal}
            confirmCancelWorkout={confirmCancelWorkout}
          />

          {/* confirm save incomplete */}

          <ConfirmSaveIncompleteWorkout
            confirmSaveModal={confirmSaveModal}
            setConfirmSaveModal={setConfirmSaveModal}
            saveWorkout={saveWorkout}
          />

          {/* confirmDelete */}

          <ConfirmDeleteExercise
            toggleConfirmDelete={toggleConfirmDelete}
            confirmDelete={confirmDelete}
            confirmDeleteExercise={confirmDeleteExercise}
          />

          {/* confirmEdit */}
          <ConfirmEdit
            setExerciseBeingEdited={setExerciseBeingEdited}
            toggleEditingExercise={toggleEditingExercise}
            exerciseBeingEdited={exerciseBeingEdited}
            isEditingExercise={isEditingExercise}
            handleEditExercise={handleEditExercise}
          />

          {isGraphicVisible && (
            <ExerciseGraphic
              isOpen={isGraphicVisible}
              onClose={() => setIsGraphicVisible(false)}
              exercise={graphicData}
            />
          )}
        </div>
      </div>
      <div className="body">
        {notification && (
          <div className={`notification ${notification?.type || ""}`}>
            {notification.message}
          </div>
        )}

        {/* --------------- */}

        {!isAddingExercise && (
          <div className="exercises">
            {/* Mostrando exercicios */}
            {exercises.map((exercise, ind) => {
              const isExpanded =
                expandedExercises[exercise.exercise.name] || false;

              return (
                <div className="outExercise">
                  <div
                    className={`exercise ${isExpanded ? "expanded" : ""}`}
                    key={exercise.exercise.id}
                  >
                    <p
                      type="button"
                      className="graphicBtn"
                      onClick={(e) => handleGraphic(exercise.exercise, e)}
                    >
                      <MdTimeline />
                    </p>

                    <p
                      className="options especific"
                      onClick={() => handleExpandOptions(ind)}
                    >
                      <SlOptions size={13} />
                    </p>
                    <iframe
                      width="560"
                      height="315"
                      src="https://www.youtube.com/embed/_FkbD0FhgVE"
                      title="Exemplo de exercício"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-2xl shadow-lg"
                    />
                    <h3>{exercise.exercise.name}</h3>

                    <p>
                      Séries: {exercise.plannedSets}{" "}
                      <span
                        onClick={() => toggleExercise(exercise.exercise.name)}
                      >
                        {isExpanded ? (
                          <FaLongArrowAltDown />
                        ) : (
                          <FaLongArrowAltRight />
                        )}
                      </span>
                    </p>
                    <div className="sets">
                      {/* series expandidas com forms */}
                      <ExpandedSet
                        isExpanded={isExpanded}
                        exercise={exercise}
                        editingSets={editingSets}
                        handleInfoBtn={handleInfoBtn}
                        handleEditSet={handleEditSet}
                        handleSaveSet={handleSaveSet}
                        isWorkoutRunning={isWorkoutRunning}
                        getSetKey={getSetKey}
                      />
                    </div>
                  </div>

                  {/* opçao de excluir/editar exercicio */}

                  <OptionsExpanded
                    optionsExpanded={optionsExpanded}
                    ind={ind}
                    handleExpandOptions={handleExpandOptions}
                    setExerciseBeingEdited={setExerciseBeingEdited}
                    toggleEditingExercise={toggleEditingExercise}
                    toggleConfirmDelete={toggleConfirmDelete}
                    exercise={exercise}
                  />
                </div>
              );
            })}

            {isWorkoutRunning && (
              <button className="endBtn" onClick={handleFinish}>
                Finalizar Treino
              </button>
            )}
          </div>
        )}

        {/* Adicionando exercicios */}

        {!isWorkoutRunning && (
          <div className="add-exercise-section">
            {isAddingExercise && (
              <AddExercises
                routine={workout}
                setIsAddingExercise={setIsAddingExercise}
              />
            )}
          </div>
        )}

        {/* abaixo é o componente que gerencia a caixa de informações de cada série */}

        <InfoBox
          infoBox={infoBox}
          closeInfoBox={closeInfoBox}
          exercises={exercises}
          getLastSet={getLastSet}
        />
      </div>
    </div>
  );
};

export default Workout;
