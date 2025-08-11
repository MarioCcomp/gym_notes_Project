import './Home.css'
import gymNotes from '../assets/gymnotes.png'
import { useNavigate } from 'react-router-dom'


const Home = () => {

     const navigate = useNavigate();

  return (
    <div className="main">
        <div className="header">
            {/* <h2>Gym Notes</h2> */}
            <img src={gymNotes} alt="" />
            <p>Seu app de treino</p>
        </div>
            <ul className='buttons'>
                <li onClick={() => navigate('/workouts')}>Meus Treinos</li>
                <li>Meu Progresso</li>
            </ul>

    </div>
  )
}

export default Home