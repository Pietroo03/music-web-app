package org.project.spring.music_album.demo.controllers;

import java.time.format.DateTimeFormatter;
import java.util.List;

import org.project.spring.music_album.demo.model.Album;
import org.project.spring.music_album.demo.model.Artista;
import org.project.spring.music_album.demo.service.AlbumService;
import org.project.spring.music_album.demo.service.ArtistaService;
import org.project.spring.music_album.demo.service.GenereService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import jakarta.validation.Valid;

@Controller
@RequestMapping("/artists")
public class ArtistaController {

    @Autowired
    private ArtistaService artistaService;

    @Autowired
    private GenereService genereService;

    @Autowired
    private AlbumService albumService;

    @GetMapping
    public String index(@RequestParam(required = false, defaultValue = "") String search,
            Authentication authentication,
            Model model) {
        List<Artista> artists;

        if (!search.isEmpty()) {
            artists = artistaService.findByName(search);
        } else {
            artists = artistaService.findAll();
        }

        for (Artista artista : artists) {
            String formattedDate = artista.getDataNascita().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
            artista.setFormattedDataNascita(formattedDate);
        }

        model.addAttribute("artists", artists);
        model.addAttribute("search", search);
        model.addAttribute("username", authentication.getName());

        return "artists/index";
    }

    @GetMapping("/{id}")
    public String show(@PathVariable Integer id, Model model) {
        Artista artista = artistaService.getById(id);

        if (artista.getDataNascita() != null) {
            String formattedDate = artista.getDataNascita().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
            artista.setFormattedDataNascita(formattedDate);
        }

        model.addAttribute("artista", artista);
        return "artists/show";
    }

    @GetMapping("/create")
    public String create(Model model) {
        model.addAttribute("artista", new Artista());
        model.addAttribute("generi", genereService.findAll());
        model.addAttribute("title", "Aggiungi un nuovo Artista");

        return "artists/create-or-edit";
    }

    @PostMapping("/create")
    public String store(@Valid @ModelAttribute("artista") Artista formArtista, BindingResult bindingResult,
            Model model) {

        if (bindingResult.hasErrors()) {
            model.addAttribute("generi", genereService.findAll());
            return "artists/create-or-edit";
        }

        Artista newArtista = artistaService.create(formArtista);

        return "redirect:/artists/" + newArtista.getId();
    }

    @GetMapping("/edit/{id}")
    public String edit(@PathVariable Integer id, Model model) {
        model.addAttribute("generi", genereService.findAll());
        model.addAttribute("artista", artistaService.getById(id));
        model.addAttribute("edit", true);
        model.addAttribute("title", "Modifica Artista");

        return "artists/create-or-edit";
    }

    @PostMapping("/edit/{id}")
    public String update(@Valid @ModelAttribute("artista") Artista formArtista, BindingResult bindingResult,
            Model model) {
        if (bindingResult.hasErrors()) {
            model.addAttribute("generi", genereService.findAll());
            return "artists/create-or-edit";
        }

        Artista newArtista = artistaService.update(formArtista);

        return "redirect:/artists/" + newArtista.getId();
    }

    @PostMapping("/delete/{id}")
    public String delete(@PathVariable Integer id) {

        Artista artista = artistaService.getById(id);

        artista.getGeneri().clear();
        artistaService.update(artista);

        for (Album albumDaCancellare : artista.getAlbums()) {
            albumService.delete(albumDaCancellare);
        }

        artistaService.delete(artista);

        return "redirect:/artists";
    }

}
