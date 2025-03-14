/**
 * ui.js - Handles UI updates and interactions
 */

// UI state variables
window.isImmersiveMode = true; // Default to immersive mode

/**
 * Update the score display
 * @param {number} totalScore - The current total score
 */
function updateScore(totalScore) {
    // Update score in both interfaces for consistency
    const scoreElement = document.getElementById("score");
    if (scoreElement) {
        scoreElement.textContent = `Total Score: ${totalScore}`;
        scoreElement.classList.add('pulse');
        setTimeout(() => scoreElement.classList.remove('pulse'), 1000);
    }
    
    // Update immersive score
    const immersiveScoreElement = document.getElementById("immersive-score");
    if (immersiveScoreElement) {
        immersiveScoreElement.textContent = `Score: ${totalScore}`;
        immersiveScoreElement.classList.add('pulse');
        setTimeout(() => immersiveScoreElement.classList.remove('pulse'), 1000);
    }
    
    // Update timer progress bar
    updateTimerProgress();
}

/**
 * Update the round display
 * @param {number} currentRound - The current round number
 * @param {number} maxRounds - The maximum number of rounds
 */
function updateRound(currentRound, maxRounds) {
    console.log(`Updating round display: ${currentRound} / ${maxRounds}`);
    
    // Update round in both interfaces for consistency
    const roundElement = document.getElementById("round");
    if (roundElement) {
        roundElement.textContent = `Round: ${currentRound} / ${maxRounds}`;
    }
    
    // Update immersive round
    const immersiveRoundElement = document.getElementById("immersive-round");
    if (immersiveRoundElement) {
        immersiveRoundElement.textContent = `Round: ${currentRound}/${maxRounds}`;
    }
}

/**
 * Update the timer progress bar
 * @param {number} timeLeft - Time left in seconds (optional)
 * @param {number} totalTime - Total time in seconds (optional, defaults to 120)
 */
function updateTimerProgress(timeLeft, totalTime = 120) {
    const progressBar = document.getElementById("timer-progress")?.querySelector(".progress-bar");
    if (progressBar) {
        // If timeLeft is not provided, don't update the width
        if (typeof timeLeft === 'number') {
            const percentage = (timeLeft / totalTime) * 100;
            progressBar.style.width = `${percentage}%`;
            
            // Change color based on time left
            if (percentage < 25) {
                progressBar.style.background = 'var(--gradient-accent)';
            } else if (percentage < 50) {
                progressBar.style.background = 'linear-gradient(135deg, var(--color-accent), var(--color-primary))';
            } else {
                progressBar.style.background = 'var(--gradient-primary)';
            }
        }
    }
}

/**
 * Show the result of the current round
 * @param {number} distance - Distance in kilometers
 * @param {number} score - Score for this round
 */
function showResult(distance, score) {
    // If in immersive mode, use the immersive result display
    if (window.isImmersiveMode) {
        showImmersiveResult(distance, score);
        return;
    }
    
    // Legacy result display for non-immersive mode
    const resultElement = document.getElementById("result");
    if (resultElement) {
        // Create a card-like result display
        resultElement.innerHTML = `
            <div class="card card-primary">
                <div class="card-header">
                    <h3>Round Result</h3>
                </div>
                <div class="card-body">
                    <p><strong>Distance:</strong> ${distance.toFixed(2)} km</p>
                    <p><strong>Points:</strong> <span class="badge badge-accent">+${score}</span></p>
                </div>
            </div>
        `;
        resultElement.style.display = "block";
        
        // Add pop animation
        resultElement.classList.add('pop');
        setTimeout(() => resultElement.classList.remove('pop'), 1500);
        
        // Show confetti for good scores
        if (score > 4000) {
            showConfetti();
        }
        
        // Also show location info if available
        // Use the currentLocationData from game.js
        if (window.currentLocationData) {
            showLocationInfo(window.currentLocationData, distance);
        }
    } else {
        console.error("Result element not found");
    }
}

