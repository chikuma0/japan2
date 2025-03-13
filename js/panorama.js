/**
 * panorama.js - Handles Street View panorama functionality
 */

// Panorama variables - using window.panorama instead of local variable
// to ensure it's accessible across the module

/**
 * Initialize the Street View panorama
 * @param {Object} options - Options for panorama initialization
 * @returns {google.maps.StreetViewPanorama} The initialized panorama instance
 */
function initializePanorama(options = {}) {
    const defaultOptions = {
        position: { lat: 35.6895, lng: 139.6917 }, // Default to Tokyo
        pov: { heading: 0, pitch: 0 },
        zoom: 1,
        addressControl: false,
        showRoadLabels: false
    };
    
    const panoramaOptions = { ...defaultOptions, ...options };
    
    const panoramaElement = document.getElementById("panorama");
    if (!panoramaElement) {
        console.error("Panorama element not found");
        return null;
    }
    
    const panoramaInstance = new google.maps.StreetViewPanorama(
        panoramaElement,
        panoramaOptions
    );
    
    return panoramaInstance;
}

/**
 * Initialize a fullscreen panorama for immersive mode
 * @param {google.maps.LatLng} position - The position to show
 * @param {Object} pov - The point of view (heading, pitch)
 * @param {number} zoom - The zoom level
 * @returns {google.maps.StreetViewPanorama} The initialized panorama instance
 */
function initializeFullscreenPanorama(position, pov, zoom) {
    const panoramaFullscreenElement = document.getElementById("panorama-fullscreen");
    if (!panoramaFullscreenElement) {
        console.error("Fullscreen panorama element not found");
        return null;
    }
    
    const panoramaFullscreen = new google.maps.StreetViewPanorama(
        panoramaFullscreenElement,
        {
            position: position,
            pov: pov,
            zoom: zoom,
            addressControl: false,
            showRoadLabels: false
        }
    );
    
    return panoramaFullscreen;
}

/**
 * Find a valid Street View location near the given coordinates
 * @param {Object} coordinates - The coordinates to search near
 * @param {Function} callback - Callback function to execute with the result
 */
function findStreetViewLocation(coordinates, callback) {
    const streetViewService = new google.maps.StreetViewService();
    
    // Try with a smaller radius first for more accurate results
    const initialRadius = 5000; // 5km
    const maxRadius = 50000; // 50km max
    
    // Try to find a panorama with increasing radius
    tryFindPanorama(coordinates, initialRadius);
    
    function tryFindPanorama(coords, radius) {
        console.log(`Searching for Street View within ${radius}m of ${coords.lat()}, ${coords.lng()}`);
        
        streetViewService.getPanorama({
            location: coords,
            radius: radius,
            source: google.maps.StreetViewSource.OUTDOOR
        }, (data, status) => {
            if (status === 'OK') {
                const location = data.location.latLng;
                console.log(`Found Street View at ${location.lat()}, ${location.lng()}`);
                callback(location, null);
            } else {
                // If not found and we haven't reached max radius, try with a larger radius
                if (radius < maxRadius) {
                    const newRadius = Math.min(radius * 2, maxRadius);
                    console.log(`No Street View found within ${radius}m, trying ${newRadius}m`);
                    tryFindPanorama(coords, newRadius);
                } else {
                    console.error('Street View data not found for this location.');
                    callback(null, new Error('No Street View found'));
                }
            }
        });
    }
}

/**
 * Set the panorama to a new location
 * @param {google.maps.LatLng} location - The location to show
 * @param {Object} customPov - Optional custom point of view (heading, pitch, zoom)
 */
function setPanoramaLocation(location, customPov = null) {
    if (!window.panorama) {
        console.error("Panorama not initialized");
        return;
    }
    
    console.log("Setting panorama location to:", location.lat(), location.lng());
    window.panorama.setPosition(location);
    
    // Use custom POV if provided, otherwise use random heading
    if (customPov) {
        window.panorama.setPov({
            heading: customPov.heading,
            pitch: customPov.pitch || 0
        });
        
        if (customPov.zoom) {
            window.panorama.setZoom(customPov.zoom);
        }
    } else {
        window.panorama.setPov({
            heading: Math.random() * 360,
            pitch: 0
        });
    }
}

// Make functions globally available
window.initializePanorama = initializePanorama;
window.initializeFullscreenPanorama = initializeFullscreenPanorama;
window.findStreetViewLocation = findStreetViewLocation;
window.setPanoramaLocation = setPanoramaLocation;