/**
 * map.js - Handles map initialization and interaction
 */

// Map variables
let map;
let minimap;
let guessMarker;
let actualMarker;
let animationPath;
let minimapGuessMarker;
let minimapActualMarker;
let minimapAnimationPath;

// Japan bounds for random coordinates
const JAPAN_BOUNDS = {
    north: 45.551483,
    south: 24.396308,
    east: 145.817458,
    west: 122.934570
};

/**
 * Initialize the map component
 * @param {Object} mapOptions - Options for map initialization
 * @returns {google.maps.Map} The initialized map instance
 */
function initializeMap(mapOptions = {}) {
    try {
        const defaultOptions = {
            center: { lat: 37.5, lng: 137 },
            zoom: 5,
            gestureHandling: 'greedy'
        };
        
        const options = { ...defaultOptions, ...mapOptions };
        
        const mapElement = document.getElementById("map");
        if (!mapElement) {
            console.error("Map element not found");
            return null;
        }
        
        const mapInstance = new google.maps.Map(mapElement, options);
        
        // Add click listener for placing guess marker
        mapInstance.addListener("click", (e) => {
            placeGuessMarker(e.latLng);
        });
        
        // Store map in module scope
        map = mapInstance;
        
        return mapInstance;
    } catch (error) {
        console.error("Error initializing map:", error);
        return null;
    }
}

/**
 * Initialize the minimap for the immersive interface
 * @param {Object} mapOptions - Options for minimap initialization
 * @returns {google.maps.Map} The initialized minimap instance
 */
function initializeMinimap(mapOptions = {}) {
    try {
        const defaultOptions = {
            center: { lat: 37.5, lng: 137 },
            zoom: 5,
            gestureHandling: 'greedy',
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true,
            zoomControl: true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.RIGHT_BOTTOM
            }
        };
        
        const options = { ...defaultOptions, ...mapOptions };
        
        const minimapElement = document.getElementById("minimap");
        if (!minimapElement) {
            console.error("Minimap element not found");
            return null;
        }
        
        const minimapInstance = new google.maps.Map(minimapElement, options);
        
        // Add click listener for placing guess marker
        minimapInstance.addListener("click", (e) => {
            console.log("Minimap clicked at:", e.latLng.lat(), e.latLng.lng());
            placeGuessMarkerOnMinimap(e.latLng, minimapInstance);
        });
        
        // Store minimap in module scope
        minimap = minimapInstance;
        window.minimap = minimapInstance;
        
        return minimapInstance;
    } catch (error) {
        console.error("Error initializing minimap:", error);
        return null;
    }
}

/**
 * Place a marker on the map at the specified location
 * @param {google.maps.LatLng} latLng - The location to place the marker
 * @param {google.maps.Map} targetMap - The map to place the marker on
 */
function placeGuessMarker(latLng, targetMap = map) {
    try {
        if (guessMarker) {
            guessMarker.setMap(null);
        }
        
        guessMarker = new google.maps.Marker({
            position: latLng,
            map: targetMap,
            icon: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
        });
        
        console.log("Guess marker placed at:", latLng.lat(), latLng.lng());
        
        // Enable submit button when a guess is made
        if (typeof window.enableSubmitButton === 'function') {
            window.enableSubmitButton();
        } else if (typeof enableSubmitButton === 'function') {
            enableSubmitButton();
        }
        
        // Store in window for access from other modules
        window.guessMarker = guessMarker;
        
        return guessMarker;
    } catch (error) {
        console.error("Error placing guess marker:", error);
        return null;
    }
}

/**
 * Place a marker on the minimap at the specified location
 * @param {google.maps.LatLng} latLng - The location to place the marker
 * @param {google.maps.Map} targetMap - The minimap to place the marker on
 */
