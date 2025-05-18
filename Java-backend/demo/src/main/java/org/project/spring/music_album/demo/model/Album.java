package org.project.spring.music_album.demo.model;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "albums")

public class Album {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank(message = "Il nome non può essere vuoto")
    @Size(min = 3, message = "Il nome deve essere lungo almeno 3 caratteri")
    private String nome;

    @NotBlank(message = "Inserisci un URL valido")
    private String foto;

    @NotBlank(message = "Inserisci un URL valido")
    private String link;

    @NotNull(message = "La data di pubblicazione è obbligatoria")
    @Past(message = "Inserire una data di pubblicazione valida")
    @Column(name = "data_di_pubblicazione")
    private LocalDate dataPubblicazione;

    @NotBlank(message = "La descrizione non può essere vuota")
    @Column(columnDefinition = "TEXT")
    private String descrizione;

    @NotNull(message = "Inserire un numero valido")
    @Min(value = 1, message = "Le tracce devono essere maggiori di 0")
    private Integer tracce;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "artist_id", nullable = false)
    @JsonIgnoreProperties("albums")
    private Artista artista;

    @ManyToMany
    @JoinTable(name = "album_genre", joinColumns = @JoinColumn(name = "album_id"), inverseJoinColumns = @JoinColumn(name = "genre_id"))
    private List<Genere> generi;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getFoto() {
        return foto;
    }

    public void setFoto(String foto) {
        this.foto = foto;
    }

    public LocalDate getDataPubblicazione() {
        return dataPubblicazione;
    }

    public void setDataPubblicazione(LocalDate dataPubblicazione) {
        this.dataPubblicazione = dataPubblicazione;
    }

    public String getDescrizione() {
        return descrizione;
    }

    public void setDescrizione(String descrizione) {
        this.descrizione = descrizione;
    }

    public Integer getTracce() {
        return tracce;
    }

    public void setTracce(Integer tracce) {
        this.tracce = tracce;
    }

    public Artista getArtista() {
        return artista;
    }

    public void setArtista(Artista artista) {
        this.artista = artista;
    }

    public List<Genere> getGeneri() {
        return generi;
    }

    public void setGeneri(List<Genere> generi) {
        this.generi = generi;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

}
