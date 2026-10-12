package org.project.spring.music_album.demo.repository;

import java.util.List;

import org.project.spring.music_album.demo.model.Genere;
import org.springframework.data.jpa.repository.JpaRepository;

// Accesso ai generi: le operazioni CRUD standard sono ereditate da JpaRepository.
public interface GenereRepository extends JpaRepository<Genere, Integer> {
    // Spring interpreta il nome e crea una query che cerca il testo dentro il campo nome.
    List<Genere> findByNomeContainingIgnoreCase(String nome);
}
