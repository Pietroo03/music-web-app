package org.project.spring.music_album.demo.api;

import java.util.List;
import java.util.Optional;

import org.project.spring.music_album.demo.model.Genere;
import org.project.spring.music_album.demo.service.GenereService;
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
@RequestMapping("/api/genres")
@CrossOrigin(origins = "http://localhost:5173")
public class GenereRestController {

    private final GenereService genereService;

    public GenereRestController(GenereService genereService) {
        this.genereService = genereService;
    }

    // Jackson serializza la lista di oggetti Genere in JSON per il frontend.
    @GetMapping
    public List<Genere> index() {
        List<Genere> generi = genereService.findAll();
        return generi;
    }

    // Restituisce un genere specifico oppure HTTP 404 se l'ID non è presente.
    @GetMapping("/{id}")
    public ResponseEntity<Genere> show(@PathVariable Integer id) {
        Optional<Genere> genereAttempt = genereService.findById(id);

        if (genereAttempt.isEmpty()) {
            return new ResponseEntity<Genere>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<Genere>(genereAttempt.get(), HttpStatus.OK);
    }

    // @Valid applica al body JSON i vincoli dichiarati nel modello Genere.
    @PostMapping
    public Genere store(@Valid @RequestBody Genere genere) {
        return genereService.create(genere);
    }

    // L'ID dell'URL prevale su quello eventualmente inviato nel body.
    @PutMapping("/{id}")
    public ResponseEntity<Genere> update(@Valid @RequestBody Genere genere, @PathVariable Integer id) {

        if (genereService.findById(id).isEmpty()) {
            return new ResponseEntity<Genere>(HttpStatus.NOT_FOUND);
        }

        genere.setId(id);
        return new ResponseEntity<Genere>(genereService.update(genere), HttpStatus.OK);

    }

    // Verifica l'esistenza prima di delegare la cancellazione al service.
    @DeleteMapping("/{id}")
    public ResponseEntity<Genere> delete(@Valid @PathVariable Integer id) {

        if (genereService.findById(id).isEmpty()) {
            return new ResponseEntity<Genere>(HttpStatus.NOT_FOUND);
        }

        genereService.deleteById(id);
        return new ResponseEntity<Genere>(HttpStatus.OK);

    }
}
