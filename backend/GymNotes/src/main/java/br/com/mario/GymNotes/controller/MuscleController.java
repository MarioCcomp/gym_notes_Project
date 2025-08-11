package br.com.mario.GymNotes.controller;


import br.com.mario.GymNotes.model.Muscle;
import br.com.mario.GymNotes.service.MuscleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController()
@RequestMapping(path = "/api")
public class MuscleController {

    @Autowired
    private MuscleService service;

    @GetMapping(path = "/muscles")
    public List<Muscle> findAll() {
        return service.findAll();
    }
}
