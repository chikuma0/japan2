/**
 * panorama.js - Handles Street View panorama functionality
 */

// Panorama variables
let panorama;

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
    
    streetViewService.getPanorama({
        location: coordinates,
        radius: 50000, // Search within 50km
        source: google.maps.StreetViewSource.OUTDOOR
    }, (data, status) => {
        if (status === 'OK') {
            const location = data.location.latLng;
            callback(location, null);
        } else {
            console.error('Street View data not found for this location.');
            callback(null, new Error('No Street View found'));
        }
    });
}

/**
 * Set the panorama to a new location with random heading
 * @param {google.maps.LatLng} location - The location to show
 */
function setPanoramaLocation(location) {
    if (!panorama) {
        console.error("Panorama not initialized");
        return;
    }
    
    panorama.setPosition(location);
    panorama.setPov({
        heading: Math.random() * 360,
        pitch: 0
    });
}

// Export functions for use in other modules
export {
    initializePanorama,
    initializeFullscreenPanorama,
    findStreetViewLocation,
    setPanoramaLocation
};