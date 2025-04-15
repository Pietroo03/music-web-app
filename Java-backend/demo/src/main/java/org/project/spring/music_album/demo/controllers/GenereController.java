package org.project.spring.music_album.demo.controllers;

import java.util.List;

import org.project.spring.music_album.demo.model.Album;
import org.project.spring.music_album.demo.model.Artista;
import org.project.spring.music_album.demo.model.Genere;
import org.project.spring.music_album.demo.service.GenereService;
import org.springframework.beans.factory.annotation.Autowired;
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
@RequestMapping("/genres")
public class GenereController {

    @Autowired
    private GenereService genereService;

    @GetMapping
    public String index(@RequestParam(required = false, defaultValue = "") String search,
            Model model) {
        List<Genere> generi;

        if (!search.isEmpty()) {
            generi = genereService.findByName(search);
        } else {
            generi = genereService.findAll();
        }

        model.addAttribute("generi", generi);
        model.addAttribute("search", search);
        return "genres/index";
    }

    @GetMapping("/create")
    public String create(Model model) {
        model.addAttribute("genere", new Genere());

        return "genres/create-or-edit";
    }

    @PostMapping("/create")
    public String store(@Valid @ModelAttribute("genere") Genere formGenere, BindingResult bindingResult,
            Model model) {
        if (bindingResult.hasErrors()) {

            return "genres/create-or-edit";
        }

        genereService.create(formGenere);

        return "redirect:/genres";
    }

    @GetMapping("/edit/{id}")
    public String edit(@PathVariable Integer id, Model model) {
        model.addAttribute("genere", genereService.getById(id));
        model.addAttribute("edit", true);

        return "genres/create-or-edit";
    }

    @PostMapping("/edit/{id}")
    public String update(@Valid @ModelAttribute("genere") Genere newGenere,
            BindingResult bindingResult, Model model) {
        if (bindingResult.hasErrors()) {
            return "genres/create-or-edit";
        }

        genereService.update(newGenere);

        return "redirect:/genres";
    }

    @PostMapping("/delete/{id}")
    public String delete(@PathVariable Integer id) {

        Genere genereDaEliminare = genereService.getById(id);

        for (Artista artistaCollegato : genereDaEliminare.getArtisti()) {
            artistaCollegato.getGeneri().remove(genereDaEliminare);
        }

        for (Album albumCollegato : genereDaEliminare.getAlbums()) {
            albumCollegato.getGeneri().remove(genereDaEliminare);
        }

        genereService.delete(genereDaEliminare);

        return "redirect:/genres";
    }
}
