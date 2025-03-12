import fs from 'fs';
import path from 'path';
import https from 'https';

// Create directories if they don't exist
const directories = [
  'public/images/updated',
  'public/images/updated/services',
  'public/images/updated/interiors',
  'public/images/updated/gallery',
  'public/images/updated/contact',
  'public/images/updated/blog',
  'public/images/updated/booking'
];

directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Simplified image URLs for more reliable downloading
const imageUrls = [
  // Hero images
  {
    url: 'https://images.unsplash.com/photo-1615529328331-f8917597711f',
    dest: 'public/images/updated/services/sage-bedroom-gold-accents.jpg',
    params: '?auto=format&fit=crop&w=1200&q=80'
  },
  {
    url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace',
    dest: 'public/images/updated/services/sage-living-room.jpg',
    params: '?auto=format&fit=crop&w=1200&q=80'
  },
  {
    url: 'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4',
    dest: 'public/images/updated/services/modern-kitchen-sage.jpg',
    params: '?auto=format&fit=crop&w=1200&q=80'
  },
  {
    url: 'https://images.unsplash.com/photo-1616137422495-1e9e46e2aa77',
    dest: 'public/images/updated/services/sage-office-plants.jpg',
    params: '?auto=format&fit=crop&w=1200&q=80'
  },
  
  // Service/Gallery images
  {
    url: 'https://images.unsplash.com/photo-1618221118493-9cfa1a1c00da',
    dest: 'public/images/updated/services/minimalist-bedroom.jpg',
    params: '?auto=format&fit=crop&w=1200&q=80'
  },
  {
    url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a',
    dest: 'public/images/updated/services/luxury-bathroom.jpg',
    params: '?auto=format&fit=crop&w=1200&q=80'
  },
  {
    url: 'https://images.unsplash.com/photo-1603969072881-b0fc7f3d77d7',
    dest: 'public/images/updated/gallery/drywall-finishing.jpg',
    params: '?auto=format&fit=crop&w=1200&q=80'
  },
  {
    url: 'https://images.unsplash.com/photo-1562664377-709f2c337eb2',
    dest: 'public/images/updated/gallery/paint-renovation.jpg',
    params: '?auto=format&fit=crop&w=1200&q=80'
  },
  
  // Before/After style images
  {
    url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7',
    dest: 'public/images/updated/gallery/before-renovation.jpg',
    params: '?auto=format&fit=crop&w=1200&q=80'
  },
  {
    url: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115',
    dest: 'public/images/updated/gallery/after-renovation.jpg',
    params: '?auto=format&fit=crop&w=1200&q=80'
  },
  
  // Tools/Professional images
  {
    url: 'https://images.unsplash.com/photo-1560184897-67f4a3f9a7fa',
    dest: 'public/images/updated/services/professional-tools.jpg',
    params: '?auto=format&fit=crop&w=1200&q=80'
  },
  {
    url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf',
    dest: 'public/images/updated/services/consultation-meeting.jpg',
    params: '?auto=format&fit=crop&w=1200&q=80'
  },

  // Contact page images
  {
    url: 'https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0',
    dest: 'public/images/updated/contact/contact-hero.jpg',
    params: '?auto=format&fit=crop&w=1200&q=80'
  },
  {
    url: 'https://images.unsplash.com/photo-1611095790444-1dfa35e37b52',
    dest: 'public/images/updated/contact/office-interior.jpg',
    params: '?auto=format&fit=crop&w=1200&q=80'
  },
  {
    url: 'https://images.unsplash.com/photo-1596557304812-d01786e46587',
    dest: 'public/images/updated/contact/phone-consultation.jpg',
    params: '?auto=format&fit=crop&w=1200&q=80'
  },

  // Blog page images
  {
    url: 'https://images.unsplash.com/photo-1617104424032-5ec8d4c38e31',
    dest: 'public/images/updated/blog/blog-hero.jpg',
    params: '?auto=format&fit=crop&w=1200&q=80'
  },
  {
    url: 'https://images.unsplash.com/photo-1593313637552-29c2c0dacd35',
    dest: 'public/images/updated/blog/drywall-techniques.jpg',
    params: '?auto=format&fit=crop&w=1200&q=80'
  },
  {
    url: 'https://images.unsplash.com/photo-1595514535215-8a631d76efe0',
    dest: 'public/images/updated/blog/design-trends.jpg',
    params: '?auto=format&fit=crop&w=1200&q=80'
  },
  {
    url: 'https://images.unsplash.com/photo-1615875882244-552c04c35311',
    dest: 'public/images/updated/blog/color-schemes.jpg',
    params: '?auto=format&fit=crop&w=1200&q=80'
  },

  // Booking page images
  {
    url: 'https://images.unsplash.com/photo-1615529328331-f8917597711f',
    dest: 'public/images/updated/booking/booking-hero.jpg',
    params: '?auto=format&fit=crop&w=1200&q=80'
  },
  {
    url: 'https://images.unsplash.com/photo-1581078426770-6d336e5de7bf',
    dest: 'public/images/updated/booking/scheduling.jpg',
    params: '?auto=format&fit=crop&w=1200&q=80'
  },
  {
    url: 'https://images.unsplash.com/photo-1553792552-253c678f32d0',
    dest: 'public/images/updated/booking/team-calendar.jpg',
    params: '?auto=format&fit=crop&w=1200&q=80'
  }
];

// Function to download an image
function downloadImage(imageObj) {
  return new Promise((resolve, reject) => {
    const fullUrl = imageObj.url + imageObj.params;
    https.get(fullUrl, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image from ${fullUrl}. Status code: ${response.statusCode}`));
        return;
      }
      
      const fileStream = fs.createWriteStream(imageObj.dest);
      response.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded: ${imageObj.dest}`);
        resolve();
      });
      
      fileStream.on('error', (err) => {
        fs.unlink(imageObj.dest, () => {}); // Delete the file if there was an error
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Download all images
async function downloadAllImages() {
  console.log('Starting to download images...');
  
  for (const imageObj of imageUrls) {
    try {
      await downloadImage(imageObj);
    } catch (error) {
      console.error(`Error downloading ${imageObj.url}: ${error.message}`);
    }
  }
  
  console.log('All downloads completed!');
}

downloadAllImages(); 