/**
 * Show the result of the current round in the immersive interface
 * @param {number} distance - Distance in kilometers
 * @param {number} score - Score for this round
 */
function showImmersiveResult(distance, score) {
    const resultsPanel = document.getElementById("immersive-results");
    if (!resultsPanel) {
        console.error("Immersive results panel not found");
        return;
    }
    
    // Calculate accuracy rating based on distance
    let accuracyRating = '';
    let accuracyClass = '';
    
    if (distance < 1) {
        accuracyRating = 'Perfect!';
        accuracyClass = 'badge-accent';
    } else if (distance < 5) {
        accuracyRating = 'Excellent!';
        accuracyClass = 'badge-primary';
    } else if (distance < 20) {
        accuracyRating = 'Great!';
        accuracyClass = 'badge-primary';
    } else if (distance < 50) {
        accuracyRating = 'Good';
        accuracyClass = 'badge-secondary';
    } else if (distance < 100) {
        accuracyRating = 'Not bad';
        accuracyClass = 'badge-secondary';
    } else if (distance < 200) {
        accuracyRating = 'Could be better';
        accuracyClass = 'badge-secondary';
    } else {
        accuracyRating = 'Way off';
        accuracyClass = 'badge-secondary';
    }
    
    // Get current round and max rounds
    const currentRound = document.getElementById("immersive-round")?.textContent.split('/')[0].trim() || '1';
    const maxRounds = document.getElementById("immersive-round")?.textContent.split('/')[1].trim() || '5';
    const isLastRound = currentRound === maxRounds;
    
    // Format results panel content
    resultsPanel.innerHTML = `
        <div class="results-header">
            <h3>Round Result</h3>
            <button class="close-results">×</button>
        </div>
        <div class="results-content">
            <div class="result-stats">
                <div class="result-distance">
                    <strong>Distance:</strong> ${distance.toFixed(2)} km
                </div>
                <div class="result-score">
                    <strong>Points:</strong> <span class="badge badge-accent">+${score}</span>
                </div>
                <div class="result-accuracy">
                    <strong>Accuracy:</strong> <span class="badge ${accuracyClass}">${accuracyRating}</span>
                </div>
            </div>
            ${window.currentLocationData ? `
                <div class="location-info">
                    <h4>${window.currentLocationData.name || 'Unknown location'}</h4>
                    <p><strong>Region:</strong> <span class="badge badge-secondary">${window.currentLocationData.region || 'Unknown region'}</span></p>
                    ${window.currentLocationData.facts ? `<p><strong>Fun Fact:</strong> ${window.currentLocationData.facts}</p>` : ''}
                </div>
            ` : ''}
            <div class="next-round-btn">
                <button class="btn btn-primary" id="next-round-btn">
                    ${isLastRound ? 'See Final Results' : 'Next Round'}
                </button>
                <div class="auto-next-timer">
                    <span>Next round in <span id="auto-next-countdown">3</span>...</span>
                </div>
            </div>
        </div>
    `;
    
    // Show the results panel
    resultsPanel.style.display = "block";
    
    // Add event listener to close button
    const closeButton = resultsPanel.querySelector(".close-results");
    if (closeButton) {
        closeButton.addEventListener("click", () => {
            resultsPanel.style.display = "none";
            // Cancel auto-transition if user closes the panel
            if (window.autoNextTimeout) {
                clearTimeout(window.autoNextTimeout);
                window.autoNextTimeout = null;
            }
        });
    }
    
    // Add event listener to next round button
    const nextRoundButton = document.getElementById("next-round-btn");
    if (nextRoundButton) {
        nextRoundButton.addEventListener("click", () => {
            resultsPanel.style.display = "none";
            // Cancel auto-transition if user clicks the button
            if (window.autoNextTimeout) {
                clearTimeout(window.autoNextTimeout);
                window.autoNextTimeout = null;
            }
            
            if (isLastRound) {
                endGame(window.totalScore, parseInt(maxRounds), window.usedLocations);
            } else {
                // Start the journey animation
                if (typeof window.startJourneyAnimation === 'function') {
                    window.startJourneyAnimation();
                }
            }
        });
    }
    
    // Show confetti for good scores
    if (score > 4000) {
        showConfetti();
    }
    
    // Set up automatic transition after 3.7 seconds
    if (!isLastRound) {
        // Set up countdown timer
        let countdown = 3;
        const countdownElement = document.getElementById("auto-next-countdown");
        
        // Update countdown every second
        const countdownInterval = setInterval(() => {
            countdown--;
            if (countdownElement) {
                countdownElement.textContent = countdown;
            }
            
            if (countdown <= 0) {
                clearInterval(countdownInterval);
            }
        }, 1000);
        
        // Set timeout for auto-transition
        window.autoNextTimeout = setTimeout(() => {
            // Clear the interval if it's still running
            clearInterval(countdownInterval);
            
            // Hide results panel
            resultsPanel.style.display = "none";
            
            // Start journey animation
            if (typeof window.startJourneyAnimation === 'function') {
                window.startJourneyAnimation();
            }
        }, 3700); // 3.7 seconds
    }
}

