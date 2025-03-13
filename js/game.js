/**
 * game.js - Handles game logic and scoring
 */

// Game state variables
let actualLocation;
let totalScore = 0;
let currentRound = 1; // Always start from round 1
const maxRounds = 5;  // Always play 5 rounds
let timerInterval;
let usedLocations = [];
let guessPositions = []; // Track player guesses for sharing
let currentLocationData = null;
let retryCount = 0;
let gameSettings = {
    difficulty: null, // null means all difficulties
    region: null,     // null means all regions
    category: null    // null means all categories
};

// Make game state variables available globally for sharing
window.guessPositions = guessPositions;
window.usedLocations = usedLocations;

// Expose totalScore to window for sharing
Object.defineProperty(window, 'totalScore', {
    get: function() {
        return totalScore;
    }
});

/**
 * Initialize the game
 * @param {Object} settings - Optional game settings
 */
function initGame(settings = {}) {
    console.log("Initializing game with maxRounds =", maxRounds);
    
    totalScore = 0;
    currentRound = 1;
    usedLocations = [];
    guessPositions = []; // Reset guess positions
    retryCount = 0;
    
    // Apply any provided settings
    gameSettings = {
        difficulty: settings.difficulty || null,
        region: settings.region || null,
        category: settings.category || null
    };
    
    console.log("Game settings:", gameSettings);
    
    updateScore(totalScore);
    updateRound(currentRound, maxRounds);
    setupNewRound();
}

/**
 * Set up a new round with a location from the database
 */
function setupNewRound() {
    try {
        console.log(`Setting up round ${currentRound} of ${maxRounds}`);
        
        resetMap();
        showLoadingIndicator();
        
        // Ensure panorama is initialized
        if (!window.panorama) {
            console.log("Panorama not initialized, initializing now");
            window.panorama = initializePanorama();
            continueSetupRound();
        } else {
            continueSetupRound();
        }
    } catch (error) {
        console.error('Error in setupNewRound:', error);
        handleStreetViewError();
    }
}

/**
 * Continue setting up the round after ensuring panorama is initialized
 */
function continueSetupRound() {
    // Show loading indicator while we get a location
    showLoadingIndicator();
    
    // Get a random location from our database or generator
    getRandomLocationFromDB().then(locationData => {
        currentLocationData = locationData;
        
        // Convert the coordinates to a LatLng object
        const coordinates = new google.maps.LatLng(
            locationData.coordinates.lat,
            locationData.coordinates.lng
        );
        
        console.log(`Round ${currentRound}: Selected location ${locationData.name}`);
        
        findStreetViewLocation(coordinates, (location, error) => {
            if (error) {
                console.error('Error finding Street View location:', error);
                handleStreetViewError();
                return;
            }
            
            hideLoadingIndicator();
            
            // Store both the original coordinates and the actual panorama location
            const originalCoordinates = new google.maps.LatLng(
                locationData.coordinates.lat,
                locationData.coordinates.lng
            );
            
            // Use the panorama location for both the panorama and the actual location marker
            actualLocation = location;
            console.log('Original coordinates:', locationData.coordinates.lat, locationData.coordinates.lng);
            console.log('Panorama location:', location.lat(), location.lng());
            console.log('Location data:', locationData.name, locationData.region);
            
            // Set the panorama to the new location with custom POV if available
            if (locationData.pov) {
                setPanoramaLocation(location, locationData.pov);
            } else {
                setPanoramaLocation(location);
            }
            
            // Start the timer for this round
            startTimer();
            
            // Enable the submit button
            enableSubmitButton();
            
            // Reset retry count for next round
            retryCount = 0;
        });
    }).catch(error => {
        console.error('Error getting random location:', error);
        handleStreetViewError();
    });
}

/**
 * Get a random location from the database or generate a new one
 * @returns {Object} A location object
 */
async function getRandomLocationFromDB() {
    // Check if we should use the generator or the database
    const useGenerator = Math.random() < 0.7; // 70% chance to use generator
    
    if (useGenerator && typeof getRandomGeneratedLocation === 'function') {
        try {
            console.log('Using location generator to create a new location');
            
            // Create filters based on game settings
            const filters = {
                difficulty: gameSettings.difficulty,
                region: gameSettings.region,
                category: gameSettings.category
            };
            
            // Get a generated location
            const location = await getRandomGeneratedLocation(filters);
            
            // Add to used locations
            usedLocations.push(location);
            
            return location;
        } catch (error) {
            console.error('Error generating location:', error);
            console.log('Falling back to database locations');
            // Fall back to database if generation fails
            return getRandomLocationFromDatabase();
        }
    } else {
        // Use the existing database
        return getRandomLocationFromDatabase();
    }
}

