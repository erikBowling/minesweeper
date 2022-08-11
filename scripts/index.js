/* GLOBALS */

const grid = document.querySelector('#grid');
const size = 20;
const gridObjects = [];
let started = false;

class GridCell{
    constructor(r,c){
        this.row = r;
        this.col = c;
        this.id = `r${r}_c${c}`;
        this.allowedBombs = true;
        this.value = 0;
        this.revealed = false;
        this.flagged = false;
    }
}

/* FUNCTIONS  */

//Used to generate HTML div elements
function generateHTMLGrid(){
    for(let i = 0; i < size; i++){
        for(let j = 0; j < size; j++){
            const cellDiv = document.createElement('div');
            cellDiv.id = `r${i}_c${j}`;
            cellDiv.classList.add('hiddenCell');
            cellDiv.addEventListener("click", ()=>{
                clickReveal(cellDiv);
            });

            cellDiv.addEventListener("auxclick", ()=>{
                flag(cellDiv);
            });
            grid.appendChild(cellDiv);
        }
    }
}
//Generates Objects to represent the grid.
function generateGridObjects(){
    for(let i = 0; i < size; i++){
        for(let j = 0; j < size; j++){
            const cell = new GridCell(i, j);
            gridObjects.push(cell);
        }
    }
}

function setGridValues(){
    gridObjects.forEach((cellObj)=>{
        if(cellObj.value != "B"){
            let numBombs = 0;
            let bounds = getValidBounds(cellObj.row, cellObj.col);
            for(let i = bounds[0][0]; i <= bounds[0][1]; i++){
                for(let j = bounds[1][0]; j <= bounds[1][1]; j++){
                    const cell = gridObjects.find(obj => obj.id == `r${i}_c${j}`);
                    if(cell.value == "B"){
                        numBombs++;
                    }
                }
            }
            cellObj.value = numBombs;
        }
    });
}

function getValidBounds(row, col){
    let bounds = [[row - 1, row + 1], [col - 1, col + 1]];

    //top row
    if(row == 0){
        bounds[0][0] = row;
        bounds[0][1] = row + 1;
    }

    //bottom row
    if(row == 19){
        bounds[0][0] = row - 1;
        bounds[0][1] = row;

    }

    //left collumn
    if(col == 0){
        bounds[1][0] = col;
        bounds[1][1] = col + 1;
    }

    //right column
    if(col == 19){
        bounds[1][0] = col - 1;
        bounds[1][1] = col;
    }

    return bounds;

}

function populateBombs(numBombs){
    for(let i = 0; i < numBombs; i++){
        let randIndex = Math.floor(Math.random() * size ** 2);
        while(gridObjects[randIndex].value != 0 || gridObjects[randIndex].allowedBombs == false){
            randIndex = Math.floor(Math.random() * size ** 2);
        }

        gridObjects[randIndex].value = "B";
    }
}

function clickReveal(cell){
    console.log("clickReveal");
    const objCell = gridObjects.find(obj => obj.id == cell.id);
    if(started == false){
        initialReveal(objCell);
        started = true;
    }
    //recursive calls on zeros and all surrounding squares.
    objCell.revealed = true;
    let bounds = getValidBounds(objCell.row, objCell.col);
    if(objCell.value == 0){
        for(let i = bounds[0][0]; i <= bounds[0][1]; i++){
            for(let j = bounds[1][0]; j <= bounds[1][1]; j++){
                const surroundingCell = gridObjects.find(obj => obj.id == `r${i}_c${j}`);
                if(surroundingCell.revealed == false && surroundingCell.value != "B"){
                    clickReveal(surroundingCell);
                }
            }
        }
    }

    updateDom();
}

function initialReveal(objCell){
    console.log("initial");
    let bounds = getValidBounds(objCell.row, objCell.col);
    for(let i = bounds[0][0]; i <= bounds[0][1]; i++){
        for(let j = bounds[1][0]; j <= bounds[1][1]; j++){
            const cell = gridObjects.find(obj => obj.id == `r${i}_c${j}`);
            cell.allowedBombs = false;
        }
    }
    populateBombs(90);
    setGridValues();
}

function showWholeGrid(){
    gridObjects.forEach((obj)=>{
        const domCell = document.querySelector(`#${obj.id}`);
        domCell.textContent = obj.value;
    });
}

function updateDom(){
    gridObjects.forEach((obj)=>{
        if(obj.revealed == true){
            const domCell = document.getElementById(obj.id);
            domCell.classList.remove("hiddenCell");
            domCell.classList.add("revealedCell");
            if(obj.value != 0) domCell.textContent = obj.value;
        }
    });

}

function flag(cellDiv){
    const cellObj = gridObjects.find(obj=> obj.id == cellDiv.id);
    
    if(cellObj.flagged == false){
        cellObj.flagged = true;
        const img = document.createElement('img');
        img.src = "images/flag.png";
        img.classList.add("flag_bomb");
        cellDiv.appendChild(img);
    }else{
        cellObj.flagged = false;
        cellDiv.removeChild(cellDiv.firstChild);
    }   
}

generateHTMLGrid();
generateGridObjects();
