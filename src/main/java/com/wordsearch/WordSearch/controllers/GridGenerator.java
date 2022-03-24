package com.wordsearch.WordSearch.controllers;

import com.wordsearch.WordSearch.models.GridSpec;
import com.wordsearch.WordSearch.services.GridGenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GridGenerator {

    @Autowired
    GridGenService service;

    @CrossOrigin(origins = "*")
    @PostMapping("/grid")
    public String generateGrid(@RequestBody GridSpec gridSpec){
        return service.generateGrid(gridSpec);
    }
}
