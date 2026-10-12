package org.project.spring.music_album.demo.repository;

import java.util.Optional;
import java.time.Instant;

import org.project.spring.music_album.demo.model.AccountActionToken;
import org.project.spring.music_album.demo.model.AccountTokenType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;

import jakarta.persistence.LockModeType;

// Repository per creare, validare e rimuovere token temporanei legati agli account.
public interface AccountActionTokenRepository extends JpaRepository<AccountActionToken, Long> {
    // Il lock impedisce a due richieste concorrenti di consumare contemporaneamente lo stesso token.
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<AccountActionToken> findByTokenHashAndType(String tokenHash, AccountTokenType type);

    // Gli underscore attraversano la relazione token.user per filtrare per utente e tipo di operazione.
    boolean existsByUser_IdAndTypeAndExpiresAtAfter(Integer userId, AccountTokenType type, Instant cutoff);

    void deleteByUser_IdAndType(Integer userId, AccountTokenType type);

    void deleteByUser_Id(Integer userId);
}