/**
 * End the game and show final results
 * @param {number} totalScore - The final total score
 * @param {number} maxRounds - The maximum number of rounds
 * @param {Array} usedLocations - The locations used in the game
 */
function endGame(totalScore, maxRounds, usedLocations = []) {
    console.log(`Ending game with totalScore=${totalScore}, maxRounds=${maxRounds}, usedLocations.length=${usedLocations.length}`);
    
    // Clear any existing timers or intervals
    const timerInterval = window.timerInterval;
    if (timerInterval) {
        clearInterval(timerInterval);
        window.timerInterval = null;
    }
    
    // Clear auto-next timeout if it exists
    if (window.autoNextTimeout) {
        clearTimeout(window.autoNextTimeout);
        window.autoNextTimeout = null;
    }
    
    const maxPossibleScore = 5000 * maxRounds;
    const scorePercentage = (totalScore / maxPossibleScore) * 100;
    console.log(`Max possible score: ${maxPossibleScore}, Score percentage: ${scorePercentage.toFixed(2)}%`);
    
    let assessment = window.getJapaneseLevel ? window.getJapaneseLevel(scorePercentage) : "日本通 (Nihon-tsū)";
    console.log(`Assessment: ${assessment}`);
    
    // Determine which card to show based on score percentage
    let cardClass = 'result-card-novice';
    if (scorePercentage >= 90) cardClass = 'result-card-master';
    else if (scorePercentage >= 70) cardClass = 'result-card-expert';
    else if (scorePercentage >= 50) cardClass = 'result-card-intermediate';
    else if (scorePercentage >= 30) cardClass = 'result-card-beginner';
    
    console.log(`Card class: ${cardClass}`);
    
    // Generate a list of visited locations
    let visitedLocationsHTML = '';
    if (usedLocations && usedLocations.length > 0) {
        visitedLocationsHTML = `
            <div class="visited-locations">
                <h3>Places You Visited</h3>
                <ul>
                    ${usedLocations.map(loc => `
                        <li>
                            <span class="location-icon">🗾</span>
                            ${loc.name || 'Unknown location'}
                            <span class="badge badge-secondary">${loc.region || 'Unknown region'}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }
    
    // Show confetti for good scores
    if (scorePercentage > 70) {
        showConfetti(50); // More confetti for high scores
    } else if (scorePercentage > 50) {
        showConfetti(20); // Less confetti for medium scores
    }
    
    // Create end game overlay for immersive mode
    const immersiveView = document.getElementById('immersive-view');
    if (immersiveView) {
        // Create end game overlay
        const endGameOverlay = document.createElement('div');
        endGameOverlay.className = 'end-game-overlay';
        endGameOverlay.style.position = 'absolute';
        endGameOverlay.style.top = '0';
        endGameOverlay.style.left = '0';
        endGameOverlay.style.width = '100%';
        endGameOverlay.style.height = '100%';
        endGameOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        endGameOverlay.style.zIndex = '2000';
        endGameOverlay.style.display = 'flex';
        endGameOverlay.style.flexDirection = 'column';
        endGameOverlay.style.justifyContent = 'center';
        endGameOverlay.style.alignItems = 'center';
        endGameOverlay.style.padding = '20px';
        
        // Create end game content
        endGameOverlay.innerHTML = `
            <div class="end-game-content" style="background-color: white; border-radius: 20px; padding: 30px; max-width: 800px; width: 90%; text-align: center;">
                <div class="game-header">
                    <div class="game-logo">
                        <h1>Japan-tsū</h1>
                        <div class="mascot mascot-sm">
                            <div class="japan-mascot">
                                <div class="mascot-face">
                                    <div class="mascot-eyes">
                                        <div class="mascot-eye"></div>
                                        <div class="mascot-eye"></div>
                                    </div>
                                    <div class="mascot-blush"></div>
                                    <div class="mascot-mouth"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <h2>Game Over!</h2>
                
                <div class="score-display" style="font-size: 24px; margin: 20px 0;">
                    <span>${totalScore} / ${maxPossibleScore}</span>
                    <div class="badge badge-primary" style="font-size: 18px; margin-left: 10px;">${scorePercentage.toFixed(2)}%</div>
                </div>
                
                <div class="result-card ${cardClass}" style="width: 300px; height: 300px; margin: 0 auto 20px auto; border-radius: 15px; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 20px;">
                    <h3 class="japanese-text">${assessment}</h3>
                </div>
                
                ${visitedLocationsHTML}
                
                <div class="game-controls" style="margin-top: 30px;">
                    <button class="btn btn-primary btn-icon" id="share-result-btn" style="margin-right: 15px;">
                        <span>Share Result</span>
                    </button>
                    <button class="btn btn-secondary" id="play-again-btn">Play Again</button>
                </div>
            </div>
        `;
        
        // Add to immersive view
        immersiveView.appendChild(endGameOverlay);
        
        // Add event listeners to the buttons
        document.getElementById('share-result-btn').addEventListener('click', function() {
            if (window.shareResult) {
                window.shareResult();
            }
        });
        
        document.getElementById('play-again-btn').addEventListener('click', function() {
            console.log("Play Again button clicked");
            // Remove end game overlay
            if (endGameOverlay.parentNode) {
                endGameOverlay.parentNode.removeChild(endGameOverlay);
            }
            
            if (window.resetGameGlobal) {
                console.log("Calling resetGameGlobal function");
                window.resetGameGlobal();
            } else {
                console.error("resetGameGlobal function not available");
            }
        });
    } else {
        console.error("Immersive view element not found");
    }
}

