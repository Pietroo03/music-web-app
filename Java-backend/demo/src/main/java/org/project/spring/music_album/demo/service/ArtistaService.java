package org.project.spring.music_album.demo.service;

import java.util.List;
import java.util.Optional;

import org.project.spring.music_album.demo.model.Album;
import org.project.spring.music_album.demo.model.Artista;
import org.project.spring.music_album.demo.model.Genere;
import org.project.spring.music_album.demo.repository.AlbumRepository;
import org.project.spring.music_album.demo.repository.ArtistaRepository;
import org.project.spring.music_album.demo.repository.GenereRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class ArtistaService {

    private final ArtistaRepository artistaRepository;
    private final AlbumRepository albumRepository;
    private final GenereRepository genereRepository;

    public ArtistaService(
            ArtistaRepository artistaRepository,
            AlbumRepository albumRepository,
            GenereRepository genereRepository) {
        this.artistaRepository = artistaRepository;
        this.albumRepository = albumRepository;
        this.genereRepository = genereRepository;
    }

    public List<Artista> findAll() {
        return artistaRepository.findAll();
    }

    public List<Artista> findAllSortedByName() {
        return artistaRepository.findAll(Sort.by("nome"));
    }

    public Optional<Artista> findById(Integer id) {
        return artistaRepository.findById(id);
    }

    public Artista getById(Integer id) {
        return artistaRepository.findById(id).get();
    }

    public List<Artista> findByName(String alias) {
        return artistaRepository.findByAliasContainingIgnoreCase(alias);
    }

    public Artista create(Artista artista) {
        return artistaRepository.save(artista);
    }

    // Aggiorna i campi dell'artista già presente invece di inserire una seconda riga.
    public Artista update(Artista artista) {
        Optional<Artista> artistaEsistente = artistaRepository.findById(artista.getId());

        if (artistaEsistente.isPresent()) {
            Artista artistaDaAggiornare = artistaEsistente.get();

            artistaDaAggiornare.setAlias(artista.getAlias());
            artistaDaAggiornare.setFoto(artista.getFoto());
            artistaDaAggiornare.setNome(artista.getNome());
            artistaDaAggiornare.setLink(artista.getLink());
            artistaDaAggiornare.setCognome(artista.getCognome());
            artistaDaAggiornare.setDataNascita(artista.getDataNascita());
            artistaDaAggiornare.setEtichetta(artista.getEtichetta());
            artistaDaAggiornare.setDescrizione(artista.getDescrizione());

            if (artista.getAlbums() != null) {
                artistaDaAggiornare.setAlbums(artista.getAlbums());
            }

            if (artista.getGeneri() != null) {
                artistaDaAggiornare.setGeneri(artista.getGeneri());
            }

            return artistaRepository.save(artistaDaAggiornare);
        } else {
            throw new RuntimeException("Artista non trovato con ID: " + artista.getId());
        }
    }

    // ATTENZIONE: questo metodo elimina anche gli album e i generi associati, non soltanto i collegamenti.
    // Se un genere è condiviso con altri artisti, cancellarlo qui può rimuoverlo anche dal loro catalogo.
    public void delete(Artista artista) {

        for (Album albumDaCancellare : artista.getAlbums()) {
            albumRepository.delete(albumDaCancellare);
        }

        for (Genere genereDaCancellare : artista.getGeneri()) {
            genereRepository.delete(genereDaCancellare);
        }

        artistaRepository.delete(artista);
    }

    // Questa variante scollega l'artista dai generi, elimina gli album collegati e infine elimina l'artista.
    public void deleteById(Integer id) {
        Artista artista = getById(id);

        for (Genere genere : artista.getGeneri()) {
            genere.getArtisti().remove(artista);
        }

        for (Album album : artista.getAlbums()) {
            albumRepository.delete(album);
        }

        artistaRepository.delete(artista);
    }

}
