package org.project.spring.music_album.demo.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.project.spring.music_album.demo.model.AccountActionToken;
import org.project.spring.music_album.demo.model.AccountTokenType;
import org.project.spring.music_album.demo.model.User;
import org.project.spring.music_album.demo.repository.AccountActionTokenRepository;
import org.project.spring.music_album.demo.repository.UserRepository;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@ExtendWith(MockitoExtension.class)
// Test isolati del servizio email: repository, encoder e SMTP sono sostituiti da mock controllabili.
class AccountEmailServiceTest {

    @Mock
    private AccountActionTokenRepository tokenRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @Mock
    private JavaMailSender mailSender;

    private AccountEmailService service;

    @BeforeEach
    // Crea il servizio con URL e mittente di test, senza inviare email reali.
    void setUp() {
        service = new AccountEmailService(tokenRepository, userRepository, passwordEncoder, mailSender,
                "http://localhost:5173", "noreply@example.test");
    }

    @Test
    // La registrazione deve spedire il token originale ma salvare nel DB soltanto l'hash.
    void registrationSendsVerificationLinkAndStoresOnlyTokenHash() {
        User user = user(10, "new@example.test");
        ArgumentCaptor<AccountActionToken> tokenCaptor = ArgumentCaptor.forClass(AccountActionToken.class);
        ArgumentCaptor<SimpleMailMessage> mailCaptor = ArgumentCaptor.forClass(SimpleMailMessage.class);

        service.sendRegistrationVerification(user);

        verify(tokenRepository).save(tokenCaptor.capture());
        verify(mailSender).send(mailCaptor.capture());
        AccountActionToken token = tokenCaptor.getValue();
        String mailBody = mailCaptor.getValue().getText();
        String rawToken = mailBody.substring(mailBody.lastIndexOf("token=") + "token=".length()).trim();

        assertEquals(AccountTokenType.EMAIL_VERIFICATION, token.getType());
        assertEquals(64, token.getTokenHash().length());
        assertNotEquals(rawToken, token.getTokenHash());
        assertTrue(mailBody.contains("/verify-email?token="));
        assertTrue(token.getExpiresAt().isAfter(Instant.now()));
        assertEquals("new@example.test", mailCaptor.getValue().getTo()[0]);
    }

    @Test
    // La verifica normalizza l'email, attiva l'account e invalida il token già usato.
    void verificationActivatesNewAddressAndConsumesToken() {
        User user = user(11, null);
        AccountActionToken token = actionToken(user, AccountTokenType.EMAIL_VERIFICATION,
                "New.User@example.test");
        when(tokenRepository.findByTokenHashAndType(anyString(), eq(AccountTokenType.EMAIL_VERIFICATION)))
                .thenReturn(Optional.of(token));
        when(userRepository.findByEmailIgnoreCase("new.user@example.test")).thenReturn(Optional.empty());

        service.verifyEmail("raw-token");

        assertEquals("new.user@example.test", user.getEmail());
        assertTrue(user.getEmailVerified());
        verify(userRepository).save(user);
        verify(tokenRepository).deleteByUser_IdAndType(11, AccountTokenType.EMAIL_VERIFICATION);
    }

    @Test
    // Il reset salva un nuovo hash password e aumenta la versione usata per revocare i vecchi JWT.
    void resetChangesPasswordAndInvalidatesPriorJwtVersions() {
        User user = user(12, "reset@example.test");
        AccountActionToken token = actionToken(user, AccountTokenType.PASSWORD_RESET, user.getEmail());
        when(tokenRepository.findByTokenHashAndType(anyString(), eq(AccountTokenType.PASSWORD_RESET)))
                .thenReturn(Optional.of(token));
        when(passwordEncoder.encode("a-new-password")).thenReturn("bcrypt-hash");

        service.resetPassword("raw-token", "a-new-password");

        assertEquals("bcrypt-hash", user.getPassword());
        assertEquals(1, user.getTokenVersion());
        verify(userRepository).save(user);
        verify(tokenRepository).deleteByUser_IdAndType(12, AccountTokenType.PASSWORD_RESET);
    }

    @Test
    // Una email sconosciuta non deve produrre un invio né rivelare informazioni sull'account.
    void unknownEmailDoesNotSendRecoveryMail() {
        when(userRepository.findByEmailIgnoreCase("unknown@example.test")).thenReturn(Optional.empty());

        service.requestPasswordReset(" unknown@example.test ");

        verify(mailSender, never()).send(any(SimpleMailMessage.class));
        verify(tokenRepository, never()).save(any(AccountActionToken.class));
    }

    @Test
    // Un token già scaduto deve essere rifiutato prima di cambiare la password.
    void expiredTokensAreRejected() {
        User user = user(13, "expired@example.test");
        AccountActionToken token = actionToken(user, AccountTokenType.PASSWORD_RESET, user.getEmail());
        token.setExpiresAt(Instant.now().minusSeconds(1));
        when(tokenRepository.findByTokenHashAndType(anyString(), eq(AccountTokenType.PASSWORD_RESET)))
                .thenReturn(Optional.of(token));

        org.junit.jupiter.api.Assertions.assertThrows(IllegalArgumentException.class,
                () -> service.resetPassword("raw-token", "a-new-password"));
        assertFalse(Boolean.TRUE.equals(user.getEmailVerified()));
    }

    private static User user(Integer id, String email) {
        // Fixture minima: nei test del servizio bastano ID, username e indirizzo.
        User user = new User();
        user.setId(id);
        user.setUsername("user-" + id);
        user.setEmail(email);
        return user;
    }

    private static AccountActionToken actionToken(User user, AccountTokenType type, String targetEmail) {
        // Costruisce un token valido per i test, lasciando il raw token fuori dalla persistenza simulata.
        AccountActionToken token = new AccountActionToken();
        token.setUser(user);
        token.setTokenHash("a".repeat(64));
        token.setType(type);
        token.setExpiresAt(Instant.now().plusSeconds(300));
        token.setTargetEmail(targetEmail);
        return token;
    }
}