/**
 * Toggle immersive mode (legacy function, kept for compatibility)
 */
function toggleImmersiveMode() {
    console.log("Immersive mode is now the default interface");
    // No-op as immersive mode is now the default
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
    // Enable both the traditional and immersive guess buttons
    const submitButton = document.getElementById('submit-guess');
    if (submitButton) {
        submitButton.disabled = false;
    }
    
    const immersiveGuessButton = document.getElementById('immersive-guess-btn');
    if (immersiveGuessButton) {
        immersiveGuessButton.disabled = false;
        immersiveGuessButton.classList.add('active');
    }
}

/**
 * Disable the submit guess button
 */
function disableSubmitButton() {
    // Disable both the traditional and immersive guess buttons
    const submitButton = document.getElementById('submit-guess');
    if (submitButton) {
        submitButton.disabled = true;
    }
    
    const immersiveGuessButton = document.getElementById('immersive-guess-btn');
    if (immersiveGuessButton) {
        immersiveGuessButton.disabled = true;
        immersiveGuessButton.classList.remove('active');
    }
}

/**
 * Check if all required UI elements exist
 */
function checkElements() {
    // Check for immersive interface elements
    const immersiveElements = ['immersive-view', 'panorama-fullscreen', 'minimap', 'immersive-round', 'immersive-score', 'immersive-timer', 'immersive-guess-btn'];
    let allImmersiveFound = true;
    
    immersiveElements.forEach(id => {
        const element = document.getElementById(id);
        if (!element) {
            console.error(`Immersive element with id "${id}" not found`);
            allImmersiveFound = false;
        } else {
            console.log(`Immersive element with id "${id}" found`);
        }
    });
    
    return allImmersiveFound;
}

