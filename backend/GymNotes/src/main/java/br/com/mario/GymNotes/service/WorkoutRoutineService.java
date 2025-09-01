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

    public WorkoutRoutine create(WorkoutRoutine routine) {
        return repository.save(routine);
    }

    public WorkoutRoutine update(String name, WorkoutRoutine routine) {
        return repository.findByName(name).map(existing -> {
            routine.getExercises().forEach(wEx -> {
                Exercise fullExercise = exerciseRepository.findById(wEx.getExercise().getId()).orElseThrow(() -> new RuntimeException("Exercise not found"));
                wEx.setExercise(fullExercise);
            });
            routine.setId(existing.getId());
            return repository.save(routine);
        }).orElse(null);
    }

    public WorkoutRoutine updatePlannedSets(String routineName, String exerciseId, int newPlannedSets) {
        WorkoutRoutine routine = repository.findByName(routineName)
                .orElseThrow(() -> new RuntimeException("Routine not found"));

        routine.getExercises().forEach(ex -> {
            if (ex.getExercise().getId().equals(exerciseId)) {
                ex.setPlannedSets(newPlannedSets);
            }
        });

        return repository.save(routine);
    }

    public WorkoutRoutine deleteExercise(String routineName, String exerciseId) {
        WorkoutRoutine routine = repository.findByName(routineName).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Routine not found"));

        System.out.println(routine.getId());

        routine.getExercises().forEach(exercise -> System.out.println(exercise.getExercise().getId()));

        boolean removed = routine.getExercises().removeIf((exercise) -> exercise.getExercise().getId().equals(exerciseId));
        if(!removed) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Exercise not found in routine");
        }
        return repository.save(routine);
    }

    public void deleteRoutine(String routineName) {
        repository.deleteByName(routineName).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Routine not found"));
    }

    public WorkoutRoutine updateName(String id, String name) {
        WorkoutRoutine routine = repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Routine not found"));
        routine.setName(name);

        return repository.save(routine);

    }
}
