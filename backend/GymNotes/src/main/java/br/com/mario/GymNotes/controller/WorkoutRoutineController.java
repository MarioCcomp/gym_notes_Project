package br.com.mario.GymNotes.controller;


import br.com.mario.GymNotes.model.WorkoutRoutine;
import br.com.mario.GymNotes.service.WorkoutRoutineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api")
public class WorkoutRoutineController {


    @Autowired
    private WorkoutRoutineService service;

    @GetMapping(path = "/routines")
    public List<WorkoutRoutine> findAll() {
        return service.findAll();
    }

    @PostMapping(path = "/routine")
    public ResponseEntity<WorkoutRoutine> create(@RequestBody WorkoutRoutine routine) {
        service.create(routine);
        return ResponseEntity.ok().build();
    }

    @PutMapping(path = "/routine/{name}")
    public ResponseEntity<WorkoutRoutine> update(@PathVariable String name, @RequestBody WorkoutRoutine routine) {
        WorkoutRoutine updated = service.update(name, routine);
        if(updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

}
