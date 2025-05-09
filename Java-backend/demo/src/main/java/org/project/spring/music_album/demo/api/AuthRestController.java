package org.project.spring.music_album.demo.api;

import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.project.spring.music_album.demo.config.JwtTokenProvider;
import org.project.spring.music_album.demo.dto.LoginRequest;
import org.project.spring.music_album.demo.dto.RegisterRequest;
import org.project.spring.music_album.demo.model.Role;
import org.project.spring.music_album.demo.model.User;
import org.project.spring.music_album.demo.repository.RoleRepository;
import org.project.spring.music_album.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthRestController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Value("${admin.key}")
    private String adminKey;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        if (userRepository.findByUsername(registerRequest.getUsername()).isPresent()) {
            return new ResponseEntity<>("Username già in uso!", HttpStatus.BAD_REQUEST);
        }

        System.out.println("AdminKey ricevuta: " + registerRequest.getAdminKey());

        // Crea un nuovo utente
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

        // Imposta il ruolo per l'utente (es. USER)
        Role role;
        if (registerRequest.getAdminKey() != null && registerRequest.getAdminKey().equals(adminKey)) {
            role = roleRepository.findByNome("ADMIN")
                    .orElseThrow(() -> new RuntimeException("Ruolo ADMIN non trovato"));
        } else {
            role = roleRepository.findByNome("USER")
                    .orElseThrow(() -> new RuntimeException("Ruolo USER non trovato"));
        }

        Set<Role> roles = new HashSet<>();
        roles.add(role);
        user.setRoles(roles);

        // Salva l'utente nel database
        userRepository.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        String token = jwtTokenProvider.generateToken(userDetails);

        // Restituisci sia il messaggio di successo che il token
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Utente registrato con successo!");
        response.put("token", token);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);

    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            // Tenta di autenticare con username e password
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtTokenProvider.generateToken(userDetails);

            Map<String, String> response = new HashMap<>();
            response.put("token", token);

            return ResponseEntity.ok().body(response);

        } catch (BadCredentialsException e) {
            // Controlla se l'errore è dovuto a username o password errata
            String username = loginRequest.getUsername();

            // Verifica se l'username esiste
            Optional<User> userOptional = userRepository.findByUsername(username);
            if (userOptional.isEmpty()) {
                // Se l'username non esiste, restituisci un errore per username
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Collections.singletonMap("error", "Username non valido"));
            } else {
                // Se l'username esiste ma la password è errata, restituisci un errore per
                // password
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Collections.singletonMap("error", "Password errata"));
            }
        }
    }

}
