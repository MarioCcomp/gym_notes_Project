import './MyWorkouts.css'
import gymNotes from '../assets/gymnotes.png'

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';





const MyWorkouts = () => {

   const navigate = useNavigate();

const [routines, setRoutines] = useState([
    {
        name: "Lower I",
        id: 1,
        exercises: []
    },
    {
        name: "Upper I",
        id: 2,
        exercises: [
            {
                name: 'Supino Reto',
                targetMuscle: 'chest',
                plannedSets: 3,
                workoutData: [
                    {
                        date: "2025/08/06",
                        sets: [
                            {
                                weight: "80kg",
                                reps: 8,
                                rir: 0,
                                annotations: "Desci a barra muito rapido na ultima rep"
                            },
                            {
                                weight: "80kg",
                                reps: 7,
                                rir: 0,
                                annotations: ""
                            },
                            {
                                weight: "80kg",
                                reps: 7,
                                rir: 0,
                                annotations: ""
                            }
                        ]
                    }
                ]

            }
        ]
    },
    {
        name: "Upper II",
        id: 3,
        exercises: []

    }, 
    {
        name: "Lower II",
        id: 4,
        exercises: []
    }
]);

    const handleBack = () => {
        if(isCreatingWorkout) {
            setIsCreatingWorkout(false);
            return;
        }
        navigate('/')

    }

    const [exercises, setExercises] = useState([
        {
            name: "Supino Inclinado",
            targetMuscle: "peito"
        },
        {
            name: "Agachamento Livre",
            targetMuscle: "quadriceps"
        },
        {
            name: "Rosca Scott",
            targetMuscle: "biceps"
        }
    ])

    const [muscles, setMuscles] = useState(["Peito", "Quadriceps", "Biceps"]);

    const [isCreatingWorkout, setIsCreatingWorkout] = useState(false);

    // --------------

    const [newRoutineName, setNewRoutineName] = useState('');
    const [selectedMuscle, setSelectedMuscle] = useState('');
    const [selectedExercise, setSelectedExercise] = useState('');
    const [plannedSets, setPlannedSets] = useState('');
    const [addedExercises, setAddedExercises] = useState([]);

    const handleAddExercise = () => {
    if (!selectedExercise || !plannedSets) return;

    const exercise = exercises.find(
        (ex) => ex.name === selectedExercise
    );

    if (!exercise) return;

    setAddedExercises([...addedExercises, {
        name: exercise.name,
        targetMuscle: selectedMuscle,
        plannedSets: Number(plannedSets),
    }]);

    // Reset campos
    setSelectedExercise('');
    setPlannedSets('');
    };





    const handleSaveWorkout = () => {
        if (!newRoutineName) return;

        const newRoutine = {
            id: Date.now(), 
            name: newRoutineName,
            exercises: addedExercises
        };

        setRoutines([...routines, newRoutine]);

        // Resetar estados
        setNewRoutineName('');
        setSelectedMuscle('');
        setSelectedExercise('');
        setPlannedSets('');
        setAddedExercises([]);
        setIsCreatingWorkout(false);
    }

    //  -----------------

  return (
    <div className="main mainWorkouts">


        <div className="back" onClick={handleBack}>Voltar</div>
        {!isCreatingWorkout && <div className="createWorkout" onClick={() => setIsCreatingWorkout(true)}>Criar novo treino</div>}
        <div className="header">
            <img src={gymNotes} alt="" />
            <p>{isCreatingWorkout ? "Crie seu treino abaixo" : "Aqui estão suas rotinas de treinos"}</p>

        </div>



            {!isCreatingWorkout && <ul className='buttons'>
            {routines && routines.map((routine) => (
                <li key={routine.id} onClick={() => navigate(`/workouts/${routine.id}`)}>{routine.name}</li>
            ))}
            </ul>}
            
           {isCreatingWorkout && (
        <form className='creatingWorkout' onSubmit={(e) => e.preventDefault()}>
            <div className="infoWarning">
            ⚠️ Caso não selecione exercícios agora, poderá fazer isso depois.
            </div>

            <label>Dê um apelido ao seu treino</label>
            <input
            type="text"
            value={newRoutineName}
            onChange={(e) => setNewRoutineName(e.target.value)}
            />

            <label>Selecione o músculo para procurar exercícios</label>
            <select
            value={selectedMuscle}
            onChange={(e) => setSelectedMuscle(e.target.value)}
            >
            <option value="">-- Selecione um músculo --</option>
            {muscles.map((muscle) => (
                <option key={muscle} value={muscle}>{muscle}</option>
            ))}
            </select>

            {selectedMuscle && (
            <>
                <label>Escolha um exercício</label>
                <select
                value={selectedExercise}
                onChange={(e) => setSelectedExercise(e.target.value)}
                >
                <option value="">-- Selecione um exercício --</option>
                {exercises
                    .filter((ex) => ex.targetMuscle.toLowerCase() === selectedMuscle.toLowerCase())
                    .map((ex) => (
                    <option key={ex.name} value={ex.name}>{ex.name}</option>
                    ))}
                </select>
            </>
            )}

            {selectedExercise && (
            <>
                <label>Quantidade de séries planejadas</label>
                <input
                type="number"
                min="1"
                value={plannedSets}
                onChange={(e) => setPlannedSets(e.target.value)}
                />
                <button type="button" onClick={handleAddExercise}>Adicionar exercício</button>
            </>
            )}

            {addedExercises.length > 0 && (
            <div className='addedExercises'>
                <h4>Exercícios adicionados:</h4>
                <ul>
                {addedExercises.map((ex, index) => (
                    <li key={index}>
                    {ex.name} - {ex.targetMuscle} - {ex.plannedSets} séries
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
        )}

    </div>
  )
}

export default MyWorkouts