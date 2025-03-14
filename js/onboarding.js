/**
 * onboarding.js - Simplified onboarding for first-time players
 */

// Check if this is the player's first visit
const isFirstVisit = !localStorage.getItem('japan-tsu-played');

/**
 * Show tutorial for first-time players
 */
function showTutorial() {
    if (!isFirstVisit) return;
    
    console.log("Showing first-time player tutorial");
    
    // Create tutorial overlay
    const tutorialOverlay = document.createElement('div');
    tutorialOverlay.className = 'tutorial-overlay';
    tutorialOverlay.style.position = 'fixed';
    tutorialOverlay.style.top = '0';
    tutorialOverlay.style.left = '0';
    tutorialOverlay.style.width = '100%';
    tutorialOverlay.style.height = '100%';
    tutorialOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    tutorialOverlay.style.zIndex = '10000';
    tutorialOverlay.style.display = 'flex';
    tutorialOverlay.style.justifyContent = 'center';
    tutorialOverlay.style.alignItems = 'center';
    
    // Create tutorial content
    const tutorialContent = document.createElement('div');
    tutorialContent.className = 'tutorial-content';
    tutorialContent.style.backgroundColor = 'white';
    tutorialContent.style.borderRadius = '12px';
    tutorialContent.style.maxWidth = '500px';
    tutorialContent.style.width = '90%';
    tutorialContent.style.padding = '20px';
    tutorialContent.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
    
    tutorialContent.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #FF75AB; margin-bottom: 10px;">Welcome to Japan-tsū!</h2>
            <p>A quick guide to get you started:</p>
        </div>
        
        <div class="tutorial-steps">
            <div class="tutorial-step" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
                <div style="background: #FF75AB; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; justify-content: center; align-items: center; margin-right: 10px; flex-shrink: 0;">1</div>
                <div>
                    <strong>Look around</strong>
                    <p>You'll be placed somewhere in Japan. Use your mouse to look around or use the navigation controls on the left.</p>
                </div>
            </div>
            
            <div class="tutorial-step" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
                <div style="background: #FF75AB; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; justify-content: center; align-items: center; margin-right: 10px; flex-shrink: 0;">2</div>
                <div>
                    <strong>Make your guess</strong>
                    <p>Click on the minimap in the bottom right corner to place your guess for where you think you are.</p>
                </div>
            </div>
            
            <div class="tutorial-step" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
                <div style="background: #FF75AB; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; justify-content: center; align-items: center; margin-right: 10px; flex-shrink: 0;">3</div>
                <div>
                    <strong>Submit and see results</strong>
                    <p>Click the "GUESS" button to see how close you were and earn points.</p>
                </div>
            </div>
            
            <div class="tutorial-step" style="margin-bottom: 15px; display: flex; align-items: flex-start;">
                <div style="background: #FF75AB; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; justify-content: center; align-items: center; margin-right: 10px; flex-shrink: 0;">4</div>
                <div>
                    <strong>Play 5 rounds</strong>
                    <p>Each game has 5 rounds. The game will automatically advance to the next round after showing your results.</p>
                </div>
            </div>
        </div>
        
        <div style="display: flex; justify-content: center; margin-top: 20px;">
            <button id="start-game-btn" class="btn btn-primary" style="padding: 10px 20px;">Start Playing!</button>
        </div>
    `;
    
    tutorialOverlay.appendChild(tutorialContent);
    document.body.appendChild(tutorialOverlay);
    
    // Add event listener to start button
    document.getElementById('start-game-btn').addEventListener('click', () => {
        // Remove tutorial overlay
        document.body.removeChild(tutorialOverlay);
        
        // Mark as played in localStorage
        localStorage.setItem('japan-tsu-played', 'true');
        
        // Start the game
        if (window.initGame) {
            window.initGame();
        }
    });
}

/**
 * Ensure first location is recognizable for new players
 * @param {Array} locations - Available locations
 * @returns {Object} A beginner-friendly location
 */
function getBeginnerFriendlyLocation(locations) {
    if (!isFirstVisit) return null; // Only for first-time players
    
    // Filter for iconic, easy-to-recognize locations
    const iconicLocations = locations.filter(loc => 
        (loc.difficulty === 'easy' || loc.difficulty === DIFFICULTY_LEVELS.EASY) && 
        (loc.category === 'tourist' || loc.category === LOCATION_CATEGORIES.TOURIST)
    );
    
    if (iconicLocations.length > 0) {
        // Get a random iconic location
        return iconicLocations[Math.floor(Math.random() * iconicLocations.length)];
    }
    
    return null; // No suitable location found
}

/**
 * Add subtle hint for first-time players
 */
function addFirstTimeHint() {
    if (!isFirstVisit) return;
    
    // Wait for the panorama to load
    setTimeout(() => {
        const panoramaContainer = document.getElementById('panorama-fullscreen');
        if (!panoramaContainer) return;
        
        // Create hint element
        const hintElement = document.createElement('div');
        hintElement.className = 'first-time-hint';
        hintElement.style.position = 'absolute';
        hintElement.style.bottom = '100px';
        hintElement.style.left = '50%';
        hintElement.style.transform = 'translateX(-50%)';
        hintElement.style.backgroundColor = 'rgba(255, 117, 171, 0.9)';
        hintElement.style.color = 'white';
        hintElement.style.padding = '10px 15px';
        hintElement.style.borderRadius = '20px';
        hintElement.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
        hintElement.style.zIndex = '2000';
        hintElement.style.pointerEvents = 'none';
        hintElement.style.animation = 'fadeInOut 5s forwards';
        
        hintElement.innerHTML = `
            <div style="display: flex; align-items: center;">
                <div style="margin-right: 10px;">💡</div>
                <div>Look for signs, landmarks, and architectural styles to help identify your location</div>
            </div>
        `;
        
        // Add animation style
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; }
                10% { opacity: 1; }
                80% { opacity: 1; }
                100% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        // Add to panorama container
        panoramaContainer.appendChild(hintElement);
        
        // Remove after animation completes
        setTimeout(() => {
            if (hintElement.parentNode === panoramaContainer) {
                panoramaContainer.removeChild(hintElement);
            }
        }, 5000);
    }, 2000);
}

/**
 * Show welcome message for first-time visitors in immersive mode
 */
function showImmersiveWelcome() {
    if (!isFirstVisit) return false;
    
    // Wait a moment for the interface to load
    setTimeout(() => {
        const immersiveView = document.getElementById('immersive-view');
        if (!immersiveView) return;
        
        // Create welcome message
        const welcomeMessage = document.createElement('div');
        welcomeMessage.className = 'welcome-message';
        welcomeMessage.style.position = 'absolute';
        welcomeMessage.style.top = '50%';
        welcomeMessage.style.left = '50%';
        welcomeMessage.style.transform = 'translate(-50%, -50%)';
        welcomeMessage.style.background = 'rgba(255, 255, 255, 0.9)';
        welcomeMessage.style.padding = '30px';
        welcomeMessage.style.borderRadius = '15px';
        welcomeMessage.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.5)';
        welcomeMessage.style.zIndex = '2000';
        welcomeMessage.style.maxWidth = '500px';
        welcomeMessage.style.textAlign = 'center';
        
        welcomeMessage.innerHTML = `
            <h2 style="color: #FF75AB; margin-bottom: 10px;">Welcome to Japan-tsū!</h2>
            <p style="margin-bottom: 20px;">Explore Japan through Street View and guess your location on the map.</p>
            <div style="text-align: left; margin-bottom: 20px;">
                <p>🔍 <strong>Navigation:</strong> Use the controls on the left to move around</p>
                <p>🧭 <strong>Compass:</strong> Shows your current direction at the top</p>
                <p>🗺️ <strong>Minimap:</strong> Click on it to place your guess</p>
                <p>⏱️ <strong>Timer:</strong> You have 2 minutes per round</p>
            </div>
            <button id="start-exploring-btn" class="btn btn-primary" style="padding: 10px 20px; background-color: #FF75AB; color: white; border: none; border-radius: 20px; cursor: pointer;">Start Exploring</button>
        `;
        
        immersiveView.appendChild(welcomeMessage);
        
        // Add event listener to start button
        document.getElementById('start-exploring-btn').addEventListener('click', function() {
            welcomeMessage.remove();
            localStorage.setItem('japan-tsu-played', 'true');
            
            // Start the game
            if (window.initGame) {
                console.log("Starting game from welcome message");
                window.initGame();
            }
        });
    }, 1000);
    
    return true;
}

// Make functions globally available
window.showTutorial = showTutorial;
window.getBeginnerFriendlyLocation = getBeginnerFriendlyLocation;
window.addFirstTimeHint = addFirstTimeHint;
window.showImmersiveWelcome = showImmersiveWelcome;