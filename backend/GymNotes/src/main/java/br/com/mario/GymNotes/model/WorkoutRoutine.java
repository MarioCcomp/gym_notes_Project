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
    private List<WorkoutExercise> exercises =  new ArrayList<>();;

    public WorkoutRoutine() {
    }

    public WorkoutRoutine(String id, List<WorkoutExercise> exercises, String name) {
        this.id = id;
        this.exercises = exercises;
        this.name = name;
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
