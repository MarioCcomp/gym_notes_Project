package br.com.mario.GymNotes.service;

import br.com.mario.GymNotes.model.Exercise;
import br.com.mario.GymNotes.model.WorkoutExercise;
import br.com.mario.GymNotes.model.WorkoutRoutine;
import br.com.mario.GymNotes.repository.ExerciseRepository;
import br.com.mario.GymNotes.repository.WorkoutRoutineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class WorkoutRoutineService {


    @Autowired
    private WorkoutRoutineRepository repository;


    @Autowired
    private ExerciseRepository exerciseRepository;

    public List<WorkoutRoutine> findAll() {
        return repository.findAll();
    }

    public WorkoutRoutine create(WorkoutRoutine routine, String username) {
        routine.setOwnerUsername(username);
        return repository.save(routine);
    }

    public WorkoutRoutine update(String id, WorkoutRoutine routine) {
        return repository.findById(id).map(existing -> {
            routine.getExercises().forEach(wEx -> {
                Exercise fullExercise = exerciseRepository.findById(wEx.getExercise().getId()).orElseThrow(() -> new RuntimeException("Exercise not found"));
                wEx.setExercise(fullExercise);
            });
            routine.setId(id);
            return repository.save(routine);
        }).orElse(null);
    }

    public WorkoutRoutine updatePlannedSets(String routineId, String exerciseId, int newPlannedSets) {
        WorkoutRoutine routine = repository.findById(routineId)
                .orElseThrow(() -> new RuntimeException("Routine not found"));

        routine.getExercises().forEach(ex -> {
            if (ex.getExercise().getId().equals(exerciseId)) {
                ex.setPlannedSets(newPlannedSets);
            }
        });

        return repository.save(routine);
    }

    public WorkoutRoutine deleteExercise(String routineId, String exerciseId) {
        WorkoutRoutine routine = repository.findById(routineId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Routine not found"));

        routine.getExercises().forEach(exercise -> System.out.println(exercise.getExercise().getId()));

        boolean removed = routine.getExercises().removeIf((exercise) -> exercise.getExercise().getId().equals(exerciseId));
        if(!removed) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Exercise not found in routine");
        }
        return repository.save(routine);
    }

    public void deleteRoutine(String routineId) {
        repository.deleteById(routineId);
    }

    public WorkoutRoutine updateName(String id, String name) {
        WorkoutRoutine routine = repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Routine not found"));
        routine.setName(name);

        return repository.save(routine);

    }

    public List<WorkoutRoutine> findByOwner(String username) {
        return repository.findByOwnerUsername(username);
    }
}
