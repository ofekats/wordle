
var height = 6; //number of guesses
var width = 5; //length of the word

var row = 0;
var col = 0;

var gameOver = false;
var word = "SUQID";

window.onload = function(){
    intialize();
}

function intialize(){
    //create the board
    for(let r =0; r < height; ++r){
        for(let c =0; c < width; ++c){
            // <span id="0_0" class="tile">P</span>
            let tile = document.createElement("span");
            tile.id = r.toString() + "_" + c.toString();
            tile.classList.add("tile");
            tile.innerText = "";
            document.getElementById("board").appendChild(tile);
        }
    }

    // user input
    document.addEventListener("keyup", (e) => {
        if(gameOver) return;

        // if the user enter a letter
        if("KeyA" <= e.code && e.code <= "KeyZ"){
            if(col < width){
                let currntTile = document.getElementById(row.toString() + "_" + col.toString());
                if (currntTile.innerText == ""){
                    currntTile.innerText = e.code[3];
                    col += 1;
                }
            }
        }
        else if (e.code == "Backspace"){
                if (0 < col && col <= width){
                    col -= 1;
                }
                let currntTile = document.getElementById(row.toString() + "_" + col.toString());
                currntTile.innerText = "";
        }
        else if (e.code == "Enter" && col == width){
            update();
            row += 1;
            col = 0;
        }

        if(!gameOver && row == height){
            gameOver = true;
            document.getElementById("answer").innerText = word;
        }
    })
}

function update(){
    let correct = 0;
    for(let c =0; c < width; ++c){
        let currntTile = document.getElementById(row.toString() + "_" + c.toString());
        let letter = currntTile.innerText;

        //is it the correct letter?
        if (word[c] == letter){
            currntTile.classList.add("correct");
            correct += 1;
        }// is it in the word?
        else if (word.includes(letter)){
            currntTile.classList.add("present");
        }//not in the word
        else{
            currntTile.classList.add("absent");
        }

        //the guess is the word => gameOver
        if(correct == width){
            gameOver = true;
        }
    }
}