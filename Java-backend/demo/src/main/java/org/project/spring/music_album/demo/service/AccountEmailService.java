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
public class AccountEmailService {

    private static final long EMAIL_TOKEN_MINUTES = 24 * 60;
    private static final long RESET_TOKEN_MINUTES = 30;

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
    public void sendRegistrationVerification(User user) {
        issueEmailVerification(user, normalizeEmail(user.getEmail()));
    }

    @Transactional
    public void requestEmailVerification(String username, String requestedEmail) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Account non trovato"));
        if (Boolean.TRUE.equals(user.getEmailVerified())) {
            throw new IllegalStateException("L'indirizzo email è già verificato");
        }

        issueEmailVerification(user, normalizeEmail(requestedEmail));
    }

    private void issueEmailVerification(User user, String targetEmail) {
        ensureEmailAvailable(targetEmail, user.getId());
        issueToken(user, targetEmail, AccountTokenType.EMAIL_VERIFICATION,
                EMAIL_TOKEN_MINUTES, "/verify-email?token=");
    }

    @Transactional
    public void resendEmailVerification(String email) {
        userRepository.findByEmailIgnoreCase(normalizeEmail(email))
                .filter(user -> !Boolean.TRUE.equals(user.getEmailVerified()))
                .ifPresent(user -> issueEmailVerification(user, normalizeEmail(user.getEmail())));
    }

    @Transactional
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
    public void requestPasswordReset(String email) {
        userRepository.findByEmailIgnoreCase(normalizeEmail(email))
                .filter(user -> Boolean.TRUE.equals(user.getEmailVerified()))
                .ifPresent(user -> issueToken(user, user.getEmail(), AccountTokenType.PASSWORD_RESET,
                        RESET_TOKEN_MINUTES, "/reset-password?token="));
    }

    @Transactional
    public void resetPassword(String rawToken, String newPassword) {
        AccountActionToken token = findValidToken(rawToken, AccountTokenType.PASSWORD_RESET);
        User user = token.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setTokenVersion((user.getTokenVersion() == null ? 0 : user.getTokenVersion()) + 1);
        userRepository.save(user);
        tokenRepository.deleteByUser_IdAndType(user.getId(), AccountTokenType.PASSWORD_RESET);
    }

    private void issueToken(User user, String targetEmail, AccountTokenType type, long lifetimeMinutes,
            String pathAndQuery) {
        Instant now = Instant.now();
        Instant resendCutoff = now.plus(lifetimeMinutes - 1, ChronoUnit.MINUTES);
        if (tokenRepository.existsByUser_IdAndTypeAndExpiresAtAfter(user.getId(), type, resendCutoff)) {
            return;
        }
        tokenRepository.deleteByUser_IdAndType(user.getId(), type);

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

        String link = frontendBaseUrl + pathAndQuery + rawToken;
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(mailFrom);
        message.setTo(targetEmail);
        message.setSubject(type == AccountTokenType.EMAIL_VERIFICATION
                ? "Verifica il tuo indirizzo email"
                : "Reimposta la password");
        message.setText(type == AccountTokenType.EMAIL_VERIFICATION
                ? "Per verificare il tuo indirizzo email, apri questo link (valido 24 ore):\n\n" + link
                : "Per reimpostare la password, apri questo link (valido 30 minuti):\n\n" + link
                        + "\n\nSe non hai richiesto il reset, ignora questa email.");
        mailSender.send(message);
    }

    private AccountActionToken findValidToken(String rawToken, AccountTokenType type) {
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
        userRepository.findByEmailIgnoreCase(email)
                .filter(existing -> !existing.getId().equals(currentUserId))
                .ifPresent(existing -> {
                    throw new IllegalArgumentException("Indirizzo email già in uso");
                });
    }

    private static String normalizeEmail(String email) {
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
