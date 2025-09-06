package br.com.mario.GymNotes.controller;


import br.com.mario.GymNotes.model.WorkoutRoutine;
import br.com.mario.GymNotes.security.JwtUtil;
import br.com.mario.GymNotes.service.WorkoutRoutineService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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

    @PutMapping(path = "/routine/{name}")
    public ResponseEntity<?> update(HttpServletRequest request, @PathVariable String name, @RequestBody WorkoutRoutine routine) {
        String username = getUserFromToken(request);
        if(username == null) {
            return ResponseEntity.status(401).body("Token invalido ou ausente");
        }
        WorkoutRoutine updated = service.update(name, routine);
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

    @PutMapping("/{routineName}/exercises/{exerciseId}")
    public ResponseEntity<?> updatePlannedSets(
            HttpServletRequest request,
            @PathVariable String routineName,
            @PathVariable String exerciseId,
            @RequestBody Map<String, Integer> body) {

        String username = getUserFromToken(request);
        if (username == null) {
            return ResponseEntity.status(401).body("Token inválido ou ausente");
        }

        Integer plannedSets = body.get("plannedSets");
        WorkoutRoutine updated = service.updatePlannedSets(routineName, exerciseId, plannedSets);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{routineName}/exercises/{exerciseId}")
    public ResponseEntity<?> deleteExercise(HttpServletRequest request, @PathVariable String routineName, @PathVariable String exerciseId) {
        String username = getUserFromToken(request);
        if (username == null) {
            return ResponseEntity.status(401).body("Token inválido ou ausente");
        }

        WorkoutRoutine routine = service.deleteExercise(routineName, exerciseId);
        return ResponseEntity.ok(routine);
    }

    @DeleteMapping("/{routineName}")
    public ResponseEntity<?> deleteRoutine(HttpServletRequest request, @PathVariable String routineName) {
        String username = getUserFromToken(request);
        if (username == null) {
            return ResponseEntity.status(401).body("Token inválido ou ausente");
        }

        service.deleteRoutine(routineName);
        return ResponseEntity.noContent().build();
    }

}
