package org.project.spring.music_album.demo.dto;

import java.util.List;
import java.util.Map;

import org.project.spring.music_album.demo.model.Album;

public class AlbumDetails {

    private Album album;
    private List<Map<String, Object>> tracks;

    public AlbumDetails(Album album, List<Map<String, Object>> tracks) {
        this.album = album;
        this.tracks = tracks;
    }

    public Album getAlbum() {
        return album;
    }

    public void setAlbum(Album album) {
        this.album = album;
    }

    public List<Map<String, Object>> getTracks() {
        return tracks;
    }

    public void setTracks(List<Map<String, Object>> tracks) {
        this.tracks = tracks;
    }

}
