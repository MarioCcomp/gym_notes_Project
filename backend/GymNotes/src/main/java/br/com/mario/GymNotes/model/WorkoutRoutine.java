package br.com.mario.GymNotes.model;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "workoutRoutines")
public class WorkoutRoutine {

    @Id
    private String id;

    private String name;
    private List<WorkoutExercise> exercises =  new ArrayList<>();
    private String ownerUsername;

    public WorkoutRoutine() {
    }

    public WorkoutRoutine(String id, String name, List<WorkoutExercise> exercises, String ownerUsername) {
        this.id = id;
        this.name = name;
        this.exercises = exercises;
        this.ownerUsername = ownerUsername;
    }

    public String getOwnerUsername() {
        return ownerUsername;
    }

    public void setOwnerUsername(String ownerUsername) {
        this.ownerUsername = ownerUsername;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public List<WorkoutExercise> getExercises() {
        return exercises;
    }

    public void setExercises(List<WorkoutExercise> exercises) {
        this.exercises = exercises;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
