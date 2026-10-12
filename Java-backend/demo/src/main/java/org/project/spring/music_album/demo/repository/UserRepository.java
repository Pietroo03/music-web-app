package org.project.spring.music_album.demo.repository;

import java.util.Optional;

import org.project.spring.music_album.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

// Accesso agli account. Le firme findBy... sono query derivate automaticamente da Spring Data.
public interface UserRepository extends JpaRepository<User, Integer> {
    // Username è usato dal login e per associare la richiesta autenticata al profilo corretto.
    Optional<User> findByUsername(String username);

    // IgnoreCase evita duplicati che differiscono soltanto per maiuscole/minuscole nell'email.
    Optional<User> findByEmailIgnoreCase(String email);
}
