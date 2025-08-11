import { useNavigate, useParams } from 'react-router-dom'
import './Workout.css'
import gymNotes from '../assets/gymnotes.png'
import { useState } from 'react'
import { useMuscles } from '../context/MusclesContext';




const Workout = ({}) => {

    // Abaixo irei colocar oq viria do banco

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
                                    annotations: "casdadad"
                                },
                                {
                                    weight: "80kg",
                                    reps: 7,
                                    rir: 0,
                                    annotations: "sdadad"
                                }
                            ]
                        }
                    ]
    
                },
                {
                    name: 'Puxada Alta',
                    targetMuscle: 'back',
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
                                    annotations: "xczcx"
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



    // ------------------------------------------------------


    const { muscles, exercises } = useMuscles();




    // Estados para adicionar exercicios


    const [exerciseSearch, setExerciseSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const exercisesPerPage = 5;


    const [isAddingExercise, setIsAddingExercise] = useState(false);
    const [selectedMuscle, setSelectedMuscle] = useState('');
    const [selectedExercise, setSelectedExercise] = useState('');
    const [plannedSets, setPlannedSets] = useState('');
    const [addedExercises, setAddedExercises] = useState([]);

    const allExercises = [
    { name: "Supino Inclinado", targetMuscle: "peito" },
    { name: "Agachamento Livre", targetMuscle: "quadriceps" },
    { name: "Rosca Scott", targetMuscle: "biceps" },
    { name: "Puxada Alta", targetMuscle: "costas" },
    ];

    const allMuscles = ["Peito", "Quadriceps", "Biceps", "Costas"];




    const handleAddExerciseToList = () => {
    if (!selectedExercise || !plannedSets) return;

    const exercise = exercises.find((ex) => ex.name === selectedExercise);
    if (!exercise) return;

    setRoutines((prev) =>
        prev.map((routine) => {
        if (routine.id === Number(workoutId)) {
            return {
            ...routine,
            exercises: [
                ...routine.exercises,
                {
                name: exercise.name,
                targetMuscle: selectedMuscle,
                plannedSets: Number(plannedSets),
                workoutData: [],
                },
            ],
            };
        }
        return routine;
        })
    );

    // Reset states
    setSelectedMuscle('');
    setSelectedExercise('');
    setPlannedSets('');
    setIsAddingExercise(false);
    };

//  -----------------------------------------------


    const {workoutId}= useParams();

    const navigate = useNavigate();

    const workout = routines.find((routine) => routine.id === Number(workoutId));  
    console.log(workout);
  

    const [expandedExercises, setExpandedExercises] = useState({});
    const [infoBox, setInfoBox] = useState({ open: false, exercise: null, setIndex: null });


    const toggleExercise = (exerciseName) => {
        setExpandedExercises((prev) => ({           
            ...prev,
            [exerciseName]: !prev[exerciseName]
        }));
    };


    const repeat = (n, fn) => Array.from({ length: n }, (_, i) => fn(i));


    const handleInfoBtn = (index, exercise) => {
        setInfoBox({ open: true, exercise, setIndex: index });
        // console.log(exercise);
        // const data = exercise.workoutData;
        // const lastIndex = data.length - 1;
        // console.log(lastIndex);

        // const lastDate = data[lastIndex].date;
        // const set = data[lastIndex].sets.find((set, indexSet) => index === indexSet);
        // console.log(set);
        // console.log(lastDate);
        // console.log(`na data ${lastDate} voce realizou essa serie com ${set.weight} de peso para ${set.reps} repetições com ${set.rir} de rir`);
        // const messageAnnotations = set.annotations.trim() === '' ? 'Voce nao anotou nenhuma observação para esta série' : set.annotations;
        // console.log(messageAnnotations)

    }

     const closeInfoBox = () => {
        setInfoBox({ open: false, exercise: null, setIndex: null });
    }

    const getLastSet = () => {
        if (!infoBox.exercise) return null;
        if(infoBox.exercise.workoutData.length === 0) return null;
        const data = infoBox.exercise.workoutData;
        const last = data[data.length - 1];
        return last.sets[infoBox.setIndex];
    }



    // funcao para deixar a primeira letra maiuscula dos nomes

    function capitalizeWords(str) {
        return str
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        }



        const getFilteredExercises = () => {
            let filtered = exercises;

            if (selectedMuscle) {
                filtered = filtered.filter(
                (ex) => ex.targetMuscle.toLowerCase().trim() === selectedMuscle.toLowerCase().trim()
                );
            }

            if (exerciseSearch.trim() !== '') {
                filtered = filtered.filter((ex) =>
                ex.name.toLowerCase().includes(exerciseSearch.toLowerCase())
                );
            }

            return filtered;
        };


  return (
    <div className='main'>
        <div className="back" onClick={() => navigate('/workouts')}>Voltar</div>
        
        <div className="header">
            <img src={gymNotes} alt="" />
            <p>Aqui está seu treino {workout ? workout.name : 'não encontrado'}</p>
        </div>

       {!isAddingExercise && <div className="exercises">
            {workout && workout.exercises.map((exercise) => {

                const isExpanded = expandedExercises[exercise.name] || false;

                return (
                <div className="exercise">
                <h3>{exercise.name}</h3>
                <p>Séries: {exercise.plannedSets} <span onClick={() => toggleExercise(exercise.name)}>{isExpanded ? '↓' : '→'}</span></p>
                <div className="sets">
                {isExpanded && exercise.plannedSets && repeat(exercise.plannedSets, (index) => (
                    <div className="set info" key={index}>
                        <div className="infoBtn" onClick={() => handleInfoBtn(index, exercise)}>
                                🛈
                            </div>
                        <p>Série {index + 1}</p>
                        <form>
                            
                            <div className="above-set">
                            <input type="text" placeholder='peso'/>
                            <input type="text" placeholder='repetições'/>
                            </div>
                            
                            <div className="down-set">
                            <input type="text" placeholder='rir (opcional)'/>
                            <input type="text" placeholder='observações (opcional)'/>
                            </div>
                            <input type="submit" value="adicionar"/>
                        </form>
                    </div>
                ))}
                </div>
                </div>
                )
            })}
        </div>}


        {/* Adicionando exercicios */}


        <div className="add-exercise-section">
            {!isAddingExercise && (
                <button className="addExerciseBtn" onClick={() => setIsAddingExercise(true)}>
                 Adicionar exercício
                </button>
            )}

            {isAddingExercise && (
                <form className="creatingExercise" onSubmit={(e) => e.preventDefault()}>
                <label>Selecione o músculo</label>
                <select
                    value={selectedMuscle}
                    onChange={(e) => setSelectedMuscle(e.target.value)}
                >
                    <option value="">-- Selecione um músculo --</option>
                    {muscles.map((muscle) => (
                    <option key={muscle.id} value={muscle.name}>{capitalizeWords(muscle.name)}</option>
                    ))}
                </select>

                
                    <>
                    <label>Escolha um exercício</label>
                     <input
                        type="text"
                        placeholder="Pesquisar exercício..."
                        value={exerciseSearch}
                        onChange={(e) => {
                            setExerciseSearch(e.target.value);
                            setCurrentPage(1); // Resetar página ao pesquisar
                        }}
                        />
                    <div className="exercise-grid">
                    {getFilteredExercises()
                        .slice((currentPage - 1) * exercisesPerPage, currentPage * exercisesPerPage)
                        .map((ex) => (
                        <div
                            key={ex.name}
                            className={`exercise-card ${selectedExercise === ex.name ? 'selected' : ''}`}
                            onClick={() => setSelectedExercise(ex.name)}
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
                                disabled={currentPage >= Math.ceil(getFilteredExercises().length / exercisesPerPage)}
                                onClick={() => setCurrentPage((prev) => prev + 1)}
                            >
                                Próxima
                            </button>
                        </div>
                    </>
                

                {selectedExercise && (
                    <>
                    <label>Quantidade de séries planejadas</label>
                    <input
                        type="number"
                        min="1"
                        value={plannedSets}
                        onChange={(e) => setPlannedSets(e.target.value)}
                    />
                    <button type="button" onClick={handleAddExerciseToList}>Salvar exercício</button>
                    </>
                )}
                </form>
            )}
        </div>










        {infoBox.open && (
                <div className="info-overlay" onClick={closeInfoBox}>
                    <div className="info-box" onClick={(e) => e.stopPropagation()}>
                        <h3>Último treino {infoBox.exercise.workoutData.length > 0 &&  "-" + infoBox.exercise.workoutData[infoBox.exercise.workoutData.length - 1].date} - {infoBox.exercise.name} - Série {infoBox.setIndex + 1}</h3>
                        {getLastSet() ? (
                            <div>
                                
                                <p>Peso: {getLastSet().weight}</p>
                                <p>Repetições: {getLastSet().reps}</p>
                                <p>RIR: {getLastSet().rir}</p>
                                <p>Anotações: {getLastSet().annotations.trim() === "" ? "Nenhuma observação." : getLastSet().annotations}</p>
                            </div>
                        ) : (
                            <p>Sem dados do último treino.</p>
                        )}
                        <button onClick={closeInfoBox}>Fechar</button>
                    </div>
                </div>
            )}

    </div>
  )
}

export default Workout