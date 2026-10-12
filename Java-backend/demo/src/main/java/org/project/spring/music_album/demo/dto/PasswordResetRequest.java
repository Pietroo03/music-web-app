package org.project.spring.music_album.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// Richiesta per il reset: eredita il token dal link email e aggiunge la nuova password.
public class PasswordResetRequest extends TokenRequest {
    @NotBlank
    @Size(min = 6, max = 72)
    private String password;

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
