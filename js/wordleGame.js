//this file contain the main functions for the game

var height = 6; //number of guesses
var width = 5; //length of the word

var row = 0;
var col = 0;

var gameOver = false;

//the answer:
//wordList and guessList defined in file "wordList.js"
// var word = wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();
//each day a diffrente word
var word = selectTodaysWord(wordList);
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

    //check if already played today
    const gameState = JSON.parse(localStorage.getItem('gameState')) || {};
    if(gameState != {} && gameState.date === getIsraelDate()){
        loadBoardFromGameState(gameState);
        gameOver = true;
        sleep(100);
        displayStats();
        return;
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

async function processInput(e){
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
        //check if the guess is a word
        let guess = "";
        //string up the guess word
        for(let c = 0; c < width; ++c){
            let currentTile = document.getElementById(row.toString() + "_" + c.toString());
            let letter = currentTile.innerText;
            guess += letter;
        }
        guess = guess.toLowerCase();
        if(!guessList.includes(guess)){
            
            //vibrate the tiles
            for(let c = 0; c < width; ++c){
                let currentTile = document.getElementById(row.toString() + "_" + c.toString());
                triggerVibration(currentTile);
            }
            showPopUp("Not in word list");
            return;
        }
        update_board();
        await sleep(2000);
        update_keyboard();
    }
    else if (e.code == "Enter"){ //Not enough letters
        //vibrate the tiles
        for(let c = 0; c < width; ++c){
            let currentTile = document.getElementById(row.toString() + "_" + c.toString());
            triggerVibration(currentTile);
        }
        showPopUp("Not enough letters");
        return;
    }

    if(!gameOver && row == height){
        gameOver = true;
        saveGameResult(0, row); //lose the game
        saveStateGame();
        showPopUp("maybe next time...")
        sleep(200);
        displayStats();
    }
}

async function update_board(){
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
    
    //listclass for the tiles
    listclass = ["absent", "absent", "absent", "absent", "absent"];
    //check all the correct ones
    for(let c =0; c < width; ++c){
        let currentTile = document.getElementById(row.toString() + "_" + c.toString());
        let letter = currentTile.innerText;
        //is it the correct letter?
        if (word[c] == letter){
            //save the class color
            listclass[c] = "correct";

            correct += 1;
            letterCount[letter] -= 1;
        }

        //the guess is the word => gameOver, you won!
        if(correct == width){
            for(let c =0; c < width; ++c){
                let currentTile = document.getElementById(row.toString() + "_" + c.toString());
                //flip the tile
                flipTile(currentTile, "correct");
                await sleep(300);
            }
            gameOver = true;
            showPopUp(getRandomMessage(row));
            saveGameResult(1, row); //win the game
            saveStateGame();
            //bounce the tiles
            for(let c = 0; c < width; ++c){
                let currentTile = document.getElementById(row.toString() + "_" + c.toString());
                triggerBounce(currentTile);
                await sleep(100);
            }
            sleep(200);
            displayStats();
            return;
        }
    }

    //check all the letter in the word but not in the correct place
    for(let c =0; c < width; ++c){
        let currentTile = document.getElementById(row.toString() + "_" + c.toString());
        let letter = currentTile.innerText;
        if(listclass[c] != "correct"){
            // is it in the word?
            if (word.includes(letter) && letterCount[letter] > 0){
                //save the class color
                listclass[c] = "present";
                letterCount[letter] -= 1;
            }//not in the word
            else{
                //the default class color of the tiles is absent
            }
        }
    }
    
    for(let c =0; c < width; ++c){
        let currentTile = document.getElementById(row.toString() + "_" + c.toString());
        //flip the tile and change the color
        flipTile(currentTile, listclass[c]);
        await sleep(300); // Wait for 300ms before flipping the next tile
    }
}

async function update_keyboard(){
    
    //check all the correct ones
    for(let c =0; c < width; ++c){
        let currentTile = document.getElementById(row.toString() + "_" + c.toString());
        let letter = currentTile.innerText;

        //is it the correct letter?
        if (word[c] == letter){
            
            //update style in keybord
            let keyTile = document.getElementById("Key" + letter);
            keyTile.classList.remove("present");
            keyTile.classList.add("correct");
            
        }
    }

    //check all the letter in the word but not in the correct place
    for(let c =0; c < width; ++c){
        let currentTile = document.getElementById(row.toString() + "_" + c.toString());
        let letter = currentTile.innerText;
        if(!currentTile.classList.contains("correct")){
            // is it in the word?
            if (word.includes(letter)){
                //update style in keybord
                let keyTile = document.getElementById("Key" + letter);
                if( !keyTile.classList.contains("correct")){
                    keyTile.classList.add("present");
                }
            }//not in the word
            else{
                //update style in keybord
                let keyTile = document.getElementById("Key" + letter);
                keyTile.classList.add("absent");
            }
        }
    }
    row += 1;
    col = 0;
}

//to make the tiles change one by one
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


//need to add alert when game is over or you have won