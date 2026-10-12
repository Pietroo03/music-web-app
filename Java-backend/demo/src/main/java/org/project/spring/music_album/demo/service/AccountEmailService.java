package org.project.spring.music_album.demo.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Locale;
import java.util.Optional;

import org.project.spring.music_album.demo.model.AccountActionToken;
import org.project.spring.music_album.demo.model.AccountTokenType;
import org.project.spring.music_album.demo.model.User;
import org.project.spring.music_album.demo.repository.AccountActionTokenRepository;
import org.project.spring.music_album.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
// Gestisce i link email di verifica, recupero password ed eliminazione account.
public class AccountEmailService {

    // Ogni tipo di azione ha una durata distinta, espressa in minuti.
    private static final long EMAIL_TOKEN_MINUTES = 24 * 60;
    private static final long RESET_TOKEN_MINUTES = 30;
    private static final long DELETE_TOKEN_MINUTES = 15;

    private final AccountActionTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;
    private final String frontendBaseUrl;
    private final String mailFrom;
    private final SecureRandom secureRandom = new SecureRandom();

    public AccountEmailService(
            AccountActionTokenRepository tokenRepository,
            UserRepository userRepository,
            BCryptPasswordEncoder passwordEncoder,
            JavaMailSender mailSender,
            @Value("${app.frontend-base-url:http://localhost:5173}") String frontendBaseUrl,
            @Value("${app.mail.from:noreply@localhost}") String mailFrom) {
        this.tokenRepository = tokenRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailSender = mailSender;
        this.frontendBaseUrl = frontendBaseUrl.replaceAll("/$", "");
        this.mailFrom = mailFrom;
    }

    @Transactional
    // Inizia la verifica dell'indirizzo inserito in fase di registrazione.
    public void sendRegistrationVerification(User user) {
        issueEmailVerification(user, normalizeEmail(user.getEmail()));
    }

    private void issueEmailVerification(User user, String targetEmail) {
        // Se l'utente cambia indirizzo, il servizio verifica prima che non appartenga già a un altro account.
        ensureEmailAvailable(targetEmail, user.getId());
        issueToken(user, targetEmail, AccountTokenType.EMAIL_VERIFICATION,
                EMAIL_TOKEN_MINUTES, "/verify-email?token=");
    }

    @Transactional
    // Invia nuovamente il link solo se l'account esiste e non è già verificato.
    public void resendEmailVerification(String email) {
        userRepository.findByEmailIgnoreCase(normalizeEmail(email))
                .filter(user -> !Boolean.TRUE.equals(user.getEmailVerified()))
                .ifPresent(user -> issueEmailVerification(user, normalizeEmail(user.getEmail())));
    }

    @Transactional
    // Applica l'indirizzo verificato e poi rimuove i token di verifica ormai inutili.
    public void verifyEmail(String rawToken) {
        AccountActionToken token = findValidToken(rawToken, AccountTokenType.EMAIL_VERIFICATION);
        User user = token.getUser();
        String targetEmail = normalizeEmail(token.getTargetEmail());
        ensureEmailAvailable(targetEmail, user.getId());

        user.setEmail(targetEmail);
        user.setEmailVerified(true);
        userRepository.save(user);
        tokenRepository.deleteByUser_IdAndType(user.getId(), AccountTokenType.EMAIL_VERIFICATION);
    }

    @Transactional
    // Per privacy la richiesta non genera errore se l'email non è registrata o verificata.
    public void requestPasswordReset(String email) {
        userRepository.findByEmailIgnoreCase(normalizeEmail(email))
                .filter(user -> Boolean.TRUE.equals(user.getEmailVerified()))
                .ifPresent(user -> issueToken(user, user.getEmail(), AccountTokenType.PASSWORD_RESET,
                        RESET_TOKEN_MINUTES, "/reset-password?token="));
    }

    @Transactional
    // Imposta la nuova password e incrementa la versione per rendere obsoleti i vecchi JWT.
    public void resetPassword(String rawToken, String newPassword) {
        AccountActionToken token = findValidToken(rawToken, AccountTokenType.PASSWORD_RESET);
        User user = token.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setTokenVersion((user.getTokenVersion() == null ? 0 : user.getTokenVersion()) + 1);
        userRepository.save(user);
        tokenRepository.deleteByUser_IdAndType(user.getId(), AccountTokenType.PASSWORD_RESET);
    }

