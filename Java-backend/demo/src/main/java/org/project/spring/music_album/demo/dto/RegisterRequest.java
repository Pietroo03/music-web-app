package org.project.spring.music_album.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// Forma JSON accettata dall'endpoint di registrazione; le annotazioni bloccano input incompleti o troppo lunghi.
public class RegisterRequest {
    @NotBlank
    @Size(max = 50)
    private String username;

    @NotBlank
    @Size(min = 6, max = 72)
    private String password;

    @NotBlank
    @Email
    @Size(max = 254)
    private String email;

    // Facoltativa: il backend la confronta con la chiave configurata prima di assegnare il ruolo ADMIN.
    private String adminKey;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAdminKey() {
        return adminKey;
    }

    public void setAdminKey(String adminKey) {
        this.adminKey = adminKey;
    }

}
