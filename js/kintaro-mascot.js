/**
 * kintaro-mascot.js - Implements Kintaro mascot for the main game screen
 * This file provides functions to generate SVG-based Kintaro mascot
 */

/**
 * Generate an SVG-based Kintaro mascot for the main game screen
 * @param {string} size - Size of the mascot (sm, md, lg)
 * @returns {string} SVG markup for the Kintaro mascot
 */
function generateKintaroMascot(size = 'sm') {
    // Size multiplier based on requested size
    let scale = 1;
    if (size === 'sm') scale = 0.6;
    if (size === 'lg') scale = 1.2;
    
    // Generate a unique ID for this mascot instance to avoid SVG filter ID conflicts
    const uniqueId = 'kintaro-' + Math.random().toString(36).substr(2, 9);
    
    return `
    <svg width="${60 * scale}" height="${60 * scale}" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <!-- Shadow filter for 3D effect -->
            <filter id="shadow-${uniqueId}" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
                <feOffset dx="1" dy="1" result="offsetblur" />
                <feComponentTransfer>
                    <feFuncA type="linear" slope="0.5" />
                </feComponentTransfer>
                <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
            
            <!-- Gradients for 3D effect -->
            <linearGradient id="skinGradient-${uniqueId}" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#ffccaa;stop-opacity:1" />
                <stop offset="50%" style="stop-color:#ffddbb;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#ffccaa;stop-opacity:1" />
            </linearGradient>
            
            <linearGradient id="redGradient-${uniqueId}" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#cc0000;stop-opacity:1" />
                <stop offset="50%" style="stop-color:#ff3333;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#cc0000;stop-opacity:1" />
            </linearGradient>
        </defs>
        
        <!-- Kintaro Character Group with 3D shadow effect -->
        <g filter="url(#shadow-${uniqueId})" transform="translate(30, 30)">
            <!-- Head with skin color -->
            <circle cx="0" cy="-5" r="20" fill="url(#skinGradient-${uniqueId})" />
            
            <!-- Hair (simplified bowl cut) -->
            <path d="M-25,-15 C-25,-40 25,-40 25,-15 L25,-15 L-25,-15 Z" fill="#000000" />
            
            <!-- Eyes (simple cartoon style) -->
            <g class="eyes">
                <ellipse cx="-7" cy="-8" rx="2" ry="2.5" fill="#000000" />
                <ellipse cx="7" cy="-8" rx="2" ry="2.5" fill="#000000" />
            </g>
            
            <!-- Eyebrows (simple) -->
            <path d="M-10,-13 L-5,-13" stroke="#000000" stroke-width="1.5" />
            <path d="M5,-13 L10,-13" stroke="#000000" stroke-width="1.5" />
            
            <!-- Rosy cheeks -->
            <circle cx="-10" cy="-2" r="3" fill="#FF9999" opacity="0.5" />
            <circle cx="10" cy="-2" r="3" fill="#FF9999" opacity="0.5" />
            
            <!-- Simple smile -->
            <path d="M-7,3 Q0,7 7,3" stroke="#000000" stroke-width="1.5" fill="none" />
            
            <!-- Red bib/apron with 金 character -->
            <path d="M-20,8 L-15,25 L15,25 L20,8 Z" fill="url(#redGradient-${uniqueId})" />
            <text x="0" y="20" font-family="sans-serif" font-size="15" fill="#ffcc00" text-anchor="middle" font-weight="bold">金</text>
            
            <!-- Axe (small version for the mascot) -->
            <g transform="translate(15,0) rotate(-30) scale(0.7)">
                <rect x="0" y="-5" width="4" height="20" fill="#8B4513" rx="1" ry="1" />
                <path d="M4,-5 L12,-10 L12,-0 L4,0 Z" fill="#A9A9A9" />
            </g>
        </g>
        
        <!-- Animation for Kintaro -->
        <animateTransform attributeName="transform" type="rotate" from="-2" to="2" dur="2s" repeatCount="indefinite" additive="sum" />
    </svg>
    `;
}

/**
 * Initialize all Kintaro mascots on the page
 */
function initializeKintaroMascots() {
    // Get all Kintaro mascot containers
    const mascotContainers = document.querySelectorAll('.kintaro-mascot');
    
    // For each container, generate and insert the SVG
    mascotContainers.forEach((container, index) => {
        // Get the size from the container classes
        let size = 'sm';
        if (container.classList.contains('mascot-lg')) size = 'lg';
        else if (!container.classList.contains('mascot-sm')) size = 'md';
        
        // Generate and insert the SVG
        container.innerHTML = generateKintaroMascot(size);
    });
}

// Make functions globally available
window.generateKintaroMascot = generateKintaroMascot;
window.initializeKintaroMascots = initializeKintaroMascots;

// Initialize mascots when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Kintaro mascots
    initializeKintaroMascots();
});