    @Transactional
    // Richiede la password attuale e un'email verificata prima di inviare il link di conferma.
    public void requestAccountDeletion(String username, String currentPassword) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Account non trovato"));
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("La password attuale non è corretta");
        }
        if (!Boolean.TRUE.equals(user.getEmailVerified()) || user.getEmail() == null || user.getEmail().isBlank()) {
            throw new IllegalStateException("Verifica prima un indirizzo email per poter eliminare l'account");
        }

        issueToken(user, user.getEmail(), AccountTokenType.ACCOUNT_DELETION,
                DELETE_TOKEN_MINUTES, "/delete-account?token=");
    }

    @Transactional
    // Consuma il token e rimuove l'utente; la transazione mantiene atomica l'operazione.
    public void confirmAccountDeletion(String rawToken) {
        AccountActionToken token = findValidToken(rawToken, AccountTokenType.ACCOUNT_DELETION);
        User user = token.getUser();
        tokenRepository.deleteByUser_Id(user.getId());
        userRepository.delete(user);
    }

    private void issueToken(User user, String targetEmail, AccountTokenType type, long lifetimeMinutes,
            String pathAndQuery) {
        Instant now = Instant.now();
        // Evita invii ripetuti a raffica: un token quasi nuovo è già valido e non serve crearne un altro.
        Instant resendCutoff = now.plus(lifetimeMinutes - 1, ChronoUnit.MINUTES);
        if (tokenRepository.existsByUser_IdAndTypeAndExpiresAtAfter(user.getId(), type, resendCutoff)) {
            return;
        }
        tokenRepository.deleteByUser_IdAndType(user.getId(), type);

        // Il token casuale viene mostrato soltanto nel link; nel database si conserva solo il suo hash.
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        String rawToken = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

        AccountActionToken token = new AccountActionToken();
        token.setUser(user);
        token.setTokenHash(hashToken(rawToken));
        token.setType(type);
        token.setExpiresAt(now.plus(lifetimeMinutes, ChronoUnit.MINUTES));
        token.setTargetEmail(targetEmail);
        tokenRepository.save(token);

        // Il percorso dipende dal tipo di azione, mentre host e porta arrivano dalla configurazione.
        String link = frontendBaseUrl + pathAndQuery + rawToken;
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(mailFrom);
        message.setTo(targetEmail);
        message.setSubject(switch (type) {
            case EMAIL_VERIFICATION -> "Verifica il tuo indirizzo email";
            case PASSWORD_RESET -> "Reimposta la password";
            case ACCOUNT_DELETION -> "Conferma l'eliminazione del tuo account";
        });
        message.setText(switch (type) {
            case EMAIL_VERIFICATION -> "Per verificare il tuo indirizzo email, apri questo link (valido 24 ore):\n\n"
                    + link;
            case PASSWORD_RESET -> "Per reimpostare la password, apri questo link (valido 30 minuti):\n\n" + link
                    + "\n\nSe non hai richiesto il reset, ignora questa email.";
            case ACCOUNT_DELETION -> "Per eliminare definitivamente il tuo account, apri il link e conferma "
                    + "l'operazione (valido 15 minuti):\n\n" + link
                    + "\n\nSe non hai richiesto l'eliminazione, ignora questa email.";
        });
        mailSender.send(message);
    }

    private AccountActionToken findValidToken(String rawToken, AccountTokenType type) {
        // L'hash e il tipo identificano il token; la stessa stringa non può valere per azioni diverse.
        if (rawToken == null || rawToken.isBlank()) {
            throw new IllegalArgumentException("Token non valido o scaduto");
        }
        Optional<AccountActionToken> token = tokenRepository.findByTokenHashAndType(hashToken(rawToken), type);
        AccountActionToken value = token.orElseThrow(() -> new IllegalArgumentException("Token non valido o scaduto"));
        if (!value.getExpiresAt().isAfter(Instant.now())) {
            tokenRepository.delete(value);
            throw new IllegalArgumentException("Token non valido o scaduto");
        }
        return value;
    }

    private void ensureEmailAvailable(String email, Integer currentUserId) {
        // In una verifica si esclude l'utente stesso, ma non si può riutilizzare l'indirizzo di un altro account.
        userRepository.findByEmailIgnoreCase(email)
                .filter(existing -> !existing.getId().equals(currentUserId))
                .ifPresent(existing -> {
                    throw new IllegalArgumentException("Indirizzo email già in uso");
                });
    }

    private static String normalizeEmail(String email) {
        // Email confrontate senza differenze di maiuscole o spazi accidentali.
        return email == null ? "" : email.trim().toLowerCase(Locale.ROOT);
    }

    private static String hashToken(String rawToken) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                    .digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 non disponibile", exception);
        }
    }
}
