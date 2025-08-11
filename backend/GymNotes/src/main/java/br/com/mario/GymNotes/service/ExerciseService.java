package br.com.mario.GymNotes.service;

import br.com.mario.GymNotes.model.Exercise;
import br.com.mario.GymNotes.repository.ExerciseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExerciseService {

    @Autowired
    private ExerciseRepository repository;

    public List<Exercise> findAll() {
        return repository.findAll();
    }
}
