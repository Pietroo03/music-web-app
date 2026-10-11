package org.project.spring.music_album.demo.dto;

import jakarta.validation.constraints.NotBlank;

public class TokenRequest {
    @NotBlank
    private String token;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
