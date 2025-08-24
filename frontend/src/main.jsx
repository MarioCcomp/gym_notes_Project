import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactDOM from "react-dom/client";
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router";
import Home from './components/Home.jsx'
import MyWorkouts from './components/MyWorkouts.jsx';
import Workout from './components/Workout.jsx';
import WorkoutsLayout from './components/WorkoutLayout.jsx';
import { MusclesProvider } from './context/MusclesContext';

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
  <MusclesProvider>
    <Routes>
      <Route path="/" element={<Home />}  />
      <Route path="/workouts" element={<WorkoutsLayout />}>
        <Route index element={<MyWorkouts />} />
        <Route path=':workoutName' element={<Workout/>} />
      </Route>
      

    </Routes>
  </MusclesProvider>
  </BrowserRouter>,
)
