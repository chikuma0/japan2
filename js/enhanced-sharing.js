/**
 * enhanced-sharing.js - Improved social sharing functionality
 */

/**
 * Create a visually appealing share card
 * @param {number} totalScore - The player's total score
 * @param {number} maxPossibleScore - The maximum possible score
 * @param {Array} usedLocations - The locations used in the game
 * @param {Array} guessPositions - The player's guess positions
 * @returns {Promise<HTMLElement>} The share card element
 */
async function createShareCard(totalScore, maxPossibleScore, usedLocations, guessPositions) {
    // Create container for the share card - now vertical like a trading card
    const shareCard = document.createElement('div');
    shareCard.className = 'share-card';
    shareCard.style.width = '400px';
    shareCard.style.height = '600px'; // Vertical trading card format
    shareCard.style.position = 'relative';
    shareCard.style.backgroundColor = '#FFF0F5';
    shareCard.style.borderRadius = '20px';
    shareCard.style.overflow = 'hidden';
    shareCard.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
    shareCard.style.fontFamily = 'Varela Round, sans-serif';
    shareCard.style.border = '10px solid white';
    
    // Add game logo and branding - trading card style header
    const header = document.createElement('div');
    header.style.padding = '20px 15px';
    header.style.background = 'linear-gradient(135deg, #FF75AB, #FF9AC1)';
    header.style.color = 'white';
    header.style.display = 'flex';
    header.style.flexDirection = 'column';
    header.style.alignItems = 'center';
    header.style.textAlign = 'center';
    header.style.borderBottom = '2px solid rgba(255, 255, 255, 0.3)';
    
    header.innerHTML = `
        <div style="position: absolute; top: 10px; right: 10px; font-size: 12px; background-color: rgba(255, 255, 255, 0.3); padding: 3px 8px; border-radius: 10px;">japan2.xyz</div>
        <div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 10px;">
            <h2 style="margin: 0; font-size: 32px; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);">Japan-tsū</h2>
            <div style="font-size: 14px; margin-top: 5px; letter-spacing: 1px;">EXPERTISE CARD</div>
        </div>
        <div style="width: 80px; height: 80px; margin: 10px 0; border-radius: 50%; position: relative; overflow: hidden; border: 3px solid white; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); background-color: white;">
            ${window.generateDynamicCard ?
                `<div style="width: 100%; height: 100%; transform: scale(1.5); transform-origin: center 30%;">
                    ${window.generateDynamicCard(totalScore, maxPossibleScore, scorePercentage, expertise)}
                </div>` :
                `<img src="${
                    scorePercentage >= 90 ? 'images/master-card.svg' :
                    scorePercentage >= 70 ? 'images/expert-card.svg' :
                    scorePercentage >= 50 ? 'images/intermediate-card.svg' :
                    scorePercentage >= 30 ? 'images/beginner-card.svg' :
                    'images/novice-card.svg'
                }" alt="Mascot" style="width: 100%; height: 100%; object-fit: cover; object-position: center 30%;">`
            }
        </div>
    `;
    
    shareCard.appendChild(header);
    
    // Add score section - trading card style
    const scoreSection = document.createElement('div');
    scoreSection.style.padding = '25px 15px';
    scoreSection.style.display = 'flex';
    scoreSection.style.flexDirection = 'column';
    scoreSection.style.alignItems = 'center';
    scoreSection.style.textAlign = 'center';
    scoreSection.style.backgroundColor = 'white';
    
    const scorePercentage = (totalScore / maxPossibleScore) * 100;
    const expertise = getJapaneseLevel(scorePercentage);
    
    // Determine card rarity based on score
    let rarityLabel = 'COMMON';
    let rarityColor = '#6c757d';
    
    if (scorePercentage >= 90) {
        rarityLabel = 'LEGENDARY';
        rarityColor = 'gold';
    } else if (scorePercentage >= 70) {
        rarityLabel = 'RARE';
        rarityColor = '#FF75AB';
    } else if (scorePercentage >= 50) {
        rarityLabel = 'UNCOMMON';
        rarityColor = '#17a2b8';
    }
    
    scoreSection.innerHTML = `
        <div style="position: relative; width: 100%; margin-bottom: 20px;">
            <div style="position: absolute; top: -15px; right: 10px; background-color: ${rarityColor}; color: white; font-size: 12px; padding: 3px 10px; border-radius: 10px; font-weight: bold;">${rarityLabel}</div>
            <div style="font-size: 24px; font-weight: bold; color: #333; margin-bottom: 5px;">${expertise}</div>
            <div style="width: 80%; height: 4px; background-color: #f0f0f0; margin: 15px auto; border-radius: 2px; overflow: hidden;">
                <div style="width: ${scorePercentage}%; height: 100%; background-color: ${rarityColor};"></div>
            </div>
        </div>
        
        <div style="display: flex; justify-content: center; align-items: center; margin: 10px 0;">
            <div style="font-size: 48px; font-weight: bold; color: ${rarityColor};">${totalScore}</div>
            <div style="font-size: 16px; color: #666; margin-left: 10px; text-align: left;">
                out of<br>${maxPossibleScore}<br>points
            </div>
        </div>
        
        <div style="font-size: 18px; color: #666; margin-top: 10px;">${scorePercentage.toFixed(1)}% accuracy</div>
    `;
    
    shareCard.appendChild(scoreSection);
    
    // Add map section - trading card style
    const mapSection = document.createElement('div');
    mapSection.style.padding = '15px';
    mapSection.style.backgroundColor = 'white';
    
    const mapContainer = document.createElement('div');
    mapContainer.style.width = '100%';
    mapContainer.style.height = '180px';
    mapContainer.style.borderRadius = '10px';
    mapContainer.style.overflow = 'hidden';
    mapContainer.style.border = '2px solid #f0f0f0';
    mapContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    mapContainer.id = 'share-map-container';
    
    mapSection.appendChild(mapContainer);
    shareCard.appendChild(mapSection);
    
    // Add places visited section - trading card style stats
    const placesSection = document.createElement('div');
    placesSection.style.padding = '10px 15px 15px';
    placesSection.style.fontSize = '14px';
    placesSection.style.color = '#666';
    placesSection.style.backgroundColor = 'white';
    
    // Create a list of places visited in a more compact format for the card
    let placesHTML = '<div style="font-weight: bold; margin-bottom: 10px; color: #333; text-align: center; font-size: 16px;">LOCATIONS VISITED</div>';
    
    console.log("Used locations for share card:", usedLocations);
    
    if (usedLocations && usedLocations.length > 0) {
        placesHTML += '<div style="display: flex; flex-direction: column; gap: 8px;">';
        
        // Only show up to 3 locations to keep the card clean
        const displayLocations = usedLocations.slice(0, 3);
        const remainingCount = usedLocations.length - 3;
        
        displayLocations.forEach(location => {
            // Make sure we have a name to display
            let locationName = 'Unknown location';
            if (location.name) {
                locationName = location.name;
            } else if (typeof location === 'string') {
                locationName = location;
            } else if (location.coordinates) {
                locationName = `Location at ${location.coordinates.lat.toFixed(2)}, ${location.coordinates.lng.toFixed(2)}`;
            }
            
            // Add region badge if available
            let regionBadge = '';
            if (location.region) {
                regionBadge = `<span style="display: inline-block; margin-left: auto; background-color: #FF75AB; color: white; padding: 1px 5px; border-radius: 10px; font-size: 10px;">${location.region}</span>`;
            }
            
            placesHTML += `
                <div style="background-color: #f8f9fa; padding: 8px 12px; border-radius: 8px; font-size: 12px; display: flex; align-items: center; border-left: 3px solid #FF75AB;">
                    <span style="display: inline-block; margin-right: 8px; color: #4285F4; font-size: 14px;">📍</span>
                    <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px;">${locationName}</span>
                    ${regionBadge}
                </div>
            `;
        });
        
        // Show how many more locations if there are more than 3
        if (remainingCount > 0) {
            placesHTML += `
                <div style="text-align: center; font-size: 12px; color: #999; padding: 5px;">
                    +${remainingCount} more location${remainingCount > 1 ? 's' : ''}
                </div>
            `;
        }
        
        placesHTML += '</div>';
    } else {
        placesHTML += '<div style="text-align: center; padding: 10px; color: #999;">No places recorded</div>';
    }
    
    placesSection.innerHTML = placesHTML;
    shareCard.appendChild(placesSection);
    
    // Add call to action - trading card style footer
    const ctaSection = document.createElement('div');
    ctaSection.style.padding = '15px';
    ctaSection.style.background = 'linear-gradient(135deg, #FF75AB, #FF9AC1)';
    ctaSection.style.textAlign = 'center';
    ctaSection.style.fontWeight = 'bold';
    ctaSection.style.color = 'white';
    ctaSection.style.borderTop = '2px solid rgba(255, 255, 255, 0.3)';
    ctaSection.style.borderBottomLeftRadius = '10px';
    ctaSection.style.borderBottomRightRadius = '10px';
    
    // Add card number and edition like a collectible card
    const totalGames = localStorage.getItem('japan-tsu-games-played') || '1';
    const cardNumber = Math.floor(Math.random() * 100) + 1;
    
    ctaSection.innerHTML = `
        <div style="margin-bottom: 8px; font-size: 16px; text-shadow: 1px 1px 2px rgba(0,0,0,0.2);">
            Can you beat my score?
        </div>
        <div style="font-size: 14px; margin-bottom: 10px;">
            Play now at japan2.xyz
        </div>
        <div style="font-size: 10px; opacity: 0.8; display: flex; justify-content: space-between; margin-top: 10px;">
            <span>Card #${cardNumber}/100</span>
            <span>Edition ${totalGames}</span>
        </div>
    `;
    
    shareCard.appendChild(ctaSection);
    
    // Initialize mini map with Japan centered
    setTimeout(() => {
        try {
            const shareMap = new google.maps.Map(document.getElementById('share-map-container'), {
                center: { lat: 36.2048, lng: 138.2529 }, // Center of Japan
                zoom: 5,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: true,
                styles: [
                    {
                        featureType: 'all',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#666666' }]
                    },
                    {
                        featureType: 'water',
                        elementType: 'geometry',
                        stylers: [{ color: '#e9e9e9' }]
                    }
                ]
            });
            
            // Add markers for each location
            if (usedLocations && usedLocations.length > 0) {
                const bounds = new google.maps.LatLngBounds();
                
                usedLocations.forEach((location, index) => {
                    const actualPosition = new google.maps.LatLng(
                        location.coordinates.lat,
                        location.coordinates.lng
                    );
                    
                    // Add actual location marker
                    new google.maps.Marker({
                        position: actualPosition,
                        map: shareMap,
                        icon: {
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: 7,
                            fillColor: '#FF75AB',
                            fillOpacity: 1,
                            strokeColor: '#FFFFFF',
                            strokeWeight: 2
                        }
                    });
                    
                    // Add guess marker if available
                    if (guessPositions && guessPositions[index]) {
                        const guessPosition = guessPositions[index];
                        
                        new google.maps.Marker({
                            position: guessPosition,
                            map: shareMap,
                            icon: {
                                path: google.maps.SymbolPath.CIRCLE,
                                scale: 5,
                                fillColor: '#4285F4',
                                fillOpacity: 1,
                                strokeColor: '#FFFFFF',
                                strokeWeight: 2
                            }
                        });
                        
                        // Draw line between guess and actual
                        new google.maps.Polyline({
                            path: [actualPosition, guessPosition],
                            geodesic: true,
                            strokeColor: '#FF75AB',
                            strokeOpacity: 0.7,
                            strokeWeight: 2,
                            map: shareMap
                        });
                        
                        bounds.extend(guessPosition);
                    }
                    
                    bounds.extend(actualPosition);
                });
                
                // Fit map to show all markers
                shareMap.fitBounds(bounds, 50); // 50px padding
            }
        } catch (error) {
            console.error('Error creating share map:', error);
        }
    }, 100);
    
    return shareCard;
}

/**
 * Generate and share the result
 * @param {number} totalScore - The player's total score
 * @param {number} maxPossibleScore - The maximum possible score
 * @param {Array} usedLocations - The locations used in the game
 * @param {Array} guessPositions - The player's guess positions
 */
async function shareEnhancedResult(totalScore, maxPossibleScore, usedLocations, guessPositions) {
    try {
        // Get the actual score from the DOM if not provided correctly
        if (!totalScore || totalScore === 0) {
            // Try to get score from the result container
            const scoreElement = document.querySelector('.score-display span');
            if (scoreElement && scoreElement.textContent) {
                const scoreMatch = scoreElement.textContent.match(/(\d+)/);
                if (scoreMatch && scoreMatch[1]) {
                    totalScore = parseInt(scoreMatch[1]);
                }
            }
        }
        
        // If we still don't have a valid score, try another approach
        if (!totalScore || totalScore === 0) {
            // Look for the score in the game result screen
            const resultScoreElement = document.querySelector('.result-container .score-display span, .game-info .score-display');
            if (resultScoreElement && resultScoreElement.textContent) {
                const scoreMatch = resultScoreElement.textContent.match(/(\d+)/);
                if (scoreMatch && scoreMatch[1]) {
                    totalScore = parseInt(scoreMatch[1]);
                }
            }
        }
        
        // Make sure we have a valid maxPossibleScore
        if (!maxPossibleScore || maxPossibleScore <= 0) {
            maxPossibleScore = 5000 * 5; // 5000 points possible per round, 5 rounds
        }
        
        // Get actual used locations if not provided correctly
        if (!usedLocations || usedLocations.length === 0) {
            // Try to get from window.usedLocations
            if (window.usedLocations && window.usedLocations.length > 0) {
                usedLocations = window.usedLocations;
            } else {
                // Try to extract from the DOM - check multiple selectors for different UI versions
                let visitedList = document.querySelectorAll('.visited-locations li');
                
                // If no results, try alternative selectors
                if (!visitedList || visitedList.length === 0) {
                    visitedList = document.querySelectorAll('.location-grid .location-card');
                }
                
                if (!visitedList || visitedList.length === 0) {
                    visitedList = document.querySelectorAll('.your-japan-journey .location-card');
                }
                
                if (visitedList && visitedList.length > 0) {
                    usedLocations = Array.from(visitedList).map(item => {
                        // Try different ways to extract the name
                        let name = '';
                        let region = '';
                        
                        // Try to get name from different possible elements
                        const nameElement = item.querySelector('.location-name') ||
                                           item.querySelector('span:not(.badge)') ||
                                           item.querySelector('div:not(.badge)');
                        
                        if (nameElement) {
                            name = nameElement.textContent.trim();
                        } else {
                            // Fallback to text content with cleanup
                            name = item.textContent.trim().split('\n')[0].trim();
                        }
                        
                        // Try to get region from badge
                        const regionElement = item.querySelector('.badge');
                        if (regionElement) {
                            region = regionElement.textContent.trim();
                        }
                        
                        return {
                            name: name || 'Japan Location',
                            region: region || 'Japan',
                            coordinates: { lat: 35.6762, lng: 139.6503 } // Default to Tokyo if coordinates not available
                        };
                    });
                }
                
                // If still no locations, create some default ones
                if (!usedLocations || usedLocations.length === 0) {
                    console.log("No locations found, using default locations");
                    usedLocations = [
                        { name: "Tokyo", region: "Kanto", coordinates: { lat: 35.6762, lng: 139.6503 } },
                        { name: "Kyoto", region: "Kansai", coordinates: { lat: 35.0116, lng: 135.7681 } },
                        { name: "Osaka", region: "Kansai", coordinates: { lat: 34.6937, lng: 135.5023 } }
                    ];
                }
            }
        }
        
        console.log("Sharing with score:", totalScore, "out of", maxPossibleScore);
        console.log("Places visited:", usedLocations ? usedLocations.length : 0);
        
        // Show loading indicator
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'loading-indicator';
        loadingIndicator.innerHTML = `
            <div class="loading-spinner"></div>
            <p>Creating your share card...</p>
        `;
        document.body.appendChild(loadingIndicator);
        
        // Create share card
        const shareCard = await createShareCard(totalScore, maxPossibleScore, usedLocations, guessPositions);
        
        // Add to DOM temporarily for html2canvas
        shareCard.style.position = 'absolute';
        shareCard.style.left = '-9999px';
        document.body.appendChild(shareCard);
        
        // Wait for map to render
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate image
        const canvas = await html2canvas(shareCard, {
            scale: 2, // Higher resolution
            logging: false,
            useCORS: true,
            willReadFrequently: true, // Optimize for multiple readback operations
            backgroundColor: null, // Transparent background
            allowTaint: true, // Allow cross-origin images
            removeContainer: true, // Clean up temporary elements
            foreignObjectRendering: false // More compatible rendering
        });
        
        // Convert to blob
        const blob = await new Promise(resolve => {
            canvas.toBlob(resolve, 'image/png');
        });
        
        // Remove temporary elements
        document.body.removeChild(shareCard);
        document.body.removeChild(loadingIndicator);
        
        // Create share data
        const shareData = {
            title: 'My Japan-tsū Score',
            text: `I scored ${totalScore} points (${(totalScore / maxPossibleScore * 100).toFixed(1)}%) in Japan-tsū! Can you beat me?`,
            url: 'https://japan2.xyz'
        };
        
        // Check if Web Share API supports sharing files
        if (navigator.canShare && navigator.canShare({ files: [new File([blob], 'japan-tsu-score.png', { type: 'image/png' })] })) {
            shareData.files = [new File([blob], 'japan-tsu-score.png', { type: 'image/png' })];
            try {
                await navigator.share(shareData);
                console.log('Share successful');
            } catch (shareError) {
                // If the user cancels the share, this is not an error we need to handle
                if (shareError.name === 'AbortError') {
                    console.log('Share was canceled by the user');
                    return;
                }
                // For other errors, fall back to the modal approach
                console.warn('Share API error, falling back to modal:', shareError);
                // Fallback to basic sharing
                const dataUrl = canvas.toDataURL('image/png');
                showShareModal(shareData, dataUrl);
                return;
            }
        } else {
            // Fallback to basic sharing
            const dataUrl = canvas.toDataURL('image/png');
            showShareModal(shareData, dataUrl);
        }
        
        // Helper function to show share modal
        function showShareModal(shareData, dataUrl) {
            // Create a modal with the image and share options
            const modal = document.createElement('div');
            modal.className = 'share-modal';
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            modal.style.display = 'flex';
            modal.style.flexDirection = 'column';
            modal.style.justifyContent = 'center';
            modal.style.alignItems = 'center';
            modal.style.zIndex = '10000';
            
            modal.innerHTML = `
                <div style="position: relative; max-width: 90%; max-height: 80%; background: white; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column;">
                    <div style="padding: 15px; background: #FF75AB; color: white; display: flex; justify-content: space-between; align-items: center;">
                        <h3 style="margin: 0;">Share Your Score</h3>
                        <button id="close-share-modal" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer;">×</button>
                    </div>
                    <div style="padding: 20px; overflow: auto; text-align: center;">
                        <img src="${dataUrl}" style="max-width: 100%; max-height: 60vh; border-radius: 8px; margin-bottom: 20px;" />
                        <div style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
                            <button id="download-share" class="btn btn-primary">Download Image</button>
                            <button id="copy-share" class="btn btn-secondary">Copy Link</button>
                            <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}" target="_blank" class="btn btn-outline">Share on Twitter</a>
                            <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}" target="_blank" class="btn btn-outline">Share on Facebook</a>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Add event listeners
            document.getElementById('close-share-modal').addEventListener('click', () => {
                document.body.removeChild(modal);
            });
            
            document.getElementById('download-share').addEventListener('click', () => {
                const link = document.createElement('a');
                link.download = 'japan-tsu-score.png';
                link.href = dataUrl;
                link.click();
            });
            
            document.getElementById('copy-share').addEventListener('click', () => {
                navigator.clipboard.writeText(shareData.url).then(() => {
                    alert('Link copied to clipboard!');
                }).catch(err => {
                    console.error('Could not copy text: ', err);
                });
            });
        }
    } catch (error) {
        console.error('Error sharing result:', error);
        
        // Don't show alert for user-canceled shares
        if (error.name === 'AbortError') {
            console.log('Share was canceled by the user');
            return;
        }
        
        // Create a more user-friendly error message
        const errorModal = document.createElement('div');
        errorModal.className = 'share-modal';
        errorModal.style.position = 'fixed';
        errorModal.style.top = '0';
        errorModal.style.left = '0';
        errorModal.style.width = '100%';
        errorModal.style.height = '100%';
        errorModal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        errorModal.style.display = 'flex';
        errorModal.style.flexDirection = 'column';
        errorModal.style.justifyContent = 'center';
        errorModal.style.alignItems = 'center';
        errorModal.style.zIndex = '10000';
        
        errorModal.innerHTML = `
            <div style="position: relative; max-width: 90%; max-height: 80%; background: white; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column;">
                <div style="padding: 15px; background: #FF75AB; color: white; display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="margin: 0;">Sharing Error</h3>
                    <button id="close-error-modal" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer;">×</button>
                </div>
                <div style="padding: 20px; overflow: auto; text-align: center;">
                    <p>Sorry, there was an error creating your share card.</p>
                    <p style="color: #666; font-size: 14px;">Error: ${error.message || 'Unknown error'}</p>
                    <button id="try-again-btn" class="btn btn-primary" style="margin-top: 15px;">Try Again</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(errorModal);
        
        // Add event listeners
        document.getElementById('close-error-modal').addEventListener('click', () => {
            document.body.removeChild(errorModal);
        });
        
        document.getElementById('try-again-btn').addEventListener('click', () => {
            document.body.removeChild(errorModal);
            // Try sharing again with a slight delay
            setTimeout(() => {
                shareEnhancedResult(totalScore, maxPossibleScore, usedLocations, guessPositions);
            }, 500);
        });
    }
}

// Make functions globally available
window.createShareCard = createShareCard;
window.shareEnhancedResult = shareEnhancedResult;