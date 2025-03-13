/**
 * locations-db.js - Database of pre-verified locations with Street View coverage
 */

/**
 * Location categories for organizing the database
 */
const LOCATION_CATEGORIES = {
    URBAN: 'urban',
    RURAL: 'rural',
    COASTAL: 'coastal',
    MOUNTAIN: 'mountain',
    HISTORIC: 'historic',
    TOURIST: 'tourist'
};

/**
 * Difficulty levels for locations
 */
const DIFFICULTY_LEVELS = {
    EASY: 'easy',         // Famous landmarks, distinctive features
    MEDIUM: 'medium',     // Less famous but still recognizable locations
    HARD: 'hard',         // Challenging locations with few distinctive features
    EXPERT: 'expert'      // Very difficult locations with minimal context clues
};

/**
 * Regions of Japan for categorizing locations
 */
const JAPAN_REGIONS = {
    HOKKAIDO: 'Hokkaido',
    TOHOKU: 'Tohoku',
    KANTO: 'Kanto',
    CHUBU: 'Chubu',
    KANSAI: 'Kansai',
    CHUGOKU: 'Chugoku',
    SHIKOKU: 'Shikoku',
    KYUSHU: 'Kyushu',
    OKINAWA: 'Okinawa'
};

/**
 * Database of pre-verified locations with Street View coverage
 * Each location includes:
 * - coordinates (lat, lng)
 * - name (optional descriptive name)
 * - category (type of location)
 * - difficulty (how challenging it is to identify)
 * - region (which part of Japan)
 * - pov (optional custom point of view - heading, pitch, zoom)
 * - facts (optional interesting facts about the location)
 */
