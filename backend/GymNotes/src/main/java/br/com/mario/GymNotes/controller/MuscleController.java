package br.com.mario.GymNotes.controller;


import br.com.mario.GymNotes.model.Muscle;
import br.com.mario.GymNotes.service.MuscleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping(path = "/muscles")
    public ResponseEntity<Muscle> createMuscle(@RequestBody Muscle muscle) {
        Muscle savedMuscle = service.save(muscle);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedMuscle);
    }

    // Endpoint para criação em lote
    @PostMapping(path = "/muscles/batch")
    public ResponseEntity<List<Muscle>> createMuscles(@RequestBody List<Muscle> muscles) {
        List<Muscle> savedMuscles = service.saveAll(muscles);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedMuscles);
    }
}
