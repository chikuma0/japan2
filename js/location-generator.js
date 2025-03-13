/**
 * location-generator.js - Generates endless new map locations with Street View coverage
 */

// Use JAPAN_BOUNDS from map.js instead of redefining it
// const JAPAN_BOUNDS is already defined in map.js

// Sub-regions within Japan for more targeted generation
// These are approximate bounds for different regions
const JAPAN_REGION_BOUNDS = {
    [JAPAN_REGIONS.HOKKAIDO]: {
        north: 45.551483,
        south: 41.350944,
        east: 145.817458,
        west: 139.333649
    },
    [JAPAN_REGIONS.TOHOKU]: {
        north: 41.553486,
        south: 36.950431,
        east: 141.602783,
        west: 139.547119
    },
    [JAPAN_REGIONS.KANTO]: {
        north: 37.149826,
        south: 34.867957,
        east: 140.899658,
        west: 138.385925
    },
    [JAPAN_REGIONS.CHUBU]: {
        north: 37.559822,
        south: 34.596756,
        east: 139.155273,
        west: 136.406555
    },
    [JAPAN_REGIONS.KANSAI]: {
        north: 35.674538,
        south: 33.424354,
        east: 136.406555,
        west: 134.149170
    },
    [JAPAN_REGIONS.CHUGOKU]: {
        north: 35.674538,
        south: 33.424354,
        east: 134.149170,
        west: 130.941162
    },
    [JAPAN_REGIONS.SHIKOKU]: {
        north: 34.407177,
        south: 32.716813,
        east: 134.768066,
        west: 132.015381
    },
    [JAPAN_REGIONS.KYUSHU]: {
        north: 33.931631,
        south: 31.159546,
        east: 132.015381,
        west: 129.538574
    },
    [JAPAN_REGIONS.OKINAWA]: {
        north: 27.104599,
        south: 24.044508,
        east: 131.327972,
        west: 122.934570
    }
};

// Population density data for different regions
// This helps generate more realistic locations (more in urban areas, fewer in rural)
const REGION_POPULATION_DENSITY = {
    [JAPAN_REGIONS.HOKKAIDO]: 0.2,  // Low density
    [JAPAN_REGIONS.TOHOKU]: 0.3,
    [JAPAN_REGIONS.KANTO]: 0.9,     // High density (Tokyo area)
    [JAPAN_REGIONS.CHUBU]: 0.6,
    [JAPAN_REGIONS.KANSAI]: 0.8,    // High density (Osaka, Kyoto)
    [JAPAN_REGIONS.CHUGOKU]: 0.4,
    [JAPAN_REGIONS.SHIKOKU]: 0.3,
    [JAPAN_REGIONS.KYUSHU]: 0.5,
    [JAPAN_REGIONS.OKINAWA]: 0.4
};

// Major cities with their coordinates for urban-focused generation
const MAJOR_CITIES = [
    { name: "Tokyo", lat: 35.6895, lng: 139.6917, radius: 50 },
    { name: "Yokohama", lat: 35.4437, lng: 139.6380, radius: 30 },
    { name: "Osaka", lat: 34.6937, lng: 135.5022, radius: 40 },
    { name: "Nagoya", lat: 35.1815, lng: 136.9066, radius: 30 },
    { name: "Sapporo", lat: 43.0618, lng: 141.3545, radius: 25 },
    { name: "Fukuoka", lat: 33.5902, lng: 130.4017, radius: 25 },
    { name: "Kobe", lat: 34.6901, lng: 135.1955, radius: 20 },
    { name: "Kyoto", lat: 35.0116, lng: 135.7681, radius: 20 },
    { name: "Hiroshima", lat: 34.3853, lng: 132.4553, radius: 20 },
    { name: "Sendai", lat: 38.2682, lng: 140.8694, radius: 20 },
    { name: "Naha", lat: 26.2124, lng: 127.6809, radius: 15 }
];

