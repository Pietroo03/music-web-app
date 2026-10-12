package org.project.spring.music_album.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// Dati richiesti per cambiare password da una sessione già autenticata.
public class ChangePasswordRequest {
    // La password attuale prova che chi richiede la modifica conosce le credenziali dell'account.
    @NotBlank
    private String currentPassword;

    // Impone la presenza della nuova password e limita la dimensione accettata dal contratto API.
    @NotBlank
    @Size(min = 6, max = 72)
    private String newPassword;

    public String getCurrentPassword() {
        return currentPassword;
    }

    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
