package org.project.spring.music_album.demo.repository;

import java.util.List;

import org.project.spring.music_album.demo.model.Album;
import org.springframework.data.jpa.repository.JpaRepository;

// Spring genera le operazioni CRUD e interpreta i nomi dei metodi come query sui campi dell'entità.
public interface AlbumRepository extends JpaRepository<Album, Integer> {

    // Cerca una frase nel nome ignorando maiuscole/minuscole; il parametro viene legato in modo sicuro.
    List<Album> findByNomeContainingIgnoreCase(String nome);

    // Ordina per ID artista e poi per data, attraversando la relazione Album.artista.
    List<Album> findAllByOrderByArtista_IdAscDataPubblicazioneAsc();
}