/**
 * Show a loading indicator while finding a Street View location
 * Uses the Japan Journey animation for a more engaging experience
 */
function showLoadingIndicator() {
    console.log("Showing Japan Journey loading animation");
    
    // Check if we're between rounds (not the first round)
    const currentRound = document.getElementById("immersive-round")?.textContent;
    const isFirstRound = !currentRound || currentRound.includes("1/");
    
    // Use the journey animation for transitions between rounds
    if (!isFirstRound && window.journeyAnimation) {
        // Start the journey animation
        window.journeyAnimation.start();
    } else {
        // Fallback to simple loading indicator for first round
        let loadingIndicator = document.getElementById('loading-indicator');
        
        if (!loadingIndicator) {
            loadingIndicator = document.createElement('div');
            loadingIndicator.id = 'loading-indicator';
            loadingIndicator.className = 'loading-indicator';
            
            // Add mascot and loading message
            loadingIndicator.innerHTML = `
                <div class="mascot mascot-sm">
                    <div class="japan-mascot">
                        <div class="mascot-face">
                            <div class="mascot-eyes">
                                <div class="mascot-eye"></div>
                                <div class="mascot-eye"></div>
                            </div>
                            <div class="mascot-blush"></div>
                            <div class="mascot-mouth"></div>
                        </div>
                    </div>
                </div>
                <div class="loading-spinner"></div>
                <p>Finding a cool spot in Japan...</p>
            `;
            
            // Add to panorama container
            const panoramaElement = document.getElementById('panorama-fullscreen');
            if (panoramaElement) {
                panoramaElement.style.position = 'relative';
                panoramaElement.appendChild(loadingIndicator);
            } else {
                document.body.appendChild(loadingIndicator);
            }
        } else {
            loadingIndicator.style.display = 'block';
        }
    }
}

/**
 * Hide the loading indicator
 */
function hideLoadingIndicator() {
    console.log("Hiding loading animation");
    
    // Stop journey animation if it's running
    if (window.journeyAnimation) {
        window.journeyAnimation.stop();
    }
    
    // Also hide the simple loading indicator if it exists
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }
}

/**
 * Show information about the current location
 * @param {Object} locationData - Data about the current location
 * @param {number} distance - Distance in kilometers from the guess
 */
function showLocationInfo(locationData, distance) {
    // In immersive mode, location info is shown in the results panel
    if (window.isImmersiveMode) {
        return;
    }
    
    // Legacy location info display for non-immersive mode
    let locationInfo = document.getElementById('location-info');
    
    if (!locationInfo) {
        locationInfo = document.createElement('div');
        locationInfo.id = 'location-info';
        locationInfo.className = 'location-info';
        
        // Add to right column
        const rightColumn = document.querySelector('.game-column-right');
        if (rightColumn) {
            // Insert at the beginning of the right column
            rightColumn.insertBefore(locationInfo, rightColumn.firstChild);
        } else {
            // Fallback to old method if right column doesn't exist
            const resultElement = document.getElementById('result');
            if (resultElement) {
                resultElement.parentNode.insertBefore(locationInfo, resultElement.nextSibling);
            }
        }
    }
    
    // Calculate accuracy rating based on distance
    let accuracyRating = '';
    let accuracyClass = '';
    
    if (distance < 1) {
        accuracyRating = 'Perfect!';
        accuracyClass = 'badge-accent';
    } else if (distance < 5) {
        accuracyRating = 'Excellent!';
        accuracyClass = 'badge-primary';
    } else if (distance < 20) {
        accuracyRating = 'Great!';
        accuracyClass = 'badge-primary';
    } else if (distance < 50) {
        accuracyRating = 'Good';
        accuracyClass = 'badge-secondary';
    } else if (distance < 100) {
        accuracyRating = 'Not bad';
        accuracyClass = 'badge-secondary';
    } else if (distance < 200) {
        accuracyRating = 'Could be better';
        accuracyClass = 'badge-secondary';
    } else {
        accuracyRating = 'Way off';
        accuracyClass = 'badge-secondary';
    }
    
    // Format location information
    locationInfo.innerHTML = `
        <div class="card-header">
            <h3>Location Info</h3>
        </div>
        <div class="card-body">
            <p><strong>Name:</strong> ${locationData.name || 'Unknown location'}</p>
            <p><strong>Region:</strong> <span class="badge badge-secondary">${locationData.region || 'Unknown region'}</span></p>
            <p><strong>Accuracy:</strong> <span class="badge ${accuracyClass}">${accuracyRating}</span></p>
            ${locationData.facts ? `<p><strong>Fun Fact:</strong> ${locationData.facts}</p>` : ''}
        </div>
    `;
    
    locationInfo.style.display = 'block';
    
    // Add pop animation
    locationInfo.classList.add('pop');
    setTimeout(() => locationInfo.classList.remove('pop'), 1500);
}

