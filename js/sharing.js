/**
 * sharing.js - Handles social sharing functionality
 */

/**
 * Share the game result
 * Uses the Web Share API if available, with fallback options
 */
function shareResult() {
    // Check if enhanced sharing is available
    if (window.shareEnhancedResult) {
        try {
            // Get game data - try multiple selectors to find the score
            let totalScore = 0;
            
            // Try different selectors to find the score
            const selectors = [
                '#result-container .score-display span',
                '.score-display span',
                '.score-display',
                '.result-card .score-display',
                '.game-info .score-display'
            ];
            
            for (const selector of selectors) {
                const element = document.querySelector(selector);
                if (element && element.textContent) {
                    const match = element.textContent.match(/(\d+)/);
                    if (match && match[1]) {
                        totalScore = parseInt(match[1]);
                        console.log(`Found score ${totalScore} using selector: ${selector}`);
                        break;
                    }
                }
            }
            
            // If we still don't have a score, try to get it from the global variable
            if (totalScore === 0 && typeof window.totalScore === 'number') {
                totalScore = window.totalScore;
                console.log(`Using global totalScore: ${totalScore}`);
            }
            
            const maxPossibleScore = 5000 * 5; // 5000 points possible per round, 5 rounds
            
            // Get locations and guesses from the game
            let usedLocations = window.usedLocations || [];
            const guessPositions = window.guessPositions || [];
            
            // If no locations found, try to get them from the DOM
            if (usedLocations.length === 0) {
                const visitedItems = document.querySelectorAll('.visited-locations li');
                if (visitedItems && visitedItems.length > 0) {
                    usedLocations = Array.from(visitedItems).map(item => {
                        const name = item.textContent.trim().split('\n')[0].trim();
                        const region = item.querySelector('.badge') ?
                            item.querySelector('.badge').textContent.trim() : '';
                        return {
                            name: name,
                            region: region,
                            coordinates: { lat: 0, lng: 0 } // We don't have coordinates from DOM
                        };
                    });
                    console.log(`Found ${usedLocations.length} locations from DOM`);
                }
            }
            
            // Use enhanced sharing
            window.shareEnhancedResult(totalScore, maxPossibleScore, usedLocations, guessPositions);
            return;
        } catch (error) {
            console.error("Error using enhanced sharing:", error);
            // Fall back to original sharing method
        }
    }
    
    // Original sharing implementation as fallback
    const resultContainer = document.getElementById('result-container');
    if (!resultContainer) {
        console.error("Result container not found");
        return;
    }
    
    try {
        // Use html2canvas to create an image of the result
        html2canvas(resultContainer, {
            backgroundColor: null,
            scale: 2, // Increase resolution
        }).then(canvas => {
            canvas.toBlob(blob => {
                // Create a file from the blob
                const filesArray = [
                    new File(
                        [blob],
                        'japan-tsu-result.png',
                        {
                            type: 'image/png',
                            lastModified: new Date().getTime()
                        }
                    )
                ];
                
                // Get the total score from the DOM
                const scoreElement = document.querySelector('#result-container .score-display span');
                let scoreText = "I played Japan-tsū!";
                if (scoreElement) {
                    const scoreMatch = scoreElement.textContent.match(/(\d+)/);
                    if (scoreMatch && scoreMatch[1]) {
                        scoreText = `I scored ${scoreMatch[1]} points in Japan-tsū!`;
                    }
                }
                
                // Prepare share data with the image
                const shareData = {
                    files: filesArray,
                    title: 'My Japan-tsū Result',
                    text: `${scoreText} Can you beat my score? Play at japan2.xyz`,
                    url: 'https://japan2.xyz'
                };
                
                // Try to use the Web Share API with files
                if (navigator.canShare && navigator.canShare(shareData)) {
                    navigator.share(shareData)
                        .then(() => console.log('Share was successful.'))
                        .catch((error) => {
                            console.log('Sharing failed', error);
                            fallbackShare(scoreText);
                        });
                } else {
                    console.log(`Your system doesn't support sharing files.`);
                    fallbackShare(scoreText);
                }
            });
        }).catch(error => {
            console.error("Error creating canvas:", error);
            fallbackShare();
        });
    } catch (error) {
        console.error("Error in shareResult:", error);
        fallbackShare();
    }
}

/**
 * Fallback sharing method when file sharing is not supported
 * @param {string} scoreText - Text describing the score
 */
function fallbackShare(scoreText = "I played Japan-tsū!") {
    try {
        // Fallback to basic Web Share API without files
        const shareData = {
            title: 'My Japan-tsū Result',
            text: `${scoreText} Can you beat my score? Play at japan2.xyz`,
            url: 'https://japan2.xyz'
        };
        
        if (navigator.share) {
            navigator.share(shareData)
                .then(() => console.log('Basic share was successful.'))
                .catch((error) => {
                    console.log('Basic sharing failed', error);
                    copyToClipboard(shareData.text + " " + shareData.url);
                });
        } else {
            // If Web Share API is not available, copy to clipboard
            copyToClipboard(shareData.text + " " + shareData.url);
        }
    } catch (error) {
        console.error("Error in fallbackShare:", error);
        alert("Sharing not available. Please take a screenshot to share your result.");
    }
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 */
function copyToClipboard(text) {
    try {
        // Create a temporary textarea element
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        
        // Select and copy the text
        textarea.select();
        document.execCommand('copy');
        
        // Remove the textarea
        document.body.removeChild(textarea);
        
        alert("Result copied to clipboard! You can paste it to share.");
    } catch (error) {
        console.error("Error copying to clipboard:", error);
        alert("Could not copy to clipboard. Please manually share your result.");
    }
}

/**
 * Create a shareable image from the result container
 * @returns {Promise<Blob>} A promise that resolves to an image blob
 */
function createShareableImage() {
    return new Promise((resolve, reject) => {
        const resultContainer = document.getElementById('result-container');
        if (!resultContainer) {
            reject(new Error("Result container not found"));
            return;
        }
        
        html2canvas(resultContainer, {
            backgroundColor: null,
            scale: 2, // Increase resolution
        }).then(canvas => {
            canvas.toBlob(blob => {
                resolve(blob);
            });
        }).catch(error => {
            reject(error);
        });
    });
}

// Make functions globally available
window.shareResult = shareResult;
window.fallbackShare = fallbackShare;
window.copyToClipboard = copyToClipboard;
window.createShareableImage = createShareableImage;