const LOCATIONS_DB = [
    // TOKYO AREA - KANTO
    {
        coordinates: { lat: 35.6895, lng: 139.6917 },
        name: "Shibuya Crossing",
        category: LOCATION_CATEGORIES.URBAN,
        difficulty: DIFFICULTY_LEVELS.EASY,
        region: JAPAN_REGIONS.KANTO,
        pov: { heading: 25, pitch: 0, zoom: 1 },
        facts: "Shibuya Crossing is one of the busiest pedestrian crossings in the world, with up to 3,000 people crossing at once during peak times."
    },
    {
        coordinates: { lat: 35.7101, lng: 139.8107 },
        name: "Tokyo Skytree",
        category: LOCATION_CATEGORIES.URBAN,
        difficulty: DIFFICULTY_LEVELS.EASY,
        region: JAPAN_REGIONS.KANTO,
        facts: "Tokyo Skytree is the tallest tower in the world at 634 meters and the second tallest structure in the world after Burj Khalifa."
    },
    {
        coordinates: { lat: 35.6586, lng: 139.7454 },
        name: "Tokyo Tower",
        category: LOCATION_CATEGORIES.URBAN,
        difficulty: DIFFICULTY_LEVELS.EASY,
        region: JAPAN_REGIONS.KANTO,
        facts: "Tokyo Tower was inspired by the Eiffel Tower but is 13 meters taller. It was completed in 1958 and painted orange and white to comply with air safety regulations."
    },
    {
        coordinates: { lat: 35.6762, lng: 139.6503 },
        name: "Shinjuku",
        category: LOCATION_CATEGORIES.URBAN,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        region: JAPAN_REGIONS.KANTO,
        facts: "Shinjuku is home to the world's busiest railway station, with more than 3.5 million people passing through daily."
    },
    
    // KYOTO AREA - KANSAI
    {
        coordinates: { lat: 35.0116, lng: 135.7681 },
        name: "Kinkaku-ji (Golden Pavilion)",
        category: LOCATION_CATEGORIES.HISTORIC,
        difficulty: DIFFICULTY_LEVELS.EASY,
        region: JAPAN_REGIONS.KANSAI,
        facts: "Kinkaku-ji, officially named Rokuon-ji, is a Zen Buddhist temple whose top two floors are completely covered in gold leaf."
    },
    {
        coordinates: { lat: 34.9949, lng: 135.7850 },
        name: "Fushimi Inari Taisha",
        category: LOCATION_CATEGORIES.HISTORIC,
        difficulty: DIFFICULTY_LEVELS.EASY,
        region: JAPAN_REGIONS.KANSAI,
        pov: { heading: 190, pitch: 0, zoom: 1 },
        facts: "Fushimi Inari Shrine is famous for its thousands of vermilion torii gates, which form a network of trails up the mountain."
    },
    {
        coordinates: { lat: 35.0394, lng: 135.7292 },
        name: "Arashiyama Bamboo Grove",
        category: LOCATION_CATEGORIES.TOURIST,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        region: JAPAN_REGIONS.KANSAI,
        facts: "The Arashiyama Bamboo Grove is one of the most photographed sights in Kyoto and has a distinct rustling sound when the wind blows through it."
    },
    
    // OSAKA AREA - KANSAI
    {
        coordinates: { lat: 34.6937, lng: 135.5022 },
        name: "Dotonbori",
        category: LOCATION_CATEGORIES.URBAN,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        region: JAPAN_REGIONS.KANSAI,
        facts: "Dotonbori is known for its bright neon lights, extravagant signage, and the famous Glico Running Man sign, which has been a landmark since 1935."
    },
    {
        coordinates: { lat: 34.6873, lng: 135.5262 },
        name: "Osaka Castle",
        category: LOCATION_CATEGORIES.HISTORIC,
        difficulty: DIFFICULTY_LEVELS.EASY,
        region: JAPAN_REGIONS.KANSAI,
        facts: "Osaka Castle was built in 1583 by Toyotomi Hideyoshi, a feudal lord and Imperial Regent. It played a major role in the unification of Japan."
    },
    
    // HOKKAIDO
    {
        coordinates: { lat: 43.0553, lng: 141.3544 },
        name: "Sapporo Clock Tower",
        category: LOCATION_CATEGORIES.HISTORIC,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        region: JAPAN_REGIONS.HOKKAIDO,
        facts: "The Sapporo Clock Tower is one of the few Western-style buildings in Japan dating from the Meiji Period and has been keeping time since 1881."
    },
    {
        coordinates: { lat: 42.9848, lng: 141.0320 },
        name: "Otaru Canal",
        category: LOCATION_CATEGORIES.COASTAL,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        region: JAPAN_REGIONS.HOKKAIDO,
        facts: "Otaru Canal was completed in 1923 and was a central part of the city's busy port. Today, the canal is lined with converted warehouses, restaurants, and shops."
    },
    
    // TOHOKU
    {
        coordinates: { lat: 38.2688, lng: 140.8721 },
        name: "Sendai",
        category: LOCATION_CATEGORIES.URBAN,
        difficulty: DIFFICULTY_LEVELS.HARD,
        region: JAPAN_REGIONS.TOHOKU,
        facts: "Sendai is known as the 'City of Trees' due to its tree-lined avenues and parks. It was founded in 1600 by Date Masamune, a powerful feudal lord."
    },
    
    // CHUBU
    {
        coordinates: { lat: 36.2384, lng: 137.9720 },
        name: "Matsumoto Castle",
        category: LOCATION_CATEGORIES.HISTORIC,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        region: JAPAN_REGIONS.CHUBU,
        facts: "Matsumoto Castle is one of Japan's oldest surviving castles and is known for its black exterior, earning it the nickname 'Crow Castle'."
    },
    {
        coordinates: { lat: 35.4660, lng: 138.8303 },
        name: "Mount Fuji View",
        category: LOCATION_CATEGORIES.MOUNTAIN,
        difficulty: DIFFICULTY_LEVELS.EASY,
        region: JAPAN_REGIONS.CHUBU,
        facts: "Mount Fuji is Japan's highest mountain at 3,776 meters and is an active volcano that last erupted in 1707."
    },
    
    // CHUGOKU
    {
        coordinates: { lat: 34.3960, lng: 132.4511 },
        name: "Hiroshima Peace Memorial",
        category: LOCATION_CATEGORIES.HISTORIC,
        difficulty: DIFFICULTY_LEVELS.EASY,
        region: JAPAN_REGIONS.CHUGOKU,
        facts: "The Hiroshima Peace Memorial (Genbaku Dome) was the only structure left standing near the hypocenter of the atomic bomb explosion on August 6, 1945."
    },
    {
        coordinates: { lat: 34.2963, lng: 132.3197 },
        name: "Miyajima Torii Gate",
        category: LOCATION_CATEGORIES.HISTORIC,
        difficulty: DIFFICULTY_LEVELS.EASY,
        region: JAPAN_REGIONS.CHUGOKU,
        facts: "The Great Torii Gate of Itsukushima Shrine appears to be floating during high tide and is one of Japan's most iconic views."
    },
    
    // SHIKOKU
    {
        coordinates: { lat: 34.3508, lng: 134.0473 },
        name: "Ritsurin Garden",
        category: LOCATION_CATEGORIES.HISTORIC,
        difficulty: DIFFICULTY_LEVELS.HARD,
        region: JAPAN_REGIONS.SHIKOKU,
        facts: "Ritsurin Garden is one of Japan's most beautiful gardens, featuring meticulously landscaped hills, ponds, and pavilions. It took over 100 years to complete."
    },
    
    // KYUSHU
    {
        coordinates: { lat: 33.5904, lng: 130.4017 },
        name: "Fukuoka Tower",
        category: LOCATION_CATEGORIES.URBAN,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        region: JAPAN_REGIONS.KYUSHU,
        facts: "Fukuoka Tower is the tallest seaside tower in Japan at 234 meters. Its exterior is covered with 8,000 half-mirrors, giving it the nickname 'Mirror Sail'."
    },
    {
        coordinates: { lat: 32.7503, lng: 129.8779 },
        name: "Nagasaki Peace Park",
        category: LOCATION_CATEGORIES.HISTORIC,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        region: JAPAN_REGIONS.KYUSHU,
        facts: "The Nagasaki Peace Park commemorates the atomic bombing of the city on August 9, 1945. The park's centerpiece is the 10-meter-tall Peace Statue."
    },
    
    // OKINAWA
    {
        coordinates: { lat: 26.2173, lng: 127.6661 },
        name: "Kokusai Dori (International Street)",
        category: LOCATION_CATEGORIES.URBAN,
        difficulty: DIFFICULTY_LEVELS.HARD,
        region: JAPAN_REGIONS.OKINAWA,
        facts: "Kokusai Dori is the main shopping street in Naha, Okinawa, stretching for about 1.6 kilometers and filled with shops, restaurants, and hotels."
    },
    {
        coordinates: { lat: 26.5016, lng: 127.9304 },
        name: "Kouri Bridge",
        category: LOCATION_CATEGORIES.COASTAL,
        difficulty: DIFFICULTY_LEVELS.HARD,
        region: JAPAN_REGIONS.OKINAWA,
        facts: "Kouri Bridge connects Yagaji Island and Kouri Island in Okinawa. At 1,960 meters, it's the longest toll-free bridge in Japan."
    },
    
    // RURAL AREAS
    {
        coordinates: { lat: 36.1439, lng: 137.2529 },
        name: "Shirakawa-go",
        category: LOCATION_CATEGORIES.RURAL,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        region: JAPAN_REGIONS.CHUBU,
        facts: "Shirakawa-go is famous for its traditional gassho-zukuri farmhouses, some of which are more than 250 years old. The steep thatched roofs are designed to withstand heavy snow."
    },
    {
        coordinates: { lat: 35.5209, lng: 134.8395 },
        name: "Tottori Sand Dunes",
        category: LOCATION_CATEGORIES.COASTAL,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        region: JAPAN_REGIONS.CHUGOKU,
        facts: "The Tottori Sand Dunes are the largest sand dunes in Japan, stretching 16 kilometers along the coast of the Sea of Japan."
    },
    
    // ADDITIONAL LOCATIONS
    {
        coordinates: { lat: 34.9677, lng: 135.7739 },
        name: "Gion District, Kyoto",
        category: LOCATION_CATEGORIES.HISTORIC,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        region: JAPAN_REGIONS.KANSAI,
        facts: "Gion is Kyoto's most famous geisha district, with preserved machiya houses lining narrow streets. It's one of the few places where you might spot geiko (Kyoto dialect for geisha) or maiko (apprentice geiko)."
    },
    {
        coordinates: { lat: 35.7111, lng: 139.7967 },
        name: "Akihabara Electric Town",
        category: LOCATION_CATEGORIES.URBAN,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        region: JAPAN_REGIONS.KANTO,
        facts: "Akihabara is the center of Japan's otaku (geek) culture and a shopping district for video games, anime, manga, and computer goods."
    },
    {
        coordinates: { lat: 35.6432, lng: 139.7466 },
        name: "Roppongi Hills",
        category: LOCATION_CATEGORIES.URBAN,
        difficulty: DIFFICULTY_LEVELS.HARD,
        region: JAPAN_REGIONS.KANTO,
        facts: "Roppongi Hills is a large integrated property development in Tokyo that includes offices, apartments, shops, restaurants, a hotel, art museum, and observation deck."
    },
    {
        coordinates: { lat: 35.0116, lng: 135.6685 },
        name: "Arashiyama Monkey Park",
        category: LOCATION_CATEGORIES.TOURIST,
        difficulty: DIFFICULTY_LEVELS.HARD,
        region: JAPAN_REGIONS.KANSAI,
        facts: "Arashiyama Monkey Park is home to over 120 Japanese macaques (snow monkeys) that roam freely on the mountainside."
    }
];

