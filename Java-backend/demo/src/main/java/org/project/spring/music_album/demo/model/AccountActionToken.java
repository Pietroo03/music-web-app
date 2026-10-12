package org.project.spring.music_album.demo.model;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

// Token temporanei per verifica email, recupero password e conferma eliminazione account.
@Entity
@Table(name = "account_action_tokens")
public class AccountActionToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Ogni token appartiene a un solo utente; LAZY evita di caricare l'utente se non serve.
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Si salva l'hash del token, non il token utilizzabile presente nel link inviato via email.
    @Column(nullable = false, unique = true, length = 64)
    private String tokenHash;

    // Il nome leggibile dell'enum è memorizzato nel database, invece del suo indice numerico.
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private AccountTokenType type;

    @Column(nullable = false)
    private Instant expiresAt;

    @Column(length = 254)
    private String targetEmail;

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getTokenHash() {
        return tokenHash;
    }

    public void setTokenHash(String tokenHash) {
        this.tokenHash = tokenHash;
    }

    public AccountTokenType getType() {
        return type;
    }

    public void setType(AccountTokenType type) {
        this.type = type;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }

    public String getTargetEmail() {
        return targetEmail;
    }

    public void setTargetEmail(String targetEmail) {
        this.targetEmail = targetEmail;
    }
}
