package org.project.spring.music_album.demo.api;

import java.util.HashSet;
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
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

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

    @Value("${admin.key}")
    private String adminKey;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        if (userRepository.findByUsername(registerRequest.getUsername()).isPresent()) {
            return new ResponseEntity<>("Username già in uso!", HttpStatus.BAD_REQUEST);
        }

        System.out.println("AdminKey ricevuta: " + registerRequest.getAdminKey());
        System.out.println("AdminKey configurata: " + adminKey);

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

        return new ResponseEntity<>("Utente registrato con successo!", HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtTokenProvider.generateToken(userDetails);

        return ResponseEntity.ok().body("Bearer " + token);
    }

}
