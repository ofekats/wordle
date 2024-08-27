
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

async function update(){
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
        // document.getElementById("answer").innerText = "Not in word list";
        
        //vibrate the tiles
        for(let c = 0; c < width; ++c){
            let currentTile = document.getElementById(row.toString() + "_" + c.toString());
            triggerVibration(currentTile);
        }
        showPopUp("Not in word list");
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
            //flip the tile
            flipTile(currentTile, "correct");
            await sleep(300); // Wait for 300ms before flipping the next tile
            
            //update style in keybord
            let keyTile = document.getElementById("Key" + letter);
            keyTile.classList.remove("present");
            keyTile.classList.add("correct");
            correct += 1;
            letterCount[letter] -= 1;
        }

        //the guess is the word => gameOver, you won!
        if(correct == width){
            gameOver = true;
            showPopUp("You are awesome!");
        }
    }

    //check all the letter in the word but not in the correct place
    for(let c =0; c < width; ++c){
        let currentTile = document.getElementById(row.toString() + "_" + c.toString());
        let letter = currentTile.innerText;
        if(!currentTile.classList.contains("correct")){
            // is it in the word?
            if (word.includes(letter) && letterCount[letter] > 0){
                //flip the tile
                flipTile(currentTile, "present");
                await sleep(300); // Wait for 300ms before flipping the next tile

                //update style in keybord
                let keyTile = document.getElementById("Key" + letter);
                if( !keyTile.classList.contains("correct")){
                    keyTile.classList.add("present");
                }
                letterCount[letter] -= 1;
            }//not in the word
            else{
                //flip the tile
                flipTile(currentTile, "absent");
                await sleep(300); // Wait for 300ms before flipping the next tile

                //update style in keybord
                let keyTile = document.getElementById("Key" + letter);
                keyTile.classList.add("absent");
            }
        }
    }
    
    row += 1;
    col = 0;
}

//function to show the popup with the message as input for 1 second
function showPopUp(popupMessage){
    const popup = document.getElementById('popup');
    popup.innerText = popupMessage;
    // Show the pop-up
    popup.classList.remove('hidden');
    popup.classList.add('show');

    // Hide the pop-up after 1 second (1000ms)
    setTimeout(function() {
        popup.classList.remove('show');
        popup.classList.add('hidden');
    }, 2000);  // 1 second delay
}

//fliping the tiles after an enter to reveal the color of the tiles
function flipTile(tile, status) {
    tile.classList.add('flip');
  
    // After the flip animation, change the background color
    setTimeout(() => {
      tile.classList.remove('flip');
      tile.classList.remove('absent');
      tile.classList.add(status); // status can be 'correct', 'present', or 'absent'
    }, 300); // Adjust timing as needed (half of the flip duration)
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//vibrate the tiles if the word is not on the word list
function triggerVibration(tile) {
    tile.classList.add('vibrate');
  
    // Optionally, remove the vibration after a short time
    setTimeout(() => {
      tile.classList.remove('vibrate');
    }, 600); // Vibrates for 600ms
}


//need to add alert when game is over or you have won or word not in wordlist