// Coastal line approximation points to help generate coastal locations
const COASTAL_POINTS = [
    { lat: 35.6895, lng: 139.6917 }, // Tokyo Bay
    { lat: 34.6937, lng: 135.5022 }, // Osaka Bay
    { lat: 33.5902, lng: 130.4017 }, // Fukuoka Bay
    { lat: 43.0618, lng: 141.3545 }, // Sapporo Coast
    { lat: 34.3853, lng: 132.4553 }, // Hiroshima Bay
    { lat: 26.2124, lng: 127.6809 }, // Naha Coast
    { lat: 38.2682, lng: 140.8694 }, // Sendai Coast
    { lat: 34.6901, lng: 135.1955 }, // Kobe Coast
    { lat: 35.4437, lng: 139.6380 }, // Yokohama Bay
    { lat: 43.2203, lng: 141.0003 }, // Otaru Coast
    { lat: 34.2333, lng: 135.1667 }, // Wakayama Coast
    { lat: 33.9578, lng: 130.9608 }, // Kitakyushu Coast
    { lat: 35.5167, lng: 134.8333 }, // Tottori Coast
    { lat: 34.3500, lng: 134.0500 }, // Takamatsu Coast
    { lat: 32.7503, lng: 129.8779 }, // Nagasaki Coast
    { lat: 31.5969, lng: 130.5571 }  // Kagoshima Coast
];

// Mountain areas for generating mountain locations
const MOUNTAIN_AREAS = [
    { name: "Mount Fuji", lat: 35.3606, lng: 138.7274, radius: 20 },
    { name: "Japanese Alps", lat: 36.1200, lng: 137.6000, radius: 50 },
    { name: "Mount Aso", lat: 32.8843, lng: 131.0869, radius: 15 },
    { name: "Daisetsuzan", lat: 43.6980, lng: 142.8695, radius: 30 },
    { name: "Mount Haku", lat: 36.1553, lng: 136.7714, radius: 15 },
    { name: "Mount Kita", lat: 35.6739, lng: 138.2392, radius: 15 },
    { name: "Mount Tate", lat: 36.5769, lng: 137.6178, radius: 15 },
    { name: "Mount Yari", lat: 36.3420, lng: 137.6473, radius: 15 }
];

// Historic areas for generating historic locations
const HISTORIC_AREAS = [
    { name: "Kyoto", lat: 35.0116, lng: 135.7681, radius: 20 },
    { name: "Nara", lat: 34.6851, lng: 135.8048, radius: 15 },
    { name: "Kamakura", lat: 35.3192, lng: 139.5467, radius: 10 },
    { name: "Nikko", lat: 36.7981, lng: 139.5981, radius: 15 },
    { name: "Himeji", lat: 34.8397, lng: 134.6939, radius: 10 },
    { name: "Kanazawa", lat: 36.5626, lng: 136.6562, radius: 15 },
    { name: "Matsumoto", lat: 36.2384, lng: 137.9720, radius: 10 },
    { name: "Takayama", lat: 36.1408, lng: 137.2520, radius: 10 }
];

// Cache of verified locations to avoid repeated API calls
let verifiedLocationsCache = [];

/**
 * Generate a random location within Japan
 * @param {Object} options - Generation options
 * @returns {Promise<Object>} A promise that resolves to a location object
 */
async function generateRandomLocation(options = {}) {
    console.log("Generating random location with options:", options);
    
    let coordinates;
    let category = options.category || getRandomCategory();
    let region = options.region || getRandomRegion();
    let difficulty = options.difficulty || getRandomDifficulty();
    
    // Check cache first
    const cachedLocation = findCachedLocation(category, region, difficulty);
    if (cachedLocation) {
        console.log("Using cached location:", cachedLocation);
        return cachedLocation;
    }
    
    // Generate coordinates based on category
    switch (category) {
        case LOCATION_CATEGORIES.URBAN:
            coordinates = generateUrbanCoordinates(region);
            break;
        case LOCATION_CATEGORIES.RURAL:
            coordinates = generateRuralCoordinates(region);
            break;
        case LOCATION_CATEGORIES.COASTAL:
            coordinates = generateCoastalCoordinates(region);
            break;
        case LOCATION_CATEGORIES.MOUNTAIN:
            coordinates = generateMountainCoordinates(region);
            break;
        case LOCATION_CATEGORIES.HISTORIC:
            coordinates = generateHistoricCoordinates(region);
            break;
        case LOCATION_CATEGORIES.TOURIST:
            coordinates = generateTouristCoordinates(region);
            break;
        default:
            coordinates = generateRandomCoordinates(region);
    }
    
    // Verify Street View coverage
    try {
        const verifiedLocation = await verifyStreetViewCoverage(coordinates);
        if (verifiedLocation) {
            // Create location object
            const location = {
                coordinates: { 
                    lat: verifiedLocation.lat(), 
                    lng: verifiedLocation.lng() 
                },
                name: await generateLocationName(verifiedLocation, category, region),
                category: category,
                difficulty: difficulty,
                region: region,
                pov: generateRandomPOV(),
                facts: await generateLocationFacts(verifiedLocation, category, region)
            };
            
            // Add to cache
            verifiedLocationsCache.push(location);
            
            // Limit cache size
            if (verifiedLocationsCache.length > 100) {
                verifiedLocationsCache.shift(); // Remove oldest entry
            }
            
            console.log("Generated new location:", location);
            return location;
        } else {
            // If no Street View found, try again with different options
            console.log("No Street View coverage found, trying again");
            return generateRandomLocation(options);
        }
    } catch (error) {
        console.error("Error verifying Street View coverage:", error);
        // Try again with different options
        return generateRandomLocation(options);
    }
}

