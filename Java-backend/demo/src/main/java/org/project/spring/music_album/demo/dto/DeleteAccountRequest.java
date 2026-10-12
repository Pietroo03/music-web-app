package org.project.spring.music_album.demo.dto;

import jakarta.validation.constraints.NotBlank;

// Corpo JSON per richiedere la cancellazione: serve la password attuale, che non viene salvata qui.
public class DeleteAccountRequest {
    @NotBlank
    private String password;

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
