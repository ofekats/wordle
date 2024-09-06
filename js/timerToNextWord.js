//this file contain the function to calculate the time remains until the next word

function getIsraelDateTime() {
    const now = new Date();
    const isDST = now.getMonth() > 2 && now.getMonth() < 10; // DST typically starts in March and ends in October
    const israelOffset = now.getTimezoneOffset() + (isDST ? 180 : 120); // UTC+3 for summer, UTC+2 for winter
    const israelDate = new Date(now.getTime() + israelOffset * 60 * 1000);
    return israelDate; //return a DATE object
}

function calculateTimeUntilMidnight() {
    const now = getIsraelDateTime();
    
    // Calculate the next midnight in Israel time
    const tomorrow = new Date(now);
    tomorrow.setHours(24, 0, 0, 0); // Set to midnight of the next day
    
    const timeUntilMidnight = tomorrow - now; // Time difference in milliseconds
    return timeUntilMidnight;
}

function startCountdown() {
    const countdownElement = document.getElementById('countdown');
    
    function updateCountdown() {
        const timeUntilMidnight = calculateTimeUntilMidnight();
        
        // Convert milliseconds to hours, minutes, and seconds
        const hours = Math.floor(timeUntilMidnight / (1000 * 60 * 60));
        const minutes = Math.floor((timeUntilMidnight % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeUntilMidnight % (1000 * 60)) / 1000);
        
        // Display the countdown
        countdownElement.textContent = `time until the next word: ${hours}h ${minutes}m ${seconds}s`;
        
        // Update the countdown every second
        if (timeUntilMidnight >= 1000) { // Give a 1-second grace period
            setTimeout(updateCountdown, 1000);
        } else {
            countdownElement.textContent = "New word available!";
            // Reload the page after a short delay
            setTimeout(() => {
                window.location.reload(); // Reloads the page
            }, 1000); // 1-second delay to show the "New word available!" message
        }
    }
    
    updateCountdown(); // Start the countdown
}
