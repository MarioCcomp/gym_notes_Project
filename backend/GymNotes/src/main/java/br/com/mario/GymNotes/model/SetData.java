package br.com.mario.GymNotes.model;

public class SetData {
    private Double reps;
    private Double kg;

    public SetData(Double reps, Double kg) {
        this.reps = reps;
        this.kg = kg;
    }

    public Double getReps() {
        return reps;
    }

    public void setReps(Double reps) {
        this.reps = reps;
    }

    public Double getKg() {
        return kg;
    }

    public void setKg(Double kg) {
        this.kg = kg;
    }
}
