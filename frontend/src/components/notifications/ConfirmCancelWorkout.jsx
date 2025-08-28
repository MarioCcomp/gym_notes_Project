import "./Notification.css";

const ConfirmCancelWorkout = ({
  confirmCancel,
  closeCancelModal,
  confirmCancelWorkout,
}) => {
  return (
    <div>
      {confirmCancel && (
        <div className="overlay" onClick={closeCancelModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <p>Tem certeza que deseja cancelar o treino? Nada será salvo.</p>
            <div className="actions">
              <button onClick={confirmCancelWorkout}>Sim, cancelar</button>
              <button onClick={closeCancelModal}>Não</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmCancelWorkout;
