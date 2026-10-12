package org.project.spring.music_album.demo.repository;

import java.util.List;

import org.project.spring.music_album.demo.model.Artista;
import org.springframework.data.jpa.repository.JpaRepository;

// JpaRepository fornisce findAll/save/deleteById; il metodo seguente aggiunge la ricerca per alias.
public interface ArtistaRepository extends JpaRepository<Artista, Integer> {
    // La ricerca contiene il testo indicato e non distingue lettere maiuscole da minuscole.
    List<Artista> findByAliasContainingIgnoreCase(String alias);
}
