package br.com.mario.GymNotes.repository;

import br.com.mario.GymNotes.model.WorkoutRoutine;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface WorkoutRoutineRepository extends MongoRepository<WorkoutRoutine, String> {
}
