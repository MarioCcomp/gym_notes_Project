import "./OptionsExpanded.css";
import { IoClose } from "react-icons/io5";

const OptionsExpanded = ({
  optionsExpanded,
  ind,
  handleExpandOptions,
  setExerciseBeingEdited,
  toggleEditingExercise,
  toggleConfirmDelete,
  exercise,
}) => {
  const closeOverlay = () => handleExpandOptions(ind);
  return (
    <div>
      {optionsExpanded[ind] && (
        <div className="overlay" onClick={closeOverlay}>
          <div className="lis" onClick={(e) => e.stopPropagation()}>
            <p onClick={closeOverlay} className="close-btn">
              < IoClose size={20}/>
            </p>
            <ul>
              <li
                onClick={(e) => {
                  setExerciseBeingEdited({
                    ...exercise.exercise,
                    index: ind,
                  });
                  toggleEditingExercise();
                  closeOverlay();
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
                  closeOverlay();
                }}
              >
                Excluir exercicio
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptionsExpanded;
