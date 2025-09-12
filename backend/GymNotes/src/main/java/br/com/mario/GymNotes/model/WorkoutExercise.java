package br.com.mario.GymNotes.model;


import org.springframework.data.mongodb.core.mapping.DBRef;

import java.util.ArrayList;
import java.util.List;

public class WorkoutExercise {

    @DBRef(lazy = false)
    private Exercise exercise;

    private Integer plannedSets;

    private List<WorkoutSession> sessions =  new ArrayList<>();


    public WorkoutExercise() {
    }

    public WorkoutExercise(Exercise exercise, Integer plannedSets, List<WorkoutSession> sessions) {
        this.exercise = exercise;
        this.plannedSets = plannedSets;
        this.sessions = sessions;
    }


    public Exercise getExercise() {
        return exercise;
    }

    public void setExercise(Exercise exercise) {
        this.exercise = exercise;
    }

    public Integer getPlannedSets() {
        return plannedSets;
    }

    public void setPlannedSets(Integer plannedSets) {
        this.plannedSets = plannedSets;
    }

    public List<WorkoutSession> getSessions() {
        return sessions;
    }

    public void setSessions(List<WorkoutSession> sessions) {
        this.sessions = sessions;
    }
}
