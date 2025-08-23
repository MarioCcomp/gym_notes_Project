package br.com.mario.GymNotes.model;



public class ExerciseSet {

    private Double weight;
    private Double reps;
    private Double rir;
    private String notes;

    public ExerciseSet() {
    }

    public ExerciseSet(Double weight, Double reps, Double rir, String notes) {
        this.weight = weight;
        this.reps = reps;
        this.rir = rir;
        this.notes = notes;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
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
