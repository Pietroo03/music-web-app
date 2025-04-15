package org.project.spring.music_album.demo.controllers;

import java.time.format.DateTimeFormatter;
import java.util.List;

import org.project.spring.music_album.demo.model.Album;
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
@RequestMapping("/albums")
public class AlbumController {

    @Autowired
    private AlbumService albumService;

    @Autowired
    private GenereService genereService;

    @Autowired
    private ArtistaService artistaService;

    @GetMapping
    public String index(@RequestParam(required = false, defaultValue = "") String search,
            Authentication authentication,
            Model model) {
        List<Album> albums;

        if (!search.isEmpty()) {
            albums = albumService.findByName(search);
        } else {
            albums = albumService.findAll();
        }

        for (Album album : albums) {
            String formattedDate = album.getDataPubblicazione().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
            album.setFormattedDataPubblicazione(formattedDate);
        }

        model.addAttribute("albums", albums);
        model.addAttribute("search", search);
        model.addAttribute("username", authentication.getName());
        return "albums/index";
    }

    @GetMapping("/{id}")
    public String show(@PathVariable Integer id, Model model) {
        Album album = albumService.getById(id);

        if (album.getDataPubblicazione() != null) {
            String formattedDate = album.getDataPubblicazione().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
            album.setFormattedDataPubblicazione(formattedDate);
        }

        model.addAttribute("album", album);
        return "albums/show";
    }

    @GetMapping("/create")
    public String create(Model model) {
        model.addAttribute("album", new Album());
        model.addAttribute("generi", genereService.findAll());
        model.addAttribute("artisti", artistaService.findAll());
        model.addAttribute("title", "Aggiungi un nuovo Album");

        return "albums/create-or-edit";
    }

    @PostMapping("/create")
    public String store(@Valid @ModelAttribute("album") Album formAlbum, BindingResult bindingResult,
            Model model) {
        if (bindingResult.hasErrors()) {
            model.addAttribute("generi", genereService.findAll());
            model.addAttribute("artisti", artistaService.findAll());
            return "albums/create-or-edit";
        }

        Album newAlbum = albumService.create(formAlbum);

        return "redirect:/albums/" + newAlbum.getId();
    }

    @GetMapping("/edit/{id}")
    public String edit(@PathVariable Integer id, Model model) {
        model.addAttribute("generi", genereService.findAll());
        model.addAttribute("artisti", artistaService.findAll());
        model.addAttribute("album", albumService.getById(id));
        model.addAttribute("edit", true);
        model.addAttribute("title", "Modifica Album");

        return "albums/create-or-edit";
    }

    @PostMapping("/edit/{id}")
    public String update(@Valid @ModelAttribute("album") Album formAlbum, BindingResult bindingResult,
            Model model) {
        if (bindingResult.hasErrors()) {
            model.addAttribute("generi", genereService.findAll());
            model.addAttribute("artisti", artistaService.findAll());
            return "albums/create-or-edit";
        }

        Album newAlbum = albumService.update(formAlbum);

        return "redirect:/albums/" + newAlbum.getId();
    }

    @PostMapping("/delete/{id}")
    public String delete(@PathVariable Integer id) {

        Album album = albumService.getById(id);

        album.getGeneri().clear();
        albumService.update(album);

        albumService.delete(album);

        return "redirect:/albums";
    }
}
