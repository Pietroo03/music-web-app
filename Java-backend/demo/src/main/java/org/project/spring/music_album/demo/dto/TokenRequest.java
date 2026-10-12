package org.project.spring.music_album.demo.dto;

import jakarta.validation.constraints.NotBlank;

// DTO minimo per gli endpoint che ricevono un token da un link email.
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
