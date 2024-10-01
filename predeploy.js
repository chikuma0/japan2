require('dotenv').config();
const fs = require('fs');

try {
  let html = fs.readFileSync('index.html', 'utf8');
  if (!process.env.GOOGLE_MAPS_API_KEY) {
    throw new Error('GOOGLE_MAPS_API_KEY is not set in the environment');
  }
  html = html.replace('YOUR_API_KEY_PLACEHOLDER', process.env.GOOGLE_MAPS_API_KEY);
  fs.writeFileSync('index.html', html);
  console.log('Pre-deployment script completed successfully.');
} catch (error) {
  console.error('Error in pre-deployment script:', error);
  process.exit(1);
}