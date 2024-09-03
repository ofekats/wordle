//this file contain the function that control the popups

//function to show the popup with the message as input for 1 second (black backgrand small popup)
function showPopUp(popupMessage){
    const popup = document.getElementById('popup');
    popup.innerText = popupMessage;
    // Show the pop-up
    popup.classList.remove('hidden');
    popup.classList.add('show');

    // Hide the pop-up after 2 second (2000ms)
    setTimeout(function() {
        popup.classList.remove('show');
        popup.classList.add('hidden');
    }, 2000);  // 2 seconds delay
}

//show the how to play popup each time the page loads and when click on the how to play image (?)
document.addEventListener('DOMContentLoaded', () => {
    const popup = document.getElementById('popup-how-to-play');
    const closeButton = document.querySelector('.close-button');
    const showPopupButton = document.getElementById('show-how-to-play-popup');

    // Function to show the popup
    function showPopup() {
        popup.style.display = 'block';
    }

    // Function to hide the popup
    function hidePopup() {
        popup.style.display = 'none';
    }

    // Show the popup when the page loads
    const gameState = JSON.parse(localStorage.getItem('gameState')) || '{}';
    
    if(gameState === '{}' || gameState.date != getIsraelDate()){
        showPopup();
    }

    // Show the popup when the image is clicked
    showPopupButton.addEventListener('click', showPopup);

    // Hide the popup when the close button is clicked
    closeButton.addEventListener('click', hidePopup);

    // Hide the popup when clicking outside of it
    window.addEventListener('click', (event) => {
        if (event.target === popup) {
            hidePopup();
        }
    });
});