/**
 * Find a cached location matching the criteria
 * @param {string} category - Location category
 * @param {string} region - Japan region
 * @param {string} difficulty - Difficulty level
 * @returns {Object|null} A matching location or null if none found
 */
function findCachedLocation(category, region, difficulty) {
    // Filter cache by criteria
    const matches = verifiedLocationsCache.filter(loc => 
        (!category || loc.category === category) &&
        (!region || loc.region === region) &&
        (!difficulty || loc.difficulty === difficulty)
    );
    
    // Return a random match if any found
    if (matches.length > 0) {
        return matches[Math.floor(Math.random() * matches.length)];
    }
    
    return null;
}

/**
 * Generate random coordinates within Japan
 * @param {string} region - Optional specific region
 * @returns {google.maps.LatLng} Random coordinates
 */
function generateRandomCoordinates(region = null) {
    let bounds;
    
    if (region && JAPAN_REGION_BOUNDS[region]) {
        bounds = JAPAN_REGION_BOUNDS[region];
    } else {
        bounds = JAPAN_BOUNDS;
    }
    
    const lat = Math.random() * (bounds.north - bounds.south) + bounds.south;
    const lng = Math.random() * (bounds.east - bounds.west) + bounds.west;
    
    return new google.maps.LatLng(lat, lng);
}

/**
 * Generate coordinates in an urban area
 * @param {string} region - Optional specific region
 * @returns {google.maps.LatLng} Urban coordinates
 */
function generateUrbanCoordinates(region = null) {
    // Filter cities by region if specified
    let cities = MAJOR_CITIES;
    if (region) {
        // This is a simplification - in a real implementation, you'd map cities to regions
        cities = MAJOR_CITIES.filter(city => {
            const cityLatLng = new google.maps.LatLng(city.lat, city.lng);
            return isCoordinateInRegion(cityLatLng, region);
        });
        
        // If no cities in this region, fall back to random coordinates in the region
        if (cities.length === 0) {
            return generateRandomCoordinates(region);
        }
    }
    
    // Select a random city
    const city = cities[Math.floor(Math.random() * cities.length)];
    
    // Generate coordinates within the city radius (in km)
    const radius = city.radius * 1000; // Convert to meters
    const angle = Math.random() * Math.PI * 2; // Random angle
    const distance = Math.sqrt(Math.random()) * radius; // Square root for more realistic distribution
    
    // Calculate offset
    const latOffset = distance * Math.cos(angle) / 111320; // 1 degree lat = 111.32 km
    const lngOffset = distance * Math.sin(angle) / (111320 * Math.cos(city.lat * Math.PI / 180));
    
    return new google.maps.LatLng(
        city.lat + latOffset,
        city.lng + lngOffset
    );
}

/**
 * Generate coordinates in a rural area
 * @param {string} region - Optional specific region
 * @returns {google.maps.LatLng} Rural coordinates
 */
