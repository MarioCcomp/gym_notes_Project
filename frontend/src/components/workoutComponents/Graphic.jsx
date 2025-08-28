import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./Graphic.css";

const dataTest = [
  {
    date: "2025/08/22",
    exercise: "Supino Reto",
    volumeLoad: 360,
    series: [
      { reps: 12, weight: 20 },
      { reps: 6, weight: 20 },
    ],
  },
  {
    date: "2025/08/25",
    exercise: "Supino Reto",
    volumeLoad: 400,
    series: [
      { reps: 10, weight: 20 },
      { reps: 10, weight: 20 },
    ],
  },
  {
    date: "2025/08/29",
    exercise: "Supino Reto",
    volumeLoad: 450,
    series: [
      { reps: 11, weight: 20 },
      { reps: 9, weight: 20 },
    ],
  },
];

const Graphic = () => {
  const [selectedData, setSelectedData] = useState(null);

  return (
    <div className="graphic-wrapper">
      {/* Gráfico */}
      <div className="graphic-container">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={dataTest}
            margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
            onMouseLeave={() => setSelectedData(null)}
          >
            <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />

            {/* Tooltip invisível para atualizar o painel */}
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  setSelectedData(payload[0].payload);
                }
                return null;
              }}
            />

            <Legend verticalAlign="top" height={36} />
            <Line
              type="monotone"
              dataKey="volumeLoad"
              name="Volume (kg)"
              stroke="#6366f1"
              strokeWidth={2}
              dot={{
                r: 5,
                stroke: "#6366f1",
                strokeWidth: 2,
                fill: "white",
              }}
              activeDot={{
                r: 8,
                fill: "#6366f1",
                stroke: "#4338ca",
                strokeWidth: 2,
              }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Painel de detalhes */}
      <div className="details-panel">
        {selectedData ? (
          <div>
            <h3>{selectedData.exercise}</h3>
            <p className="date">{selectedData.date}</p>
            <p>
              <strong>Volume:</strong> {selectedData.volumeLoad} kg
            </p>
            <p className="subtitle">Séries</p>
            <ul>
              {selectedData.series.map((s, idx) => (
                <li key={idx}>
                  {s.reps} reps × {s.weight}kg
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="placeholder">Passe o mouse em um ponto do gráfico</p>
        )}
      </div>
    </div>
  );
};

export default Graphic;
