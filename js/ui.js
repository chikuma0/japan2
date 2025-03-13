/**
 * ui.js - Handles UI updates and interactions
 */

// UI state variables
window.isImmersiveMode = false;

/**
 * Update the score display
 * @param {number} totalScore - The current total score
 */
function updateScore(totalScore) {
    const scoreElement = document.getElementById("score");
    if (scoreElement) {
        scoreElement.textContent = `Total Score: ${totalScore}`;
        scoreElement.classList.add('pulse');
        setTimeout(() => scoreElement.classList.remove('pulse'), 1000);
    } else {
        console.error("Score element not found");
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
    
    const roundElement = document.getElementById("round");
    if (roundElement) {
        roundElement.textContent = `Round: ${currentRound} / ${maxRounds}`;
        console.log(`Round display updated to: ${roundElement.textContent}`);
    } else {
        console.error("Round element not found");
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
    
    // First, make sure any existing result and score elements are properly hidden
    // to prevent "not found" errors when they're removed from the DOM
    const existingResultElement = document.getElementById("result");
    if (existingResultElement) {
        existingResultElement.style.display = "none";
    }
    
    const existingScoreElement = document.getElementById("score");
    if (existingScoreElement) {
        existingScoreElement.style.display = "none";
    }
    
    // Now update the game container with the end game content
    const gameContainer = document.getElementById("game-container");
    if (gameContainer) {
        // Create a new div to hold the end game content
        const endGameContent = document.createElement('div');
        endGameContent.className = 'end-game-content';
        endGameContent.innerHTML = `
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
            
            <div class="timer-display" id="timer">Game Over!</div>
            
            <!-- New Three-Column Layout -->
            <div class="game-layout">
                <!-- Left Column -->
                <div class="game-column game-column-left">
                    <!-- Game Info -->
                    <div class="game-info">
                        <div class="score-display">
                            <span>${totalScore} / ${maxPossibleScore}</span>
                        </div>
                        <div class="badge badge-primary">${scorePercentage.toFixed(2)}%</div>
                    </div>
                    
                    <!-- Result Display -->
                    <div class="result-container" id="result-container">
                        <div class="result-card ${cardClass} pop">
                            <h3 class="japanese-text">${assessment}</h3>
                        </div>
                        <p id="game-url">Play at: japan2.xyz</p>
                    </div>
                    
                    <!-- Left Ad Space -->
                    <div class="ad-container ad-container-left">
                        <!-- Ad content will go here -->
                    </div>
                    
                </div>
                
                <!-- Center Column -->
                <div class="game-column game-column-center">
                    ${visitedLocationsHTML}
                    
                    <div class="social-sharing">
                        <button class="btn btn-primary btn-icon" id="share-result-btn">
                            <span>Share Result</span>
                        </button>
                    </div>
                    
                    <div class="game-controls">
                        <button class="btn btn-secondary" id="play-again-btn">Play Again</button>
                    </div>
                    
                    <!-- Game options simplified for cleaner UI -->
                    
                </div>
                
                <!-- Right Column -->
                <div class="game-column game-column-right">
                    <!-- Location Info -->
                    <div class="location-info" id="location-info" style="display: none;"></div>
                    
                </div>
            </div>
            
            <!-- Bottom Ad Space -->
            <div class="ad-container">
                <!-- Ad content will go here -->
            </div>
            
            <!-- Create new result and score elements for the end game screen -->
            <div id="result" style="display: none;"></div>
            <div id="score" style="display: none;">Total Score: ${totalScore}</div>
        `;
        
        // Clear the game container and add the end game content
        gameContainer.innerHTML = '';
        gameContainer.appendChild(endGameContent);
        
        // Add event listeners to the buttons
        document.getElementById('share-result-btn').addEventListener('click', function() {
            if (window.shareResult) {
                window.shareResult();
            }
        });
        
        document.getElementById('play-again-btn').addEventListener('click', function() {
            if (window.resetGameGlobal) {
                window.resetGameGlobal();
            }
        });
        
        // Difficulty selection removed to streamline experience
    } else {
        console.error("Game container element not found");
    }
}

/**
 * Toggle immersive mode
 */
function toggleImmersiveMode() {
    window.isImmersiveMode = !window.isImmersiveMode;
    const immersiveView = document.getElementById('immersive-view');
    const gameContainer = document.getElementById('game-container');
    
    if (!immersiveView || !gameContainer) {
        console.error("Required elements for immersive mode not found");
        return;
    }
    
    if (window.isImmersiveMode) {
        // Show immersive view with animation
        immersiveView.style.display = 'block';
        immersiveView.classList.add('fade-in');
        gameContainer.classList.add('fade-out');
        
        setTimeout(() => {
            gameContainer.style.display = 'none';
            gameContainer.classList.remove('fade-out');
        }, 500);
        
        // Initialize the fullscreen panorama
        try {
            // Get the current position, pov, and zoom from the main panorama
            const position = window.panorama.getPosition();
            const pov = window.panorama.getPov();
            const zoom = window.panorama.getZoom();
            
            // Initialize the fullscreen panorama
            window.panoramaFullscreen = initializeFullscreenPanorama(
                position,
                pov,
                zoom
            );
            
            console.log("Fullscreen panorama initialized");
        } catch (error) {
            console.error("Error in immersive mode panorama setup:", error);
        }
        
        // Update timer in immersive mode
        updateImmersiveTimer();
        
        // Show a brief message
        const message = document.createElement('div');
        message.className = 'speech-bubble fade-in';
        message.style.position = 'absolute';
        message.style.top = '50%';
        message.style.left = '50%';
        message.style.transform = 'translate(-50%, -50%)';
        message.style.zIndex = '1003';
        message.innerHTML = '<p>Immersive Mode Activated!</p>';
        
        immersiveView.appendChild(message);
        
        setTimeout(() => {
            message.classList.add('fade-out');
            setTimeout(() => message.remove(), 500);
        }, 1500);
        
        // Initialize mini-map
        try {
            const miniMapElement = document.getElementById('mini-map');
            if (miniMapElement) {
                window.miniMap = new google.maps.Map(miniMapElement, {
                    center: window.panorama.getPosition(),
                    zoom: 15,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    disableDefaultUI: true
                });
                
                // Add marker for current position
                new google.maps.Marker({
                    position: window.panorama.getPosition(),
                    map: window.miniMap,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 7,
                        fillColor: '#FF9AC1',
                        fillOpacity: 1,
                        strokeColor: '#FFFFFF',
                        strokeWeight: 2
                    }
                });
            }
        } catch (error) {
            console.error("Error in immersive mode map setup:", error);
        }
    } else {
        // Show game container with animation
        gameContainer.style.display = 'block';
        gameContainer.classList.add('fade-in');
        immersiveView.classList.add('fade-out');
        
        setTimeout(() => {
            immersiveView.style.display = 'none';
            immersiveView.classList.remove('fade-out');
        }, 500);
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

/**
 * Show a loading indicator while finding a Street View location
 * Uses the Japan Journey animation for a more engaging experience
 */
function showLoadingIndicator() {
    console.log("Showing Japan Journey loading animation");
    
    // Check if we're between rounds (not the first round)
    const currentRound = document.getElementById("round")?.textContent;
    const isFirstRound = !currentRound || currentRound.includes("1 /");
    
    // Show location info if available
    if (window.currentLocationData) {
        // Create a simplified version of location info without accuracy rating
        showLoadingLocationInfo(window.currentLocationData);
    }
    
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
            const panoramaElement = document.getElementById('panorama');
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
 * Show location information during loading
 * @param {Object} locationData - Data about the current location
 */
function showLoadingLocationInfo(locationData) {
    // Create or get location info element
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
        }
    }
    
    // Format location information without accuracy rating
    locationInfo.innerHTML = `
        <div class="card-header">
            <h3>Location Info</h3>
        </div>
        <div class="card-body">
            <p><strong>Name:</strong> ${locationData.name || 'Unknown location'}</p>
            <p><strong>Region:</strong> <span class="badge badge-secondary">${locationData.region || 'Unknown region'}</span></p>
            ${locationData.facts ? `<p><strong>Fun Fact:</strong> ${locationData.facts}</p>` : ''}
        </div>
    `;
    
    locationInfo.style.display = 'block';
    
    // Add pop animation
    locationInfo.classList.add('pop');
    setTimeout(() => locationInfo.classList.remove('pop'), 1500);
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
    
    // Note: We intentionally don't hide the location info here
    // as it should remain visible after loading is complete
}

/**
 * Show information about the current location
 * @param {Object} locationData - Data about the current location
 * @param {number} distance - Distance in kilometers from the guess
 */
function showLocationInfo(locationData, distance) {
    // Create or get location info element
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

// Make functions globally available
window.updateScore = updateScore;
window.updateRound = updateRound;
window.showResult = showResult;
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