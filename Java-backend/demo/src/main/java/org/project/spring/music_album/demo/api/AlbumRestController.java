package org.project.spring.music_album.demo.api;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.fasterxml.jackson.databind.JsonNode;
import org.project.spring.music_album.demo.dto.AlbumDetails;
import org.project.spring.music_album.demo.model.Album;
import org.project.spring.music_album.demo.service.AlbumService;
import org.springframework.beans.factory.annotation.Autowired;
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

            ResponseEntity<JsonNode> searchResponse = restTemplate.exchange(
                    deezerSearchUrl,
                    HttpMethod.GET,
                    null,
                    JsonNode.class);

            JsonNode body = searchResponse.getBody();
            if (body == null || !body.path("data").isArray()) {
                return new ResponseEntity<>(new AlbumDetails(album, new ArrayList<>()), HttpStatus.OK);
            }

            JsonNode searchData = body.path("data");
            if (searchData.isEmpty()) {
                return new ResponseEntity<>(new AlbumDetails(album, new ArrayList<>()), HttpStatus.OK);
            }

            JsonNode deezerAlbumIdNode = searchData.get(0).path("id");
            if (!deezerAlbumIdNode.isNumber()) {
                return new ResponseEntity<>(new AlbumDetails(album, new ArrayList<>()), HttpStatus.OK);
            }
            int deezerAlbumId = deezerAlbumIdNode.intValue();

            String albumDetailUrl = "https://api.deezer.com/album/" + deezerAlbumId;
            ResponseEntity<JsonNode> albumResponse = restTemplate.exchange(
                    albumDetailUrl,
                    HttpMethod.GET,
                    null,
                    JsonNode.class);

            JsonNode albumData = albumResponse.getBody();
            if (albumData == null || !albumData.path("tracks").path("data").isArray()) {
                return new ResponseEntity<>(new AlbumDetails(album, new ArrayList<>()), HttpStatus.OK);
            }

            JsonNode tracksData = albumData.path("tracks").path("data");
            List<Map<String, Object>> tracks = new ArrayList<>();
            for (JsonNode track : tracksData) {
                Map<String, Object> trackDetails = new HashMap<>();
                trackDetails.put("title", track.path("title").asText(null));
                trackDetails.put("duration", track.path("duration").isNumber()
                        ? track.path("duration").numberValue()
                        : null);
                trackDetails.put("preview", track.path("preview").asText(null));
                tracks.add(trackDetails);
            }

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
