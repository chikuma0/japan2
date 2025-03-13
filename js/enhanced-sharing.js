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
    // Create container for the share card
    const shareCard = document.createElement('div');
    shareCard.className = 'share-card';
    shareCard.style.width = '600px';
    shareCard.style.height = '315px'; // Twitter card size
    shareCard.style.position = 'relative';
    shareCard.style.backgroundColor = '#FFF0F5';
    shareCard.style.borderRadius = '12px';
    shareCard.style.overflow = 'hidden';
    shareCard.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
    shareCard.style.fontFamily = 'Varela Round, sans-serif';
    
    // Add game logo and branding
    const header = document.createElement('div');
    header.style.padding = '15px';
    header.style.background = 'linear-gradient(135deg, #FF75AB, #FF9AC1)';
    header.style.color = 'white';
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    
    header.innerHTML = `
        <div style="display: flex; align-items: center;">
            <h2 style="margin: 0; font-size: 24px;">Japan-tsū</h2>
            <div style="width: 30px; height: 30px; margin-left: 10px; background-color: #FF9AC1; border-radius: 50%; position: relative; overflow: hidden;">
                <div style="position: absolute; top: 30%; left: 50%; transform: translateX(-50%); width: 60%; height: 40%; display: flex; justify-content: space-between;">
                    <div style="width: 5px; height: 5px; background-color: #333; border-radius: 50%;"></div>
                    <div style="width: 5px; height: 5px; background-color: #333; border-radius: 50%;"></div>
                </div>
                <div style="position: absolute; bottom: 30%; left: 50%; transform: translateX(-50%); width: 30%; height: 10%; border-bottom: 2px solid #333; border-radius: 50%;"></div>
            </div>
        </div>
        <div style="font-size: 14px;">japan2.xyz</div>
    `;
    
    shareCard.appendChild(header);
    
    // Add score section
    const scoreSection = document.createElement('div');
    scoreSection.style.padding = '15px';
    scoreSection.style.display = 'flex';
    scoreSection.style.justifyContent = 'space-between';
    scoreSection.style.alignItems = 'center';
    
    const scorePercentage = (totalScore / maxPossibleScore) * 100;
    const expertise = getJapaneseLevel(scorePercentage);
    
    scoreSection.innerHTML = `
        <div>
            <div style="font-size: 36px; font-weight: bold; color: #FF75AB;">${totalScore}</div>
            <div style="font-size: 14px; color: #666;">out of ${maxPossibleScore} points</div>
        </div>
        <div style="text-align: right;">
            <div style="font-size: 18px; font-weight: bold; color: #333;">${expertise}</div>
            <div style="font-size: 14px; color: #666;">${scorePercentage.toFixed(1)}% accuracy</div>
        </div>
    `;
    
    shareCard.appendChild(scoreSection);
    
    // Add places visited section
    const placesSection = document.createElement('div');
    placesSection.style.padding = '0 15px 10px';
    placesSection.style.fontSize = '14px';
    placesSection.style.color = '#666';
    
    // Create a list of places visited
    let placesHTML = '<div style="font-weight: bold; margin-bottom: 5px;">Places Visited:</div><div style="display: flex; flex-wrap: wrap; gap: 5px;">';
    
    console.log("Used locations for share card:", usedLocations);
    
    if (usedLocations && usedLocations.length > 0) {
        usedLocations.forEach(location => {
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
                regionBadge = `<span style="display: inline-block; margin-left: 5px; background-color: #FF75AB; color: white; padding: 1px 5px; border-radius: 10px; font-size: 10px;">${location.region}</span>`;
            }
            
            placesHTML += `
                <div style="background-color: #f0f0f0; padding: 5px 10px; border-radius: 12px; font-size: 12px; margin-bottom: 5px; display: flex; align-items: center;">
                    <span style="display: inline-block; margin-right: 5px; color: #4285F4;">📍</span>
                    ${locationName}
                    ${regionBadge}
                </div>
            `;
        });
    } else {
        placesHTML += '<div>No places recorded</div>';
    }
    
    placesHTML += '</div>';
    placesSection.innerHTML = placesHTML;
    shareCard.appendChild(placesSection);
    
    // Add mini map with guess markers
    const mapSection = document.createElement('div');
    mapSection.style.padding = '0 15px 10px';
    mapSection.style.height = '120px';
    
    const mapContainer = document.createElement('div');
    mapContainer.style.width = '100%';
    mapContainer.style.height = '100%';
    mapContainer.style.borderRadius = '8px';
    mapContainer.style.overflow = 'hidden';
    mapContainer.id = 'share-map-container';
    
    mapSection.appendChild(mapContainer);
    shareCard.appendChild(mapSection);
    
    // Add call to action
    const ctaSection = document.createElement('div');
    ctaSection.style.padding = '10px 15px';
    ctaSection.style.backgroundColor = '#F8F8F8';
    ctaSection.style.textAlign = 'center';
    ctaSection.style.fontWeight = 'bold';
    ctaSection.style.color = '#333';
    ctaSection.innerHTML = 'Can you beat my score? Play now at japan2.xyz';
    
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
                // Try to extract from the DOM
                const visitedList = document.querySelectorAll('.visited-locations li');
                if (visitedList && visitedList.length > 0) {
                    usedLocations = Array.from(visitedList).map(item => {
                        const name = item.textContent.trim().split('\n')[0].trim();
                        const region = item.querySelector('.badge') ?
                            item.querySelector('.badge').textContent.trim() : '';
                        return {
                            name: name,
                            region: region,
                            coordinates: { lat: 0, lng: 0 } // We don't have coordinates from DOM
                        };
                    });
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
            useCORS: true
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
            await navigator.share(shareData);
        } else {
            // Fallback to basic sharing
            const dataUrl = canvas.toDataURL('image/png');
            
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
        alert('Sorry, there was an error creating your share card. Please try again.');
    }
}

// Make functions globally available
window.createShareCard = createShareCard;
window.shareEnhancedResult = shareEnhancedResult;