function placeGuessMarkerOnMinimap(latLng, targetMap = minimap) {
    try {
        console.log("Placing guess marker on minimap at:", latLng.lat(), latLng.lng());
        
        if (minimapGuessMarker) {
            minimapGuessMarker.setMap(null);
        }
        
        minimapGuessMarker = new google.maps.Marker({
            position: latLng,
            map: targetMap,
            icon: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
        });
        
        console.log("Minimap guess marker placed at:", latLng.lat(), latLng.lng());
        
        // Also update the main guessMarker for consistency
        guessMarker = minimapGuessMarker;
        window.guessMarker = guessMarker;
        
        // Enable the guess button
        const guessButton = document.getElementById("immersive-guess-btn");
        if (guessButton) {
            guessButton.disabled = false;
            guessButton.classList.add("active");
            console.log("Guess button enabled");
        } else {
            console.error("Guess button not found");
        }
        
        return minimapGuessMarker;
    } catch (error) {
        console.error("Error placing guess marker on minimap:", error);
        return null;
    }
}

/**
 * Show the actual location on the map
 * @param {google.maps.LatLng} actualLatLng - The actual location
 */
function showActualLocation(actualLatLng) {
    try {
        if (actualMarker) actualMarker.setMap(null);
        
        console.log('Placing actual location marker at:', actualLatLng.lat(), actualLatLng.lng());
        
        actualMarker = new google.maps.Marker({
            position: actualLatLng,
            map: map,
            icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
        });
        
        // Draw line between guess and actual location if a guess was made
        if (guessMarker) {
            if (animationPath) animationPath.setMap(null);
            
            animationPath = new google.maps.Polyline({
                path: [guessMarker.getPosition(), actualLatLng],
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2,
                map: map
            });
            
            // Fit bounds to show both markers
            const bounds = new google.maps.LatLngBounds();
            bounds.extend(guessMarker.getPosition());
            bounds.extend(actualLatLng);
            map.fitBounds(bounds);
        } else {
            // If no guess was made, just center on the actual location
            map.setCenter(actualLatLng);
            map.setZoom(12);
        }
        
        // Store in window for access from other modules
        window.actualMarker = actualMarker;
        window.animationPath = animationPath;
        
        return actualMarker;
    } catch (error) {
        console.error("Error showing actual location:", error);
        return null;
    }
}

/**
 * Show the actual location on the minimap
 * @param {google.maps.LatLng} actualLatLng - The actual location
 */
function showActualLocationOnMinimap(actualLatLng) {
    try {
        if (!minimap) {
            console.error("Minimap not initialized");
            return null;
        }
        
        if (minimapActualMarker) minimapActualMarker.setMap(null);
        
        console.log('Placing actual location marker on minimap at:', actualLatLng.lat(), actualLatLng.lng());
        
        minimapActualMarker = new google.maps.Marker({
            position: actualLatLng,
            map: minimap,
            icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
        });
        
        // Draw line between guess and actual location if a guess was made
        if (minimapGuessMarker) {
            if (minimapAnimationPath) minimapAnimationPath.setMap(null);
            
            minimapAnimationPath = new google.maps.Polyline({
                path: [minimapGuessMarker.getPosition(), actualLatLng],
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2,
                map: minimap
            });
            
            // Fit bounds to show both markers
            const bounds = new google.maps.LatLngBounds();
            bounds.extend(minimapGuessMarker.getPosition());
            bounds.extend(actualLatLng);
            minimap.fitBounds(bounds);
        } else {
            // If no guess was made, just center on the actual location
            minimap.setCenter(actualLatLng);
            minimap.setZoom(12);
        }
        
        // Store in window for access from other modules
        window.minimapActualMarker = minimapActualMarker;
        window.minimapAnimationPath = minimapAnimationPath;
        
        return minimapActualMarker;
    } catch (error) {
        console.error("Error showing actual location on minimap:", error);
        return null;
    }
}

/**
 * Create a pixel icon with the specified color
 * @param {string} color - The color of the icon
 * @returns {Object} The icon configuration
 */
