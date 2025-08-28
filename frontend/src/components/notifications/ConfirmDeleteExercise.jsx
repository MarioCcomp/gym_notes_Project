import "./Notification.css";

const ConfirmDeleteExercise = ({
  toggleConfirmDelete,
  confirmDelete,
  confirmDeleteExercise,
}) => {
  return (
    <div>
      {confirmDelete && (
        <div className="overlay" onClick={toggleConfirmDelete}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <p>
              Tem certeza que deseja excluir esse exercicio? Todo progresso
              deste exercicio será excluido
            </p>
            <div className="actions">
              <button
                onClick={() => {
                  confirmDeleteExercise();
                }}
              >
                Sim, desejo excluir
              </button>
              <button onClick={toggleConfirmDelete}>Não</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmDeleteExercise;
