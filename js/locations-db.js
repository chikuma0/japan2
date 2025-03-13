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
    {
        coordinates: { lat: 35.7100, lng: 139.8107 },
        name: "Asakusa Sensoji Temple",
        category: LOCATION_CATEGORIES.HISTORIC,
        difficulty: DIFFICULTY_LEVELS.EASY,
        region: JAPAN_REGIONS.KANTO,
        facts: "Sensoji is Tokyo's oldest temple, founded in 628 AD. The famous Kaminarimon (Thunder Gate) with its massive red lantern is an iconic symbol of Tokyo."
    },
    {
        coordinates: { lat: 35.6717, lng: 139.7649 },
        name: "Tsukiji Outer Market",
        category: LOCATION_CATEGORIES.URBAN,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        region: JAPAN_REGIONS.KANTO,
        facts: "While the main Tsukiji fish market relocated to Toyosu in 2018, the outer market remains a vibrant food district with over 400 shops and restaurants."
    },
    {
        coordinates: { lat: 35.6594, lng: 139.7005 },
        name: "Meiji Shrine",
        category: LOCATION_CATEGORIES.HISTORIC,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        region: JAPAN_REGIONS.KANTO,
        facts: "Meiji Shrine is dedicated to Emperor Meiji and Empress Shoken. The 170-acre forest surrounding the shrine contains 120,000 trees donated from all over Japan."
    },
    {
        coordinates: { lat: 35.6257, lng: 139.7264 },
        name: "Odaiba",
        category: LOCATION_CATEGORIES.URBAN,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        region: JAPAN_REGIONS.KANTO,
        facts: "Odaiba is a popular entertainment district built on an artificial island in Tokyo Bay. It features a replica of the Statue of Liberty and the Rainbow Bridge."
    },
    {
        coordinates: { lat: 35.6905, lng: 139.7026 },
        name: "Harajuku Takeshita Street",
        category: LOCATION_CATEGORIES.URBAN,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        region: JAPAN_REGIONS.KANTO,
        facts: "Takeshita Street is the center of Harajuku's youth culture and fashion scene, packed with trendy boutiques, crepe stands, and quirky cafes."
    },
    {
        coordinates: { lat: 35.7148, lng: 139.7967 },
        name: "Ueno Park",
        category: LOCATION_CATEGORIES.URBAN,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        region: JAPAN_REGIONS.KANTO,
        facts: "Ueno Park is Tokyo's largest public park and home to several museums, a zoo, and beautiful cherry blossom trees that attract thousands during hanami season."
    },
    {
        coordinates: { lat: 35.6852, lng: 139.7528 },
        name: "Ginza",
        category: LOCATION_CATEGORIES.URBAN,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        region: JAPAN_REGIONS.KANTO,
        facts: "Ginza is Tokyo's most luxurious shopping district, comparable to Fifth Avenue in New York. On weekends, the main street is closed to traffic, creating a pedestrian paradise."
    },
    {
        coordinates: { lat: 35.6586, lng: 139.7011 },
        name: "Yoyogi Park",
        category: LOCATION_CATEGORIES.URBAN,
        difficulty: DIFFICULTY_LEVELS.HARD,
        region: JAPAN_REGIONS.KANTO,
        facts: "Yoyogi Park was the site of the Olympic Village for the 1964 Tokyo Olympics and is now a popular gathering spot for musicians, artists, and dancers on weekends."
    },
    {
        coordinates: { lat: 35.6284, lng: 139.7387 },
        name: "TeamLab Borderless Museum",
        category: LOCATION_CATEGORIES.URBAN,
        difficulty: DIFFICULTY_LEVELS.HARD,
        region: JAPAN_REGIONS.KANTO,
        facts: "TeamLab Borderless is a digital art museum where artworks move out of rooms, communicate with other works, and influence and sometimes intermingle with each other."
    },
    
    // YOKOHAMA - KANTO
    {
        coordinates: { lat: 35.4513, lng: 139.6315 },
        name: "Yokohama Chinatown",
        category: LOCATION_CATEGORIES.URBAN,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        region: JAPAN_REGIONS.KANTO,
        facts: "Yokohama Chinatown is the largest Chinatown in Japan, established in 1859 when Yokohama port opened to foreign trade. It has over 500 Chinese restaurants and shops."
    },
    {
        coordinates: { lat: 35.4548, lng: 139.6372 },
        name: "Yokohama Landmark Tower",
        category: LOCATION_CATEGORIES.URBAN,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        region: JAPAN_REGIONS.KANTO,
        facts: "Until 2014, Landmark Tower was the tallest building in Japan at 296 meters. Its Sky Garden observatory offers spectacular views of Mt. Fuji on clear days."
    },
    {
        coordinates: { lat: 35.4527, lng: 139.6285 },
        name: "Yokohama Red Brick Warehouse",
        category: LOCATION_CATEGORIES.URBAN,
        difficulty: DIFFICULTY_LEVELS.HARD,
        region: JAPAN_REGIONS.KANTO,
        facts: "These historic customs buildings from 1911 have been converted into a shopping and cultural complex that hosts seasonal events like the Christmas Market."
    },
    
    // KAMAKURA - KANTO
    {
        coordinates: { lat: 35.3167, lng: 139.5361 },
        name: "Great Buddha of Kamakura",
        category: LOCATION_CATEGORIES.HISTORIC,
        difficulty: DIFFICULTY_LEVELS.EASY,
        region: JAPAN_REGIONS.KANTO,
        facts: "The Great Buddha (Daibutsu) at Kotoku-in Temple is a bronze statue standing at 13.35 meters tall. Cast in 1252, it has survived tsunamis and earthquakes."
    },
    {
        coordinates: { lat: 35.3249, lng: 139.5507 },
        name: "Hase-dera Temple",
        category: LOCATION_CATEGORIES.HISTORIC,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        region: JAPAN_REGIONS.KANTO,
        facts: "Hase-dera is famous for its 9.18-meter-tall wooden statue of Kannon, the goddess of mercy, and its beautiful gardens with seasonal flowers."
    },
    {
        coordinates: { lat: 35.3369, lng: 139.5318 },
        name: "Tsurugaoka Hachimangu Shrine",
        category: LOCATION_CATEGORIES.HISTORIC,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        region: JAPAN_REGIONS.KANTO,
        facts: "Founded in 1063, this is Kamakura's most important shrine. The approach features a wide staircase and a massive torii gate, with beautiful cherry blossoms in spring."
    },
    
    // NIKKO - KANTO
    {
        coordinates: { lat: 36.7573, lng: 139.5985 },
        name: "Nikko Toshogu Shrine",
        category: LOCATION_CATEGORIES.HISTORIC,
        difficulty: DIFFICULTY_LEVELS.EASY,
        region: JAPAN_REGIONS.KANTO,
        facts: "Toshogu Shrine is the final resting place of Tokugawa Ieyasu, the founder of the Tokugawa Shogunate. It's famous for its lavish decorations and the 'see no evil, speak no evil, hear no evil' monkey carvings."
    },
    {
        coordinates: { lat: 36.7380, lng: 139.6007 },
        name: "Kegon Falls",
        category: LOCATION_CATEGORIES.MOUNTAIN,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        region: JAPAN_REGIONS.KANTO,
        facts: "Kegon Falls is one of Japan's three most beautiful waterfalls, with water dropping 97 meters from Lake Chuzenji. It's particularly spectacular in autumn and when frozen in winter."
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
    {
        coordinates: { lat: 35.0395, lng: 135.7290 },
        name: "Tenryu-ji Temple",
        category: LOCATION_CATEGORIES.HISTORIC,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        region: JAPAN_REGIONS.KANSAI,
        facts: "Tenryu-ji is the most important temple in Kyoto's Arashiyama district. Its garden, designed by Zen master Muso Soseki, is a designated UNESCO World Heritage Site."
    },
    {
        coordinates: { lat: 35.0305, lng: 135.7029 },
        name: "Katsura Imperial Villa",
        category: LOCATION_CATEGORIES.HISTORIC,
        difficulty: DIFFICULTY_LEVELS.EXPERT,
        region: JAPAN_REGIONS.KANSAI,
        facts: "Katsura Imperial Villa is considered a masterpiece of Japanese architecture and garden design from the 17th century. Visits require advance permission from the Imperial Household Agency."
    },
    {
        coordinates: { lat: 34.9945, lng: 135.7852 },
        name: "Ginkaku-ji (Silver Pavilion)",
        category: LOCATION_CATEGORIES.HISTORIC,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        region: JAPAN_REGIONS.KANSAI,
        facts: "Despite its name, Ginkaku-ji was never covered in silver. It was built by shogun Ashikaga Yoshimasa as a retirement villa in the late 15th century."
    },
    {
        coordinates: { lat: 34.9815, lng: 135.7729 },
        name: "Philosopher's Path",
        category: LOCATION_CATEGORIES.TOURIST,
        difficulty: DIFFICULTY_LEVELS.HARD,
        region: JAPAN_REGIONS.KANSAI,
        facts: "This stone path follows a canal lined with cherry trees and is named after philosopher Nishida Kitaro who used to meditate while walking this route to Kyoto University."
    },
    {
        coordinates: { lat: 35.0144, lng: 135.6711 },
        name: "Ryoan-ji Temple",
        category: LOCATION_CATEGORIES.HISTORIC,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        region: JAPAN_REGIONS.KANSAI,
        facts: "Ryoan-ji is home to Japan's most famous rock garden, consisting of 15 rocks arranged on white gravel. The meaning of the arrangement is left to each viewer's interpretation."
    },
    {
        coordinates: { lat: 34.9677, lng: 135.7739 },
        name: "Gion District, Kyoto",
        category: LOCATION_CATEGORIES.HISTORIC,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        region: JAPAN_REGIONS.KANSAI,
        facts: "Gion is Kyoto's most famous geisha district, with preserved machiya houses lining narrow streets. It's one of the few places where you might spot geiko (Kyoto dialect for geisha) or maiko (apprentice geiko)."
    },
    {
        coordinates: { lat: 34.9955, lng: 135.7854 },
        name: "Nanzen-ji Temple",
        category: LOCATION_CATEGORIES.HISTORIC,
        difficulty: DIFFICULTY_LEVELS.HARD,
        region: JAPAN_REGIONS.KANSAI,
        facts: "Nanzen-ji features a massive Sanmon gate and an unusual brick aqueduct built during the Meiji Period. It's one of the most important Zen temples in Japan."
    },
    {
        coordinates: { lat: 35.0116, lng: 135.6685 },
        name: "Arashiyama Monkey Park",
        category: LOCATION_CATEGORIES.TOURIST,
        difficulty: DIFFICULTY_LEVELS.HARD,
        region: JAPAN_REGIONS.KANSAI,
        facts: "Arashiyama Monkey Park is home to over 120 Japanese macaques (snow monkeys) that roam freely on the mountainside."
    },
    
    // NARA - KANSAI
    {
        coordinates: { lat: 34.6851, lng: 135.8048 },
        name: "Nara Park",
        category: LOCATION_CATEGORIES.TOURIST,
        difficulty: DIFFICULTY_LEVELS.EASY,
        region: JAPAN_REGIONS.KANSAI,
        facts: "Nara Park is home to over 1,200 wild sika deer that are considered messengers of the gods. Visitors can purchase special crackers to feed them."
    },
    {
        coordinates: { lat: 34.6890, lng: 135.8397 },
        name: "Todai-ji Temple",
        category: LOCATION_CATEGORIES.HISTORIC,
        difficulty: DIFFICULTY_LEVELS.EASY,
        region: JAPAN_REGIONS.KANSAI,
        facts: "Todai-ji houses the world's largest bronze Buddha statue (Daibutsu) at 15 meters tall. The temple's main hall is one of the world's largest wooden buildings."
    },
    {
        coordinates: { lat: 34.6773, lng: 135.8294 },
        name: "Kasuga Taisha Shrine",
        category: LOCATION_CATEGORIES.HISTORIC,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        region: JAPAN_REGIONS.KANSAI,
        facts: "Kasuga Taisha is famous for its thousands of bronze and stone lanterns, which are lit twice a year during special festivals in February and August."
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
    {
        coordinates: { lat: 34.6687, lng: 135.5030 },
        name: "Shitennoji Temple",
        category: LOCATION_CATEGORIES.HISTORIC,
        difficulty: DIFFICULTY_LEVELS.HARD,
        region: JAPAN_REGIONS.KANSAI,
        facts: "Shitennoji is one of Japan's oldest temples, founded in 593 by Prince Shotoku who helped introduce Buddhism to Japan. Despite being rebuilt several times, it retains its original 6th-century design."
    },
    {
        coordinates: { lat: 34.6683, lng: 135.4299 },
        name: "Universal Studios Japan",
        category: LOCATION_CATEGORIES.TOURIST,
        difficulty: DIFFICULTY_LEVELS.EASY,
        region: JAPAN_REGIONS.KANSAI,
        facts: "Universal Studios Japan opened in 2001 and features attractions based on popular films and characters, including a highly acclaimed Harry Potter area and Super Nintendo World."
    },
    {
        coordinates: { lat: 34.7024, lng: 135.4959 },
        name: "Umeda Sky Building",
        category: LOCATION_CATEGORIES.URBAN,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        region: JAPAN_REGIONS.KANSAI,
        facts: "The Umeda Sky Building consists of two 40-story towers connected by a 'Floating Garden Observatory' at the top. The open-air deck offers 360-degree views of Osaka."
    },
    
    // KOBE - KANSAI
    {
        coordinates: { lat: 34.6882, lng: 135.1961 },
        name: "Kobe Harborland",
        category: LOCATION_CATEGORIES.URBAN,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        region: JAPAN_REGIONS.KANSAI,
        facts: "Kobe Harborland is a shopping and entertainment district along the waterfront. The area is especially beautiful at night when illuminated."
    },
    {
        coordinates: { lat: 34.7211, lng: 135.2596 },
        name: "Nunobiki Herb Garden",
        category: LOCATION_CATEGORIES.TOURIST,
        difficulty: DIFFICULTY_LEVELS.HARD,
        region: JAPAN_REGIONS.KANSAI,
        facts: "Reached by the Shin-Kobe Ropeway, this garden features over 200 species of herbs and flowers, as well as a greenhouse and restaurant with panoramic views of Kobe."
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
    {
        coordinates: { lat: 43.0621, lng: 141.3543 },
        name: "Sapporo Odori Park",
        category: LOCATION_CATEGORIES.URBAN,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        region: JAPAN_REGIONS.HOKKAIDO,
        facts: "Odori Park stretches through downtown Sapporo for 1.5 kilometers and hosts many events, including the famous Sapporo Snow Festival in February."
    },
    {
        coordinates: { lat: 42.7845, lng: 140.6675 },
        name: "Lake Toya",
        category: LOCATION_CATEGORIES.MOUNTAIN,
        difficulty: DIFFICULTY_LEVELS.HARD,
        region: JAPAN_REGIONS.HOKKAIDO,
        facts: "Lake Toya is a volcanic caldera lake that never freezes, despite Hokkaido's cold winters. It's part of the Shikotsu-Toya National Park and surrounded by hot springs."
    },
    {
        coordinates: { lat: 43.7664, lng: 142.4503 },
        name: "Furano Flower Fields",
        category: LOCATION_CATEGORIES.RURAL,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        region: JAPAN_REGIONS.HOKKAIDO,
        facts: "Furano is famous for its lavender fields that bloom in July, creating a purple carpet across the landscape. Farm Tomita is the most popular spot to view these flowers."
    },
    {
        coordinates: { lat: 43.1975, lng: 140.9942 },
        name: "Niseko",
        category: LOCATION_CATEGORIES.MOUNTAIN,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        region: JAPAN_REGIONS.HOKKAIDO,
        facts: "Niseko is Japan's premier ski resort, famous for its consistent powder snow. It has become an international destination, particularly popular with Australian tourists."
    },
    {
        coordinates: { lat: 44.0582, lng: 145.1232 },
        name: "Shiretoko Peninsula",
        category: LOCATION_CATEGORIES.MOUNTAIN,
        difficulty: DIFFICULTY_LEVELS.EXPERT,
        region: JAPAN_REGIONS.HOKKAIDO,
        facts: "Shiretoko is a UNESCO World Heritage Site known for its rich ecosystem. It's one of the few places in the world where sea ice forms at such a relatively low latitude."
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
    {
        coordinates: { lat: 39.7012, lng: 140.1031 },
        name: "Kakunodate Samurai District",
        category: LOCATION_CATEGORIES.HISTORIC,
        difficulty: DIFFICULTY_LEVELS.HARD,
        region: JAPAN_REGIONS.TOHOKU,
        facts: "Kakunodate is a former castle town with well-preserved samurai residences dating back to the Edo period. It's also famous for its weeping cherry trees."
    },
    {
        coordinates: { lat: 40.8284, lng: 140.7506 },
        name: "Hirosaki Castle",
        category: LOCATION_CATEGORIES.HISTORIC,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        region: JAPAN_REGIONS.TOHOKU,
        facts: "Hirosaki Castle is surrounded by over 2,500 cherry trees, making it one of Japan's best cherry blossom viewing spots. The castle was built in 1611 by the Tsugaru clan."
    },
    {
        coordinates: { lat: 38.8768, lng: 139.8486 },
        name: "Mount Zao",
        category: LOCATION_CATEGORIES.MOUNTAIN,
        difficulty: DIFFICULTY_LEVELS.HARD,
        region: JAPAN_REGIONS.TOHOKU,
        facts: "Mount Zao is famous for its 'snow monsters' - trees covered in snow and ice that form bizarre shapes. It's also home to a crater lake and ski resort."
    },
    {
        coordinates: { lat: 39.1009, lng: 140.0508 },
        name: "Ginzan Onsen",
        category: LOCATION_CATEGORIES.HISTORIC,
        difficulty: DIFFICULTY_LEVELS.EXPERT,
        region: JAPAN_REGIONS.TOHOKU,
        facts: "Ginzan Onsen is a picturesque hot spring town with traditional ryokan lining a river. Its gas lamps create a magical atmosphere, especially in winter when snow covers the area."
    },
    {
        coordinates: { lat: 40.4568, lng: 141.4321 },
        name: "Lake Towada",
        category: LOCATION_CATEGORIES.MOUNTAIN,
        difficulty: DIFFICULTY_LEVELS.HARD,
        region: JAPAN_REGIONS.TOHOKU,
        facts: "Lake Towada is the largest crater lake on Honshu island, formed by volcanic eruptions about 200,000 years ago. The surrounding area is known for its beautiful autumn colors."
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
    {
        coordinates: { lat: 36.1439, lng: 137.2529 },
        name: "Shirakawa-go",
        category: LOCATION_CATEGORIES.RURAL,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        region: JAPAN_REGIONS.CHUBU,
        facts: "Shirakawa-go is famous for its traditional gassho-zukuri farmhouses, some of which are more than 250 years old. The steep thatched roofs are designed to withstand heavy snow."
    },
    {
        coordinates: { lat: 36.7381, lng: 137.0252 },
        name: "Tateyama Kurobe Alpine Route",
        category: LOCATION_CATEGORIES.MOUNTAIN,
        difficulty: DIFFICULTY_LEVELS.HARD,
        region: JAPAN_REGIONS.CHUBU,
        facts: "This spectacular route through the Northern Japan Alps features the famous 'Snow Walls' that can reach up to 20 meters high in spring."
    },
    {
        coordinates: { lat: 35.2324, lng: 139.0538 },
        name: "Hakone Open-Air Museum",
        category: LOCATION_CATEGORIES.TOURIST,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        region: JAPAN_REGIONS.CHUBU,
        facts: "The Hakone Open-Air Museum combines nature and art with over 100 sculptures displayed outdoors against the backdrop of mountains. It also houses a significant Picasso collection."
    },
    {
        coordinates: { lat: 35.1968, lng: 136.9338 },
        name: "Nagoya Castle",
        category: LOCATION_CATEGORIES.HISTORIC,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        region: JAPAN_REGIONS.CHUBU,
        facts: "Nagoya Castle was built in 1612 and was one of the largest castles in Japan. The golden shachihoko (mythical fish-like creatures) on its roof are symbols of Nagoya."
    },
    {
        coordinates: { lat: 35.4346, lng: 138.5969 },
        name: "Kawaguchiko",
        category: LOCATION_CATEGORIES.MOUNTAIN,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        region: JAPAN_REGIONS.CHUBU,
        facts: "Lake Kawaguchiko is one of the Fuji Five Lakes and offers some of the best views of Mount Fuji. It's particularly beautiful during cherry blossom season and autumn."
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
    {
        coordinates: { lat: 35.5209, lng: 134.8395 },
        name: "Tottori Sand Dunes",
        category: LOCATION_CATEGORIES.COASTAL,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        region: JAPAN_REGIONS.CHUGOKU,
        facts: "The Tottori Sand Dunes are the largest sand dunes in Japan, stretching 16 kilometers along the coast of the Sea of Japan."
    },
    {
        coordinates: { lat: 34.4011, lng: 131.3897 },
        name: "Akiyoshido Cave",
        category: LOCATION_CATEGORIES.TOURIST,
        difficulty: DIFFICULTY_LEVELS.HARD,
        region: JAPAN_REGIONS.CHUGOKU,
        facts: "Akiyoshido is Japan's largest limestone cave, stretching for about 10 kilometers underground. The explored section open to tourists is about 1 kilometer long."
    },
    {
        coordinates: { lat: 34.6668, lng: 133.9347 },
        name: "Kurashiki Bikan Historical Quarter",
        category: LOCATION_CATEGORIES.HISTORIC,
        difficulty: DIFFICULTY_LEVELS.HARD,
        region: JAPAN_REGIONS.CHUGOKU,
        facts: "Kurashiki's preserved canal district features white-walled storehouses from the Edo period that have been converted into museums, shops, and cafes."
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
    {
        coordinates: { lat: 33.8361, lng: 132.7661 },
        name: "Dogo Onsen",
        category: LOCATION_CATEGORIES.HISTORIC,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        region: JAPAN_REGIONS.SHIKOKU,
        facts: "Dogo Onsen is one of Japan's oldest hot springs, with a history stretching back over 1,000 years. Its main bathhouse was the inspiration for the bathhouse in the film 'Spirited Away'."
    },
    {
        coordinates: { lat: 34.0675, lng: 134.5519 },
        name: "Naruto Whirlpools",
        category: LOCATION_CATEGORIES.COASTAL,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        region: JAPAN_REGIONS.SHIKOKU,
        facts: "The Naruto Whirlpools occur in the Naruto Strait between Shikoku and Awaji Island. These tidal whirlpools can reach up to 20 meters in diameter during spring tides."
    },
    {
        coordinates: { lat: 33.5453, lng: 133.5312 },
        name: "Kochi Castle",
        category: LOCATION_CATEGORIES.HISTORIC,
        difficulty: DIFFICULTY_LEVELS.HARD,
        region: JAPAN_REGIONS.SHIKOKU,
        facts: "Kochi Castle is one of only 12 Japanese castles that have survived in their original form, without being destroyed by fires, wars or other disasters."
    },
    {
        coordinates: { lat: 34.1815, lng: 133.8076 },
        name: "Iya Valley",
        category: LOCATION_CATEGORIES.RURAL,
        difficulty: DIFFICULTY_LEVELS.EXPERT,
        region: JAPAN_REGIONS.SHIKOKU,
        facts: "The remote Iya Valley is known for its dramatic mountain scenery, traditional vine bridges (kazurabashi), and hot springs. It was historically a refuge for the defeated Heike clan."
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
    {
        coordinates: { lat: 32.7898, lng: 130.7417 },
        name: "Kumamoto Castle",
        category: LOCATION_CATEGORIES.HISTORIC,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        region: JAPAN_REGIONS.KYUSHU,
        facts: "Kumamoto Castle is one of Japan's three premier castles, along with Himeji and Matsumoto. It was severely damaged in the 2016 earthquakes but is being restored."
    },
    {
        coordinates: { lat: 33.2631, lng: 131.8808 },
        name: "Beppu Onsen",
        category: LOCATION_CATEGORIES.TOURIST,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        region: JAPAN_REGIONS.KYUSHU,
        facts: "Beppu is one of Japan's most famous hot spring resorts, with over 2,000 hot spring vents. The city's 'Hells' (jigoku) are colorful hot springs for viewing rather than bathing."
    },
    {
        coordinates: { lat: 31.5969, lng: 130.5571 },
        name: "Sakurajima",
        category: LOCATION_CATEGORIES.MOUNTAIN,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        region: JAPAN_REGIONS.KYUSHU,
        facts: "Sakurajima is an active volcano in Kagoshima Bay that erupts frequently. It was formerly an island but became connected to the mainland by lava flows in 1914."
    },
    {
        coordinates: { lat: 32.8861, lng: 131.0997 },
        name: "Mount Aso",
        category: LOCATION_CATEGORIES.MOUNTAIN,
        difficulty: DIFFICULTY_LEVELS.HARD,
        region: JAPAN_REGIONS.KYUSHU,
        facts: "Mount Aso has one of the world's largest caldera, measuring 25 kilometers across. The active volcano within the caldera is accessible to visitors when eruption levels are low."
    },
    {
        coordinates: { lat: 33.3137, lng: 130.3745 },
        name: "Dazaifu Tenmangu Shrine",
        category: LOCATION_CATEGORIES.HISTORIC,
        difficulty: DIFFICULTY_LEVELS.HARD,
        region: JAPAN_REGIONS.KYUSHU,
        facts: "Dazaifu Tenmangu is dedicated to the spirit of Sugawara no Michizane, a scholar and politician who was deified as the god of learning. Students visit to pray for academic success."
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
    {
        coordinates: { lat: 26.1815, lng: 127.7471 },
        name: "Shuri Castle",
        category: LOCATION_CATEGORIES.HISTORIC,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        region: JAPAN_REGIONS.OKINAWA,
        facts: "Shuri Castle was the palace of the Ryukyu Kingdom for over 400 years. Though largely destroyed by fire in 2019, reconstruction efforts are underway."
    },
    {
        coordinates: { lat: 26.6882, lng: 127.8773 },
        name: "Churaumi Aquarium",
        category: LOCATION_CATEGORIES.TOURIST,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        region: JAPAN_REGIONS.OKINAWA,
        facts: "Okinawa Churaumi Aquarium was once the world's largest aquarium and features the massive Kuroshio Tank, home to whale sharks and manta rays."
    },
    {
        coordinates: { lat: 24.3406, lng: 124.1555 },
        name: "Ishigaki Island",
        category: LOCATION_CATEGORIES.COASTAL,
        difficulty: DIFFICULTY_LEVELS.EXPERT,
        region: JAPAN_REGIONS.OKINAWA,
        facts: "Ishigaki Island is known for its beautiful beaches, coral reefs, and manta ray diving spots. Kabira Bay on the island is considered one of Japan's most scenic spots."
    },
    {
        coordinates: { lat: 26.3587, lng: 127.7387 },
        name: "American Village",
        category: LOCATION_CATEGORIES.URBAN,
        difficulty: DIFFICULTY_LEVELS.HARD,
        region: JAPAN_REGIONS.OKINAWA,
        facts: "American Village is a shopping and entertainment complex with an American theme, reflecting Okinawa's history with U.S. military bases. It features a Ferris wheel and many restaurants."
    },
    {
        coordinates: { lat: 26.6964, lng: 127.8781 },
        name: "Cape Manzamo",
        category: LOCATION_CATEGORIES.COASTAL,
        difficulty: DIFFICULTY_LEVELS.MEDIUM,
        region: JAPAN_REGIONS.OKINAWA,
        facts: "Cape Manzamo features a dramatic cliff shaped like an elephant's trunk. Its name means 'field capable of seating ten thousand people' due to its wide, grassy plateau."
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