import "./Notification.css";

const GeneralNotification = ({
  exerciseBeingEdited,
  toggleEditingExercise,
  setExerciseBeingEdited,
  isEditingExercise,
  handleEditExercise,
}) => {
  return (
    <div>
      {isEditingExercise && (
        <div
          className="overlay"
          onClick={() => {
            toggleEditingExercise();
            setExerciseBeingEdited(null);
          }}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleEditExercise}>
              <label>
                Digite a nova quantidade séries para o exercicio{" "}
                <span>{exerciseBeingEdited ? exerciseBeingEdited.name : ""}</span>
              </label>
              <input type="number" min="1"/>
              <div className="actions">
                <button type="submit">Salvar</button>
                <button
                  onClick={() => {
                    setExerciseBeingEdited(null);
                    toggleEditingExercise();
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneralNotification;