/**
 * Get a random location from the static database
 * @returns {Object} A location object from the database
 */
function getRandomLocationFromDatabase() {
    // For first-time players on first round, try to get a beginner-friendly location
    if (currentRound === 1 && window.getBeginnerFriendlyLocation && !localStorage.getItem('japan-tsu-played')) {
        const beginnerLocation = window.getBeginnerFriendlyLocation(LOCATIONS_DB);
        if (beginnerLocation) {
            console.log('Using beginner-friendly location for first-time player');
            usedLocations.push(beginnerLocation);
            
            // Show first-time hint
            if (window.addFirstTimeHint) {
                setTimeout(window.addFirstTimeHint, 2000);
            }
            
            return beginnerLocation;
        }
    }
    
    // Filter out already used locations
    let availableLocations = LOCATIONS_DB.filter(loc =>
        !usedLocations.some(used =>
            used.coordinates.lat === loc.coordinates.lat &&
            used.coordinates.lng === loc.coordinates.lng
        )
    );
    
    // If we've used all locations, reset the used locations array
    if (availableLocations.length === 0) {
        console.log('All locations have been used. Resetting used locations.');
        usedLocations = [];
        availableLocations = [...LOCATIONS_DB]; // Use all locations
    }
    
    // Apply any game settings filters to the available locations
    if (gameSettings.difficulty) {
        availableLocations = availableLocations.filter(loc => loc.difficulty === gameSettings.difficulty);
    }
    
    if (gameSettings.region) {
        availableLocations = availableLocations.filter(loc => loc.region === gameSettings.region);
    }
    
    if (gameSettings.category) {
        availableLocations = availableLocations.filter(loc => loc.category === gameSettings.category);
    }
    
    // If no locations match the filters, use all available locations
    if (availableLocations.length === 0) {
        console.warn('No locations match the provided filters. Using all available locations.');
        availableLocations = LOCATIONS_DB.filter(loc =>
            !usedLocations.some(used =>
                used.coordinates.lat === loc.coordinates.lat &&
                used.coordinates.lng === loc.coordinates.lng
            )
        );
    }
    
    // Get a random location from the filtered available locations
    const randomIndex = Math.floor(Math.random() * availableLocations.length);
    const location = availableLocations[randomIndex];
    
    // Add to used locations
    usedLocations.push(location);
    
    return location;
}

/**
 * Handle errors when Street View data is not found
 */
function handleStreetViewError() {
    retryCount++;
    
    if (retryCount > 3) {
        // After 3 retries, show a message and move to the next location
        hideLoadingIndicator();
        console.log("Having trouble finding Street View data. Moving to a new location.");
        
        // Instead of an alert which blocks the UI, show a message in the panorama
        const panoramaElement = document.getElementById("panorama");
        if (panoramaElement) {
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.innerHTML = `
                <div class="card card-accent">
                    <div class="card-body">
                        <h3>Street View Not Available</h3>
                        <p>Having trouble finding Street View data for this location.</p>
                        <p>Moving to a new location in 3 seconds...</p>
                    </div>
                </div>
            `;
            panoramaElement.appendChild(errorMessage);
            
            // Remove the message after a delay
            setTimeout(() => {
                if (errorMessage.parentNode === panoramaElement) {
                    panoramaElement.removeChild(errorMessage);
                }
            }, 3000);
        }
        
        retryCount = 0;
        setTimeout(setupNewRound, 3000);
    } else {
        // Try again with a different location
        console.log(`Retry attempt ${retryCount}/3`);
        setTimeout(setupNewRound, 1000);
    }
}

/**
 * Start the timer for the current round
 */
