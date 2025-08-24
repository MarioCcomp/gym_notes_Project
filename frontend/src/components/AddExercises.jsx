import { useState } from "react";
import { useMuscles } from "../context/MusclesContext";
import { capitalizeWords, getFilteredExercises } from "../utils/utils";
import "./AddExercises.css";
import { useExercises } from "../hooks/useExercises";

const AddExercises = ({ routine }) => {
  const [isCreatingWorkout, setIsCreatingWorkout] = useState(false);
  const [selectedMuscle, setSelectedMuscle] = useState("");
  const [plannedSets, setPlannedSets] = useState();
  const [selectedExercise, setSelectedExercise] = useState();
  const { muscles, exercises } = useMuscles();
  const exercisesPerPage = 5;

  const [exerciseSearch, setExerciseSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { addWorkoutExercises } = useExercises();

  const handleSaveExercise = () => {
    const newWorkoutExercise = {
      exercise: selectedExercise,
      plannedSets: plannedSets,
      sessions: [],
    };

    console.log(routine);
    const newRoutine = {
      ...routine,
      exercises: [...routine.exercises, newWorkoutExercise],
    };

    addWorkoutExercises(newRoutine);
  };

  return (
    <div>
      {/* <h3>Adicione um exercício ao seu treino</h3> */}
      <form className="creatingExercise">
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
                  selectedExercise.name === ex.name ? "selected" : ""
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
            <button type="button" onClick={handleSaveExercise}>
              Salvar exercício
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default AddExercises;
