package org.project.spring.music_album.demo.api;

import java.util.List;
import java.util.Optional;

import org.project.spring.music_album.demo.model.Genere;
import org.project.spring.music_album.demo.service.GenereService;
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
@RequestMapping("/api/genres")
@CrossOrigin(origins = "http://localhost:5173")
public class GenereRestController {

    @Autowired
    private GenereService genereService;

    @GetMapping
    public List<Genere> index() {
        List<Genere> generi = genereService.findAll();
        return generi;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Genere> show(@PathVariable Integer id) {
        Optional<Genere> genereAttempt = genereService.findById(id);

        if (genereAttempt.isEmpty()) {
            return new ResponseEntity<Genere>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<Genere>(genereAttempt.get(), HttpStatus.OK);
    }

    @PostMapping
    public Genere store(@Valid @RequestBody Genere genere) {
        return genereService.create(genere);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Genere> update(@Valid @RequestBody Genere genere, @PathVariable Integer id) {

        if (genereService.findById(id).isEmpty()) {
            return new ResponseEntity<Genere>(HttpStatus.NOT_FOUND);
        }

        genere.setId(id);
        return new ResponseEntity<Genere>(genereService.update(genere), HttpStatus.OK);

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Genere> delete(@Valid @PathVariable Integer id) {

        if (genereService.findById(id).isEmpty()) {
            return new ResponseEntity<Genere>(HttpStatus.NOT_FOUND);
        }

        genereService.deleteById(id);
        return new ResponseEntity<Genere>(HttpStatus.OK);

    }
}
