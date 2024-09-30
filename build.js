require('dotenv').config();
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)){
    fs.mkdirSync(distDir);
}

let html = fs.readFileSync('index.html', 'utf8');
html = html.replace('YOUR_API_KEY_PLACEHOLDER', process.env.GOOGLE_MAPS_API_KEY);
fs.writeFileSync(path.join(distDir, 'index.html'), html);

console.log('API Key replaced successfully'); // Add this for debugging
