package org.project.spring.music_album.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// DTO condiviso dalle richieste che partono da un indirizzo email (reset e reinvio verifica).
public class EmailRequest {
    @NotBlank
    @Email
    @Size(max = 254)
    private String email;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
