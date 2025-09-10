package br.com.mario.GymNotes.service;

import br.com.mario.GymNotes.model.User;
import br.com.mario.GymNotes.repository.UserRepository;
import br.com.mario.GymNotes.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public Map<String, String> login(String username, String password) {
        User user  = userRepository.findByUsername(username).orElse(null);

        if(user == null || !passwordEncoder.matches(password, user.getPassword())) {
            return Map.of("type", "error", "message", "Credenciais invalidas");
        }
        String token = jwtUtil.generateToken(username);
        return Map.of("type", "success", "message", "Login efetuado com sucesso" ,"token", token, "nickname", user.getNickname());
    }

    public Map<String, String> register(String username, String nickname, String email, String password) {

        if(userRepository.findByUsername(username).isPresent()) {
            return Map.of("type", "error", "message", "O usuario ja existe");
        }

        User user = new User();
        user.setUsername(username);
        user.setNickname(nickname);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));

        userRepository.save(user);

        return  Map.of("type", "success", "message", "Usuario registrado com sucesso");
    }

}
