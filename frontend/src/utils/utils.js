import { useMuscles } from "../context/MusclesContext";

export function capitalizeWords(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getFilteredExercises(selectedMuscle, exerciseSearch) {
  const { exercises } = useMuscles();
  let filtered = exercises;

  if (selectedMuscle) {
    filtered = filtered.filter(
      (ex) =>
        ex.targetMuscle.name.toLowerCase().trim() ===
        selectedMuscle.toLowerCase().trim()
    );
  }

  if (exerciseSearch.trim() !== "") {
    filtered = filtered.filter((ex) =>
      ex.name.toLowerCase().includes(exerciseSearch.toLowerCase())
    );
  }

  return filtered;
}
