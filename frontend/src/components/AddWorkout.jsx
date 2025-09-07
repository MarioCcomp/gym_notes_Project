import { useState } from "react";
import { useMuscles } from "../context/MusclesContext";
import "./AddWorkout.css";
import { capitalizeWords, getFilteredExercises } from "../utils/utils";
import { useWorkouts } from "../hooks/useWorkouts";

const AddWorkout = ({ setIsAddingWorkout }) => {
  const { muscles, exercises, routines } = useMuscles();
  const [selectedMuscle, setSelectedMuscle] = useState("");
  const [newRoutineName, setNewRoutineName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [exerciseSearch, setExerciseSearch] = useState("");
  const [addedExercises, setAddedExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState();
  const [plannedSets, setPlannedSets] = useState(1);
  const { saveWorkout } = useWorkouts();

  const exercisesPerPage = 5;

  const handleSaveExercise = (e) => {
    e.preventDefault();
    const newWorkoutExercise = {
      exercise: selectedExercise,
      plannedSets: plannedSets,
      sessions: [],
    };
    setAddedExercises((prev) => {
      if (addedExercises.length > 0) {
        return [...prev, newWorkoutExercise];
      }
      return [newWorkoutExercise];
    });
    console.log(addedExercises);
  };

  const handleSaveWorkout = () => {
    let name = newRoutineName;
    if (newRoutineName === "") {
      name = `Treino ${routines.length + 1}`;
    }

    const newRoutine = {
      name: name,
      exercises: addedExercises,
    };

    setIsAddingWorkout(false);
    saveWorkout(newRoutine);

    // console.log(routines);
    // console.log(newRoutine);
  };

  return (
    <div>
      <form className="creatingWorkout" onSubmit={handleSaveExercise}>
        <div className="infoWarning">
          ⚠️ Caso não selecione exercícios agora, poderá fazer isso depois.
        </div>

        <label>Dê um apelido ao seu treino</label>
        <input
          type="text"
          value={newRoutineName}
          onChange={(e) => setNewRoutineName(e.target.value)}
        />

        <label>Selecione o músculo</label>
        <select
          value={selectedMuscle}
          onChange={(e) => setSelectedMuscle(e.target.value)}
        >
          <option value="">-- Selecione um músculo --</option>
          {muscles.map((muscle) => (
            <option key={muscle.id}>{capitalizeWords(muscle.name)}</option>
          ))}
        </select>

        <label>Escolha um exercício</label>
        <input
          type="text"
          placeholder="Pesquisar exercício..."
          value={exerciseSearch}
          onChange={(e) => {
            setExerciseSearch(e.target.value);
            setCurrentPage(1);
          }}
        />

        <div className="exercise-grid">
          {getFilteredExercises(selectedMuscle, exerciseSearch)
            .slice(
              (currentPage - 1) * exercisesPerPage,
              currentPage * exercisesPerPage
            )
            .map((ex) => (
              <div
                className={`exercise-card ${
                  selectedExercise && selectedExercise.name === ex.name
                    ? "selected"
                    : ""
                }`}
                onClick={() => setSelectedExercise(ex)}
              >
                {capitalizeWords(ex.name)}
              </div>
            ))}
        </div>

        <div className="pagination-controls">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Anterior
          </button>
          <span>Página {currentPage}</span>
          <button
            type="button"
            disabled={
              currentPage >=
              Math.ceil(
                getFilteredExercises(selectedMuscle, exerciseSearch).length /
                  exercisesPerPage
              )
            }
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Próxima
          </button>
        </div>

        {selectedExercise && (
          <>
            <label>Quantidade de séries planejadas</label>
            <input
              type="number"
              min="1"
              value={plannedSets}
              onChange={(e) => setPlannedSets(e.target.value)}
            />
            <button type="submit">Salvar exercício</button>
          </>
        )}

        {addedExercises.length > 0 && (
          <div className="addedExercises">
            <h4>Exercícios adicionados:</h4>
            <ul>
              {addedExercises.map((ex, index) => (
                <li key={index}>
                  {ex.exercise.name} - {ex.plannedSets}{" "}
                  {ex.plannedSets > 1 ? "séries" : "série"}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="button"
          className="saveWorkoutBtn"
          onClick={handleSaveWorkout}
        >
          Adicionar treino
        </button>
      </form>
    </div>
  );
};

export default AddWorkout;
