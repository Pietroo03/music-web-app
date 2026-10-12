package org.project.spring.music_album.demo.repository;

import org.project.spring.music_album.demo.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

// Repository dei ruoli; Optional rappresenta il caso in cui il ruolo richiesto non esista.
public interface RoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findByNome(String nome);
}
