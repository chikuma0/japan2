/**
 * ui.js - Handles UI updates and interactions
 */

import { getJapaneseLevel } from './game.js';

// UI state variables
let isImmersiveMode = false;

/**
 * Update the score display
 * @param {number} totalScore - The current total score
 */
function updateScore(totalScore) {
    const scoreElement = document.getElementById("score");
    if (scoreElement) {
        scoreElement.textContent = `Total Score: ${totalScore}`;
    } else {
        console.error("Score element not found");
    }
}

/**
 * Update the round display
 * @param {number} currentRound - The current round number
 * @param {number} maxRounds - The maximum number of rounds
 */
function updateRound(currentRound, maxRounds) {
    const roundElement = document.getElementById("round");
    if (roundElement) {
        roundElement.textContent = `Round: ${currentRound} / ${maxRounds}`;
    } else {
        console.error("Round element not found");
    }
}

/**
 * Show the result of the current round
 * @param {number} distance - Distance in kilometers
 * @param {number} score - Score for this round
 */
function showResult(distance, score) {
    const resultElement = document.getElementById("result");
    if (resultElement) {
        resultElement.innerHTML = `Distance: ${distance.toFixed(2)} km | Points: +${score}`;
        resultElement.style.display = "block";
        
        // Add pulse animation
        resultElement.classList.add('pulse');
        setTimeout(() => resultElement.classList.remove('pulse'), 1500);
    } else {
        console.error("Result element not found");
    }
}

/**
 * End the game and show final results
 * @param {number} totalScore - The final total score
 * @param {number} maxRounds - The maximum number of rounds
 */
function endGame(totalScore, maxRounds) {
    const maxPossibleScore = 5000 * maxRounds;
    const scorePercentage = (totalScore / maxPossibleScore) * 100;
    let assessment = getJapaneseLevel(scorePercentage);
    
    // Determine which card to show based on score percentage
    let cardClass = 'card-novice';
    if (scorePercentage >= 90) cardClass = 'card-master';
    else if (scorePercentage >= 70) cardClass = 'card-expert';
    else if (scorePercentage >= 50) cardClass = 'card-intermediate';
    else if (scorePercentage >= 30) cardClass = 'card-beginner';
    
    const gameContainer = document.getElementById("game-container");
    if (gameContainer) {
        gameContainer.innerHTML = `
            <div id="result-container">
                <h1>Japan-tsū: Game Over</h1>
                <div class="result-card ${cardClass}"></div>
                <div id="final-score">
                    <p>Final Score: ${totalScore} / ${maxPossibleScore}</p>
                    <p>Percentage: ${scorePercentage.toFixed(2)}%</p>
                    <p>Level: ${assessment}</p>
                </div>
                <p id="game-url">Play at: japan2.xyz</p>
            </div>
            <button onclick="shareResult()">Share Result</button>
            <button onclick="resetGameGlobal()">Play Again</button>
        `;
        
        // Apply styles to result container
        const resultContainer = document.getElementById('result-container');
        if (resultContainer) {
            resultContainer.style.backgroundColor = '#1a1a1a';
            resultContainer.style.color = '#33ff33';
            resultContainer.style.padding = '20px';
            resultContainer.style.border = '4px solid #33ff33';
            resultContainer.style.boxShadow = '0 0 0 4px #006400, 0 0 10px rgba(51, 255, 51, 0.5)';
            resultContainer.style.fontFamily = "'Press Start 2P', cursive";
            resultContainer.style.textAlign = 'center';
            resultContainer.style.width = '300px';
            resultContainer.style.margin = '0 auto';
            
            // Style the URL specifically
            const gameUrl = document.getElementById('game-url');
            if (gameUrl) {
                gameUrl.style.marginTop = '20px';
                gameUrl.style.fontSize = '12px';
                gameUrl.style.color = '#33ff33';
            }
        }
    } else {
        console.error("Game container element not found");
    }
}

/**
 * Toggle immersive mode
 */
function toggleImmersiveMode() {
    isImmersiveMode = !isImmersiveMode;
    const immersiveView = document.getElementById('immersive-view');
    const gameContainer = document.getElementById('game-container');
    
    if (!immersiveView || !gameContainer) {
        console.error("Required elements for immersive mode not found");
        return;
    }
    
    if (isImmersiveMode) {
        immersiveView.style.display = 'block';
        gameContainer.style.display = 'none';
        
        // Update timer in immersive mode
        updateImmersiveTimer();
    } else {
        immersiveView.style.display = 'none';
        gameContainer.style.display = 'block';
    }
}

/**
 * Update the timer display in immersive mode
 */
function updateImmersiveTimer() {
    const immersiveTimerElement = document.getElementById("immersive-timer");
    const timerElement = document.getElementById("timer");
    
    if (immersiveTimerElement && timerElement) {
        immersiveTimerElement.textContent = timerElement.textContent;
    }
}

/**
 * Enable the submit guess button
 */
function enableSubmitButton() {
    const submitButton = document.getElementById('submit-guess');
    if (submitButton) {
        submitButton.disabled = false;
    } else {
        console.error("Submit button not found");
    }
}

/**
 * Disable the submit guess button
 */
function disableSubmitButton() {
    const submitButton = document.getElementById('submit-guess');
    if (submitButton) {
        submitButton.disabled = true;
    } else {
        console.error("Submit button not found");
    }
}

/**
 * Check if all required UI elements exist
 */
function checkElements() {
    const elements = ['result', 'score', 'round', 'submit-guess'];
    let allFound = true;
    
    elements.forEach(id => {
        const element = document.getElementById(id);
        if (!element) {
            console.error(`Element with id "${id}" not found`);
            allFound = false;
        } else {
            console.log(`Element with id "${id}" found`);
        }
    });
    
    return allFound;
}

// Export functions for use in other modules
export {
    updateScore,
    updateRound,
    showResult,
    endGame,
    toggleImmersiveMode,
    updateImmersiveTimer,
    enableSubmitButton,
    disableSubmitButton,
    checkElements
};