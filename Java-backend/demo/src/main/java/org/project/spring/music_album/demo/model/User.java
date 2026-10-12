package org.project.spring.music_album.demo.model;

import java.util.Set;
import java.time.Instant;

import jakarta.persistence.Entity;
import jakarta.persistence.Column;
import jakarta.persistence.CascadeType;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

// Account persistente: questa classe descrive la riga users e le sue relazioni con ruoli e foto.
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank(message = "Inserire un username valido")
    private String username;

    @Size(min = 6, message = "La password deve essere lunga almeno 6 caratteri")
    @NotBlank(message = "Inserire una password valida")
    private String password;

    // L'email è obbligatoria e unica perché serve per verifica, recupero password e cancellazione.
    @Email
    @Column(nullable = false, unique = true, length = 254)
    private String email;

    @Column(nullable = false)
    private Boolean emailVerified;

    // Aumentando questa versione si possono invalidare i JWT già emessi senza aspettarne la scadenza.
    private Integer tokenVersion;

    // La data viene creata alla prima persistenza e poi non viene modificata dagli aggiornamenti.
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    // La foto è opzionale e dipende dal ciclo di vita dell'account; mappedBy indica la FK in UserProfileImage.
    @OneToOne(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private UserProfileImage profileImage;

    // L'utente possiede questa relazione molti-a-molti: role_user collega gli ID di utenti e ruoli.
    // EAGER carica i ruoli insieme all'utente perché Spring Security li usa subito per autorizzare le API.
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "role_user", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

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

    public Boolean getEmailVerified() {
        return emailVerified;
    }

    public void setEmailVerified(Boolean emailVerified) {
        this.emailVerified = emailVerified;
    }

    public Integer getTokenVersion() {
        return tokenVersion;
    }

    public void setTokenVersion(Integer tokenVersion) {
        this.tokenVersion = tokenVersion;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public UserProfileImage getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(UserProfileImage profileImage) {
        this.profileImage = profileImage;
    }

    // JPA chiama questo metodo una volta prima dell'INSERT, così la data è impostata anche senza input frontend.
    @PrePersist
    void initializeCreatedAt() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

}
