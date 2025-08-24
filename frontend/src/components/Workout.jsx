import { useNavigate, useParams } from "react-router-dom";
import "./Workout.css";
import gymNotes from "../assets/gymnotes.png";
import { useState } from "react";
import { useMuscles } from "../context/MusclesContext";
import AddExercises from "./AddExercises";

const Workout = ({}) => {
  // ------------------------------------------------------

  const { muscles, exercises, routines } = useMuscles();

  // Estados para adicionar exercicios

  const [exerciseSearch, setExerciseSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const exercisesPerPage = 5;

  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [selectedMuscle, setSelectedMuscle] = useState("");
  const [selectedExercise, setSelectedExercise] = useState("");
  const [plannedSets, setPlannedSets] = useState("");

  const { workoutName } = useParams();

  const navigate = useNavigate();

  const workout = routines.find((routine) => routine.name === workoutName);

  const [expandedExercises, setExpandedExercises] = useState({});
  const [infoBox, setInfoBox] = useState({
    open: false,
    exercise: null,
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
    setInfoBox({ open: true, exercise, setIndex: index });
  };

  const closeInfoBox = () => {
    setInfoBox({ open: false, exercise: null, setIndex: null });
  };

  const getLastSet = () => {
    if (!infoBox.exercise) return null;
    if (infoBox.exercise.sessions.length === 0) return null;
    const data = infoBox.exercise.sessions;
    const last = data[data.length - 1];
    return last.sets[infoBox.setIndex];
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
        <p>
          Aqui está seu treino{" "}
          {workout ? "ainda n coloquei nome" : "não encontrado"}
        </p>
      </div>

      {!isAddingExercise && (
        <div className="exercises">
          {workout &&
            workout.exercises.map((exercise) => {
              const isExpanded =
                expandedExercises[exercise.exercise.name] || false;

              return (
                <div className="exercise">
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
                      repeat(exercise.plannedSets, (index) => (
                        <div className="set info" key={index}>
                          <div
                            className="infoBtn"
                            onClick={() => handleInfoBtn(index, exercise)}
                          >
                            🛈
                          </div>
                          <p>Série {index + 1}</p>
                          <form>
                            <div className="above-set">
                              <input type="text" placeholder="peso" />
                              <input type="text" placeholder="repetições" />
                            </div>

                            <div className="down-set">
                              <input type="text" placeholder="rir (opcional)" />
                              <input
                                type="text"
                                placeholder="observações (opcional)"
                              />
                            </div>
                            <input type="submit" value="Adicionar" />
                          </form>
                        </div>
                      ))}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Adicionando exercicios */}

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

      {infoBox.open && (
        <div className="info-overlay" onClick={closeInfoBox}>
          <div className="info-box" onClick={(e) => e.stopPropagation()}>
            <h3>
              Último treino{" "}
              {infoBox.exercise.sessions.length > 0 &&
                "-" +
                  infoBox.exercise.sessions[
                    infoBox.exercise.sessions.length - 1
                  ].date}{" "}
              - {infoBox.exercise.exercise.name} - Série {infoBox.setIndex + 1}
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
            <button onClick={closeInfoBox}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workout;
