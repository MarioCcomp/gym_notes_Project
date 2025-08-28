package br.com.mario.GymNotes.model;



public class ExerciseSet {

    private String weight;
    private Double reps;
    private Double rir;
    private String notes;

    public ExerciseSet() {
    }

    public ExerciseSet(String weight, Double reps, Double rir, String notes) {
        this.weight = weight;
        this.reps = reps;
        this.rir = rir;
        this.notes = notes;
    }

    public String getWeight() {
        return weight;
    }

    public void setWeight(String weight) {
        this.weight = weight;
    }

    public Double getReps() {
        return reps;
    }

    public void setReps(Double reps) {
        this.reps = reps;
    }

    public Double getRir() {
        return rir;
    }

    public void setRir(Double rir) {
        this.rir = rir;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
