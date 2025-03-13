/**
 * index.js - Main entry point for the Japan-tsū application
 */

// Import all modules
// Note: We're using dynamic imports to avoid CORS issues when loading directly from filesystem
let mapModule, panoramaModule, gameModule, uiModule, sharingModule, locationsModule;

// Global variables that need to be accessible from HTML
window.map = null;
window.panorama = null;
window.guessMarker = null;
window.actualMarker = null;
window.animationPath = null;

/**
 * Initialize the application when the Google Maps API is loaded
 * This function is called by the Google Maps API as a callback
 */
window.initMap = async function() {
    console.log("initMap called");
    
    try {
        // Dynamically import modules
        mapModule = await import('./map.js');
        panoramaModule = await import('./panorama.js');
        gameModule = await import('./game.js');
        uiModule = await import('./ui.js');
        sharingModule = await import('./sharing.js');
        locationsModule = await import('./locations-db.js');
        
        // Expose functions to global scope
        window.submitGuess = gameModule.submitGuess;
        window.toggleImmersiveMode = uiModule.toggleImmersiveMode;
        window.shareResult = sharingModule.shareResult;
        window.resetGameGlobal = gameModule.resetGame;
        
        // Expose game settings functions
        window.setGameDifficulty = gameModule.setGameDifficulty;
        window.setGameRegion = gameModule.setGameRegion;
        window.setGameCategory = gameModule.setGameCategory;
        window.resetGameSettings = gameModule.resetGameSettings;
        
        // Expose constants for game settings
        window.DIFFICULTY_LEVELS = gameModule.DIFFICULTY_LEVELS;
        window.LOCATION_CATEGORIES = gameModule.LOCATION_CATEGORIES;
        window.JAPAN_REGIONS = gameModule.JAPAN_REGIONS;
        
        // Check if Google Maps API is loaded
        if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
            console.log("Google Maps API not loaded yet, retrying...");
            setTimeout(window.initMap, 100);
            return;
        }
        
        // Initialize map and panorama
        window.map = mapModule.initializeMap();
        window.panorama = panoramaModule.initializePanorama();
        
        // Set up toggle map button event listener
        const toggleMapButton = document.getElementById('toggle-map');
        if (toggleMapButton) {
            toggleMapButton.addEventListener('click', handleToggleMap);
        }
        
        // Initialize the game
        gameModule.initGame();
        
        // Check if all required elements exist
        uiModule.checkElements();
        
        console.log("Game initialized successfully");
    } catch (error) {
        console.error("Error initializing game:", error);
        console.error("Error details:", error.stack);
    }
};

/**
 * Handle toggle map button click in immersive mode
 */
function handleToggleMap() {
    const panoramaFullscreen = document.getElementById('panorama-fullscreen');
    const miniMap = document.getElementById('mini-map-container');
    
    if (!panoramaFullscreen || !miniMap) {
        console.error("Required elements for toggle map not found");
        return;
    }
    
    if (panoramaFullscreen.style.display !== 'none') {
        panoramaFullscreen.style.display = 'none';
        miniMap.style.width = '100%';
        miniMap.style.height = '100%';
    } else {
        panoramaFullscreen.style.display = 'block';
        miniMap.style.width = '200px';
        miniMap.style.height = '200px';
    }
}

/**
 * Set up event listeners when the DOM is loaded
 */
function setupEventListeners() {
    // Add event listener to submit button
    const submitButton = document.getElementById('submit-guess');
    if (submitButton) {
        // Remove any existing click listeners first to prevent double execution
        submitButton.removeEventListener('click', submitGuessHandler);
        
        // Add the event listener with a named function so we can remove it later if needed
        submitButton.addEventListener('click', submitGuessHandler);
        console.log("Submit button event listener added");
    } else {
        console.error("Submit button not found");
    }
    
    // Handler function for submit button clicks
    function submitGuessHandler() {
        console.log("Submit button clicked (from event listener)");
        if (window.submitGuess) {
            window.submitGuess();
        } else {
            console.error("submitGuess function not available yet");
        }
    }
    
    // Add event listener to toggle immersive mode button
    const toggleImmersiveButton = document.getElementById('toggle-immersive-btn');
    if (toggleImmersiveButton) {
        toggleImmersiveButton.addEventListener('click', function() {
            if (window.toggleImmersiveMode) {
                window.toggleImmersiveMode();
            } else {
                console.error("toggleImmersiveMode function not available yet");
            }
        });
        console.log("Toggle immersive mode button event listener added");
    } else {
        console.error("Toggle immersive mode button not found");
    }
    
    // Add event listener to exit immersive button
    const exitImmersiveButton = document.getElementById('exit-immersive');
    if (exitImmersiveButton) {
        exitImmersiveButton.addEventListener('click', function() {
            if (window.toggleImmersiveMode) {
                window.toggleImmersiveMode();
            } else {
                console.error("toggleImmersiveMode function not available yet");
            }
        });
    }
}

// Set up event listeners when the DOM is loaded
document.addEventListener('DOMContentLoaded', setupEventListeners);

// Additional initialization when window is fully loaded
window.onload = function() {
    console.log("Window loaded");
    
    // If modules are loaded, check elements
    if (uiModule) {
        uiModule.checkElements();
    }
    
    // We no longer add a redundant event listener here
    // This was causing the double submission issue
};

// Log that the index.js file has loaded
console.log("index.js loaded");