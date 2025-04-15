package org.project.spring.music_album.demo.api;

import java.util.List;
import java.util.Optional;

import org.project.spring.music_album.demo.model.Artista;
import org.project.spring.music_album.demo.service.ArtistaService;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    private ArtistaService artistaService;

    @GetMapping
    public List<Artista> index() {
        List<Artista> artisti = artistaService.findAll();
        return artisti;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Artista> show(@PathVariable Integer id) {
        Optional<Artista> artistaAttempt = artistaService.findById(id);

        if (artistaAttempt.isEmpty()) {
            return new ResponseEntity<Artista>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<Artista>(artistaAttempt.get(), HttpStatus.OK);
    }

    @PostMapping
    public Artista store(@Valid @RequestBody Artista artista) {
        return artistaService.create(artista);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Artista> update(@Valid @RequestBody Artista artista, @PathVariable Integer id) {

        if (artistaService.findById(id).isEmpty()) {
            return new ResponseEntity<Artista>(HttpStatus.NOT_FOUND);
        }

        artista.setId(id);
        return new ResponseEntity<Artista>(artistaService.update(artista), HttpStatus.OK);

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Artista> delete(@Valid @PathVariable Integer id) {

        if (artistaService.findById(id).isEmpty()) {
            return new ResponseEntity<Artista>(HttpStatus.NOT_FOUND);
        }

        artistaService.deleteById(id);
        return new ResponseEntity<Artista>(HttpStatus.OK);

    }
}
