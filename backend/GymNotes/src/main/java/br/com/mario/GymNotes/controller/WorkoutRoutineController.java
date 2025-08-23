package br.com.mario.GymNotes.controller;


import br.com.mario.GymNotes.model.WorkoutRoutine;
import br.com.mario.GymNotes.service.WorkoutRoutineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/routine")
public class WorkoutRoutineController {


    @Autowired
    private WorkoutRoutineService service;

    @GetMapping()
    public List<WorkoutRoutine> findAll() {
        return service.findAll();
    }

    @PostMapping()
    public ResponseEntity<WorkoutRoutine> create(@RequestBody WorkoutRoutine routine) {
        service.create(routine);
        return ResponseEntity.ok().build();
    }

    @PutMapping(path = "/{id}")
    public ResponseEntity<WorkoutRoutine> update(@PathVariable String id, @RequestBody WorkoutRoutine routine) {
        WorkoutRoutine updated = service.update(id, routine);
        if(updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

}
