import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./components/Home.jsx";
import MyWorkouts from "./components/MyWorkouts.jsx";
import Workout from "./components/workoutComponents/Workout.jsx";
import WorkoutsLayout from "./components/WorkoutLayout.jsx";
import { MusclesProvider } from "./context/MusclesContext";
import { TokenProvider } from "./context/TokenContext.jsx";
import Login from "./components/Login.jsx";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <TokenProvider>
      <MusclesProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/workouts" element={<WorkoutsLayout />}>
            <Route index element={<MyWorkouts />} />
            <Route path=":workoutName" element={<Workout />} />
          </Route>
        </Routes>
      </MusclesProvider>
    </TokenProvider>
  </BrowserRouter>
);