/**
 * Show confetti animation for celebrations
 * @param {number} count - Number of confetti pieces to create (default: 30)
 */
function showConfetti(count = 30) {
    const confettiContainer = document.getElementById('confetti-container');
    if (!confettiContainer) return;
    
    // Clear any existing confetti
    confettiContainer.innerHTML = '';
    
    // Create confetti pieces
    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // Random position
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.top = `-20px`;
        
        // Random size
        const size = Math.random() * 10 + 5;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        
        // Random color
        const colors = [
            'var(--color-primary)',
            'var(--color-secondary)',
            'var(--color-accent)',
            'var(--color-primary-light)',
            'var(--color-secondary-light)'
        ];
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Random rotation
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        // Random animation duration
        confetti.style.animationDuration = `${Math.random() * 2 + 2}s`;
        
        // Random delay
        confetti.style.animationDelay = `${Math.random() * 0.5}s`;
        
        // Add to container
        confettiContainer.appendChild(confetti);
    }
    
    // Remove confetti after animation completes
    setTimeout(() => {
        confettiContainer.innerHTML = '';
    }, 4000);
}

/**
 * Initialize responsive layout helpers
 */
function initResponsiveHelpers() {
    // Detect viewport size changes
    const mediaQuery = window.matchMedia('(min-width: 1024px) and (max-width: 1439px)');
    
    function handleScreenChange(e) {
        if (e.matches) {
            // Laptop mode - add any specific adjustments
            document.body.classList.add('laptop-mode');
        } else {
            document.body.classList.remove('laptop-mode');
        }
    }
    
    // Initial check
    handleScreenChange(mediaQuery);
    
    // Add listener for changes
    mediaQuery.addEventListener('change', handleScreenChange);
}

// Initialize responsive helpers when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initResponsiveHelpers();
    
    // Set up navigation controls for immersive mode
    if (typeof setupNavigationControls === 'function') {
        setupNavigationControls();
    }
});

// Make functions globally available
window.updateScore = updateScore;
window.updateRound = updateRound;
window.showResult = showResult;
window.showImmersiveResult = showImmersiveResult;
window.endGame = endGame;
window.toggleImmersiveMode = toggleImmersiveMode;
window.updateImmersiveTimer = updateImmersiveTimer;
window.enableSubmitButton = enableSubmitButton;
window.disableSubmitButton = disableSubmitButton;
window.checkElements = checkElements;
window.showLoadingIndicator = showLoadingIndicator;
window.hideLoadingIndicator = hideLoadingIndicator;
window.showLocationInfo = showLocationInfo;
window.updateTimerProgress = updateTimerProgress;
window.showConfetti = showConfetti;
window.initResponsiveHelpers = initResponsiveHelpers;