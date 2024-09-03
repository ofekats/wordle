//this file contains the function that control the movement of the board tiles

//fliping the tiles after an enter to reveal the color of the tiles
function flipTile(tile, status) {
    tile.classList.add('flip');
  
    // After the flip animation, change the background color
    setTimeout(() => {
      tile.classList.remove('flip');
      tile.classList.remove('absent');
      tile.classList.add(status); // status can be 'correct', 'present', or 'absent'
    }, 300); // half of the flip duration
}

//vibrate the tiles if the word is not on the word list
function triggerVibration(tile) {
    tile.classList.add('vibrate');
  
    // remove the vibration after a short time
    setTimeout(() => {
      tile.classList.remove('vibrate');
    }, 600); // Vibrates for 600ms
}

//bounce the tiles if the word is not on the word list
function triggerBounce(tile) {
    tile.classList.add('bounce');
  
    // remove the bounce after a short time
    setTimeout(() => {
      tile.classList.remove('bounce');
    }, 600); // bounce for 600ms
}