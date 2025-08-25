import { useNavigate, useParams } from "react-router-dom";
import "./Workout.css";
import gymNotes from "../assets/gymnotes.png";
import { useState, useEffect } from "react";
import { useMuscles } from "../context/MusclesContext";
import AddExercises from "./AddExercises";
import { useExercises } from "../hooks/useExercises";

const Workout = ({}) => {
  // ------------------------------------------------------

  const { routines } = useMuscles();

  // Estados para adicionar exercicios

  const [exerciseSearch, setExerciseSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const exercisesPerPage = 5;

  const [isWorkoutRunning, setIsWorkoutRunning] = useState(false);

  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [selectedMuscle, setSelectedMuscle] = useState("");
  const [selectedExercise, setSelectedExercise] = useState("");
  const [plannedSets, setPlannedSets] = useState("");
  const [editingSets, setEditingSets] = useState({});
  const [notification, setNotification] = useState(null);

  const { workoutName } = useParams();

  const navigate = useNavigate();

  const workout = routines.find((routine) => routine.name === workoutName);
  const [exercises, setExercises] = useState([]);

  const { addWorkoutExercises } = useExercises();

  useEffect(() => {
    if (workout) {
      setExercises([...workout.exercises]);
    }
  }, [workout]);

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
    const last = exercise.sessions[exercise.sessions.length - 1 - minus];
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

  return (
    <div className="main">
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
        <p>{workout ? workout.name : "Carregando treino..."}</p>
        {isWorkoutRunning ? (
          <button onClick={handleCancelClick}>Cancelar</button>
        ) : (
          <button className="startBtn" onClick={handleStart}>
            Iniciar Treino
          </button>
        )}
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
      </div>

      {notification && <div className="notification">{notification}</div>}

      {!isAddingExercise && (
        <div className="exercises">
          {exercises.map((exercise) => {
            const isExpanded =
              expandedExercises[exercise.exercise.name] || false;

            return (
              <div className="exercise" key={exercise.exercise.id}>
                <h3>{exercise.exercise.name}</h3>
                <p>
                  Séries: {exercise.plannedSets}{" "}
                  <span onClick={() => toggleExercise(exercise.exercise.name)}>
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
                            onSubmit={(e) => handleSaveSet(e, index, exercise)}
                          >
                            <div className="above-set">
                              <input
                                type="text"
                                placeholder="peso"
                                name="weight"
                                disabled={!isEditing}
                              />
                              <input
                                type="text"
                                placeholder="repetições"
                                name="reps"
                                disabled={!isEditing}
                              />
                            </div>

                            <div className="down-set">
                              <input
                                type="text"
                                placeholder="rir (opcional)"
                                name="rir"
                                disabled={!isEditing}
                              />
                              <input
                                type="text"
                                placeholder="observações (opcional)"
                                name="notes"
                                disabled={!isEditing}
                              />
                            </div>
                            {isEditing ? (
                              <input type="submit" value="Adicionar" />
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleEditSet(index, exercise)}
                                className="editBtn"
                              >
                                Editar
                              </button>
                            )}
                          </form>
                        </div>
                      );
                    })}
                </div>
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

          {isAddingExercise && <AddExercises routine={workout} />}
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
