// this file contion the function to choose the message the user get when he wins the game based on the guess number

// Define the messages for each guess number
const messages = {
    1: ["That’s unbelievable!", "You are the luckiest ever!", "You are the greatest of all time!"],
    2: ["Wow!", "You are awesome!", "Incredible job!"],
    3: ["Great work!", "Nicely done!", "You’re on fire!"],
    4: ["Good job!", "Well played!", "You're doing well!"],
    5: ["Phew, you made it!", "Nice save!", "Close call, but you got it!"],
    6: ["You barely made it!", "That was close!", "Lucky guess!"]
};

// Function to get a random message based on the guess number
function getRandomMessage(guessNumber) {
    const messagesForGuess = messages[guessNumber];
    if (!messagesForGuess) {
        return "You are awesome!"; // Fallback in case of an invalid guess number
    }
    const randomIndex = Math.floor(Math.random() * messagesForGuess.length);
    return messagesForGuess[randomIndex];
}

