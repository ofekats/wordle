//this file contain the function that save and present the game state if you already played the wordle on this date

function saveStateGame() {
    let guesses = [];
    let boardState = [];

    for (let r = 0; r < height; ++r) {
        let guess = ""; 
        let state = []; 

        for (let c = 0; c < width; ++c) {
            let currentTile = document.getElementById(r.toString() + "_" + c.toString());
            guess += currentTile.innerText; // Concatenate the letter to the guess string
            state.push(currentTile.classList.toString()); // Add the class list as a string to the state array
        }

        guesses.push(guess); // Add the current guess to the guesses array
        boardState.push(state); // Add the current state to the boardState array
    }
    const gameState = {
        date: getIsraelDate(),
        guesses: guesses,
        boardState: boardState
      };
      localStorage.setItem('gameState', JSON.stringify(gameState));
}

function loadBoardFromGameState(gameState){
    const map = { //map to control the tile color
        "tile correct": "correct",
        "tile absent": "absent",
        "tile present": "present",
        "tile correct bounce": "correct"
    }
    for (let r = 0; r < height; ++r) {
        let guess = gameState.guesses[r]; 
        let state = gameState.boardState[r]; 
        if (guess === ""){
            return;
        }
        for (let c = 0; c < width; ++c) {
            let currentTile = document.getElementById(r.toString() + "_" + c.toString());
            currentTile.innerText = guess[c];
            currentTile.classList.add(map[state[c]]);
        }
    }

}
