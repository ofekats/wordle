//this file contain the function that control the stats

function saveGameResult(win, numGuesses) {
    //get the data from the browser or start new data
    let stats = JSON.parse(localStorage.getItem('wordleStats')) || {
        gamesPlayed: 0,
        wins: 0,
        streak: 0,
        maxStreak: 0,
        guessDistribution: {}
    };
    //add to the count of the game played
    stats.gamesPlayed++;

    //is the game played in a streak? check if missed a date
    const gameState = JSON.parse(localStorage.getItem('gameState')) || '{}';
    if(gameState === '{}' || (!isDateYesterday(gameState.date) && gameState.date != getIsraelDate())){
      stats.streak = 0;
    }

    //if win - add to wins, streak, max-streak and guess distribution
    if (win) {
        stats.wins++;
        stats.streak++;
        stats.maxStreak = Math.max(stats.streak, stats.maxStreak);
        stats.guessDistribution[numGuesses] = (stats.guessDistribution[numGuesses] || 0) + 1;
        stats.lastGuess = numGuesses;
    } else { //if lost- start streak from the start
        stats.streak = 0;
        stats.lastGuess = -1;
    }

    //save the data in the browser
    localStorage.setItem('wordleStats', JSON.stringify(stats));
}

function getStats() {
    return JSON.parse(localStorage.getItem('wordleStats')) || {};
}

// Function to display the stats in the modal popup
function displayStats() {
    let stats = getStats();
  
   // Populate the stats in the table
  document.getElementById('gamesPlayed').textContent = stats.gamesPlayed || 0;
  document.getElementById('totalWins').textContent = stats.wins || 0;
  document.getElementById('currentStreak').textContent = stats.streak || 0;
  document.getElementById('maxStreak').textContent = stats.maxStreak || 0;

  // Populate the guess distribution
  const guessDistribution = stats.guessDistribution || {};
  const guessDistributionContainer = document.getElementById('guessDistribution');
  guessDistributionContainer.innerHTML = ''; // Clear any existing content

  const rawMaxGuessCount = Math.max(...Object.values(guessDistribution), 1); // Avoid division by zero
  const maxGuessCount = Math.max(rawMaxGuessCount, 200);
  const maxBarWidth = 500; // Maximum width in pixels

  let currentGuess = stats.lastGuess || 0;
  
  for (let i = 1; i <= 6; i++) {
    const guessCount = guessDistribution[i] || 0;
    const guessBar = document.createElement('div');
    guessBar.className = 'guessBar';

    // Create span for guess number (left side)
    const guessNumberSpan = document.createElement('span');
    guessNumberSpan.className = 'guessNumber';
    guessNumberSpan.textContent = i;

    // Create span for guess count (right side)
    const guessCountSpan = document.createElement('span');
    guessCountSpan.className = 'guessCount';
    guessCountSpan.textContent = guessCount;

    // Calculate the width of the bar based on maxBarWidth
    const percentage = (guessCount / maxGuessCount) * maxBarWidth;
    guessCountSpan.style.width = `${percentage}px`;

    // Apply the appropriate class based on whether it's the current guess
    if (i === currentGuess) {
      guessBar.classList.add('green');
    } else {
      guessBar.classList.add('gray');
    }

    // Append spans to the bar
    guessBar.appendChild(guessNumberSpan);
    guessBar.appendChild(guessCountSpan);

    guessDistributionContainer.appendChild(guessBar);
  }
  startCountdown();
  document.getElementById('statsModal').style.display = 'block';
  }
  
  // Get the modal element
  const modal = document.getElementById('statsModal');
  
  // Get the button that opens the modal
  const btn = document.getElementById('showStats');
  
  // Get the <span> element that closes the modal
  const span = document.getElementsByClassName('close')[0];
  
  // When the user clicks the button, open the modal
  btn.onclick = function () {
    displayStats();
  };
  
  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = 'none';
  };
  
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };
  