function startTimer() {
    const totalTime = 120; // 2 minutes in seconds
    let timeLeft = totalTime;
    const timerElement = document.getElementById("timer");
    const immersiveTimerElement = document.getElementById("immersive-timer");
    
    // Clear any existing timer
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    // Initialize progress bar to 100%
    updateTimerProgress(timeLeft, totalTime);
    
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
        
        // Update progress bar
        updateTimerProgress(timeLeft, totalTime);
        
        // Add visual effects when time is running low
        if (timeLeft <= 10 && timeLeft > 0) {
            if (timerElement) {
                timerElement.classList.add('time-low');
            }
            if (immersiveTimerElement) {
                immersiveTimerElement.classList.add('time-low');
            }
        } else {
            if (timerElement) {
                timerElement.classList.remove('time-low');
            }
            if (immersiveTimerElement) {
                immersiveTimerElement.classList.remove('time-low');
            }
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
    console.log("Time's up! Moving to the next round.");
    
    // Check if we're in immersive mode and exit if necessary
    if (window.isImmersiveMode) {
        console.log("Exiting immersive mode before proceeding to next round");
        toggleImmersiveMode();
    }
    
    // Show a non-blocking message instead of an alert
    const panoramaElement = document.getElementById("panorama");
    if (panoramaElement) {
        const timeUpMessage = document.createElement('div');
        timeUpMessage.className = 'time-up-message';
        timeUpMessage.innerHTML = `
            <div class="card card-primary">
                <div class="card-body">
                    <h3>Time's Up!</h3>
                    <p>Moving to the next round...</p>
                </div>
            </div>
        `;
        panoramaElement.appendChild(timeUpMessage);
        
        // Remove the message after a delay
        setTimeout(() => {
            if (timeUpMessage.parentNode === panoramaElement) {
                panoramaElement.removeChild(timeUpMessage);
            }
        }, 3000);
    }
    
    submitGuess(); // This will handle submitting the current guess (or no guess) and moving to the next round
}

// Flag to prevent multiple submissions for the same round
let isSubmitting = false;

/**
 * Submit the current guess and calculate score
 */
function submitGuess() {
    try {
        // Prevent multiple submissions for the same round
        if (isSubmitting) {
            console.log("Already processing a submission, ignoring duplicate");
            return;
        }
        
        // Set the flag to prevent multiple submissions
        isSubmitting = true;
        
        // Prevent submitting after game is complete
        if (currentRound > maxRounds) {
            console.log("Game already complete, ignoring additional submissions");
            isSubmitting = false;
            return;
        }
        
        // Also prevent processing if we're somehow on round 6 or higher
        if (currentRound > 5) {
            console.log("Invalid round number, resetting game");
            resetGame();
            isSubmitting = false;
            return;
        }
        
        // Clear the timer
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        
        console.log(`Processing guess for round ${currentRound} of ${maxRounds}`);
        
        let guessLocation, distance, score;
        const guessMarker = window.guessMarker; // Access from global scope
        
        if (!guessMarker) {
            console.log("No guess made");
            guessLocation = null;
            distance = 2000; // Max distance
            score = 0;
            
            // Record null for this round's guess
            guessPositions.push(null);
        } else {
            guessLocation = guessMarker.getPosition();
            
            if (!actualLocation) {
                console.error("actualLocation is not set");
                isSubmitting = false;
                return;
            }
            
            console.log("Actual location in submitGuess:", actualLocation.lat(), actualLocation.lng());
            console.log("Guess location:", guessLocation.lat(), guessLocation.lng());
            
            // Record this round's guess position
            guessPositions.push(guessLocation);
            
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
        
        // Show information about the location if available
        if (currentLocationData) {
            showLocationInfo(currentLocationData, distance);
        }
        
        // Check if this was the last round (round 5)
        if (currentRound === maxRounds) {
            console.log(`Game complete! Final score: ${totalScore}`);
            
            // Reset the submission flag after a delay
            setTimeout(() => {
                isSubmitting = false;
            }, 1000);
            
            // Delay ending the game to give the player time to see the final round result
            console.log("Delaying end game to show final round result");
            setTimeout(() => {
                endGame(totalScore, maxRounds, usedLocations);
            }, 7000); // Same delay as for showing location info
        } else {
            // Move to next round
            currentRound++;
            console.log(`Round completed. Moving to round ${currentRound} of ${maxRounds}`);
            updateRound(currentRound, maxRounds);
            
            // Reset the submission flag after a delay
            setTimeout(() => {
                isSubmitting = false;
            }, 1000);
            
            // Phase 1: Show round result for a few seconds (already visible at this point)
            // Add a "preparing journey" indicator after 1 second
            setTimeout(() => {
                const resultElement = document.getElementById('result');
                if (resultElement) {
                    const journeyIndicator = document.createElement('div');
                    journeyIndicator.className = 'journey-indicator';
                    journeyIndicator.style.marginTop = '15px';
                    journeyIndicator.style.padding = '8px';
                    journeyIndicator.style.backgroundColor = 'rgba(255, 117, 171, 0.1)';
                    journeyIndicator.style.borderRadius = '5px';
                    journeyIndicator.style.textAlign = 'center';
                    journeyIndicator.style.animation = 'pulse 1.5s infinite';
                    journeyIndicator.innerHTML = `
                        <div style="font-weight: bold; margin-bottom: 5px;">Preparing for journey...</div>
                        <div style="font-size: 14px;">Next location loading</div>
                    `;
                    resultElement.appendChild(journeyIndicator);
                    
                    // Add pulse animation
                    const pulseStyle = document.createElement('style');
                    pulseStyle.textContent = `
                        @keyframes pulse {
                            0% { opacity: 0.6; }
                            50% { opacity: 1; }
                            100% { opacity: 0.6; }
                        }
                    `;
                    document.head.appendChild(pulseStyle);
                }
                
                // Phase 2: Start journey animation while keeping result visible
                setTimeout(() => {
                    // Slide result to top in compact mode
                    const resultElement = document.getElementById('result');
                    if (resultElement) {
                        // Add transition styles
                        resultElement.style.transition = 'all 0.25s ease';
                        
                        // Move to top of screen
                        resultElement.style.position = 'fixed';
                        resultElement.style.top = '10px';
                        resultElement.style.left = '50%';
                        resultElement.style.transform = 'translateX(-50%)';
                        resultElement.style.zIndex = '10000';
                        resultElement.style.maxWidth = '300px';
                        resultElement.style.padding = '5px 10px';
                        resultElement.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                        resultElement.style.borderRadius = '10px';
                        resultElement.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                        
                        // Make card body more compact
                        const cardBody = resultElement.querySelector('.card-body');
                        if (cardBody) {
                            cardBody.style.display = 'flex';
                            cardBody.style.justifyContent = 'space-between';
                            cardBody.style.padding = '5px';
                        }
                    }
                    
                    // Create journey animation overlay that covers the entire screen
                    const journeyOverlay = document.createElement('div');
                    journeyOverlay.className = 'journey-overlay';
                    journeyOverlay.style.position = 'fixed';
                    journeyOverlay.style.top = '0';
                    journeyOverlay.style.left = '0';
                    journeyOverlay.style.width = '100%';
                    journeyOverlay.style.height = '100%';
                    journeyOverlay.style.backgroundColor = 'rgba(255, 240, 245, 0.9)';
                    journeyOverlay.style.zIndex = '9999';
                    journeyOverlay.style.display = 'flex';
                    journeyOverlay.style.flexDirection = 'column';
                    journeyOverlay.style.justifyContent = 'center';
                    journeyOverlay.style.alignItems = 'center';
                    journeyOverlay.style.fontFamily = 'Varela Round, sans-serif';
                    journeyOverlay.style.color = '#FF75AB';
                    journeyOverlay.style.fontSize = '24px';
                    journeyOverlay.style.textAlign = 'center';
                    journeyOverlay.style.padding = '20px';
                    
                    // Add content to the overlay
                    journeyOverlay.innerHTML = `
                        <div class="mascot" style="width: 100px; height: 100px; margin-bottom: 20px; animation: bounce 0.5s infinite alternate;">
                            <div style="width: 100%; height: 100%; background-color: #FF75AB; border-radius: 50%; position: relative; overflow: hidden;">
                                <div style="position: absolute; top: 30%; left: 50%; transform: translateX(-50%); width: 60%; height: 40%; display: flex; justify-content: space-between;">
                                    <div style="width: 15px; height: 15px; background-color: #333; border-radius: 50%;"></div>
                                    <div style="width: 15px; height: 15px; background-color: #333; border-radius: 50%;"></div>
                                </div>
                                <div style="position: absolute; bottom: 30%; left: 50%; transform: translateX(-50%); width: 30%; height: 10%; border-bottom: 3px solid #333; border-radius: 50%;"></div>
                            </div>
                        </div>
                        
                        <div class="message" style="font-size: 28px; font-weight: bold; margin: 20px 0;">Traveling to next location...</div>
                        
                        <div class="landmarks" style="display: flex; gap: 20px; margin: 20px 0; justify-content: center;">
                            <div style="font-size: 40px; animation: pop 0.25s forwards;">🗼</div>
                            <div style="font-size: 40px; animation: pop 0.25s forwards; animation-delay: 0.15s;">🗻</div>
                            <div style="font-size: 40px; animation: pop 0.25s forwards; animation-delay: 0.3s;">🏯</div>
                            <div style="font-size: 40px; animation: pop 0.25s forwards; animation-delay: 0.45s;">🚅</div>
                        </div>
                        
                        <div class="progress-container" style="width: 80%; max-width: 400px; height: 20px; background-color: #FFF; border-radius: 10px; overflow: hidden; margin: 20px auto; border: 2px solid #FF75AB;">
                            <div class="progress-bar" style="width: 0%; height: 100%; background: linear-gradient(90deg, #FF75AB, #FFB6C1); transition: width 2.5s ease;"></div>
                        </div>
                    `;
                    
                    // Add animation styles
                    const style = document.createElement('style');
                    style.textContent = `
                        @keyframes bounce {
                            0% { transform: translateY(0); }
                            100% { transform: translateY(-20px); }
                        }
                        
                        @keyframes pop {
                            0% { transform: scale(0); }
                            70% { transform: scale(1.2); }
                            100% { transform: scale(1); }
                        }
                    `;
                    journeyOverlay.appendChild(style);
                    
                    // Add to document
                    document.body.appendChild(journeyOverlay);
                    
                    // Animate progress bar
                    setTimeout(() => {
                        const progressBar = journeyOverlay.querySelector('.progress-bar');
                        if (progressBar) {
                            progressBar.style.width = '100%';
                        }
                    }, 50);
                    
                    // Remove overlay and restore result after animation completes
                    setTimeout(() => {
                        // Remove journey overlay
                        if (journeyOverlay.parentNode) {
                            journeyOverlay.parentNode.removeChild(journeyOverlay);
                        }
                        
                        // Reset result element to original state
                        if (resultElement) {
                            resultElement.style.position = '';
                            resultElement.style.top = '';
                            resultElement.style.left = '';
                            resultElement.style.transform = '';
                            resultElement.style.zIndex = '';
                            resultElement.style.maxWidth = '';
                            resultElement.style.padding = '';
                            resultElement.style.backgroundColor = '';
                            resultElement.style.borderRadius = '';
                            resultElement.style.boxShadow = '';
                            
                            // Reset card body
                            const cardBody = resultElement.querySelector('.card-body');
                            if (cardBody) {
                                cardBody.style.display = '';
                                cardBody.style.justifyContent = '';
                                cardBody.style.padding = '';
                            }
                            
                            // Remove journey indicator
                            const journeyIndicator = resultElement.querySelector('.journey-indicator');
                            if (journeyIndicator && journeyIndicator.parentNode) {
                                journeyIndicator.parentNode.removeChild(journeyIndicator);
                            }
                        }
                        
                        // Start next round
                        setupNewRound();
                    }, 3000);
                }, 2000); // Start phase 2 after 2 seconds
            }, 500); // Start phase 1 after 0.5 seconds
        }
    } catch (error) {
        console.error("Error in submitGuess function:", error);
        isSubmitting = false;
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
    
    // More challenging scoring mechanism with steeper exponential decay
    const maxDistance = 500; // Reduced from 1000km to 500km for more challenge
    const maxScore = 5000;
    const perfectThreshold = 5; // Distance in km below which you get a perfect score
    
    // Exponential scoring formula: score decreases more rapidly as distance increases
    // For a guess within perfectThreshold km, score = maxScore
    // For distance = maxDistance or greater, score = 0
    let score = 0;
    
    if (distance <= perfectThreshold) {
        // Perfect or near-perfect guess
        score = maxScore;
    } else if (distance < maxDistance) {
        // Steeper exponential decay formula: score = maxScore * e^(-k * (distance - perfectThreshold))
        // where k is chosen so that score = 0 when distance = maxDistance
        const k = Math.log(1000) / (maxDistance - perfectThreshold); // k chosen so score is 0.1% of maxScore at maxDistance
        score = Math.round(maxScore * Math.exp(-k * (distance - perfectThreshold)));
    }
    
    console.log(`Score calculation: distance=${distance}km, maxDistance=${maxDistance}, perfectThreshold=${perfectThreshold}, maxScore=${maxScore}, calculated score=${score}`);
    
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
 * @param {Object} settings - Optional game settings
 */
function resetGame(settings = {}) {
    console.log("Resetting game completely");
    
    // Clear any existing timer
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    // Reset all game state variables
    totalScore = 0;
    currentRound = 1;
    resetMap();
    usedLocations = [];
    currentLocationData = null;
    retryCount = 0;
    
    // Reset the game container to its initial state
    const gameContainer = document.getElementById("game-container");
    if (gameContainer) {
        gameContainer.innerHTML = `
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
                <!-- Game settings removed to streamline UI -->
            </div>

            <div class="timer-display" id="timer">2:00</div>

            <!-- New Three-Column Layout -->
            <div class="game-layout">
                <!-- Left Column -->
                <div class="game-column game-column-left">
                    <!-- Map Container -->
                    <div class="map-container" id="map"></div>

                    <!-- Game Info -->
                    <div class="game-info">
                        <div class="score-display" id="score">Total Score: 0</div>
                        <div class="round-display" id="round">Round: 1 / 5</div>
                        <div class="progress" id="timer-progress">
                            <div class="progress-bar" style="width: 100%;"></div>
                        </div>
                    </div>

                    <!-- New Left Ad Space -->
                    <div class="ad-container ad-container-left">
                        <!-- Ad content will go here -->
                    </div>
                </div>

                <!-- Center Column -->
                <div class="game-column game-column-center">
                    <!-- Panorama Viewer -->
                    <div class="panorama-container" id="panorama"></div>
                    
                    <!-- Game Controls -->
                    <div class="game-controls">
                        <button class="btn btn-primary" id="submit-guess">Submit Guess</button>
                        <button class="btn btn-secondary" id="toggle-immersive-btn" onclick="toggleImmersiveMode()">Immersive Mode</button>
                    </div>

                    <!-- Result Display -->
                    <div id="result" style="display: none;"></div>
                </div>

                <!-- Right Column -->
                <div class="game-column game-column-right">
                    <!-- Location Info (moved from below) -->
                    <div class="location-info" id="location-info" style="display: none;"></div>

                    <!-- New Right Ad Space -->
                    <div class="ad-container ad-container-right">
                        <!-- Ad content will go here -->
                    </div>
                </div>
            </div>

            <!-- Bottom Ad Space -->
            <div class="ad-container">
                <!-- Ad content will go here -->
            </div>
        `;
    }
    
    console.log("Game reset. Starting new game with round =", currentRound);
    
    // We need to reinitialize the map and panorama before starting a new game
    // This is done asynchronously to ensure the DOM elements are ready
    setTimeout(() => {
        try {
            console.log("Reinitializing map and panorama");
            
            // Initialize map and panorama
            window.map = initializeMap();
            window.panorama = initializePanorama();
            
            // Initialize the game again with settings
            initGame(settings);
        } catch (error) {
            console.error("Error in resetGame:", error);
            // Still try to initialize the game even if there was an error
            initGame(settings);
        }
    }, 100); // Short delay to ensure DOM is ready
}

/**
 * Set game difficulty
 * @param {string} difficulty - The difficulty level to set
 */
function setGameDifficulty(difficulty) {
    if (Object.values(DIFFICULTY_LEVELS).includes(difficulty)) {
        gameSettings.difficulty = difficulty;
        console.log(`Game difficulty set to: ${difficulty}`);
    } else {
        console.error(`Invalid difficulty: ${difficulty}`);
    }
}

/**
 * Set game region
 * @param {string} region - The region to set
 */
function setGameRegion(region) {
    if (Object.values(JAPAN_REGIONS).includes(region)) {
        gameSettings.region = region;
        console.log(`Game region set to: ${region}`);
    } else {
        console.error(`Invalid region: ${region}`);
    }
}

/**
 * Set game category
 * @param {string} category - The category to set
 */
function setGameCategory(category) {
    if (Object.values(LOCATION_CATEGORIES).includes(category)) {
        gameSettings.category = category;
        console.log(`Game category set to: ${category}`);
    } else {
        console.error(`Invalid category: ${category}`);
    }
}

/**
 * Reset game settings to default (all locations)
 */
function resetGameSettings() {
    gameSettings = {
        difficulty: null,
        region: null,
        category: null
    };
    console.log('Game settings reset to default (all locations)');
}

// Make functions globally available
window.initGame = initGame;
window.setupNewRound = setupNewRound;
window.submitGuess = submitGuess;
window.calculateScore = calculateScore;
window.getJapaneseLevel = getJapaneseLevel;
window.resetGame = resetGame;
window.resetGameGlobal = resetGame; // Add alias for resetGame to fix play again button
window.handleTimeUp = handleTimeUp;
window.setGameDifficulty = setGameDifficulty;
window.setGameRegion = setGameRegion;
window.setGameCategory = setGameCategory;
window.resetGameSettings = resetGameSettings;

// Expose currentLocationData to the window object for use in ui.js
Object.defineProperty(window, 'currentLocationData', {
    get: function() {
        return currentLocationData;
    }
});