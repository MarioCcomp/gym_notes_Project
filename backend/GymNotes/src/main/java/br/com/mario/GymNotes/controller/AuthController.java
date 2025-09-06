package br.com.mario.GymNotes.controller;


import br.com.mario.GymNotes.model.User;
import br.com.mario.GymNotes.repository.UserRepository;
import br.com.mario.GymNotes.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("register")
    public Map<String, String> register (@RequestBody Map<String, String> request) {
        String username = request.get("username");

        if(userRepository.findByUsername(username).isPresent()) {
            return Map.of("error", "O usuario ja existe");
        }

        String nickname = request.get("nickname");
        String email = request.get("email");
        String password = request.get("password");

        User user = new User();
        user.setUsername(username);
        user.setNickname(nickname);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));

        userRepository.save(user);

        return Map.of("sucesso", "Usuario registrado com sucesso");
    }

    @PostMapping("login")
    public Map<String, String> login (@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        User user  = userRepository.findByUsername(username).orElse(null);

        if(user == null || !passwordEncoder.matches(password, user.getPassword())) {
            return Map.of("error", "Credenciais invalidas");
        }
        String token = jwtUtil.generateToken(username);
        return Map.of("token", token);
    }
}
