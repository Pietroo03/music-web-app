package org.project.spring.music_album.demo.api;

import java.util.List;
import java.util.Optional;

import org.project.spring.music_album.demo.model.Album;
import org.project.spring.music_album.demo.service.AlbumService;
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
@RequestMapping("/api/albums")
@CrossOrigin(origins = "http://localhost:5173")
public class AlbumRestController {

    @Autowired
    private AlbumService albumService;

    @GetMapping
    public List<Album> index() {
        List<Album> albums = albumService.findAll();
        return albums;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Album> show(@PathVariable Integer id) {
        Optional<Album> albumAttempt = albumService.findById(id);

        if (albumAttempt.isEmpty()) {
            return new ResponseEntity<Album>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<Album>(albumAttempt.get(), HttpStatus.OK);
    }

    @PostMapping
    public Album store(@Valid @RequestBody Album album) {
        return albumService.create(album);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Album> update(@Valid @RequestBody Album album, @PathVariable Integer id) {

        if (albumService.findById(id).isEmpty()) {
            return new ResponseEntity<Album>(HttpStatus.NOT_FOUND);
        }

        album.setId(id);
        return new ResponseEntity<Album>(albumService.update(album), HttpStatus.OK);

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Album> delete(@Valid @PathVariable Integer id) {

        if (albumService.findById(id).isEmpty()) {
            return new ResponseEntity<Album>(HttpStatus.NOT_FOUND);
        }

        albumService.deleteById(id);
        return new ResponseEntity<Album>(HttpStatus.OK);

    }
}
