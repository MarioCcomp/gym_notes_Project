import { useNavigate, useParams } from "react-router-dom";
import "./Workout.css";
import axios from "axios";
import gymNotes from "../assets/gymnotes.png";
import { useState, useEffect } from "react";
import { useMuscles } from "../context/MusclesContext";
import AddExercises from "./AddExercises";
import { useExercises } from "../hooks/useExercises";
import { capitalizeWords } from "../utils/utils";
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

const Workout = ({}) => {
  // ------------------------------------------------------

  const { routines, updateRoutine } = useMuscles();


  const exercisesPerPage = 5;

  const [isWorkoutRunning, setIsWorkoutRunning] = useState(false);

  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [plannedSets, setPlannedSets] = useState("");
  const [editingSets, setEditingSets] = useState({});
  const [notification, setNotification] = useState(null);
  const [optionsExpanded, setOptionsExpanded] = useState({});

  const { workoutName } = useParams();

  const navigate = useNavigate();

  const [workout, setWorkout] = useState(
    routines.find((routine) => routine.name === workoutName)
  );
  const [exercises, setExercises] = useState([]);

  const { addWorkoutExercises } = useExercises();

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

  const repeat = (n, fn) => Array.from({ length: n }, (_, i) => fn(i));

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
    // aqui eu tenho q verificar se o indice infobox.setindex existia no ultimo treino, pq ele pode ter adicionado um agora
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
    setNotification("✅ Treino salvo com sucesso!");

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
    setNotification("✅ Série salva com sucesso!");

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

  useEffect(() => {
    setExpandedExercises({});
  }, [isWorkoutRunning, isAddingExercise]);

  const handleExpandOptions = (index) => {
    setOptionsExpanded((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const confirmDeleteExercise = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/${workout.name}/exercises/${exerciseBeingEdited.id}`
      );

      setWorkout(response.data);
      updateRoutine(response.data);

      toggleConfirmDelete();
      setOptionsExpanded((prev) => ({
        ...prev,
        [exerciseBeingEdited.index]: false,
      }));
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleEditExercise = async (e) => {
    e.preventDefault();

    const newPlannedSets = e.target[0].value;
    if (!exerciseBeingEdited) return;

    try {
      const res = await axios.put(
        `http://localhost:8080/api/${workout.name}/exercises/${exerciseBeingEdited.id}`,
        { plannedSets: Number(newPlannedSets) }
      );

      const updatedRoutine = res.data;

      setWorkout(updatedRoutine);
      updateRoutine(updatedRoutine);

      setExerciseBeingEdited(null);
      toggleEditingExercise();
      setOptionsExpanded((prev) => ({
        ...prev,
        [exerciseBeingEdited.index]: false,
      }));
    } catch (err) {
      console.error(err);
      alert("Falha ao salvar alterações");
    }
  };

  return (
    <div className="main">
      {/* <p>TESTEEEEEEEEEEEE</p> */}
      {/* <Graphic /> */}
      <div
        className="back"
        onClick={() => {
          if (isAddingExercise) setIsAddingExercise(false);
          else navigate("/workouts");
        }}
      >
        Voltar
      </div>

      <div className="header">
        <img src={gymNotes} alt="" />
        <h2>
          {workout ? capitalizeWords(workout.name) : "Carregando treino..."}
        </h2>
        {!isAddingExercise &&
          (exercises.length > 0 ? (
            isWorkoutRunning ? (
              <button onClick={handleCancelClick}>Cancelar</button>
            ) : (
              <button className="startBtn" onClick={handleStart}>
                Iniciar Treino
              </button>
            )
          ) : (
            <p>Adicione exercícios para poder iniciar seu treino</p>
          ))}
        {confirmCancel && (
          <div className="overlay" onClick={closeCancelModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <p>Tem certeza que deseja cancelar o treino? Nada será salvo.</p>
              <div className="actions">
                <button onClick={confirmCancelWorkout}>Sim, cancelar</button>
                <button onClick={closeCancelModal}>Não</button>
              </div>
            </div>
          </div>
        )}
        {confirmSaveModal && (
          <div className="overlay" onClick={() => setConfirmSaveModal(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <p className="modal-title">⚠️ Exercícios incompletos</p>
              <p className="modal-text">
                Os seguintes exercícios não foram preenchidos completamente:
              </p>
              <ul className="modal-list">
                {confirmSaveModal.map((ex, idx) => (
                  <li key={idx}>- {ex}</li>
                ))}
              </ul>
              <p className="modal-text">Deseja salvar o treino mesmo assim?</p>
              <div className="actions">
                <button onClick={() => setConfirmSaveModal(null)}>
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    saveWorkout();
                    setConfirmSaveModal(null);
                  }}
                >
                  Salvar mesmo assim
                </button>
              </div>
            </div>
          </div>
        )}
        {confirmDelete && (
          <div className="overlay" onClick={toggleConfirmDelete}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <p>
                Tem certeza que deseja excluir esse exercicio? Todo progresso
                deste exercicio será excluido
              </p>
              <div className="actions">
                <button
                  onClick={() => {
                    confirmDeleteExercise();
                  }}
                >
                  Sim, desejo excluir
                </button>
                <button onClick={toggleConfirmDelete}>Não</button>
              </div>
            </div>
          </div>
        )}
        {isEditingExercise && (
          <div
            className="overlay"
            onClick={() => {
              toggleEditingExercise();
              setExerciseBeingEdited(null);
            }}
          >
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <form onSubmit={handleEditExercise}>
                <label>
                  Digite a nova quantidade séries para o exercicio{" "}
                  {exerciseBeingEdited ? exerciseBeingEdited.name : ""}
                </label>
                <input type="number" />
                <div className="actions">
                  <button type="submit">Salvar</button>
                  <button
                    onClick={() => {
                      setExerciseBeingEdited(null);
                      toggleEditingExercise();
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

      {notification && <div className="notification">{notification}</div>}

      {!isAddingExercise && (
        <div className="exercises">
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
                    className="options"
                    onClick={() => handleExpandOptions(ind)}
                  >
                    ...
                  </p>
                  <h3>{exercise.exercise.name}</h3>
                  <p>
                    Séries: {exercise.plannedSets}{" "}
                    <span
                      onClick={() => toggleExercise(exercise.exercise.name)}
                    >
                      {isExpanded ? "↓" : "→"}
                    </span>
                  </p>
                  <div className="sets">
                    {isExpanded &&
                      exercise.plannedSets &&
                      repeat(exercise.plannedSets, (index) => {
                        const key = getSetKey(exercise.exercise.id, index);
                        const isEditing = editingSets[key] ?? true;

                        return (
                          <div className="set info" key={index}>
                            <div
                              className="infoBtn"
                              onClick={() => handleInfoBtn(index, exercise)}
                            >
                              🛈
                            </div>
                            <p>Série {index + 1}</p>
                            <form
                              key={isWorkoutRunning}
                              onSubmit={(e) =>
                                handleSaveSet(e, index, exercise)
                              }
                            >
                              <div className="above-set">
                                <input
                                  type="text"
                                  placeholder="peso"
                                  name="weight"
                                  disabled={!isEditing || !isWorkoutRunning}
                                />
                                <input
                                  type="text"
                                  placeholder="repetições"
                                  name="reps"
                                  disabled={!isEditing || !isWorkoutRunning}
                                />
                              </div>

                              <div className="down-set">
                                <input
                                  type="text"
                                  placeholder="rir (opcional)"
                                  name="rir"
                                  disabled={!isEditing || !isWorkoutRunning}
                                />
                                <input
                                  type="text"
                                  placeholder="observações (opcional)"
                                  name="notes"
                                  disabled={!isEditing || !isWorkoutRunning}
                                />
                              </div>
                              {isWorkoutRunning &&
                                (isEditing ? (
                                  <input type="submit" value="Adicionar" />
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleEditSet(index, exercise)
                                    }
                                    className="editBtn"
                                  >
                                    Editar
                                  </button>
                                ))}
                            </form>
                          </div>
                        );
                      })}
                  </div>
                </div>
                {optionsExpanded[ind] && (
                  <div className="lis">
                    <p onClick={() => handleExpandOptions(ind)}>X</p>
                    <ul>
                      <li
                        onClick={(e) => {
                          setExerciseBeingEdited({
                            ...exercise.exercise,
                            index: ind,
                          });
                          toggleEditingExercise();
                        }}
                      >
                        Editar exercicio
                      </li>
                      <li
                        onClick={() => {
                          toggleConfirmDelete();
                          setExerciseBeingEdited({
                            ...exercise.exercise,
                            index: ind,
                          });
                        }}
                      >
                        Excluir exercicio
                      </li>
                    </ul>
                  </div>
                )}
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
          {!isAddingExercise && (
            <button
              className="addExerciseBtn"
              onClick={() => setIsAddingExercise(true)}
            >
              Adicionar exercício
            </button>
          )}

          {isAddingExercise && (
            <AddExercises
              routine={workout}
              setIsAddingExercise={setIsAddingExercise}
            />
          )}
        </div>
      )}

      {infoBox.open && (
        <div className="info-overlay" onClick={closeInfoBox}>
          <div className="info-box" onClick={(e) => e.stopPropagation()}>
            {(() => {
              const exercise = exercises.find(
                (ex) => ex.exercise.id === infoBox.exerciseId
              );

              if (!exercise) return <p>Exercício não encontrado.</p>;

              const lastSession =
                exercise.sessions.length > 0
                  ? exercise.sessions[exercise.sessions.length - 1]
                  : null;

              return (
                <>
                  <h3>
                    Último treino {lastSession && "- " + lastSession.date} -{" "}
                    {exercise.exercise.name} - Série {infoBox.setIndex + 1}
                  </h3>

                  {getLastSet() ? (
                    <div>
                      <p>Peso: {getLastSet().weight}</p>
                      <p>Repetições: {getLastSet().reps}</p>
                      <p>RIR: {getLastSet().rir}</p>
                      <p>
                        Anotações:{" "}
                        {getLastSet().notes.trim() === ""
                          ? "Nenhuma observação."
                          : getLastSet().notes}
                      </p>
                    </div>
                  ) : (
                    <p>Sem dados do último treino.</p>
                  )}
                </>
              );
            })()}
            <button onClick={closeInfoBox}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workout;
