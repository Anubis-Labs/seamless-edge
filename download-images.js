// This script downloads placeholder images from Unsplash
const https = require('https');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'src', 'assets', 'images');

// Make sure the directory exists
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// List of Unsplash image URLs for drywall and construction
const imageUrls = [
  // Hero image
  { url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1200', filename: 'hero.jpg' },
  
  // Service images
  { url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800', filename: 'boarding.jpg' },
  { url: 'https://images.unsplash.com/photo-1621155346337-1d19476ba7d6?q=80&w=800', filename: 'taping.jpg' },
  { url: 'https://images.unsplash.com/photo-1572051525329-30b52e8e5a5b?q=80&w=800', filename: 'sanding.jpg' },
  { url: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?q=80&w=800', filename: 'repairs.jpg' },
  
  // Project gallery images
  { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800', filename: 'project1.jpg' },
  { url: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=800', filename: 'project2.jpg' },
  { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800', filename: 'project3.jpg' },
  { url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=800', filename: 'project4.jpg' },
  { url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=800', filename: 'project5.jpg' },
  { url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=800', filename: 'project6.jpg' },
  
  // Team images
  { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400', filename: 'team1.jpg' },
  { url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=400', filename: 'team2.jpg' },
  
  // About page image
  { url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800', filename: 'about.jpg' },
  
  // Logo placeholder
  { url: 'https://via.placeholder.com/200x80?text=Seamless+Edge+Co', filename: 'logo.png' }
];

// Function to download an image
function downloadImage(imageObj) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(imagesDir, imageObj.filename);
    const file = fs.createWriteStream(filePath);
    
    https.get(imageObj.url, (response) => {
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${imageObj.filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}); // Delete the file if there's an error
      console.error(`Error downloading ${imageObj.filename}: ${err.message}`);
      reject(err);
    });
  });
}

// Download all images
async function downloadAllImages() {
  for (const imageObj of imageUrls) {
    try {
      await downloadImage(imageObj);
    } catch (error) {
      console.error(`Failed to download ${imageObj.filename}`);
    }
  }
  console.log('All downloads completed!');
}

downloadAllImages(); 