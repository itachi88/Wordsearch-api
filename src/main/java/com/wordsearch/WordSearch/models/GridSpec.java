package com.wordsearch.WordSearch.models;

import java.util.List;

public class GridSpec {
    private int gridSize;
    private List<String> words;

    public int getGridSize() {
        return gridSize;
    }

    public void setGridSize(int gridSize) {
        this.gridSize = gridSize;
    }

    public List<String> getWords() {
        return words;
    }

    public void setWords(List<String> words) {
        this.words = words;
    }
}
