package br.com.mario.GymNotes.controller;


import br.com.mario.GymNotes.model.Exercise;
import br.com.mario.GymNotes.service.ExerciseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
