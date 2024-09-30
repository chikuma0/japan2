require('dotenv').config();
const fs = require('fs');

try {
  let html = fs.readFileSync('index.html', 'utf8');
  html = html.replace('YOUR_API_KEY_PLACEHOLDER', process.env.AIzaSyCCQsM6IW_drrcpvIUBB545G9j4rUGVvIE);
  fs.writeFileSync('dist/index.html', html);
  console.log('Pre-deployment script completed successfully.');
} catch (error) {
  console.error('Error in pre-deployment script:', error);
  process.exit(1);
}