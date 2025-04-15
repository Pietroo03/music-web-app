package org.project.spring.music_album.demo.repository;

import java.util.List;

import org.project.spring.music_album.demo.model.Album;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlbumRepository extends JpaRepository<Album, Integer> {

    List<Album> findByNomeContainingIgnoreCase(String nome);

    List<Album> findAllByOrderByArtista_IdAscDataPubblicazioneAsc();
}
