/**
 * sharing.js - Handles social sharing functionality
 */

/**
 * Share the game result
 * Uses the Web Share API if available, with fallback options
 */
function shareResult() {
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
                const scoreElement = document.getElementById('final-score');
                let scoreText = "I played Japan-tsū!";
                if (scoreElement) {
                    const scoreMatch = scoreElement.textContent.match(/Final Score: (\d+)/);
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

// Export functions for use in other modules
export {
    shareResult,
    fallbackShare,
    copyToClipboard,
    createShareableImage
};