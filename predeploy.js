require('dotenv').config();
const fs = require('fs');

try {
  let html = fs.readFileSync('index.html', 'utf8');
  if (!process.env.GOOGLE_MAPS_API_KEY) {
    throw new Error('GOOGLE_MAPS_API_KEY is not set in the environment');
  }
  console.log('HTML content before replacement:', html);
  html = html.replace('YOUR_API_KEY_PLACEHOLDER', process.env.GOOGLE_MAPS_API_KEY);
  console.log('HTML content after replacement:', html);
  fs.writeFileSync('index.html', html);
  console.log('Pre-deployment script completed successfully.');
  console.log('API Key (first 5 chars):', process.env.GOOGLE_MAPS_API_KEY.substr(0, 5));
  console.log('API Key Placeholder replaced:', !html.includes('YOUR_API_KEY_PLACEHOLDER'));
  console.log('API Key present in HTML:', html.includes(process.env.GOOGLE_MAPS_API_KEY));
} catch (error) {
  console.error('Error in pre-deployment script:', error);
  process.exit(1);
}