/**
 * Get a random location from the database
 * @param {Object} filters - Optional filters for category, difficulty, region
 * @returns {Object} A random location object
 */
function getRandomLocation(filters = {}) {
    let filteredLocations = [...LOCATIONS_DB];
    
    // Apply filters if provided
    if (filters.category) {
        filteredLocations = filteredLocations.filter(loc => loc.category === filters.category);
    }
    
    if (filters.difficulty) {
        filteredLocations = filteredLocations.filter(loc => loc.difficulty === filters.difficulty);
    }
    
    if (filters.region) {
        filteredLocations = filteredLocations.filter(loc => loc.region === filters.region);
    }
    
    // If no locations match the filters, return a random location from the entire database
    if (filteredLocations.length === 0) {
        console.warn('No locations match the provided filters. Using random location from entire database.');
        filteredLocations = [...LOCATIONS_DB];
    }
    
    // Return a random location from the filtered list
    const randomIndex = Math.floor(Math.random() * filteredLocations.length);
    return filteredLocations[randomIndex];
}

/**
 * Get locations by region
 * @param {string} region - The region to filter by
 * @returns {Array} Array of location objects in the specified region
 */
function getLocationsByRegion(region) {
    return LOCATIONS_DB.filter(loc => loc.region === region);
}

/**
 * Get locations by difficulty
 * @param {string} difficulty - The difficulty level to filter by
 * @returns {Array} Array of location objects with the specified difficulty
 */
function getLocationsByDifficulty(difficulty) {
    return LOCATIONS_DB.filter(loc => loc.difficulty === difficulty);
}

/**
 * Get locations by category
 * @param {string} category - The category to filter by
 * @returns {Array} Array of location objects in the specified category
 */
function getLocationsByCategory(category) {
    return LOCATIONS_DB.filter(loc => loc.category === category);
}

// Make variables and functions globally available
window.LOCATION_CATEGORIES = LOCATION_CATEGORIES;
window.DIFFICULTY_LEVELS = DIFFICULTY_LEVELS;
window.JAPAN_REGIONS = JAPAN_REGIONS;
window.LOCATIONS_DB = LOCATIONS_DB;
window.getRandomLocation = getRandomLocation;
window.getLocationsByRegion = getLocationsByRegion;
window.getLocationsByDifficulty = getLocationsByDifficulty;
window.getLocationsByCategory = getLocationsByCategory;