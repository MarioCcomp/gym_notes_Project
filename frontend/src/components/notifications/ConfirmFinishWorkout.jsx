import "./Notification.css";

const ConfirmFinishWorkout = ({
  confirmFinishWorkout,
  setConfirmFinishWorkout,
  saveWorkout,
}) => {
  return (
    <div>
      {confirmFinishWorkout && (
        <div className="overlay" onClick={() => setConfirmFinishWorkout(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <p className="modal-text">Deseja salvar o treino? Todo progresso será salvo e não terá mais como editar</p>
            <div className="actions">
              <button onClick={() => setConfirmFinishWorkout(null)}>
                Cancelar
              </button>
              <button
                onClick={() => {
                  saveWorkout();
                  setConfirmFinishWorkout(null);
                }}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmFinishWorkout;
