package com.wordsearch.WordSearch.services;

import com.wordsearch.WordSearch.models.GridSpec;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class GridGenService {
    private enum direction{
        HORIZONTAL, VERTICAL, DIAGONAL
    }

    private class Point{
        int row;
        int col;

        public Point(int row, int col){
            this.row =row;
            this.col = col;
        }

        @Override
        public String toString() {
            return "Point{" +
                    "row=" + row +
                    ", col=" + col +
                    '}';
        }
    }

    // TODO: Reverse dirs
    public String generateGrid(GridSpec spec){

        List<direction> directions = Arrays.asList(direction.values());
        List<Point> coordinates = new ArrayList<>();
        int gridSize = spec.getGridSize();
        char[][] grid = new char[gridSize][gridSize];
        for(int i=0; i<gridSize; i++)
            Arrays.fill(grid[i], '_');

        for(int i=0; i<gridSize; i++){
            for(int j=0; j<gridSize; j++){
                coordinates.add(new Point(i, j));
            }
        }

        for(String word : spec.getWords()){
            // select a random coordinate
            word = word.toUpperCase();
            int len = word.length();
            if(len > gridSize)
                continue;
            boolean placed = false;
            Collections.shuffle(coordinates);
            // select a random direction;
            for(Point curr : coordinates){
                if(placed)
                    break;
                Collections.shuffle(directions);
                for(direction dir : directions){
                    if(placed)
                        break;
//                    int index =0;
                    if(doesFit(curr, word, dir, grid, gridSize)){
                        placed = true;
                        // check which direction and start filling the word accordingly
                        switch(dir){
                            case HORIZONTAL:
                                for(int i=0; i< len; i++)
                                    grid[curr.row][i+curr.col] = word.charAt(i);
                                break;
                            case VERTICAL:
                                for(int i=0; i<len; i++)
                                    grid[i+curr.row][curr.col] = word.charAt(i);
                                break;

                            case DIAGONAL:
                                for(int i=0; i<len; i++)
                                    grid[curr.row+i][curr.col+i] = word.charAt(i);

                                break;
                        }
                    }
                }
            }
        }
        randomFill(grid);
        return stringify(grid);
    }

    private void randomFill(char[][] grid){
        for(int i=0; i<grid.length; i++){
            for(int j=0; j<grid.length; j++){
                if(grid[i][j] == '_')
                    grid[i][j] = (char)('A' + ThreadLocalRandom.current().nextInt(0, 26));
            }
        }
    }

    private String stringify(char[][] grid){
        StringBuilder sb = new StringBuilder();
        for(int i=0; i<grid.length; i++){
            for(int j=0; j<grid.length; j++)
                sb.append(grid[i][j]+" ");
            sb.append("\n");
        }

        return sb.toString();
    }
    private boolean doesFit(Point curr, String word, direction dir, char[][] grid, int gridSize){
        int len = word.length();
        switch(dir){
            case HORIZONTAL:
                if(curr.col + len > gridSize)
                    return false;
                // check if none of the places is occupied
                for(int i=0; i< len; i++){
                    if(grid[curr.row][i + curr.col] != '_')
                        return false;
                }

                return true;

            case VERTICAL:
                if(curr.row + len > gridSize)
                    return false;
                // check if none of the places is occupied
                for(int i=0; i< len; i++){
                    if(grid[curr.row+i][curr.col] != '_')
                        return false;
                }

                return true;

            case DIAGONAL:
                if(curr.row + len > gridSize || curr.col + len > gridSize)
                    return false;

                for(int i=0; i<len; i++)
                    if(grid[curr.row + i][curr.col + i] != '_')
                        return false;

                return true;


        }

        return false;
    }

}
