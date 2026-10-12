package org.project.spring.music_album.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

// La foto è separata dall'account per non caricare i byte dell'immagine a ogni lettura dell'utente.
@Entity
@Table(name = "user_profile_images")
public class UserProfileImage {

    @Id
    private Integer userId;

    // La chiave primaria della foto è anche la chiave esterna dell'utente: può esserci al massimo una foto.
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // MEDIUMBLOB consente di salvare i byte del file immagine direttamente in MySQL.
    @Lob
    @Column(nullable = false, columnDefinition = "MEDIUMBLOB")
    private byte[] imageData;

    @Column(nullable = false, length = 32)
    private String contentType;

    public Integer getUserId() {
        return userId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public byte[] getImageData() {
        return imageData;
    }

    public void setImageData(byte[] imageData) {
        this.imageData = imageData;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }
}
