package org.project.spring.music_album.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// Payload validato per cambiare lo username senza accettare stringhe vuote o troppo lunghe.
public class UpdateUsernameRequest {
    @NotBlank
    @Size(max = 50)
    private String username;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
