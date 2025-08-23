package br.com.mario.GymNotes.model;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "exercises")
public class Exercise {

    @Id
    private String id;

    private String name;

    @DBRef(lazy = false)
    private Muscle targetMuscle;

    public Exercise() {
    }

    public Exercise(String id, String name, Muscle targetMuscle) {
        this.id = id;
        this.name = name;
        this.targetMuscle = targetMuscle;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Muscle getTargetMuscle() {
        return targetMuscle;
    }

    public void setTargetMuscle(Muscle targetMuscle) {
        this.targetMuscle = targetMuscle;
    }
}