function generateRuralCoordinates(region = null) {
    // For rural areas, we want to avoid major cities
    // Generate random coordinates and check distance from cities
    const coords = generateRandomCoordinates(region);
    
    // Check if coordinates are far enough from all major cities
    const isFarFromCities = MAJOR_CITIES.every(city => {
        const cityLatLng = new google.maps.LatLng(city.lat, city.lng);
        const distance = google.maps.geometry.spherical.computeDistanceBetween(coords, cityLatLng) / 1000; // km
        return distance > city.radius + 20; // At least 20km beyond city radius
    });
    
    if (isFarFromCities) {
        return coords;
    } else {
        // Try again if too close to a city
        return generateRuralCoordinates(region);
    }
}

/**
 * Generate coordinates in a coastal area
 * @param {string} region - Optional specific region
 * @returns {google.maps.LatLng} Coastal coordinates
 */
function generateCoastalCoordinates(region = null) {
    // Filter coastal points by region if specified
    let coastalPoints = COASTAL_POINTS;
    if (region) {
        coastalPoints = COASTAL_POINTS.filter(point => {
            const pointLatLng = new google.maps.LatLng(point.lat, point.lng);
            return isCoordinateInRegion(pointLatLng, region);
        });
        
        // If no coastal points in this region, fall back to random coordinates
        if (coastalPoints.length === 0) {
            return generateRandomCoordinates(region);
        }
    }
    
    // Select a random coastal point
    const point = coastalPoints[Math.floor(Math.random() * coastalPoints.length)];
    
    // Generate coordinates within 10km of the coastal point
    const radius = 10000; // 10km in meters
    const angle = Math.random() * Math.PI * 2; // Random angle
    const distance = Math.random() * radius;
    
    // Calculate offset
    const latOffset = distance * Math.cos(angle) / 111320;
    const lngOffset = distance * Math.sin(angle) / (111320 * Math.cos(point.lat * Math.PI / 180));
    
    return new google.maps.LatLng(
        point.lat + latOffset,
        point.lng + lngOffset
    );
}

/**
 * Generate coordinates in a mountainous area
 * @param {string} region - Optional specific region
 * @returns {google.maps.LatLng} Mountain coordinates
 */
function generateMountainCoordinates(region = null) {
    // Filter mountain areas by region if specified
    let mountains = MOUNTAIN_AREAS;
    if (region) {
        mountains = MOUNTAIN_AREAS.filter(mountain => {
            const mountainLatLng = new google.maps.LatLng(mountain.lat, mountain.lng);
            return isCoordinateInRegion(mountainLatLng, region);
        });
        
        // If no mountains in this region, fall back to random coordinates
        if (mountains.length === 0) {
            return generateRandomCoordinates(region);
        }
    }
    
    // Select a random mountain area
    const mountain = mountains[Math.floor(Math.random() * mountains.length)];
    
    // Generate coordinates within the mountain radius (in km)
    const radius = mountain.radius * 1000; // Convert to meters
    const angle = Math.random() * Math.PI * 2; // Random angle
    const distance = Math.random() * radius;
    
    // Calculate offset
    const latOffset = distance * Math.cos(angle) / 111320;
    const lngOffset = distance * Math.sin(angle) / (111320 * Math.cos(mountain.lat * Math.PI / 180));
    
    return new google.maps.LatLng(
        mountain.lat + latOffset,
        mountain.lng + lngOffset
    );
}

/**
 * Generate coordinates in a historic area
 * @param {string} region - Optional specific region
 * @returns {google.maps.LatLng} Historic coordinates
 */
function generateHistoricCoordinates(region = null) {
    // Filter historic areas by region if specified
    let historicAreas = HISTORIC_AREAS;
    if (region) {
        historicAreas = HISTORIC_AREAS.filter(area => {
            const areaLatLng = new google.maps.LatLng(area.lat, area.lng);
            return isCoordinateInRegion(areaLatLng, region);
        });
        
        // If no historic areas in this region, fall back to random coordinates
        if (historicAreas.length === 0) {
            return generateRandomCoordinates(region);
        }
    }
    
    // Select a random historic area
    const area = historicAreas[Math.floor(Math.random() * historicAreas.length)];
    
    // Generate coordinates within the historic area radius (in km)
    const radius = area.radius * 1000; // Convert to meters
    const angle = Math.random() * Math.PI * 2; // Random angle
    const distance = Math.random() * radius;
    
    // Calculate offset
    const latOffset = distance * Math.cos(angle) / 111320;
    const lngOffset = distance * Math.sin(angle) / (111320 * Math.cos(area.lat * Math.PI / 180));
    
    return new google.maps.LatLng(
        area.lat + latOffset,
        area.lng + lngOffset
    );
}

