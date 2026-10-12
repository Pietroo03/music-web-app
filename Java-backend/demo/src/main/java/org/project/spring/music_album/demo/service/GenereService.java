package org.project.spring.music_album.demo.service;

import java.util.List;
import java.util.Optional;

import org.project.spring.music_album.demo.model.Genere;
import org.project.spring.music_album.demo.repository.GenereRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class GenereService {

    private final GenereRepository genereRepository;

    public GenereService(GenereRepository genereRepository) {
        this.genereRepository = genereRepository;
    }

    // Metodi di servizio che tengono il controller separato dall'accesso diretto al repository.
    public List<Genere> findAll() {
        return genereRepository.findAll();
    }

    public List<Genere> findAllSortedByName() {
        return genereRepository.findAll(Sort.by("nome"));
    }

    public Optional<Genere> findById(Integer id) {
        return genereRepository.findById(id);
    }

    public Genere getById(Integer id) {
        return genereRepository.findById(id).get();
    }

    public List<Genere> findByName(String nome) {
        return genereRepository.findByNomeContainingIgnoreCase(nome);
    }

    public Genere create(Genere Genere) {
        return genereRepository.save(Genere);
    }

    // save inserisce una nuova riga oppure aggiorna quella con lo stesso ID.
    public Genere update(Genere Genere) {
        return genereRepository.save(Genere);
    }

    public void delete(Genere Genere) {

        genereRepository.delete(Genere);
    }

    public void deleteById(Integer id) {

        Genere Genere = getById(id);

        genereRepository.delete(Genere);
    }
}
