import "./OptionsExpanded.css"

const OptionsExpanded = ({optionsExpanded, ind, handleExpandOptions, setExerciseBeingEdited, toggleEditingExercise, toggleConfirmDelete, exercise}) => {
  return (
    <div>
      {optionsExpanded[ind] && (
        <div className="lis">
          <p onClick={() => handleExpandOptions(ind)}>X</p>
          <ul>
            <li
              onClick={(e) => {
                setExerciseBeingEdited({
                  ...exercise.exercise,
                  index: ind,
                });
                toggleEditingExercise();
              }}
            >
              Editar exercicio
            </li>
            <li
              onClick={() => {
                toggleConfirmDelete();
                setExerciseBeingEdited({
                  ...exercise.exercise,
                  index: ind,
                });
              }}
            >
              Excluir exercicio
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default OptionsExpanded;
