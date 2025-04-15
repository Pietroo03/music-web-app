package org.project.spring.music_album.demo.model;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "artists")
public class Artista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank(message = "L''alias non può essere vuoto")
    @Size(min = 3, message = "L''alias deve essere lungo almeno 3 caratteri")
    private String alias;

    @NotBlank(message = "Inserisci un URL valido")
    private String foto;

    @NotBlank(message = "Il nome non può essere vuoto")
    @Size(min = 3, message = "Il nome deve essere lungo almeno 3 caratteri")
    private String nome;

    @NotBlank(message = "Il cognome non può essere vuoto")
    @Size(min = 3, message = "Il cognome deve essere lungo almeno 3 caratteri")
    private String cognome;

    @NotNull(message = "La data di nascita è obbligatoria")
    @Past(message = "Inserire una data di nascita valida")
    @Column(name = "data_di_nascita")
    private LocalDate dataNascita;

    private String formattedDataNascita;

    @NotBlank(message = "L''etichetta non può essere vuota")
    @Size(min = 3, message = "L''etichetta deve essere lunga almeno 3 caratteri")
    private String etichetta;

    @NotBlank(message = "La descrizione non può essere vuota")
    @Column(columnDefinition = "TEXT")
    private String descrizione;

    @OneToMany(mappedBy = "artista")
    @JsonIgnoreProperties("artista")
    private List<Album> albums;

    @ManyToMany
    @JoinTable(name = "artist_genre", joinColumns = @JoinColumn(name = "artist_id"), inverseJoinColumns = @JoinColumn(name = "genre_id"))
    private List<Genere> generi;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getAlias() {
        return alias;
    }

    public void setAlias(String alias) {
        this.alias = alias;
    }

    public String getFoto() {
        return foto;
    }

    public void setFoto(String foto) {
        this.foto = foto;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCognome() {
        return cognome;
    }

    public void setCognome(String cognome) {
        this.cognome = cognome;
    }

    public LocalDate getDataNascita() {
        return dataNascita;
    }

    public void setDataNascita(LocalDate dataNascita) {
        this.dataNascita = dataNascita;
    }

    public String getFormattedDataNascita() {
        return formattedDataNascita;
    }

    public void setFormattedDataNascita(String formattedDataNascita) {
        this.formattedDataNascita = formattedDataNascita;
    }

    public String getEtichetta() {
        return etichetta;
    }

    public void setEtichetta(String etichetta) {
        this.etichetta = etichetta;
    }

    public String getDescrizione() {
        return descrizione;
    }

    public void setDescrizione(String descrizione) {
        this.descrizione = descrizione;
    }

    public List<Album> getAlbums() {
        return albums;
    }

    public void setAlbums(List<Album> albums) {
        this.albums = albums;
    }

    public List<Genere> getGeneri() {
        return generi;
    }

    public void setGeneri(List<Genere> generi) {
        this.generi = generi;
    }

}
