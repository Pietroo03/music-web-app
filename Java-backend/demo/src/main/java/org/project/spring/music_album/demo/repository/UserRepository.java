package org.project.spring.music_album.demo.repository;

import java.util.Optional;

import org.project.spring.music_album.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUsername(String username);
}
