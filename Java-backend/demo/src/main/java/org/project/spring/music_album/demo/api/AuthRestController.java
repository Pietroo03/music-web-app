package org.project.spring.music_album.demo.api;

import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

import org.project.spring.music_album.demo.config.JwtTokenProvider;
import org.project.spring.music_album.demo.dto.EmailRequest;
import org.project.spring.music_album.demo.dto.LoginRequest;
import org.project.spring.music_album.demo.dto.PasswordResetRequest;
import org.project.spring.music_album.demo.dto.RegisterRequest;
import org.project.spring.music_album.demo.dto.TokenRequest;
import org.project.spring.music_album.demo.model.Role;
import org.project.spring.music_album.demo.model.User;
import org.project.spring.music_album.demo.repository.RoleRepository;
import org.project.spring.music_album.demo.repository.UserRepository;
import org.project.spring.music_album.demo.service.AccountEmailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.transaction.annotation.Transactional;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthRestController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final String adminKey;
    private final AccountEmailService accountEmailService;

    public AuthRestController(
            UserRepository userRepository,
            RoleRepository roleRepository,
            BCryptPasswordEncoder passwordEncoder,
            JwtTokenProvider jwtTokenProvider,
            AuthenticationManager authenticationManager,
            @Value("${admin.key}") String adminKey,
            AccountEmailService accountEmailService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.authenticationManager = authenticationManager;
        this.adminKey = adminKey;
        this.accountEmailService = accountEmailService;
    }

    @PostMapping("/register")
    @Transactional
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        if (userRepository.findByUsername(registerRequest.getUsername()).isPresent()) {
            return new ResponseEntity<>("Nome utente o email già in uso!", HttpStatus.BAD_REQUEST);
        }
        String email = registerRequest.getEmail().trim().toLowerCase(Locale.ROOT);
        if (userRepository.findByEmailIgnoreCase(email).isPresent()) {
            return new ResponseEntity<>("Nome utente o email già in uso!", HttpStatus.BAD_REQUEST);
        }

        // Crea un nuovo utente
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setEmail(email);
        user.setEmailVerified(false);

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

        accountEmailService.sendRegistrationVerification(user);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Registrazione completata. Controlla la tua email per attivare l'account.");

        return ResponseEntity.status(HttpStatus.CREATED).body(response);

    }

    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@Valid @RequestBody TokenRequest request) {
        try {
            accountEmailService.verifyEmail(request.getToken());
            return ResponseEntity.ok(Collections.singletonMap("message", "Email verificata. Ora puoi accedere."));
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", exception.getMessage()));
        }
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerification(@Valid @RequestBody EmailRequest request) {
        accountEmailService.resendEmailVerification(request.getEmail());
        return ResponseEntity.accepted().body(Collections.singletonMap("message",
                "Se l'account richiede la verifica, riceverai un'email a breve."));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody EmailRequest request) {
        accountEmailService.requestPasswordReset(request.getEmail());
        return ResponseEntity.accepted().body(Collections.singletonMap("message",
                "Se l'indirizzo è registrato e verificato, riceverai un link per reimpostare la password."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody PasswordResetRequest request) {
        try {
            accountEmailService.resetPassword(request.getToken(), request.getPassword());
            return ResponseEntity.ok(Collections.singletonMap("message", "Password aggiornata. Ora puoi accedere."));
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", exception.getMessage()));
        }
    }

    @PostMapping("/email-verification")
    public ResponseEntity<?> requestEmailVerification(Authentication authentication,
            @Valid @RequestBody EmailRequest request) {
        try {
            accountEmailService.requestEmailVerification(authentication.getName(), request.getEmail());
            return ResponseEntity.accepted().body(Collections.singletonMap("message",
                    "Se l'account può aggiungere un indirizzo, riceverai un link di verifica."));
        } catch (IllegalArgumentException | IllegalStateException exception) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", exception.getMessage()));
        }
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

        } catch (DisabledException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Collections.singletonMap("error", "Verifica il tuo indirizzo email prima di accedere."));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("error", "Username o password non validi"));
        }
    }

}