/**
 * Generate coordinates in a tourist area
 * @param {string} region - Optional specific region
 * @returns {google.maps.LatLng} Tourist coordinates
 */
function generateTouristCoordinates(region = null) {
    // Tourist areas are a mix of urban, historic, and natural attractions
    // Randomly choose between these types
    const type = Math.random();
    
    if (type < 0.4) {
        return generateUrbanCoordinates(region);
    } else if (type < 0.7) {
        return generateHistoricCoordinates(region);
    } else if (type < 0.85) {
        return generateCoastalCoordinates(region);
    } else {
        return generateMountainCoordinates(region);
    }
}

/**
 * Check if coordinates are within a specific region
 * @param {google.maps.LatLng} coords - The coordinates to check
 * @param {string} region - The region to check against
 * @returns {boolean} True if coordinates are in the region
 */
function isCoordinateInRegion(coords, region) {
    if (!region || !JAPAN_REGION_BOUNDS[region]) {
        return true; // If no region specified or invalid region, consider it valid
    }
    
    const bounds = JAPAN_REGION_BOUNDS[region];
    const lat = coords.lat();
    const lng = coords.lng();
    
    return lat >= bounds.south && 
           lat <= bounds.north && 
           lng >= bounds.west && 
           lng <= bounds.east;
}

/**
 * Verify if coordinates have Street View coverage
 * @param {google.maps.LatLng} coordinates - The coordinates to verify
 * @returns {Promise<google.maps.LatLng|null>} A promise that resolves to verified coordinates or null
 */
function verifyStreetViewCoverage(coordinates) {
    return new Promise((resolve, reject) => {
        const streetViewService = new google.maps.StreetViewService();
        
        streetViewService.getPanorama({
            location: coordinates,
            radius: 50000, // 50km radius
            source: google.maps.StreetViewSource.OUTDOOR
        }, (data, status) => {
            if (status === 'OK') {
                resolve(data.location.latLng);
            } else {
                resolve(null);
            }
        });
    });
}

/**
 * Generate a random point of view for the panorama
 * @returns {Object} POV object with heading, pitch, and zoom
 */
function generateRandomPOV() {
    return {
        heading: Math.random() * 360,
        pitch: Math.random() * 20 - 10, // Between -10 and 10 degrees
        zoom: Math.random() < 0.5 ? 1 : 0 // Occasionally zoom out a bit
    };
}

/**
 * Generate a name for a location based on its coordinates and category
 * @param {google.maps.LatLng} coordinates - The location coordinates
 * @param {string} category - The location category
 * @param {string} region - The Japan region
 * @returns {Promise<string>} A promise that resolves to a location name
 */
async function generateLocationName(coordinates, category, region) {
    // In a real implementation, this would use reverse geocoding
    // For now, we'll generate a generic name based on region and category
    
    const regionName = region || "Unknown Region";
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
    
    // For demonstration, we'll just use a generic name format
    return `${regionName} ${categoryName} Location`;
}

/**
 * Generate facts about a location
 * @param {google.maps.LatLng} coordinates - The location coordinates
 * @param {string} category - The location category
 * @param {string} region - The Japan region
 * @returns {Promise<string>} A promise that resolves to location facts
 */
