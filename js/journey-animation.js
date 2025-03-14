/**
 * journey-animation.js - Controls the Japan Journey loading animation
 * Part of Japan-tsū game
 */

/**
 * JourneyAnimation - Class to manage the Japan Journey loading animation
 */
class JourneyAnimation {
  constructor() {
    this.container = null;
    this.animationTimers = [];
    this.landmarks = [
      { emoji: '🗼', name: 'Tokyo Tower' },
      { emoji: '🗻', name: 'Mount Fuji' },
      { emoji: '🏯', name: 'Castle' },
      { emoji: '🚅', name: 'Shinkansen' },
      { emoji: '🍣', name: 'Sushi' },
      { emoji: '🌸', name: 'Cherry Blossom' },
      { emoji: '⛩️', name: 'Shrine' },
      { emoji: '♨️', name: 'Hot Spring' }
    ];
    this.messages = [
      "Packing my suitcase!",
      "Where to next? It's a mystery!",
      "Zooming across Japan!",
      "Ooh, what's that over there?",
      "I think I found something cool!",
      "Get ready for your next challenge!"
    ];
  }

  /**
   * Initialize the animation container and elements
   */
  initialize() {
    // Create container if it doesn't exist
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'journey-animation-container';
      this.container.style.position = 'fixed';
      this.container.style.top = '0';
      this.container.style.left = '0';
      this.container.style.width = '100%';
      this.container.style.height = '100%';
      this.container.style.backgroundColor = 'rgba(255, 240, 245, 0.9)';
      this.container.style.zIndex = '9999';
      this.container.style.display = 'flex';
      this.container.style.flexDirection = 'column';
      this.container.style.justifyContent = 'center';
      this.container.style.alignItems = 'center';
      this.container.style.fontFamily = 'Varela Round, sans-serif';
      this.container.style.color = '#FF75AB';
      this.container.style.fontSize = '24px';
      this.container.style.textAlign = 'center';
      this.container.style.padding = '20px';
      
      // Create HTML structure
      this.container.innerHTML = `
        <div class="mascot" style="width: 100px; height: 100px; margin-bottom: 20px; animation: bounce 1s infinite alternate;">
          <div style="width: 100%; height: 100%; background-color: #FF75AB; border-radius: 50%; position: relative; overflow: hidden;">
            <div style="position: absolute; top: 30%; left: 50%; transform: translateX(-50%); width: 60%; height: 40%; display: flex; justify-content: space-between;">
              <div style="width: 15px; height: 15px; background-color: #333; border-radius: 50%;"></div>
              <div style="width: 15px; height: 15px; background-color: #333; border-radius: 50%;"></div>
            </div>
            <div style="position: absolute; bottom: 30%; left: 50%; transform: translateX(-50%); width: 30%; height: 10%; border-bottom: 3px solid #333; border-radius: 50%;"></div>
          </div>
        </div>
        
        <div class="message" style="font-size: 28px; font-weight: bold; margin: 20px 0; min-height: 40px;">Loading next location...</div>
        
        <div class="landmarks" style="display: flex; gap: 20px; margin: 20px 0; min-height: 60px;"></div>
        
        <div class="progress-container" style="width: 80%; max-width: 400px; height: 20px; background-color: #FFF; border-radius: 10px; overflow: hidden; margin: 20px 0; border: 2px solid #FF75AB;">
          <div class="progress-bar" style="width: 0%; height: 100%; background: linear-gradient(90deg, #FF75AB, #FFB6C1); transition: width 0.5s ease;"></div>
        </div>
      `;
      
      // Add to document
      document.body.appendChild(this.container);
    }
    
    return true;
  }

  /**
   * Start the animation sequence
   */
  start() {
    this.initialize();
    this.container.style.display = 'flex';
    this.clearTimers();
    
    // Get elements
    const messageEl = this.container.querySelector('.message');
    const landmarksEl = this.container.querySelector('.landmarks');
    const progressBar = this.container.querySelector('.progress-bar');
    
    // Clear landmarks
    landmarksEl.innerHTML = '';
    
    // Stage 1: Initial message (0-1s)
    messageEl.textContent = this.messages[0];
    progressBar.style.width = '10%';
    
    // Stage 2: Show first landmark (1-2s)
    this.animationTimers.push(setTimeout(() => {
      messageEl.textContent = this.messages[1];
      progressBar.style.width = '30%';
      
      const landmark = this.landmarks[0];
      const landmarkEl = document.createElement('div');
      landmarkEl.style.fontSize = '40px';
      landmarkEl.style.animation = 'pop 0.5s forwards';
      landmarkEl.textContent = landmark.emoji;
      landmarkEl.title = landmark.name;
      landmarksEl.appendChild(landmarkEl);
    }, 1000));
    
    // Stage 3: Show more landmarks (2-4s)
    this.animationTimers.push(setTimeout(() => {
      messageEl.textContent = this.messages[2];
      progressBar.style.width = '50%';
      
      for (let i = 1; i < 4; i++) {
        const landmark = this.landmarks[i];
        const landmarkEl = document.createElement('div');
        landmarkEl.style.fontSize = '40px';
        landmarkEl.style.animation = 'pop 0.5s forwards';
        landmarkEl.style.animationDelay = `${(i-1) * 0.3}s`;
        landmarkEl.textContent = landmark.emoji;
        landmarkEl.title = landmark.name;
        landmarksEl.appendChild(landmarkEl);
      }
    }, 2000));
    
    // Stage 4: Almost there (4-5s)
    this.animationTimers.push(setTimeout(() => {
      messageEl.textContent = this.messages[3];
      progressBar.style.width = '75%';
    }, 4000));
    
    // Stage 5: Found it! (5-6s)
    this.animationTimers.push(setTimeout(() => {
      messageEl.textContent = this.messages[4];
      progressBar.style.width = '90%';
      
      // Add final landmark
      const landmark = this.landmarks[4];
      const landmarkEl = document.createElement('div');
      landmarkEl.style.fontSize = '50px';
      landmarkEl.style.animation = 'tada 1s forwards';
      landmarkEl.textContent = landmark.emoji;
      landmarkEl.title = landmark.name;
      landmarksEl.appendChild(landmarkEl);
    }, 5000));
    
    // Stage 6: Final stage - exactly at 5 seconds to ensure consistent timing
    this.animationTimers.push(setTimeout(() => {
      messageEl.textContent = this.messages[5];
      progressBar.style.width = '100%';
      console.log("Journey animation completed after exactly 5 seconds");
    }, 5000)); // Set to exactly 5000ms for consistent timing
  }

  /**
   * Stop the animation and clean up
   */
  stop() {
    this.clearTimers();
    if (this.container) {
      this.container.style.display = 'none';
    }
  }

  /**
   * Clear all animation timers
   */
  clearTimers() {
    this.animationTimers.forEach(timer => clearTimeout(timer));
    this.animationTimers = [];
  }
}

// Create a singleton instance
const journeyAnimation = new JourneyAnimation();

// Export for global use
window.journeyAnimation = journeyAnimation;

// Add necessary CSS
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
  
  @keyframes tada {
    0% { transform: scale(1); }
    10%, 20% { transform: scale(0.9) rotate(-3deg); }
    30%, 50%, 70%, 90% { transform: scale(1.1) rotate(3deg); }
    40%, 60%, 80% { transform: scale(1.1) rotate(-3deg); }
    100% { transform: scale(1) rotate(0); }
  }
`;
document.head.appendChild(style);