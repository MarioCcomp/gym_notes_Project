package br.com.mario.GymNotes.controller;


import br.com.mario.GymNotes.model.WorkoutRoutine;
import br.com.mario.GymNotes.service.WorkoutRoutineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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
        return ResponseEntity.ok(service.create(routine));
    }

    @PutMapping(path = "/routine/{name}")
    public ResponseEntity<WorkoutRoutine> update(@PathVariable String name, @RequestBody WorkoutRoutine routine) {
        WorkoutRoutine updated = service.update(name, routine);
        if(updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @PutMapping(path = "/routine/name/{id}")
    public ResponseEntity<WorkoutRoutine> updateName(@PathVariable String id, @RequestBody Map<String, String> body) {
        String name = body.get("name");
        WorkoutRoutine updated = service.updateName(id, name);
        if(updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{routineName}/exercises/{exerciseId}")
    public ResponseEntity<WorkoutRoutine> updatePlannedSets(
            @PathVariable String routineName,
            @PathVariable String exerciseId,
            @RequestBody Map<String, Integer> body) {

        Integer plannedSets = body.get("plannedSets");
        WorkoutRoutine updated = service.updatePlannedSets(routineName, exerciseId, plannedSets);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{routineName}/exercises/{exerciseId}")
    public ResponseEntity<WorkoutRoutine> deleteExercise(@PathVariable String routineName, @PathVariable String exerciseId) {
        WorkoutRoutine routine = service.deleteExercise(routineName, exerciseId);
        return ResponseEntity.ok(routine);
    }

    @DeleteMapping("/{routineName}")
    public ResponseEntity<WorkoutRoutine> deleteRoutine(@PathVariable String routineName) {
        service.deleteRoutine(routineName);
        return ResponseEntity.noContent().build();
    }

}