async function generateLocationFacts(coordinates, category, region) {
    // In a real implementation, this might use an API to get real facts
    // For now, we'll generate generic facts based on category and region
    
    const facts = [
        `This is a ${category} location in the ${region} region of Japan.`,
        `The coordinates are approximately ${coordinates.lat().toFixed(4)}°N, ${coordinates.lng().toFixed(4)}°E.`
    ];
    
    // Add category-specific facts
    switch (category) {
        case LOCATION_CATEGORIES.URBAN:
            facts.push("Urban areas in Japan are known for their dense population and modern infrastructure.");
            break;
        case LOCATION_CATEGORIES.RURAL:
            facts.push("Rural Japan is characterized by traditional farming practices and beautiful countryside landscapes.");
            break;
        case LOCATION_CATEGORIES.COASTAL:
            facts.push("Japan's coastline stretches over 29,751 kilometers and features diverse marine ecosystems.");
            break;
        case LOCATION_CATEGORIES.MOUNTAIN:
            facts.push("Mountains cover about 73% of Japan's land area, creating dramatic landscapes throughout the country.");
            break;
        case LOCATION_CATEGORIES.HISTORIC:
            facts.push("Japan has a rich history dating back thousands of years, with many well-preserved historic sites.");
            break;
        case LOCATION_CATEGORIES.TOURIST:
            facts.push("Japan attracts millions of tourists each year to experience its unique culture, cuisine, and attractions.");
            break;
    }
    
    // Add region-specific facts
    switch (region) {
        case JAPAN_REGIONS.HOKKAIDO:
            facts.push("Hokkaido is Japan's northernmost main island, known for its natural beauty and winter sports.");
            break;
        case JAPAN_REGIONS.TOHOKU:
            facts.push("Tohoku in northern Honshu is famous for its mountains, hot springs, and traditional festivals.");
            break;
        case JAPAN_REGIONS.KANTO:
            facts.push("The Kanto region includes Tokyo and is the most populous area of Japan.");
            break;
        case JAPAN_REGIONS.CHUBU:
            facts.push("Chubu in central Honshu features the Japanese Alps and Mount Fuji.");
            break;
        case JAPAN_REGIONS.KANSAI:
            facts.push("Kansai includes the historic cities of Kyoto, Osaka, and Nara, and was the cultural and political center of Japan for centuries.");
            break;
        case JAPAN_REGIONS.CHUGOKU:
            facts.push("The Chugoku region in western Honshu includes Hiroshima and features diverse landscapes from mountains to coastlines.");
            break;
        case JAPAN_REGIONS.SHIKOKU:
            facts.push("Shikoku is the smallest of Japan's four main islands and is known for its 88-temple pilgrimage route.");
            break;
        case JAPAN_REGIONS.KYUSHU:
            facts.push("Kyushu, the southernmost of Japan's main islands, is known for its active volcanoes, hot springs, and subtropical climate.");
            break;
        case JAPAN_REGIONS.OKINAWA:
            facts.push("Okinawa consists of a chain of islands with a subtropical climate, beautiful beaches, and unique cultural heritage.");
            break;
    }
    
    return facts.join(" ");
}

/**
 * Get a random category
 * @returns {string} A random location category
 */
function getRandomCategory() {
    const categories = Object.values(LOCATION_CATEGORIES);
    return categories[Math.floor(Math.random() * categories.length)];
}

/**
 * Get a random region
 * @returns {string} A random Japan region
 */
function getRandomRegion() {
    const regions = Object.values(JAPAN_REGIONS);
    return regions[Math.floor(Math.random() * regions.length)];
}

/**
 * Get a random difficulty level
 * @returns {string} A random difficulty level
 */
function getRandomDifficulty() {
    const difficulties = Object.values(DIFFICULTY_LEVELS);
    return difficulties[Math.floor(Math.random() * difficulties.length)];
}

/**
 * Get a random location with Street View coverage
 * @param {Object} filters - Optional filters for category, difficulty, region
 * @returns {Promise<Object>} A promise that resolves to a location object
 */
async function getRandomGeneratedLocation(filters = {}) {
    console.log("Getting random generated location with filters:", filters);
    
    try {
        // Generate a location with the specified filters
        const location = await generateRandomLocation({
            category: filters.category || null,
            difficulty: filters.difficulty || null,
            region: filters.region || null
        });
        
        return location;
    } catch (error) {
        console.error("Error generating random location:", error);
        
        // Fallback to the existing database if generation fails
        console.log("Falling back to existing location database");
        return getRandomLocation(filters);
    }
}

// Make functions globally available
window.generateRandomLocation = generateRandomLocation;
window.getRandomGeneratedLocation = getRandomGeneratedLocation;
window.verifiedLocationsCache = verifiedLocationsCache;

// Log that the module has loaded
console.log("location-generator.js module loaded");