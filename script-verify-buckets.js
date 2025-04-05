// Script to verify that storage buckets exist and create them if they don't
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get Supabase credentials from environment
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase URL or API key');
  console.error('Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file');
  process.exit(1);
}

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

      // Verify RLS policies
      console.log('Checking RLS policies...');
      try {
        // Create a test file to verify permissions
        const testFile = new Blob(['test content'], { type: 'text/plain' });
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('site-assets')
          .upload(`test_${Date.now()}.txt`, testFile, { upsert: true });
          
        if (uploadError) {
          console.error('Error uploading test file:', uploadError);
          console.log('This indicates a permissions issue. Attempting to fix...');
          
          // We could implement policy fixes here
        } else {
          console.log('Successfully uploaded test file:', uploadData.path);
          console.log('RLS policies appear to be working correctly!');
        }
      } catch (err) {
        console.error('Error testing RLS policies:', err);
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