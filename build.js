require('dotenv').config();
const fs = require('fs');
const path = require('path');

console.log('Build script started');

const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)){
    fs.mkdirSync(distDir);
}

let html = fs.readFileSync('index.html', 'utf8');
console.log('API Key Placeholder present:', html.includes('YOUR_API_KEY_PLACEHOLDER'));

if (!process.env.GOOGLE_MAPS_API_KEY) {
    console.error('GOOGLE_MAPS_API_KEY is not set in the environment');
    process.exit(1);
}

html = html.replace('YOUR_API_KEY_PLACEHOLDER', process.env.GOOGLE_MAPS_API_KEY);
console.log('API Key Placeholder replaced:', !html.includes('YOUR_API_KEY_PLACEHOLDER'));
console.log('API Key present:', html.includes(process.env.GOOGLE_MAPS_API_KEY));

fs.writeFileSync(path.join(distDir, 'index.html'), html);
console.log('Updated index.html written to dist folder');

console.log('Build script completed');
