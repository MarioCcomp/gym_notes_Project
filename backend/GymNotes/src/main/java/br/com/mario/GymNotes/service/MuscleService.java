package br.com.mario.GymNotes.service;


import br.com.mario.GymNotes.model.Muscle;
import br.com.mario.GymNotes.repository.MuscleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MuscleService {

    @Autowired
    private MuscleRepository repository;

    public List<Muscle> findAll() {
        return repository.findAll();
    }
}
