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
            <div class="auto-next-timer">
                <span>${isLastRound ? 'See Final Results' : 'Next round'} in <span id="auto-next-countdown">2</span>...</span>
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
    
    // No next round button anymore - auto-transition only
    
    // Show confetti for good scores
    if (score > 4000) {
        showConfetti();
    }
    
    // Set up countdown timer for 2 seconds
    let countdown = 2;
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
    
    // Note: We don't set up auto-transition here anymore
    // The transition is now handled in game.js with preloading
}

/**
 * End the game and show final results
 * @param {number} totalScore - The final total score
 * @param {number} maxRounds - The maximum number of rounds
 * @param {Array} usedLocations - The locations used in the game
 */
function endGame(totalScore, maxRounds, usedLocations = []) {
    console.log(`Ending game with totalScore=${totalScore}, maxRounds=${maxRounds}, usedLocations.length=${usedLocations.length}`);
    
    // IMPORTANT: Set a flag to indicate the game is over
    // This will prevent any further rounds from being set up
    window.gameOver = true;
    
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
    
    // Stop any running journey animation
    if (window.journeyAnimation) {
        window.journeyAnimation.stop();
    }
    
    // Hide any loading indicators
    hideLoadingIndicator();
    
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
    
    // Generate a list of visited locations with enhanced styling
    let visitedLocationsHTML = '';
    if (usedLocations && usedLocations.length > 0) {
        visitedLocationsHTML = `
            <div class="visited-locations">
                <h3 style="color: var(--color-primary); margin-bottom: 15px; font-size: 1.5rem;">Your Japan Journey</h3>
                <div class="location-grid" style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
                    ${usedLocations.map((loc, index) => `
                        <div class="location-card" style="background: linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,0.7));
                                                         border-radius: 10px;
                                                         padding: 12px;
                                                         width: 150px;
                                                         box-shadow: 0 3px 8px rgba(0,0,0,0.1);
                                                         animation: fadeIn 0.5s ${0.1 * index}s both;
                                                         transition: all 0.3s ease;">
                            <div style="display: flex; align-items: center; margin-bottom: 8px;">
                                <span class="location-number" style="background-color: var(--color-primary);
                                                                    color: white;
                                                                    width: 24px;
                                                                    height: 24px;
                                                                    border-radius: 50%;
                                                                    display: flex;
                                                                    align-items: center;
                                                                    justify-content: center;
                                                                    margin-right: 8px;
                                                                    font-size: 12px;
                                                                    font-weight: bold;">${index + 1}</span>
                                <span class="location-name" style="font-weight: bold; color: #333; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${loc.name || 'Unknown location'}</span>
                            </div>
                            <span class="badge badge-secondary" style="display: inline-block; width: 100%; text-align: center; margin-top: 5px;">${loc.region || 'Unknown region'}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // Show confetti for all scores, but with different amounts and colors based on score
    if (scorePercentage > 70) {
        showConfetti(100, true); // More confetti with special effects for high scores
    } else if (scorePercentage > 50) {
        showConfetti(50, true); // Medium amount of confetti with special effects
    } else {
        showConfetti(30, false); // Basic confetti for lower scores
    }
    
    // Create end game overlay for immersive mode
    const immersiveView = document.getElementById('immersive-view');
    if (immersiveView) {
        // Create end game overlay with animation
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
        endGameOverlay.style.opacity = '0';
        endGameOverlay.style.animation = 'fadeIn 0.8s forwards';
        
        // Add keyframe animation for fade in
        const fadeInStyle = document.createElement('style');
        fadeInStyle.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideInUp {
                from { transform: translateY(50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            
            @keyframes glow {
                0% { box-shadow: 0 0 5px rgba(255, 117, 171, 0.5); }
                50% { box-shadow: 0 0 20px rgba(255, 117, 171, 0.8); }
                100% { box-shadow: 0 0 5px rgba(255, 117, 171, 0.5); }
            }
            
            @keyframes rotateIn {
                from { transform: rotate(-10deg) scale(0.8); opacity: 0; }
                to { transform: rotate(0) scale(1); opacity: 1; }
            }
            
            .end-game-content {
                animation: slideInUp 0.8s forwards;
            }
            
            .result-card {
                animation: rotateIn 1s 0.5s both, glow 2s 1.5s infinite;
            }
            
            .score-display {
                animation: slideInUp 0.8s 0.3s both;
            }
            
            .visited-locations {
                animation: slideInUp 0.8s 0.6s both;
            }
            
            .game-controls {
                animation: slideInUp 0.8s 0.9s both;
            }
            
            .game-logo h1 {
                animation: pulse 2s infinite;
            }
        `;
        document.head.appendChild(fadeInStyle);
        
        // Create end game content
        endGameOverlay.innerHTML = `
            <div class="end-game-content" style="background-color: white; border-radius: 20px; padding: 30px; max-width: 800px; width: 90%; text-align: center; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);">
                <div class="game-header">
                    <div class="game-logo">
                        <h1 style="color: var(--color-primary); text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);">Japan-tsū</h1>
                        <div class="mascot mascot-sm kintaro-mascot" id="kintaro-mascot-endgame">
                            <!-- SVG will be inserted here via JavaScript -->
                        </div>
                    </div>
                </div>
                
                <h2 style="color: var(--color-primary); font-size: 2.5rem; margin: 10px 0; text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);">Game Complete!</h2>
                
                <div class="score-display" style="font-size: 28px; margin: 20px 0; font-weight: bold; color: #333;">
                    <span>${totalScore} / ${maxPossibleScore}</span>
                    <div class="badge badge-primary" style="font-size: 20px; margin-left: 10px; padding: 5px 10px;">${scorePercentage.toFixed(2)}%</div>
                </div>
                
                <div class="result-card ${cardClass}" style="width: 300px; height: 500px; margin: 0 auto 20px auto; border-radius: 15px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2); position: relative; overflow: hidden;">
                    <!-- Generate dynamic SVG card with actual player score -->
                    ${generateDynamicCard(totalScore, maxPossibleScore, scorePercentage, assessment)}
                </div>
                
                ${visitedLocationsHTML}
                
                <div class="game-controls" style="margin-top: 30px;">
                    <button class="btn btn-primary btn-icon" id="share-result-btn" style="margin-right: 15px; padding: 12px 24px; font-size: 1.1rem; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); transition: all 0.3s ease;">
                        <span>Share Result</span>
                    </button>
                    <button class="btn btn-secondary" id="play-again-btn" style="padding: 12px 24px; font-size: 1.1rem; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); transition: all 0.3s ease;">Play Again</button>
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
    // If the game is over, don't show the loading animation
    if (window.gameOver) {
        console.log("Game is over, not showing loading animation");
        return;
    }
    
    console.log("Showing Japan Journey loading animation");
    
    // Check if we're between rounds (not the first round)
    const currentRound = document.getElementById("immersive-round")?.textContent;
    const isFirstRound = !currentRound || currentRound.includes("1/");
    const isLastRound = currentRound && currentRound.includes("5/"); // Check if it's the last round (5/5)
    
    // Get the current round number and max rounds
    const roundMatch = currentRound?.match(/(\d+)\/(\d+)/);
    const currentRoundNum = roundMatch ? parseInt(roundMatch[1]) : 1;
    const maxRoundsNum = roundMatch ? parseInt(roundMatch[2]) : 5;
    
    // Check if we're transitioning to the final round
    const isTransitioningToLastRound = currentRoundNum === maxRoundsNum - 1;
    
    // IMPORTANT: Never show journey animation for the last round (5/5) or when transitioning to the last round
    // For rounds 2-3, always show the journey animation for consistent experience
    if (!isFirstRound && !isLastRound && !isTransitioningToLastRound && window.journeyAnimation) {
        console.log("Using journey animation for round transition");
        // Start the journey animation
        window.journeyAnimation.start();
    } else {
        console.log(`Using simple loading indicator (isFirstRound: ${isFirstRound}, isLastRound: ${isLastRound})`);
        // Fallback to simple loading indicator for first round or last round
        let loadingIndicator = document.getElementById('loading-indicator');
        
        if (!loadingIndicator) {
            loadingIndicator = document.createElement('div');
            loadingIndicator.id = 'loading-indicator';
            loadingIndicator.className = 'loading-indicator';
            
            // Add mascot and loading message
            loadingIndicator.innerHTML = `
                <div class="mascot mascot-sm kintaro-mascot" id="kintaro-mascot-loading">
                    <!-- SVG will be inserted here via JavaScript -->
                </div>
                <div class="loading-spinner"></div>
                <p>${isLastRound ? 'Preparing final results...' : isTransitioningToLastRound ? 'Preparing final location...' : 'Finding a cool spot in Japan...'}</p>
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
            // Update the message based on the round
            const messageElement = loadingIndicator.querySelector('p');
            if (messageElement) {
                messageElement.textContent = isLastRound ? 'Preparing final results...' :
                                             isTransitioningToLastRound ? 'Preparing final location...' :
                                             'Finding a cool spot in Japan...';
            }
            
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
 * @param {boolean} specialEffects - Whether to add special effects (default: false)
 */
function showConfetti(count = 30, specialEffects = false) {
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
        
        // Random size - larger for special effects
        const size = specialEffects ?
            Math.random() * 15 + 8 : // Larger confetti for special effects
            Math.random() * 10 + 5;  // Regular size
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        
        // Random color - more vibrant for special effects
        let colors = [
            'var(--color-primary)',
            'var(--color-secondary)',
            'var(--color-accent)',
            'var(--color-primary-light)',
            'var(--color-secondary-light)'
        ];
        
        // Add gold and silver for special effects
        if (specialEffects) {
            colors = colors.concat([
                'gold',
                'silver',
                '#FFD700', // Gold
                '#FF1493', // Deep pink
                '#00FFFF', // Cyan
                '#7FFF00'  // Chartreuse
            ]);
            
            // Add glitter effect for some confetti
            if (Math.random() > 0.7) {
                confetti.style.boxShadow = '0 0 10px 2px white';
                confetti.style.background = 'radial-gradient(circle, white, ' +
                    colors[Math.floor(Math.random() * colors.length)] + ')';
            } else {
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            }
        } else {
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        }
        
        // Random shape for special effects
        if (specialEffects && Math.random() > 0.7) {
            const shapes = ['circle', 'star', 'heart'];
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            
            if (shape === 'circle') {
                confetti.style.borderRadius = '50%';
            } else if (shape === 'star') {
                confetti.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
            } else if (shape === 'heart') {
                confetti.style.clipPath = 'path("M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z")';
            }
        }
        
        // Random rotation
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        // Random animation duration - more varied for special effects
        const duration = specialEffects ?
            Math.random() * 3 + 2 : // Longer duration for special effects
            Math.random() * 2 + 2;  // Regular duration
        confetti.style.animationDuration = `${duration}s`;
        
        // Random delay
        confetti.style.animationDelay = `${Math.random() * 0.8}s`;
        
        // Add to container
        confettiContainer.appendChild(confetti);
    }
    
    // Add celebratory text for special effects
    if (specialEffects) {
        const celebrationText = document.createElement('div');
        celebrationText.className = 'celebration-text';
        celebrationText.textContent = 'AMAZING!';
        celebrationText.style.position = 'absolute';
        celebrationText.style.top = '40%';
        celebrationText.style.left = '50%';
        celebrationText.style.transform = 'translate(-50%, -50%) scale(0)';
        celebrationText.style.fontSize = '5rem';
        celebrationText.style.fontWeight = 'bold';
        celebrationText.style.color = 'gold';
        celebrationText.style.textShadow = '0 0 10px rgba(255, 215, 0, 0.7)';
        celebrationText.style.zIndex = '9999';
        celebrationText.style.opacity = '0';
        celebrationText.style.animation = 'celebration-text 1.5s ease-out forwards';
        
        // Add keyframe animation for the text
        const style = document.createElement('style');
        style.textContent = `
            @keyframes celebration-text {
                0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
                50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
                70% { transform: translate(-50%, -50%) scale(0.9); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        confettiContainer.appendChild(celebrationText);
        
        // Remove the style element after animation completes
        setTimeout(() => {
            document.head.removeChild(style);
        }, 2000);
    }
    
    // Remove confetti after animation completes - longer for special effects
    setTimeout(() => {
        confettiContainer.innerHTML = '';
    }, specialEffects ? 6000 : 4000);
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
window.generateDynamicCard = generateDynamicCard;
window.generateMascot = generateMascot;

/**
 * Generate a dynamic SVG card with the player's actual score
 * @param {number} score - The player's score
 * @param {number} maxScore - The maximum possible score
 * @param {number} percentage - The score percentage
 * @param {string} assessment - The expertise level assessment
 * @returns {string} SVG card content as HTML
 */
function generateDynamicCard(score, maxScore, percentage, assessment) {
    // Determine the level based on percentage
    let level;
    if (percentage >= 90) level = 'master';
    else if (percentage >= 70) level = 'expert';
    else if (percentage >= 50) level = 'intermediate';
    else if (percentage >= 30) level = 'beginner';
    else level = 'novice';
    
    // Get the title and subtitle based on level
    let title, subtitle;
    switch(level) {
        case 'master':
            title = '日本地理マスター';
            subtitle = 'NIHON CHIRI MASTER';
            break;
        case 'expert':
            title = '日本通';
            subtitle = 'NIHON-TSŪ';
            break;
        case 'intermediate':
            title = '地理オタク';
            subtitle = 'CHIRI OTAKU';
            break;
        case 'beginner':
            title = '旅行好き';
            subtitle = 'RYOKŌ-ZUKI';
            break;
        case 'novice':
            title = '駅前迷子';
            subtitle = 'EKIMAE MAIGO';
            break;
    }
    
    // Generate the mascot SVG based on level
    const mascotSVG = generateMascot(level);
    
    // Create the SVG content
    return `
    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="500" viewBox="0 0 300 500" preserveAspectRatio="xMidYMid meet">
        <!-- Trading Card Style Background with border -->
        <rect width="300" height="500" fill="#FF85B3" rx="15" ry="15" />
        <rect x="10" y="10" width="280" height="480" fill="none" stroke="#FFFFFF" stroke-width="2" rx="10" ry="10" stroke-opacity="0.5" />
        
        <!-- Card Shine Effect -->
        <rect x="0" y="0" width="300" height="150" fill="url(#cardShine)" opacity="0.2" />
        
        <!-- Website URL -->
        <rect x="200" y="20" width="80" height="30" rx="15" ry="15" fill="#FFFFFF" opacity="0.8" />
        <text x="240" y="40" font-family="sans-serif" font-size="14" fill="#333333" text-anchor="middle" font-weight="bold">japan2.xyz</text>
        
        <!-- Title - positioned to avoid overlap with mascot circle -->
        <text x="150" y="70" font-family="sans-serif" font-size="32" fill="#3A3A8C" text-anchor="middle" font-weight="bold">Japan-tsū</text>
        
        <!-- Add Card Shine Gradient to Defs -->
        <defs>
            <linearGradient id="cardShine" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:0.7" />
                <stop offset="50%" style="stop-color:#FFFFFF;stop-opacity:0" />
                <stop offset="100%" style="stop-color:#FFFFFF;stop-opacity:0" />
            </linearGradient>
            
            <!-- Shadow filter for 3D effect -->
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
                <feOffset dx="2" dy="2" result="offsetblur" />
                <feComponentTransfer>
                    <feFuncA type="linear" slope="0.5" />
                </feComponentTransfer>
                <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
            
            <!-- Gradients for 3D effect -->
            <!-- Kintaro hair gradient -->
            <linearGradient id="hairGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#000000;stop-opacity:1" />
                <stop offset="50%" style="stop-color:#333333;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#000000;stop-opacity:1" />
            </linearGradient>
            
            <!-- Red bib/apron gradient -->
            <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#cc0000;stop-opacity:1" />
                <stop offset="50%" style="stop-color:#ff3333;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#cc0000;stop-opacity:1" />
            </linearGradient>
            
            <!-- Skin gradient for Kintaro -->
            <linearGradient id="skinGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#ffccaa;stop-opacity:1" />
                <stop offset="50%" style="stop-color:#ffddbb;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#ffccaa;stop-opacity:1" />
            </linearGradient>
            
            <!-- Brown gradient for bear -->
            <linearGradient id="bearGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#8B4513;stop-opacity:1" />
                <stop offset="50%" style="stop-color:#A0522D;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#8B4513;stop-opacity:1" />
            </linearGradient>
            
            <!-- Tan gradient for tanuki -->
            <linearGradient id="tanukiGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#D2B48C;stop-opacity:1" />
                <stop offset="50%" style="stop-color:#DEB887;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#D2B48C;stop-opacity:1" />
            </linearGradient>
            
            <!-- White gradient for rabbit -->
            <linearGradient id="rabbitGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#F5F5F5;stop-opacity:1" />
                <stop offset="50%" style="stop-color:#FFFFFF;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#F5F5F5;stop-opacity:1" />
            </linearGradient>
            
            <!-- Brown gradient for monkey -->
            <linearGradient id="monkeyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#A0522D;stop-opacity:1" />
                <stop offset="50%" style="stop-color:#CD853F;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#A0522D;stop-opacity:1" />
            </linearGradient>
        </defs>
        
        <!-- Circular Mascot Background with inner glow -->
        <circle cx="150" cy="160" r="70" fill="#FFFFFF" stroke="#3A3A8C" stroke-width="5" />
        <circle cx="150" cy="160" r="65" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-opacity="0.5" />
        
        <!-- Kintaro or Animal Mascot - centered in the circle -->
        <g transform="translate(150, 160)">
            ${mascotSVG}
        </g>
        
        <!-- Score Section -->
        <text x="150" y="290" font-family="sans-serif" font-size="70" fill="#666666" text-anchor="middle" font-weight="bold">${score}</text>
        <text x="150" y="315" font-family="sans-serif" font-size="14" fill="#666666" text-anchor="middle">out of ${maxScore} points</text>
        
        <!-- Japanese Title -->
        <text x="150" y="350" font-family="sans-serif" font-size="20" fill="#333333" text-anchor="middle" font-weight="bold">${title}</text>
        <text x="150" y="375" font-family="sans-serif" font-size="16" fill="#666666" text-anchor="middle">(${subtitle})</text>
        
        <!-- Accuracy -->
        <text x="150" y="405" font-family="sans-serif" font-size="20" fill="#666666" text-anchor="middle" font-weight="bold">${percentage.toFixed(1)}% accuracy</text>
        
        <!-- Progress Bar -->
        <rect x="100" y="425" width="100" height="12" rx="6" ry="6" fill="#DDDDDD" />
        <rect x="100" y="425" width="${Math.min(100, percentage)}" height="12" rx="6" ry="6" fill="#3A3A8C" />
        
        <!-- Card Number -->
        <text x="270" y="465" font-family="sans-serif" font-size="12" fill="#666666" text-anchor="end" font-weight="bold">#${Math.floor(Math.random() * 1000)}</text>
    </svg>
    `;
}

/**
 * Generate the mascot SVG based on level
 * @param {string} level - The expertise level
 * @returns {string} SVG content for the mascot
 */
function generateMascot(level) {
    switch(level) {
        case 'master':
            // Kintaro (金太郎) - Master level
            return `
            <!-- Kintaro Character Group with 3D shadow effect -->
            <g filter="url(#shadow)">
                <!-- Head with skin color -->
                <circle cx="0" cy="-15" r="25" fill="url(#skinGradient)" />
                
                <!-- Hair (simplified bowl cut) -->
                <path d="M-30,-25 C-30,-60 30,-60 30,-25 L30,-25 L-30,-25 Z" fill="#000000" />
                
                <!-- Eyes (simple cartoon style) -->
                <g class="eyes">
                    <ellipse cx="-8" cy="-18" rx="2" ry="2.5" fill="#000000" />
                    <ellipse cx="8" cy="-18" rx="2" ry="2.5" fill="#000000" />
                </g>
                
                <!-- Eyebrows (simple) -->
                <path d="M-12,-23 L-6,-23" stroke="#000000" stroke-width="1.5" />
                <path d="M6,-23 L12,-23" stroke="#000000" stroke-width="1.5" />
                
                <!-- Rosy cheeks -->
                <circle cx="-12" cy="-10" r="4" fill="#FF9999" opacity="0.5" />
                <circle cx="12" cy="-10" r="4" fill="#FF9999" opacity="0.5" />
                
                <!-- Simple smile -->
                <path d="M-8,-5 Q0,0 8,-5" stroke="#000000" stroke-width="1.5" fill="none" />
                
                <!-- Red bib/apron with 金 character -->
                <path d="M-25,0 L-20,30 L20,30 L25,0 Z" fill="url(#redGradient)" />
                <text x="0" y="20" font-family="sans-serif" font-size="20" fill="#ffcc00" text-anchor="middle" font-weight="bold">金</text>
                
                <!-- Axe (raised triumphantly) -->
                <g transform="translate(0,0) rotate(-30)">
                    <rect x="25" y="-15" width="5" height="45" fill="#8B4513" rx="2" ry="2" />
                    <path d="M30,-15 L45,-25 L45,-5 L30,-5 Z" fill="#A9A9A9" />
                </g>
            </g>
            `;
            
        case 'expert':
            // Japanese Monkey (猿) - Expert level
            return `
            <!-- Monkey Character Group with 3D shadow effect -->
            <g filter="url(#shadow)">
                <!-- Head -->
                <circle cx="0" cy="-15" r="25" fill="url(#monkeyGradient)" />
                
                <!-- Ears -->
                <ellipse cx="-20" cy="-30" rx="10" ry="12" fill="url(#monkeyGradient)" />
                <ellipse cx="20" cy="-30" rx="10" ry="12" fill="url(#monkeyGradient)" />
                <ellipse cx="-20" cy="-30" rx="6" ry="8" fill="#FFC0CB" opacity="0.7" />
                <ellipse cx="20" cy="-30" rx="6" ry="8" fill="#FFC0CB" opacity="0.7" />
                
                <!-- Face (lighter color) -->
                <ellipse cx="0" cy="-10" rx="18" ry="20" fill="#E8C4A0" />
                
                <!-- Eyes -->
                <g class="eyes">
                    <ellipse cx="-8" cy="-20" rx="3" ry="4" fill="#000000" />
                    <ellipse cx="8" cy="-20" rx="3" ry="4" fill="#000000" />
                </g>
                
                <!-- Eyebrows (wise) -->
                <path d="M-12,-25 Q-8,-27 -4,-25" stroke="#000000" stroke-width="1.5" fill="none" />
                <path d="M4,-25 Q8,-27 12,-25" stroke="#000000" stroke-width="1.5" fill="none" />
                
                <!-- Nose -->
                <ellipse cx="0" cy="-10" rx="5" ry="3" fill="#8B4513" />
                
                <!-- Mouth (slight smile) -->
                <path d="M-8,-5 Q0,-2 8,-5" stroke="#8B4513" stroke-width="1.5" fill="none" />
                
                <!-- Red bib/apron with 金 character -->
                <path d="M-20,0 L-15,25 L15,25 L20,0 Z" fill="url(#redGradient)" />
                <text x="0" y="15" font-family="sans-serif" font-size="15" fill="#ffcc00" text-anchor="middle" font-weight="bold">金</text>
                
                <!-- Map of Japan (representing knowledge) -->
                <g transform="translate(25,-5) scale(0.5)">
                    <path d="M0,0 C10,-10 20,0 30,-5 C40,-10 30,-20 40,-15 C50,-10 40,0 50,5 C40,10 30,5 20,10 C10,15 0,5 0,0 Z" fill="#33ff33" opacity="0.8" />
                </g>
            </g>
            `;
            
        case 'intermediate':
            // Rabbit (兎) - Intermediate level
            return `
            <!-- Rabbit Character Group with 3D shadow effect -->
            <g filter="url(#shadow)">
                <!-- Head -->
                <ellipse cx="0" cy="-15" rx="20" ry="25" fill="url(#rabbitGradient)" />
                
                <!-- Ears (two distinct ears) -->
                <path d="M-10,-35 C-15,-60 -5,-65 -5,-40" fill="url(#rabbitGradient)" />
                <path d="M10,-35 C15,-60 5,-65 5,-40" fill="url(#rabbitGradient)" />
                <path d="M-8,-40 C-10,-55 -5,-58 -5,-40" fill="#FFC0CB" opacity="0.5" />
                <path d="M5,-40 C5,-58 10,-55 8,-40" fill="#FFC0CB" opacity="0.5" />
                
                <!-- Eyes -->
                <g class="eyes">
                    <ellipse cx="-8" cy="-20" rx="3" ry="5" fill="#FF0000" />
                    <ellipse cx="8" cy="-20" rx="3" ry="5" fill="#FF0000" />
                    <ellipse cx="-8" cy="-20" rx="1.5" ry="2.5" fill="#000000" />
                    <ellipse cx="8" cy="-20" rx="1.5" ry="2.5" fill="#000000" />
                </g>
                
                <!-- Nose -->
                <path d="M-2,-12 L0,-10 L2,-12 Z" fill="#FF69B4" />
                
                <!-- Whiskers -->
                <path d="M-5,-12 L-15,-10" stroke="#DDDDDD" stroke-width="0.8" />
                <path d="M-5,-10 L-15,-8" stroke="#DDDDDD" stroke-width="0.8" />
                <path d="M5,-12 L15,-10" stroke="#DDDDDD" stroke-width="0.8" />
                <path d="M5,-10 L15,-8" stroke="#DDDDDD" stroke-width="0.8" />
                
                <!-- Mouth (attentive) -->
                <path d="M-3,-8 Q0,-6 3,-8" stroke="#FF69B4" stroke-width="1" fill="none" />
                
                <!-- Red bib/apron with 金 character -->
                <path d="M-15,0 L-12,20 L12,20 L15,0 Z" fill="url(#redGradient)" />
                <text x="0" y="12" font-family="sans-serif" font-size="12" fill="#ffcc00" text-anchor="middle" font-weight="bold">金</text>
                
                <!-- Book (representing knowledge) -->
                <g transform="translate(20,0) rotate(10)">
                    <rect x="-5" y="-5" width="15" height="20" fill="#3366CC" />
                    <rect x="-3" y="-3" width="11" height="16" fill="#FFFFFF" />
                    <path d="M-2,0 L8,0" stroke="#000000" stroke-width="0.5" />
                    <path d="M-2,3 L8,3" stroke="#000000" stroke-width="0.5" />
                    <path d="M-2,6 L8,6" stroke="#000000" stroke-width="0.5" />
                </g>
            </g>
            `;
            
        case 'beginner':
            // Tanuki/Raccoon Dog (狸) - Beginner level
            return `
            <!-- Tanuki Character Group with 3D shadow effect -->
            <g filter="url(#shadow)">
                <!-- Head -->
                <circle cx="0" cy="-15" r="25" fill="url(#tanukiGradient)" />
                
                <!-- Ears -->
                <ellipse cx="-15" cy="-35" rx="8" ry="10" fill="url(#tanukiGradient)" />
                <ellipse cx="15" cy="-35" rx="8" ry="10" fill="url(#tanukiGradient)" />
                
                <!-- Face mask -->
                <path d="M-20,-20 C-15,-10 15,-10 20,-20 C15,-5 -15,-5 -20,-20 Z" fill="#333333" />
                
                <!-- Eyes (curious) -->
                <g class="eyes">
                    <ellipse cx="-10" cy="-20" rx="4" ry="5" fill="#FFFFFF" />
                    <ellipse cx="10" cy="-20" rx="4" ry="5" fill="#FFFFFF" />
                    <ellipse cx="-10" cy="-20" rx="2" ry="3" fill="#000000" />
                    <ellipse cx="10" cy="-20" rx="2" ry="3" fill="#000000" />
                </g>
                
                <!-- Nose -->
                <ellipse cx="0" cy="-10" rx="5" ry="3" fill="#000000" />
                
                <!-- Mouth (playful) -->
                <path d="M-8,-5 Q0,0 8,-5" stroke="#000000" stroke-width="1.5" fill="none" />
                
                <!-- Red bib/apron with 金 character -->
                <path d="M-20,0 L-15,25 L15,25 L20,0 Z" fill="url(#redGradient)" />
                <text x="0" y="15" font-family="sans-serif" font-size="15" fill="#ffcc00" text-anchor="middle" font-weight="bold">金</text>
                
                <!-- Travel bag -->
                <g transform="translate(20,0)">
                    <rect x="-10" y="-5" width="20" height="15" rx="3" ry="3" fill="#8B4513" />
                    <rect x="-8" y="-7" width="16" height="3" rx="1" ry="1" fill="#8B4513" />
                    <ellipse cx="0" cy="-7" rx="3" ry="1" fill="#8B4513" />
                </g>
            </g>
            `;
            
        case 'novice':
        default:
            // Bear (熊) - Novice level
            return `
            <!-- Bear Character Group with 3D shadow effect -->
            <g filter="url(#shadow)">
                <!-- Head -->
                <circle cx="0" cy="-15" r="28" fill="url(#bearGradient)" />
                
                <!-- Ears -->
                <circle cx="-18" cy="-35" r="10" fill="url(#bearGradient)" />
                <circle cx="18" cy="-35" r="10" fill="url(#bearGradient)" />
                <circle cx="-18" cy="-35" r="5" fill="#5E2605" />
                <circle cx="18" cy="-35" r="5" fill="#5E2605" />
                
                <!-- Muzzle -->
                <ellipse cx="0" cy="-5" rx="15" ry="12" fill="#A0522D" />
                
                <!-- Eyes (confused) -->
                <g class="eyes">
                    <ellipse cx="-10" cy="-20" rx="3" ry="4" fill="#000000" />
                    <ellipse cx="10" cy="-20" rx="3" ry="4" fill="#000000" />
                    <ellipse cx="-10" cy="-22" rx="1" ry="1" fill="#FFFFFF" />
                    <ellipse cx="10" cy="-22" rx="1" ry="1" fill="#FFFFFF" />
                </g>
                
                <!-- Nose -->
                <ellipse cx="0" cy="-10" rx="6" ry="4" fill="#000000" />
                
                <!-- Mouth (confused) -->
                <path d="M-8,-3 Q0,-8 8,-3" stroke="#000000" stroke-width="1.5" fill="none" />
                
                <!-- Red bib/apron with 金 character -->
                <path d="M-20,0 L-15,25 L15,25 L20,0 Z" fill="url(#redGradient)" />
                <text x="0" y="15" font-family="sans-serif" font-size="15" fill="#ffcc00" text-anchor="middle" font-weight="bold">金</text>
                
                <!-- Sweat drop -->
                <path d="M20,-25 Q22,-20 20,-15 Q18,-20 20,-25 Z" fill="#99ccff" />
                
                <!-- Map (upside down, showing confusion) -->
                <g transform="translate(20,0) rotate(180)">
                    <path d="M-5,-5 C0,-10 5,-5 10,-8 C15,-10 10,-15 15,-12 C20,-10 15,-5 20,0 C15,5 10,2 5,5 C0,8 -5,2 -5,-5 Z" fill="#33ff33" opacity="0.5" />
                </g>
            </g>
            `;
    }
}