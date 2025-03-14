/**
 * index.js - Main entry point for the Japan-tsū application
 */

// Global variables that need to be accessible from HTML
window.map = null;
window.panorama = null;
window.minimap = null;
window.guessMarker = null;
window.actualMarker = null;
window.animationPath = null;

/**
 * Initialize the application when the Google Maps API is loaded
 * This function is called by the Google Maps API as a callback
 */
window.initMap = function() {
    console.log("initMap called");
    
    try {
        // Check if Google Maps API is loaded
        if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
            console.log("Google Maps API not loaded yet, retrying...");
            setTimeout(window.initMap, 100);
            return;
        }
        
        // Initialize panorama directly in immersive mode
        window.panorama = initializeImmersivePanorama();
        
        // Initialize minimap for guessing
        window.minimap = initializeMinimap();
        
        // Set up navigation controls
        if (typeof setupNavigationControls === 'function') {
            setupNavigationControls();
        } else {
            console.warn("setupNavigationControls function not available yet");
        }
        
        // Set up toggle map button event listener
        const toggleMapButton = document.getElementById('toggle-map');
        if (toggleMapButton) {
            toggleMapButton.addEventListener('click', handleToggleMap);
        }
        
        // Check if this is the first visit
        const isFirstVisit = !localStorage.getItem('japan-tsu-played');
        
        if (isFirstVisit) {
            // Show immersive welcome for first-time players
            if (window.showImmersiveWelcome) {
                window.showImmersiveWelcome();
            } else {
                console.warn("showImmersiveWelcome function not available yet");
                // Fallback to traditional tutorial if immersive welcome is not available
                if (window.showTutorial) {
                    window.showTutorial();
                }
            }
            
            // Initialize the game after a short delay to ensure welcome message is shown
            setTimeout(() => {
                if (typeof initGame === 'function') {
                    initGame();
                }
            }, 500);
        } else {
            // Initialize the game directly for returning players
            initGame();
        }
        
        // Check if all required elements exist
        checkElements();
        
        console.log("Game initialized successfully in immersive mode");
    } catch (error) {
        console.error("Error initializing game:", error);
        console.error("Error details:", error.stack);
        
        // Fallback to traditional mode if immersive mode fails
        fallbackToTraditionalMode();
    }
};

/**
 * Fallback to traditional mode if immersive mode fails
 */
function fallbackToTraditionalMode() {
    console.log("Falling back to traditional mode");
    
    try {
        // Show the game container
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            gameContainer.style.display = 'block';
        }
        
        // Hide the immersive view
        const immersiveView = document.getElementById('immersive-view');
        if (immersiveView) {
            immersiveView.style.display = 'none';
        }
        
        // Initialize map and panorama in traditional mode
        window.map = initializeMap();
        window.panorama = initializePanorama();
        
        // Initialize the game
        if (typeof initGame === 'function') {
            initGame();
        }
        
        console.log("Fallback to traditional mode successful");
    } catch (error) {
        console.error("Error in fallback to traditional mode:", error);
    }
}

/**
 * Handle toggle map button click in immersive mode
 */
function handleToggleMap() {
    const panoramaFullscreen = document.getElementById('panorama-fullscreen');
    const minimapContainer = document.getElementById('minimap-container');
    
    if (!panoramaFullscreen || !minimapContainer) {
        console.error("Required elements for toggle map not found");
        return;
    }
    
    if (panoramaFullscreen.style.display !== 'none') {
        panoramaFullscreen.style.display = 'none';
        minimapContainer.style.width = '100%';
        minimapContainer.style.height = '100%';
        minimapContainer.style.zIndex = '1005';
        
        // Update toggle map button text
        const toggleMapButton = document.getElementById('toggle-map');
        if (toggleMapButton) {
            toggleMapButton.textContent = 'Return to Panorama';
        }
    } else {
        panoramaFullscreen.style.display = 'block';
        minimapContainer.style.width = '250px';
        minimapContainer.style.height = '250px';
        minimapContainer.style.zIndex = '1002';
        
        // Update toggle map button text
        const toggleMapButton = document.getElementById('toggle-map');
        if (toggleMapButton) {
            toggleMapButton.textContent = 'Switch to Map';
        }
    }
}

/**
 * Set up event listeners when the DOM is loaded
 */
function setupEventListeners() {
    // Add event listener to immersive guess button
    const immersiveGuessButton = document.getElementById('immersive-guess-btn');
    if (immersiveGuessButton) {
        // Remove any existing click listeners first to prevent double execution
        const newGuessButton = immersiveGuessButton.cloneNode(true);
        immersiveGuessButton.parentNode.replaceChild(newGuessButton, immersiveGuessButton);
        
        // Add the event listener
        newGuessButton.addEventListener('click', function() {
            console.log("Immersive guess button clicked");
            if (typeof submitGuess === 'function') {
                submitGuess();
            } else {
                console.error("submitGuess function not available yet");
            }
        });
        console.log("Immersive guess button event listener added");
    } else {
        console.error("Immersive guess button not found");
    }
    
    // Legacy event listeners for traditional mode (kept for compatibility)
    
    // Add event listener to submit button
    const submitButton = document.getElementById('submit-guess');
    if (submitButton) {
        // Remove any existing click listeners first to prevent double execution
        const newSubmitButton = submitButton.cloneNode(true);
        submitButton.parentNode.replaceChild(newSubmitButton, submitButton);
        
        // Add the event listener
        newSubmitButton.addEventListener('click', function() {
            console.log("Submit button clicked (from event listener)");
            if (typeof submitGuess === 'function') {
                submitGuess();
            } else {
                console.error("submitGuess function not available yet");
            }
        });
        console.log("Submit button event listener added");
    }
}

// Set up event listeners when the DOM is loaded
document.addEventListener('DOMContentLoaded', setupEventListeners);

// Additional initialization when window is fully loaded
window.onload = function() {
    console.log("Window loaded");
    
    // Check if all required elements exist
    if (typeof checkElements === 'function') {
        checkElements();
    }
    
    // Set up event listeners again to ensure they're properly attached
    setupEventListeners();
};

// Log that the index.js file has loaded
console.log("index.js loaded");