package br.com.mario.GymNotes.controller;


import br.com.mario.GymNotes.model.Exercise;
import br.com.mario.GymNotes.model.Muscle;
import br.com.mario.GymNotes.service.ExerciseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api")
public class ExerciseController {


    @Autowired
    private ExerciseService service;

    @GetMapping(path = "/exercises")
    public List<Exercise> findAll() {
        return service.findAll();
    }

    @PostMapping(path = "/exercises/batch")
    public ResponseEntity<List<Exercise>> createExercises(@RequestBody List<Exercise> exercises) {
        List<Exercise> savedExercises = service.saveAll(exercises);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedExercises);
    }
}
