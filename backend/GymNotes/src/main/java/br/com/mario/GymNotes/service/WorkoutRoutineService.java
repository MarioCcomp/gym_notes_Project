package br.com.mario.GymNotes.service;

import br.com.mario.GymNotes.model.Exercise;
import br.com.mario.GymNotes.model.WorkoutRoutine;
import br.com.mario.GymNotes.repository.ExerciseRepository;
import br.com.mario.GymNotes.repository.WorkoutRoutineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public void create(WorkoutRoutine routine) {
        repository.save(routine);
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
}
