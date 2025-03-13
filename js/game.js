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
let currentLocationData = null;
let retryCount = 0;
let gameSettings = {
    difficulty: null, // null means all difficulties
    region: null,     // null means all regions
    category: null    // null means all categories
};

/**
 * Initialize the game
 * @param {Object} settings - Optional game settings
 */
function initGame(settings = {}) {
    console.log("Initializing game with maxRounds =", maxRounds);
    
    totalScore = 0;
    currentRound = 1;
    usedLocations = [];
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
    // Get a random location from our curated database
    const locationData = getRandomLocationFromDB();
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
}

/**
 * Get a random location from the database that hasn't been used yet
 * @returns {Object} A location object from the database
 */
function getRandomLocationFromDB() {
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
                timerElement.classList.add('pulse');
            }
            if (immersiveTimerElement) {
                immersiveTimerElement.classList.add('pulse');
            }
        } else {
            if (timerElement) {
                timerElement.classList.remove('pulse');
            }
            if (immersiveTimerElement) {
                immersiveTimerElement.classList.remove('pulse');
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
        } else {
            guessLocation = guessMarker.getPosition();
            
            if (!actualLocation) {
                console.error("actualLocation is not set");
                isSubmitting = false;
                return;
            }
            
            console.log("Actual location in submitGuess:", actualLocation.lat(), actualLocation.lng());
            console.log("Guess location:", guessLocation.lat(), guessLocation.lng());
            
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
            
            setTimeout(setupNewRound, 7000); // Increased delay to give players time to read location info
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
                <div class="game-settings">
                    <button class="btn btn-sm btn-outline" id="settings-button">Settings</button>
                </div>
            </div>

            <div class="timer-display" id="timer">2:00</div>

            <div class="panorama-container" id="panorama"></div>

            <div class="game-info-grid">
                <div class="map-container" id="map"></div>

                <div class="game-info">
                    <div class="score-display" id="score">Total Score: 0</div>
                    <div class="round-display" id="round">Round: 1 / 5</div>
                    <div class="progress" id="timer-progress">
                        <div class="progress-bar" style="width: 100%;"></div>
                    </div>
                </div>
            </div>

            <div class="game-controls">
                <button class="btn btn-primary" id="submit-guess">Submit Guess</button>
                <button class="btn btn-secondary" id="toggle-immersive-btn" onclick="toggleImmersiveMode()">Immersive Mode</button>
            </div>

            <div id="result" style="display: none;"></div>
            <div id="location-info" style="display: none;"></div>
            
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
window.handleTimeUp = handleTimeUp;
window.setGameDifficulty = setGameDifficulty;
window.setGameRegion = setGameRegion;
window.setGameCategory = setGameCategory;
window.resetGameSettings = resetGameSettings;