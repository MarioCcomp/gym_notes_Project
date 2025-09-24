import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home.jsx";
import MyWorkouts from "./components/MyWorkouts.jsx";
import Workout from "./components/workoutComponents/Workout.jsx";
import WorkoutsLayout from "./components/WorkoutLayout.jsx";
import { MusclesProvider } from "./context/MusclesContext";
import { TokenProvider } from "./context/TokenContext.jsx";
import Login from "./components/Login.jsx";
import ResetPassword from "./components/ResetPassword.jsx";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <TokenProvider>
      <MusclesProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/workouts" element={<WorkoutsLayout />}>
            <Route index element={<MyWorkouts />} />
            <Route path=":workoutName" element={<Workout />} />
          </Route>
          <Route path="/reset" element={<ResetPassword />} />

          <Route path="*" element={<Login />} />
        </Routes>
      </MusclesProvider>
    </TokenProvider>
  </BrowserRouter>
);
