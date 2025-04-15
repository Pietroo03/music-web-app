package org.project.spring.music_album.demo.service;

import java.util.List;
import java.util.Optional;

import org.project.spring.music_album.demo.model.Album;
import org.project.spring.music_album.demo.repository.AlbumRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class AlbumService {

    @Autowired
    private AlbumRepository albumRepository;

    public List<Album> findAll() {
        return albumRepository.findAllByOrderByArtista_IdAscDataPubblicazioneAsc();
    }

    public List<Album> findAllSortedByName() {
        return albumRepository.findAll(Sort.by("nome"));
    }

    public Optional<Album> findById(Integer id) {
        return albumRepository.findById(id);
    }

    public Album getById(Integer id) {
        return albumRepository.findById(id).get();
    }

    public List<Album> findByName(String nome) {
        return albumRepository.findByNomeContainingIgnoreCase(nome);
    }

    public Album create(Album Album) {
        return albumRepository.save(Album);
    }

    public Album update(Album Album) {
        return albumRepository.save(Album);
    }

    public void delete(Album Album) {

        albumRepository.delete(Album);
    }

    public void deleteById(Integer id) {

        Album Album = getById(id);

        albumRepository.delete(Album);
    }
}
