// TODO: show list of words fed by the user
// event handling - click set of letters and press enter, if match then green, else nothing
// if all words found, alert(game over, new game?)

alert('Insert grid size and the words you want to find. Click on letters either vertically from top to bottom, horizontally from left to right or diagonally from top to bottom. Press Enter to confirm your selection & Esc to clear it out. Game ends when you find all the words')
let words = null;
let gridSize;
const vis = new Set()
function getGrid(){
    gridSize = document.querySelector("#gridSize").value;
    words = document.querySelector("#wordList").
        value.split(',').map(function (x) { return x.toUpperCase().trim()})
                        .filter((x) => x.length <= gridSize);

    let gridSpec = {
        gridSize : gridSize,
        words : words

    }
    


    var xhr = new XMLHttpRequest();
    xhr.open("POST", "./grid");
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        // console.log(xhr.status);
        let grid = xhr.responseText;
        // console.log(grid)
        renderGrid(grid)
    }};

    // console.log(JSON.stringify(gridSpec))
    xhr.send(JSON.stringify(gridSpec))
    
}

function renderGrid(grid){
    // $('.container').hide()
    
    let a = grid.split(' \n')
    let arr = []
    for(let i = 0; i< a.length-1; i++){
        arr.push(a[i].split(' '))
    }
    
    let table = '<table id="grid">'

    for(let i=0; i<arr.length; i++){
        table += '<tr>'
        for(let j=0; j<arr[0].length; j++){
            table += `<td data-x= ${i} data-y= ${j} data-letter=${arr[i][j]}>${arr[i][j]}</td>`
        }
        table += '</tr>'
    }

    table += '</table>'
    // console.log(arr)
    // $('.container').html(table)
    $('.container').hide()
    $('#gridArea').html(table)
    

    // show the list of entered words

    var section = document.getElementById('displayWords')
    section.innerHTML += '<h3>Words to find: </h3>'
    for(let i=0; i<words.length; i++)
        section.innerHTML += `${words[i]} `;

    // event handling - click on td
    
    let table_td = $('#grid').find('td')
    // console.log(table_td)
    
    let currAllowedCells = []
    let formedWord = ''
    table_td.on('click', function (event) {
        let td = $(this)
        let prevAllowedCells = currAllowedCells.filter(() => true)
        currAllowedCells=[]
        
        if(prevAllowedCells.length == 0){
            td.addClass('hlt');
            formedWord += td.attr('data-letter')
            let currRow = +td.attr('data-x'), currCol = +td.attr('data-y') 
            // console.log(currRow+' '+currCol)
            if(currRow + 1 < gridSize)
                currAllowedCells.push({row: currRow+1, col: currCol, dir: 'V'})
            
            if(currCol + 1 < gridSize)
                currAllowedCells.push({row: currRow, col: currCol+1, dir: 'H'})
            
            if(currRow +1 < gridSize && currCol + 1 < gridSize)
                currAllowedCells.push({row: currRow+1, col: currCol+1, dir: 'D'})
            
            
        }

        else{
            
            // check the direction and add the neighbours accordingly
            // if not, then clear the allowed and selected list and remove highlights
            let isValid = false
            let currRow = +td.attr('data-x'), currCol = +td.attr('data-y') 
            let currDir = ''
            let ok = false
            // checking if the current cell is in the neighbouring list
            for(let i=0; i<prevAllowedCells.length; i++){
                if(currRow === prevAllowedCells[i].row && currCol === prevAllowedCells[i].col){
                    // valid neighbour
                    
                    td.addClass('hlt')
                    ok = true
                    formedWord += td.attr('data-letter')
                    currDir = prevAllowedCells[i].dir;
                    if(currDir === 'V' && currRow + 1 < gridSize)
                        currAllowedCells.push({row: currRow+1, col: currCol, dir: 'V'})
                    else if(currDir === 'H' && currCol +1 < gridSize)
                        currAllowedCells.push({row: currRow, col: currCol+1, dir: 'H'})
                    
                    else if(currDir === 'D' && currRow +1 < gridSize && currCol + 1 < gridSize)
                        currAllowedCells.push({row: currRow+1, col: currCol+1, dir: 'D'})

                    break;
                }
                 
            }

            // if neighbour list is empty, then clear formedWord and unhighlight selected cells
            if(!ok){
                formedWord = '';
                $('#grid').find('td').removeClass('hlt')
                currAllowedCells = []
                prevAllowedCells = []
                alert('Invalid')
            }
    
        }

        // console.log('neighbours = '+JSON.stringify(currAllowedCells))

        
    })

    let foundWords = 0;
    $(this).on('keydown', function (event){
        
        // console.log(event.code) 
        if(event.code ==='Enter'){
            if(words.includes(formedWord)){
                if(vis.has(formedWord))
                    alert('Not a new found word!')
                else{
                    vis.add(formedWord)
                    if(++foundWords === words.length){
                        
                        vis.clear()
                        foundWords = 0
                        alert('Congrats! You found all the words')

                        // redirect to main game screen
                        $('.container').show()
                        $('#gridArea').html('')
                        $('#displayWords').html('')

                    }

                    else{
                        alert('New word found')
                    }

                    formedWord = '';
                    $('#grid').find('td').removeClass('hlt')
                    currAllowedCells = []
                    prevAllowedCells = []
                }
            }
        }

        else if(event.code === 'Escape'){
            formedWord = '';
            $('#grid').find('td').removeClass('hlt')
            currAllowedCells = []
            prevAllowedCells = []
        }
    
    }) 

}



