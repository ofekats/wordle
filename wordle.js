
var height = 6; //number of guesses
var width = 5; //length of the word

var row = 0;
var col = 0;

var gameOver = false;

// var word = "SUQID";
//wordList defined in file "wordList.js"
var word = wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();
//the answer!!!!!
console.log(word);

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

    //create the key board
    let keyboard = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
        ["Enter", "Z", "X", "C", "V", "B", "N", "M", "⌫" ]
    ]

    for(let i = 0; i < keyboard.length; ++i){
        let currentRow = keyboard[i];
        let keyboardRow = document.createElement("div");
        keyboardRow.classList.add("keyboard-row");

        for(let j = 0; j < currentRow.length; ++j){
            let keyTile = document.createElement("div");
            let key = currentRow[j];
            keyTile.innerText = key;
            if(key == "Enter"){
                keyTile.id = "Enter";
            }
            else if (key == "⌫"){
                keyTile.id = "Backspace";
            }
            else if ("A" <= key && key <= "Z"){
                keyTile.id = "Key" + key;
            }
            keyTile.addEventListener("click", processKey)

            if(key == "Enter"){
                keyTile.classList.add("enter-key-tile");
            }else{
                keyTile.classList.add("key-tile");
            }
            keyboardRow.appendChild(keyTile);
        }
        document.body.appendChild(keyboardRow);
    }

    // user input
    document.addEventListener("keyup", (e) => {
        processInput(e);
    })
}

function processKey(){
    let e = {"code": this.id};
    processInput(e);
}

function processInput(e){
    if(gameOver) return;

    // if the user enter a letter
    if("KeyA" <= e.code && e.code <= "KeyZ"){
        if(col < width){
            let currentTile = document.getElementById(row.toString() + "_" + col.toString());
            if (currentTile.innerText == ""){
                currentTile.innerText = e.code[3];
                col += 1;
            }
        }
    }
    else if (e.code == "Backspace"){
            if (0 < col && col <= width){
                col -= 1;
            }
            let currentTile = document.getElementById(row.toString() + "_" + col.toString());
            currentTile.innerText = "";
    }
    else if (e.code == "Enter" && col == width){
        update();
    }

    if(!gameOver && row == height){
        gameOver = true;
        document.getElementById("answer").innerText = word;
    }
}

function update(){
    //check if the guess is a word
    let guess = "";
    document.getElementById("answer").innerText = "";
    //string up the guess word
    for(let c = 0; c < width; ++c){
        let currentTile = document.getElementById(row.toString() + "_" + c.toString());
        let letter = currentTile.innerText;
        guess += letter;
    }
    guess = guess.toLowerCase();
    if(!wordList.includes(guess)){
        document.getElementById("answer").innerText = "Not in word list";
        return;
    }
    
    //start processing game
    let correct = 0;
    let letterCount = {};
    for(let i = 0; i < word.length; ++i){
        letter = word[i];
        if(letterCount[letter]){
            letterCount[letter] += 1;
        }else {
            letterCount[letter] = 1;
        }
    }

    //check all the correct ones
    for(let c =0; c < width; ++c){
        let currentTile = document.getElementById(row.toString() + "_" + c.toString());
        let letter = currentTile.innerText;

        //is it the correct letter?
        if (word[c] == letter){
            currentTile.classList.add("correct");
            //update style in keybord
            let keyTile = document.getElementById("Key" + letter);
            keyTile.classList.remove("present");
            keyTile.classList.add("correct");
            correct += 1;
            letterCount[letter] -= 1;
        }

        //the guess is the word => gameOver
        if(correct == width){
            gameOver = true;
        }
    }

    //check all the letter in the word but not in the correct place
    for(let c =0; c < width; ++c){
        let currentTile = document.getElementById(row.toString() + "_" + c.toString());
        let letter = currentTile.innerText;
        if(!currentTile.classList.contains("correct")){
            // is it in the word?
            if (word.includes(letter) && letterCount[letter] > 0){
                currentTile.classList.add("present");
                //update style in keybord
                let keyTile = document.getElementById("Key" + letter);
                if( !keyTile.classList.contains("correct")){
                    keyTile.classList.add("present");
                }
                letterCount[letter] -= 1;
            }//not in the word
            else{
                currentTile.classList.add("absent");
                //update style in keybord
                let keyTile = document.getElementById("Key" + letter);
                keyTile.classList.add("absent");
            }
        }
    }
    
    row += 1;
    col = 0;
}


//need to add alert when game is over or you have won or word not in wordlist