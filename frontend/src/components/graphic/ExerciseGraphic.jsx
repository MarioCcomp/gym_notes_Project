import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./ExerciseGraphic.css";

// const exercise = {
//   name: "Supino Reto",
//   sessions: [
//     {
//       date: "2025-09-10",
//       volume: 1000,
//       sets: [
//         { reps: 10, kg: 50 },
//         { reps: 10, kg: 50 },
//       ],
//     },
//     {
//       date: "2025-09-12",
//       volume: 1200,
//       sets: [
//         { reps: 8, kg: 60 },
//         { reps: 6, kg: 70 },
//       ],
//     },
//   ],
// };

// Tooltip customizado
function CustomTooltip({ active, payload, label, exercise }) {
  if (active && payload && payload.length) {
    const session = payload[0].payload;

    return (
      <div className="tooltip-box">
        <b>{exercise.name}</b> – {label}
        <br />
        Total: <span className="tooltip-highlight">{session.volume} kg</span>
        <hr />
        {session.sets.map((set, idx) => (
          <div key={idx}>
            Série {idx + 1}:{" "}
            <span className="tooltip-series">
              {set.kg}kg × {set.reps} reps
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

// Modal do gráfico
export default function ExerciseGraphic({ isOpen, onClose, exercise }) {
  if (!isOpen) return null;

  const hasData = exercise?.sessions && exercise.sessions.length > 0;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal exercise-modal" onClick={(e) => e.stopPropagation()}>
        {/* Botão de fechar */}
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>

        {/* Nome do exercício centralizado */}
         <h2 className="exercise-title">{exercise.name}</h2>

        {/* Gráfico */}


        {/* Verificação se há dados */}
        {!hasData ? (
          <p className="no-data">Não há dados disponíveis para este exercício.</p>
        ) : (

        <div className="exercise-chart">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={exercise.sessions}
               margin={{ top: 20, right: 20, bottom: 30, left: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="date"
                tick={{ fill: "#e2e8f0", fontSize: 12 }}
                label={{
                  value: "Sessões",
                  position: "insideBottom",
                  dy: 25,
                  fill: "#fff",
                }}
              />
              <YAxis
                tick={{ fill: "#e2e8f0", fontSize: 12 }}
                label={{
                  value: "Tonelagem (kg)",
                  angle: -90,
                  position: "insideLeft",
                  offset: 10,
                  fill: "#fff",
                }}
              />
              <Tooltip content={<CustomTooltip  exercise={exercise}/>} />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ color: "#38bdf8", fontSize: 14 }}
              />
              <Line
                type="monotone"
                dataKey="volume"
                stroke="#facc15"
                strokeWidth={3}
                dot={{ r: 5, stroke: "#0f172a", strokeWidth: 2 }}
                activeDot={{ r: 7, stroke: "#facc15", strokeWidth: 2 }}
                name={exercise.name} // legenda = nome do exercício
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>)}
      </div>
    </div>
  );
}
