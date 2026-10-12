package org.project.spring.music_album.demo.api;

import java.util.List;
import java.util.Optional;

import org.project.spring.music_album.demo.model.Artista;
import org.project.spring.music_album.demo.service.ArtistaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/artists")
@CrossOrigin(origins = "http://localhost:5173")
public class ArtistaRestController {

    private final ArtistaService artistaService;

    public ArtistaRestController(ArtistaService artistaService) {
        this.artistaService = artistaService;
    }

    // Spring converte automaticamente la lista Java restituita in una risposta JSON.
    @GetMapping
    public List<Artista> index() {
        List<Artista> artisti = artistaService.findAll();
        return artisti;
    }

    // L'ID arriva dal percorso URL; Optional consente di rispondere 404 quando il record manca.
    @GetMapping("/{id}")
    public ResponseEntity<Artista> show(@PathVariable Integer id) {
        Optional<Artista> artistaAttempt = artistaService.findById(id);

        if (artistaAttempt.isEmpty()) {
            return new ResponseEntity<Artista>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<Artista>(artistaAttempt.get(), HttpStatus.OK);
    }

    // Riceve un artista in JSON e @Valid controlla i vincoli dichiarati nel modello.
    @PostMapping
    public Artista store(@Valid @RequestBody Artista artista) {
        return artistaService.create(artista);
    }

    // Prima conferma che il record esista, poi impone al body l'ID dell'URL.
    @PutMapping("/{id}")
    public ResponseEntity<Artista> update(@Valid @RequestBody Artista artista, @PathVariable Integer id) {

        if (artistaService.findById(id).isEmpty()) {
            return new ResponseEntity<Artista>(HttpStatus.NOT_FOUND);
        }

        artista.setId(id);
        return new ResponseEntity<Artista>(artistaService.update(artista), HttpStatus.OK);

    }

    // La rimozione è delegata al service perché deve gestire le relazioni con album e generi.
    @DeleteMapping("/{id}")
    public ResponseEntity<Artista> delete(@Valid @PathVariable Integer id) {

        if (artistaService.findById(id).isEmpty()) {
            return new ResponseEntity<Artista>(HttpStatus.NOT_FOUND);
        }

        artistaService.deleteById(id);
        return new ResponseEntity<Artista>(HttpStatus.OK);

    }
}
