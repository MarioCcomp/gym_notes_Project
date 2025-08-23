package br.com.mario.GymNotes.repository;

import br.com.mario.GymNotes.model.Muscle;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MuscleRepository extends MongoRepository<Muscle, String> {
}
