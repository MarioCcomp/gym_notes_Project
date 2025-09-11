package br.com.mario.GymNotes.controller;


import br.com.mario.GymNotes.model.User;
import br.com.mario.GymNotes.repository.UserRepository;
import br.com.mario.GymNotes.security.JwtUtil;
import br.com.mario.GymNotes.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService service;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("register")
    public ResponseEntity<Map<String, String>> register (@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String nickname = request.get("nickname");
        String email = request.get("email");
        String password = request.get("password");

        Map<String, String> response = service.register(username, nickname, email, password);

        if(response.get("type").equals("error")) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(response);

    }

    @PostMapping("login")
    public ResponseEntity<Map<String, String>> login (@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        Map<String, String> response = service.login(username, password);

        if(response.get("type").equals("error")) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);


    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Token não enviado"));
            }

            String token = authHeader.substring(7); // remove "Bearer "
            String username = jwtUtil.validateAndGetUsername(token);

            User user = userRepository.findByUsername(username).orElse(null);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Usuário não encontrado"));
            }

            return ResponseEntity.ok(Map.of(
                    "id", user.getId(),
                    "username", user.getUsername(),
                    "nickname", user.getNickname(),
                    "email", user.getEmail()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Token inválido ou expirado"));
        }
    }

}
