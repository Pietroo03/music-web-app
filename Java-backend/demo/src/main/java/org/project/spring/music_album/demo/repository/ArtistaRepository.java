package org.project.spring.music_album.demo.repository;

import java.util.List;

import org.project.spring.music_album.demo.model.Artista;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArtistaRepository extends JpaRepository<Artista, Integer> {
    List<Artista> findByAliasContainingIgnoreCase(String alias);
}
