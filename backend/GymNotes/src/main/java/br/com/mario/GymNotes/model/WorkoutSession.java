package br.com.mario.GymNotes.model;



import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class WorkoutSession {

    private LocalDate date;
    private List<ExerciseSet> sets =  new ArrayList<>();;

    public WorkoutSession() {
    }

    public WorkoutSession(LocalDate date, List<ExerciseSet> sets) {
        this.date = date;
        this.sets = sets;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public List<ExerciseSet> getSets() {
        return sets;
    }

    public void setSets(List<ExerciseSet> sets) {
        this.sets = sets;
    }
}
