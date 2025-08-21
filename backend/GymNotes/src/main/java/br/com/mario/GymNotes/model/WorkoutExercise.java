package br.com.mario.GymNotes.model;


import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class WorkoutExercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id")
    private Exercise exercise;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "routine.id")
    private WorkoutRoutine routine;

    private int plannedSets;

    @OneToMany(mappedBy = "workoutExercise", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<WorkoutSession> sessions =  new ArrayList<>();



    public WorkoutExercise() {
    }

    public WorkoutExercise(Exercise exercise, int plannedSets, List<WorkoutSession> sessions) {
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

    public int getPlannedSets() {
        return plannedSets;
    }

    public void setPlannedSets(int plannedSets) {
        this.plannedSets = plannedSets;
    }

    public List<WorkoutSession> getSessions() {
        return sessions;
    }

    public void setSessions(List<WorkoutSession> sessions) {
        this.sessions = sessions;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public WorkoutRoutine getRoutine() {
        return routine;
    }

    public void setRoutine(WorkoutRoutine routine) {
        this.routine = routine;
    }

    public void addSession(WorkoutSession session) {
        sessions.add(session);
        session.setWorkoutExercise(this);
    }
}
