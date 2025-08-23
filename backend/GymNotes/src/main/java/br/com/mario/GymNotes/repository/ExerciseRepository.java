package br.com.mario.GymNotes.repository;

import br.com.mario.GymNotes.model.Exercise;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ExerciseRepository extends MongoRepository<Exercise, String> {
}
