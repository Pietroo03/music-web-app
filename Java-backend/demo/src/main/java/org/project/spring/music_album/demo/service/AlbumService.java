package org.project.spring.music_album.demo.service;

import java.util.List;
import java.util.Optional;

import org.project.spring.music_album.demo.model.Album;
import org.project.spring.music_album.demo.repository.AlbumRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class AlbumService {

    private final AlbumRepository albumRepository;

    public AlbumService(AlbumRepository albumRepository) {
        this.albumRepository = albumRepository;
    }

    // Elenco usato dal controller: l'ordinamento è definito dal repository, non dalla pagina frontend.
    public List<Album> findAll() {
        return albumRepository.findAllByOrderByArtista_IdAscDataPubblicazioneAsc();
    }

    public List<Album> findAllSortedByName() {
        return albumRepository.findAll(Sort.by("nome"));
    }

    // Optional permette al controller di restituire 404 quando l'ID non esiste.
    public Optional<Album> findById(Integer id) {
        return albumRepository.findById(id);
    }

    // Variante che presume l'esistenza dell'ID: get() lancia un'eccezione se il record non c'è.
    public Album getById(Integer id) {
        return albumRepository.findById(id).get();
    }

    public List<Album> findByName(String nome) {
        return albumRepository.findByNomeContainingIgnoreCase(nome);
    }

    public Album create(Album Album) {
        return albumRepository.save(Album);
    }

    // Carica prima il record gestito da JPA e copia i campi modificabili, così non si sovrascrivono
    // relazioni o valori non inviati dal form con null.
    public Album update(Album album) {
        Optional<Album> albumEsistente = albumRepository.findById(album.getId());

        if (albumEsistente.isPresent()) {
            Album albumDaAggiornare = albumEsistente.get();

            albumDaAggiornare.setNome(album.getNome());
            albumDaAggiornare.setFoto(album.getFoto());
            albumDaAggiornare.setLink(album.getLink());
            albumDaAggiornare.setDataPubblicazione(album.getDataPubblicazione());
            albumDaAggiornare.setTracce(album.getTracce());
            albumDaAggiornare.setDescrizione(album.getDescrizione());

            // Le relazioni si aggiornano solo se la richiesta ne contiene una nuova.
            if (album.getArtista() != null) {
                albumDaAggiornare.setArtista(album.getArtista());
            }

            if (album.getGeneri() != null) {
                albumDaAggiornare.setGeneri(album.getGeneri());
            }

            return albumRepository.save(albumDaAggiornare);
        } else {
            throw new RuntimeException("Album non trovato con ID: " + album.getId());
        }
    }

    public void delete(Album Album) {

        albumRepository.delete(Album);
    }

    public void deleteById(Integer id) {

        Album Album = getById(id);

        albumRepository.delete(Album);
    }
}
