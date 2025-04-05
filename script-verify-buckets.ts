// Script to verify that storage buckets exist and create them if they don't
import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

const REQUIRED_BUCKETS = [
  'site-assets',
  'blog-images',
  'gallery-images',
  'testimonial-images',
  'service-images',
  'resumes'
];

async function main() {
  console.log('Verifying storage buckets...');
  console.log('Supabase URL:', supabaseUrl);

  try {
    // List existing buckets
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error listing buckets:', error);
      return;
    }
    
    console.log('Existing buckets:', buckets?.map(b => b.id) || []);
    
    // Check which buckets need to be created
    const existingBucketIds = new Set(buckets?.map(b => b.id) || []);
    const missingBuckets = REQUIRED_BUCKETS.filter(id => !existingBucketIds.has(id));
    
    if (missingBuckets.length === 0) {
      console.log('All required buckets exist! 🎉');
      
      // Update public settings
      for (const bucket of buckets || []) {
        const shouldBePublic = bucket.id !== 'resumes';
        if (bucket.public !== shouldBePublic) {
          console.log(`Updating ${bucket.id} public setting to ${shouldBePublic}`);
          await supabase.storage.updateBucket(bucket.id, {
            public: shouldBePublic
          });
        }
      }
      return;
    }
    
    console.log('Missing buckets:', missingBuckets);
    
    // Create missing buckets
    for (const bucketId of missingBuckets) {
      console.log(`Creating bucket: ${bucketId}`);
      
      const { data, error: createError } = await supabase.storage.createBucket(bucketId, {
        public: bucketId !== 'resumes' // All buckets public except resumes
      });
      
      if (createError) {
        console.error(`Error creating bucket ${bucketId}:`, createError);
      } else {
        console.log(`Successfully created bucket: ${bucketId}`);
      }
    }
    
    console.log('Bucket verification complete!');
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

// Run the script
main(); 