import "./Notification.css";

const ConfirmSaveIncompleteWorkout = ({
  confirmSaveModal,
  setConfirmSaveModal,
  saveWorkout,
}) => {
  return (
    <div>
      {confirmSaveModal && (
        <div className="overlay" onClick={() => setConfirmSaveModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <p className="modal-title">⚠️ Exercícios incompletos</p>
            <p className="modal-text">
              Os seguintes exercícios não foram preenchidos completamente:
            </p>
            <ul className="modal-list">
              {confirmSaveModal.map((ex, idx) => (
                <li key={idx}>- {ex}</li>
              ))}
            </ul>
            <p className="modal-text">Deseja salvar o treino mesmo assim?</p>
            <div className="actions">
              <button onClick={() => setConfirmSaveModal(null)}>
                Cancelar
              </button>
              <button
                onClick={() => {
                  saveWorkout();
                  setConfirmSaveModal(null);
                }}
              >
                Salvar mesmo assim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmSaveIncompleteWorkout;
