package org.project.spring.music_album.demo.api;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.project.spring.music_album.demo.dto.AlbumDetails;
import org.project.spring.music_album.demo.model.Album;
import org.project.spring.music_album.demo.service.AlbumService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
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
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

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
    public ResponseEntity<AlbumDetails> show(@PathVariable Integer id) {
        Optional<Album> albumAttempt = albumService.findById(id);

        if (albumAttempt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Album album = albumAttempt.get();

        String query = album.getNome() + " " + album.getArtista().getAlias();
        String deezerSearchUrl = "https://api.deezer.com/search/album?q=" +
                URLEncoder.encode(query, StandardCharsets.UTF_8);

        try {
            RestTemplate restTemplate = new RestTemplate();

            ResponseEntity<Map<String, Object>> searchResponse = restTemplate.exchange(
                    deezerSearchUrl,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<>() {
                    });

            Map<String, Object> body = searchResponse.getBody();
            if (body == null || !body.containsKey("data")) {
                return new ResponseEntity<>(new AlbumDetails(album, new ArrayList<>()), HttpStatus.OK);
            }

            List<Map<String, Object>> data = (List<Map<String, Object>>) body.get("data");
            if (data.isEmpty()) {
                return new ResponseEntity<>(new AlbumDetails(album, new ArrayList<>()), HttpStatus.OK);
            }

            Number deezerAlbumIdNum = (Number) data.get(0).get("id");
            if (deezerAlbumIdNum == null) {
                return new ResponseEntity<>(new AlbumDetails(album, new ArrayList<>()), HttpStatus.OK);
            }
            int deezerAlbumId = deezerAlbumIdNum.intValue();

            String albumDetailUrl = "https://api.deezer.com/album/" + deezerAlbumId;
            ResponseEntity<Map<String, Object>> albumResponse = restTemplate.exchange(
                    albumDetailUrl,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<>() {
                    });

            Map<String, Object> albumData = albumResponse.getBody();
            if (albumData == null || !albumData.containsKey("tracks")) {
                return new ResponseEntity<>(new AlbumDetails(album, new ArrayList<>()), HttpStatus.OK);
            }

            Map<String, Object> tracksObj = (Map<String, Object>) albumData.get("tracks");
            List<Map<String, Object>> tracksData = (List<Map<String, Object>>) tracksObj.get("data");

            // 🔁 Qui costruisci lista di oggetti traccia con title, duration e preview
            List<Map<String, Object>> tracks = tracksData.stream()
                    .map(track -> {
                        Map<String, Object> t = new HashMap<>();
                        t.put("title", track.get("title"));
                        t.put("duration", track.get("duration"));
                        t.put("preview", track.get("preview"));
                        return t;
                    })
                    .collect(Collectors.toList());

            AlbumDetails albumWithTracks = new AlbumDetails(album, tracks);
            return new ResponseEntity<>(albumWithTracks, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
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