function createPixelIcon(color) {
    return {
        url: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Crect width='8' height='8' fill='${color}' /%3E%3C/svg%3E`,
        scaledSize: new google.maps.Size(16, 16),
        anchor: new google.maps.Point(8, 8)
    };
}

/**
 * Create an arrow symbol for the path animation
 * @param {number} scale - The scale of the arrow
 * @returns {Object} The arrow symbol configuration
 */
function createArrowSymbol(scale = 3) {
    return {
        path: 'M 0,-4 L 4,0 L 0,4 L 0,-4',
        fillColor: '#ff0',
        fillOpacity: 1,
        scale: scale,
        strokeColor: '#ff0',
        strokeWeight: 1
    };
}

/**
 * Animate an arrow along a path from start to end
 * @param {google.maps.LatLng} start - The start location
 * @param {google.maps.LatLng} end - The end location
 * @param {Function} callback - Callback function to execute after animation
 */
function animateArrowSlower(start, end, callback) {
    try {
        if (animationPath) animationPath.setMap(null);
        
        animationPath = new google.maps.Polyline({
            path: [start, start],
            icons: [{
                icon: createArrowSymbol(),
                offset: '100%'
            }],
            map: map,
            strokeColor: '#ff0',
            strokeOpacity: 0.8,
            strokeWeight: 2
        });

        let step = 0;
        const numSteps = 100; // Increase number of steps for smoother animation
        const animationStep = window.setInterval(() => {
            step++;
            if (step > numSteps) {
                clearInterval(animationStep);
                if (callback) callback();
                return;
            }
            const are_we_there_yet = google.maps.geometry.spherical.interpolate(start, end, step / numSteps);
            animationPath.setPath([start, are_we_there_yet]);
        }, 20); // Increase interval to slow down animation
        
        // Store in window for access from other modules
        window.animationPath = animationPath;
        
        return animationPath;
    } catch (error) {
        console.error("Error animating arrow:", error);
        return null;
    }
}

/**
 * Reset the map to its initial state
 */
function resetMap() {
    try {
        if (guessMarker) guessMarker.setMap(null);
        if (actualMarker) actualMarker.setMap(null);
        if (animationPath) animationPath.setMap(null);
        
        if (map) {
            map.setCenter({ lat: 37.5, lng: 137 });
            map.setZoom(5);
        }
        
        // Reset global variables
        guessMarker = null;
        actualMarker = null;
        animationPath = null;
        
        // Reset window variables
        window.guessMarker = null;
        window.actualMarker = null;
        window.animationPath = null;
    } catch (error) {
        console.error("Error resetting map:", error);
    }
}

/**
 * Reset the minimap to its initial state
 */
function resetMinimap() {
    try {
        if (minimapGuessMarker) minimapGuessMarker.setMap(null);
        if (minimapActualMarker) minimapActualMarker.setMap(null);
        if (minimapAnimationPath) minimapAnimationPath.setMap(null);
        
        if (minimap) {
            minimap.setCenter({ lat: 37.5, lng: 137 });
            minimap.setZoom(5);
        }
        
        // Reset global variables
        minimapGuessMarker = null;
        minimapActualMarker = null;
        minimapAnimationPath = null;
        
        // Reset window variables
        window.minimapGuessMarker = null;
        window.minimapActualMarker = null;
        window.minimapAnimationPath = null;
        
        // Disable the guess button
        const guessButton = document.getElementById("immersive-guess-btn");
        if (guessButton) {
            guessButton.disabled = true;
            guessButton.classList.remove("active");
        }
    } catch (error) {
        console.error("Error resetting minimap:", error);
    }
}

/**
 * Get random coordinates within Japan bounds
 * @returns {Object} Random coordinates {lat, lng}
 */
function getRandomCoordinates() {
    const lat = Math.random() * (JAPAN_BOUNDS.north - JAPAN_BOUNDS.south) + JAPAN_BOUNDS.south;
    const lng = Math.random() * (JAPAN_BOUNDS.east - JAPAN_BOUNDS.west) + JAPAN_BOUNDS.west;
    return { lat, lng };
}

// Make functions globally available
window.initializeMap = initializeMap;
window.initializeMinimap = initializeMinimap;
window.placeGuessMarker = placeGuessMarker;
window.placeGuessMarkerOnMinimap = placeGuessMarkerOnMinimap;
window.showActualLocation = showActualLocation;
window.showActualLocationOnMinimap = showActualLocationOnMinimap;
window.createPixelIcon = createPixelIcon;
window.createArrowSymbol = createArrowSymbol;
window.animateArrowSlower = animateArrowSlower;
window.resetMap = resetMap;
window.resetMinimap = resetMinimap;
window.getRandomCoordinates = getRandomCoordinates;

// Log that the map.js module has loaded
console.log("map.js module loaded");