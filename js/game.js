/**
 * game.js - Handles game logic and scoring
 */

import { getRandomCoordinates, showActualLocation, resetMap } from './map.js';
import { findStreetViewLocation, setPanoramaLocation } from './panorama.js';
import { updateScore, updateRound, showResult, endGame, enableSubmitButton, disableSubmitButton } from './ui.js';

// Game state variables
let actualLocation;
let totalScore = 0;
let currentRound = 1;
const maxRounds = 5;
let timerInterval;
let usedLocations = [];

/**
 * Initialize the game
 */
function initGame() {
    totalScore = 0;
    currentRound = 1;
    usedLocations = [];
    updateScore(totalScore);
    updateRound(currentRound, maxRounds);
    setupNewRound();
}

/**
 * Set up a new round with a random location
 */
function setupNewRound() {
    try {
        resetMap();
        const randomCoords = getRandomCoordinates();
        
        findStreetViewLocation(randomCoords, (location, error) => {
            if (error) {
                console.error('Error finding Street View location:', error);
                // Try again with a new location
                setupNewRound();
                return;
            }
            
            actualLocation = location;
            console.log('New round location:', location.lat(), location.lng());
            
            // Set the panorama to the new location
            setPanoramaLocation(location);
            
            // Start the timer for this round
            startTimer();
            
            // Enable the submit button
            enableSubmitButton();
        });
    } catch (error) {
        console.error('Error in setupNewRound:', error);
        // Try again after a short delay
        setTimeout(setupNewRound, 1000);
    }
}

/**
 * Start the timer for the current round
 */
function startTimer() {
    let timeLeft = 120; // 2 minutes in seconds
    const timerElement = document.getElementById("timer");
    const immersiveTimerElement = document.getElementById("immersive-timer");
    
    // Clear any existing timer
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    function updateTimer() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        const timerText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (timerElement) {
            timerElement.textContent = timerText;
        }
        
        if (immersiveTimerElement) {
            immersiveTimerElement.textContent = timerText;
        }
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeUp();
        } else {
            timeLeft--;
        }
    }
    
    updateTimer(); // Call once immediately to set initial display
    timerInterval = setInterval(updateTimer, 1000);
}

/**
 * Handle when time runs out for a round
 */
function handleTimeUp() {
    alert("Time's up! Moving to the next round.");
    submitGuess(); // This will handle submitting the current guess (or no guess) and moving to the next round
}

/**
 * Submit the current guess and calculate score
 */
function submitGuess() {
    try {
        // Clear the timer
        clearInterval(timerInterval);
        
        let guessLocation, distance, score;
        const guessMarker = window.guessMarker; // Access from global scope
        
        if (!guessMarker) {
            console.log("No guess made");
            guessLocation = null;
            distance = 2000; // Max distance
            score = 0;
        } else {
            guessLocation = guessMarker.getPosition();
            
            if (!actualLocation) {
                console.error("actualLocation is not set");
                return;
            }
            
            distance = google.maps.geometry.spherical.computeDistanceBetween(guessLocation, actualLocation) / 1000; // Convert to km
            score = calculateScore(distance);
        }
        
        console.log("Distance:", distance);
        console.log("Score for this round:", score);
        
        totalScore += score;
        console.log("Total score:", totalScore);
        
        // Show the actual location on the map
        showActualLocation(actualLocation);
        
        // Update UI with results
        showResult(distance, score);
        updateScore(totalScore);
        
        // Move to next round or end game
        currentRound++;
        if (currentRound > maxRounds) {
            endGame(totalScore, maxRounds);
        } else {
            updateRound(currentRound, maxRounds);
            setTimeout(setupNewRound, 5000);
        }
    } catch (error) {
        console.error("Error in submitGuess function:", error);
    }
}

/**
 * Calculate score based on distance
 * @param {number} distance - Distance in kilometers
 * @returns {number} The calculated score
 */
function calculateScore(distance) {
    if (isNaN(distance) || distance === Infinity) {
        console.error('Invalid distance:', distance);
        return 0;
    }
    const maxDistance = 2000; // km
    const maxScore = 5000;
    let score = Math.max(0, Math.round(maxScore * (1 - distance / maxDistance)));
    return score;
}

/**
 * Get Japanese expertise level based on score percentage
 * @param {number} percentage - Score percentage
 * @returns {string} Expertise level description
 */
function getJapaneseLevel(percentage) {
    if (percentage >= 90) return "日本地理マスター (Nihon Chiri Master)";
    if (percentage >= 70) return "本通 (Nihon-tsū)";
    if (percentage >= 50) return "地理オタク (Chiri Otaku)";
    if (percentage >= 30) return "旅行好き (Ryokō-zuki)";
    return "駅前迷子 (Ekimae Maigo)";
}

/**
 * Reset the game to start a new one
 */
function resetGame() {
    totalScore = 0;
    currentRound = 1;
    resetMap();
    usedLocations = [];
    
    // Reset the game container to its initial state
    const gameContainer = document.getElementById("game-container");
    if (gameContainer) {
        gameContainer.innerHTML = `
            <h1>Japan-tsū</h1>
            <div id="timer">2:00</div>
            <div id="panorama"></div>
            <div id="map"></div>
            <button id="submit-guess">Submit Guess</button>
            <div id="score">Total Score: 0</div>
            <div id="round">Round: 1 / 5</div>
            <div id="result" style="display: none;"></div>
        `;
    }
    
    // Initialize the game again
    initGame();
}

// Export functions for use in other modules
export {
    initGame,
    setupNewRound,
    submitGuess,
    calculateScore,
    getJapaneseLevel,
    resetGame,
    handleTimeUp
};