import "./Home.css";
import gymNotes from "../assets/gymnotes.png";
import { useNavigate } from "react-router-dom";
import UserMenu from "./UserMenu";
import { useToken } from "../context/TokenContext";
import ExerciseGraphic from "./graphic/ExerciseGraphic";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="main main-home">
      <ExerciseGraphic />
      <div className="header">
        {/* <h2>Gym Notes</h2> */}
        <img src={gymNotes} alt="" />
        <p>Seu app de treino</p>
      </div>

      <UserMenu/>

      <ul className="buttons">
        <li onClick={() => navigate("/workouts")}>Meus Treinos</li>
        <li>Meu ProgresAAAAso</li>
      </ul>
    </div>
  );
};

export default Home;
