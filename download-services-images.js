import fs from 'fs';
import https from 'https';
import path from 'path';

// Create the directory if it doesn't exist
const imageDir = path.join('public', 'images', 'services');
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

const images = [
  {
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd',
    filename: 'drywall-installation.jpg',
    alt: 'Professional installing drywall'
  },
  {
    url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92',
    filename: 'drywall-taping.jpg',
    alt: 'Drywall finishing tools and materials'
  },
  {
    url: 'https://images.unsplash.com/photo-1594128825019-0f259fde9d7a',
    filename: 'drywall-sanding.jpg',
    alt: 'Sanding and finishing drywall'
  },
  {
    url: 'https://images.unsplash.com/photo-1599619351208-3e6c839d6828',
    filename: 'texture-application.jpg',
    alt: 'Textured wall detail'
  },
  {
    url: 'https://images.unsplash.com/photo-1606175856341-74ab2fb1ad6c',
    filename: 'finished-wall.jpg',
    alt: 'Clean, finished drywall in modern room'
  },
  {
    url: 'https://images.unsplash.com/photo-1560440021-33f9b867899d',
    filename: 'consultation.jpg',
    alt: 'Contractor discussing project with client'
  },
  {
    url: 'https://images.unsplash.com/photo-1533619043865-1c2e2c29b4d5',
    filename: 'repair-work.jpg',
    alt: 'Drywall repair and patching'
  },
  {
    url: 'https://images.unsplash.com/photo-1571687949921-1306bfb24b72',
    filename: 'tools.jpg',
    alt: 'Professional construction tools'
  }
];

// Function to download an image
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filepath = path.join(imageDir, filename);
    
    // Add Unsplash params for better quality/size
    const fullUrl = `${url}?q=85&w=1200&auto=format&fit=crop`;
    
    https.get(fullUrl, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded: ${filename}`);
        resolve();
      });

      fileStream.on('error', (err) => {
        fs.unlinkSync(filepath); // Clean up failed download
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Process all images
async function downloadAllImages() {
  console.log('Starting image downloads...');
  
  // Create data directory if it doesn't exist
  const dataDir = path.join('src', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  for (const image of images) {
    try {
      await downloadImage(image.url, image.filename);
    } catch (error) {
      console.error(`Error downloading ${image.filename}:`, error.message);
    }
  }
  console.log('All downloads completed!');
  
  // Create a JSON file with image data for easier import
  fs.writeFileSync(
    path.join('src', 'data', 'serviceImages.json'), 
    JSON.stringify(images, null, 2)
  );
  console.log('Image metadata saved to src/data/serviceImages.json');
}

downloadAllImages(); 