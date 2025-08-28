import "./InfoBox.css"

const InfoBox = ({ infoBox, closeInfoBox, exercises, getLastSet }) => {
  return (
    <div>
      {infoBox.open && (
        <div className="info-overlay" onClick={closeInfoBox}>
          <div className="info-box" onClick={(e) => e.stopPropagation()}>
            {(() => {
              const exercise = exercises.find(
                (ex) => ex.exercise.id === infoBox.exerciseId
              );

              if (!exercise) return <p>Exercício não encontrado.</p>;

              const lastSession =
                exercise.sessions.length > 0
                  ? exercise.sessions[exercise.sessions.length - 1]
                  : null;

              return (
                <>
                  <h3>
                    Último treino {lastSession && "- " + lastSession.date} -{" "}
                    {exercise.exercise.name} - Série {infoBox.setIndex + 1}
                  </h3>

                  {getLastSet() ? (
                    <div>
                      <p>Peso: {getLastSet().weight}</p>
                      <p>Repetições: {getLastSet().reps}</p>
                      <p>RIR: {getLastSet().rir}</p>
                      <p>
                        Anotações:{" "}
                        {getLastSet().notes.trim() === ""
                          ? "Nenhuma observação."
                          : getLastSet().notes}
                      </p>
                    </div>
                  ) : (
                    <p>Sem dados do último treino.</p>
                  )}
                </>
              );
            })()}
            <button onClick={closeInfoBox}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoBox;
