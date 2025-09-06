package br.com.mario.GymNotes.repository;

import br.com.mario.GymNotes.model.WorkoutRoutine;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface WorkoutRoutineRepository extends MongoRepository<WorkoutRoutine, String> {
    Optional<WorkoutRoutine> findByName(String name);
    Optional<WorkoutRoutine> deleteByName(String name);
    List<WorkoutRoutine> findByOwnerUsername(String ownerUsername);
}
