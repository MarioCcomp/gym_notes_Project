package br.com.mario.GymNotes.controller;


import br.com.mario.GymNotes.model.ExerciseData;
import br.com.mario.GymNotes.model.WorkoutRoutine;
import br.com.mario.GymNotes.security.JwtUtil;
import br.com.mario.GymNotes.service.WorkoutRoutineService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

@RestController
@RequestMapping(path = "/api")
public class WorkoutRoutineController {


    @Autowired
    private WorkoutRoutineService service;

    @Autowired
    private JwtUtil jwtUtil;

    private String getUserFromToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if(authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }
        String token = authHeader.substring(7);
        return jwtUtil.validateAndGetUsername(token);
    }

    @GetMapping(path = "/routines")
    public ResponseEntity<?> findAll(HttpServletRequest request) {

        String username = getUserFromToken(request);
        if(username == null) {
            return ResponseEntity.status(401).body("Token invalido ou ausente");
        }

        List<WorkoutRoutine> routines = service.findByOwner(username);
        return ResponseEntity.ok(routines);
    }

    @PostMapping(path = "/routine")
    public ResponseEntity<?> create(HttpServletRequest request, @RequestBody WorkoutRoutine routine) {
        String username = getUserFromToken(request);
        if(username == null) {
            return ResponseEntity.status(401).body("Token invalido ou ausente");
        }
        return ResponseEntity.ok(service.create(routine, username));
    }

    @PutMapping(path = "/routine/{id}")
    public ResponseEntity<?> update(HttpServletRequest request, @PathVariable String id, @RequestBody WorkoutRoutine routine) {
        String username = getUserFromToken(request);
        if(username == null) {
            return ResponseEntity.status(401).body("Token invalido ou ausente");
        }

        AtomicBoolean noSet = new AtomicBoolean(false);
        routine.getExercises().forEach(ex -> {
            if(ex.getPlannedSets() == null) {
                noSet.set(true);
            }
        });

        if(noSet.get()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Coloque pelo menos uma série", "type", "info"));
        }

        WorkoutRoutine updated = service.update(id, routine);
        if(updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @PutMapping(path = "/routine/name/{id}")
    public ResponseEntity<?> updateName(HttpServletRequest request, @PathVariable String id, @RequestBody Map<String, String> body) {
        String username = getUserFromToken(request);
        if (username == null) {
            return ResponseEntity.status(401).body("Token inválido ou ausente");
        }


        String name = body.get("name");
        WorkoutRoutine updated = service.updateName(id, name);
        if(updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{routineId}/exercises/{exerciseId}")
    public ResponseEntity<?> updatePlannedSets(
            HttpServletRequest request,
            @PathVariable String routineId,
            @PathVariable String exerciseId,
            @RequestBody Map<String, Integer> body) {

        String username = getUserFromToken(request);
        if (username == null) {
            return ResponseEntity.status(401).body("Token inválido ou ausente");
        }


        Integer plannedSets = body.get("plannedSets");
        if(plannedSets < 1) {
            return ResponseEntity.badRequest().body(Map.of("message", "Coloque ao menos uma série", "type", "info"));
        }
        WorkoutRoutine updated = service.updatePlannedSets(routineId, exerciseId, plannedSets);

        if(updated == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Você já possui esse número de séries", "type", "info"));
        }

        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{routineId}/exercises/{exerciseId}")
    public ResponseEntity<?> deleteExercise(HttpServletRequest request, @PathVariable String routineId, @PathVariable String exerciseId) {
        String username = getUserFromToken(request);
        if (username == null) {
            return ResponseEntity.status(401).body("Token inválido ou ausente");
        }

        WorkoutRoutine routine = service.deleteExercise(routineId, exerciseId);
        return ResponseEntity.ok(routine);
    }

    @DeleteMapping("/{routineId}")
    public ResponseEntity<?> deleteRoutine(HttpServletRequest request, @PathVariable String routineId) {
        String username = getUserFromToken(request);
        if (username == null) {
            return ResponseEntity.status(401).body("Token inválido ou ausente");
        }

        service.deleteRoutine(routineId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{routineId}/exercises/{exerciseId}")
    public ResponseEntity<?> getData(HttpServletRequest request, @PathVariable String routineId, @PathVariable String exerciseId) {
        String username = getUserFromToken(request);
        if (username == null) {
            return ResponseEntity.status(401).body("Token inválido ou ausente");
        }

        ExerciseData data = service.getData(routineId,exerciseId);
        return ResponseEntity.ok(data);
    }

}
