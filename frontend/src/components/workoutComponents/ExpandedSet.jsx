import "./ExpandedSet.css";
import { FaCircleInfo } from "react-icons/fa6";


const ExpandedSet = ({
  isExpanded,
  exercise,
  editingSets,
  handleInfoBtn,
  handleSaveSet,
  isWorkoutRunning,
  handleEditSet,
  getSetKey,
}) => {
  const repeat = (n, fn) => Array.from({ length: n }, (_, i) => fn(i));

  return (
    <div className="sets">
      {isExpanded &&
        exercise.plannedSets &&
        repeat(exercise.plannedSets, (index) => {
          const key = getSetKey(exercise.exercise.id, index);
          const isEditing = editingSets[key] ?? true;

          return (
            <div className="set info" key={index}>
              <div
                className="infoBtn"
                onClick={() => handleInfoBtn(index, exercise)}
              >
                <FaCircleInfo />
              </div>
              <p>Série {index + 1}</p>
              <form
                key={isWorkoutRunning}
                onSubmit={(e) => handleSaveSet(e, index, exercise)}
              >
                <div className="above-set">
                  <input
                    type="text"
                    placeholder="peso"
                    name="weight"
                    disabled={!isEditing || !isWorkoutRunning}
                  />
                  <input
                    type="text"
                    placeholder="repetições"
                    name="reps"
                    disabled={!isEditing || !isWorkoutRunning}
                  />
                </div>

                <div className="down-set">
                  <input
                    type="text"
                    placeholder="rir (opcional)"
                    name="rir"
                    disabled={!isEditing || !isWorkoutRunning}
                  />
                  <input
                    type="text"
                    placeholder="observações (opcional)"
                    name="notes"
                    disabled={!isEditing || !isWorkoutRunning}
                  />
                </div>
                {isWorkoutRunning &&
                  (isEditing ? (
                    <input type="submit" value="Adicionar" />
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleEditSet(index, exercise)}
                      className="editBtn"
                    >
                      Editar
                    </button>
                  ))}
              </form>
            </div>
          );
        })}
    </div>
  );
};

export default ExpandedSet;
