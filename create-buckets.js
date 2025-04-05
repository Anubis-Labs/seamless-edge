#!/usr/bin/env node

// CommonJS script to create buckets directly using Supabase REST API
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get project info
const projectInfo = JSON.parse(execSync('npx supabase status --output json').toString());
const project = projectInfo[0] || {};

// Get API credentials
const serviceKey = project.service_role_key;
const apiUrl = project.api_url;

if (!serviceKey || !apiUrl) {
  console.error('Error: Could not get Supabase credentials');
  console.error('Make sure your Supabase project is running');
  process.exit(1);
}

console.log('Supabase API URL:', apiUrl);

// Buckets to create
const REQUIRED_BUCKETS = [
  'site-assets',
  'blog-images',
  'gallery-images',
  'testimonial-images',
  'service-images',
  'resumes'
];

// Function to create a bucket using Supabase direct SQL
function createBucketDirectly(bucketId, isPublic = true) {
  try {
    const sqlCommand = `
      INSERT INTO storage.buckets (id, name, public)
      VALUES ('${bucketId}', '${bucketId}', ${isPublic})
      ON CONFLICT (id) DO UPDATE
      SET public = ${isPublic};
    `.trim();
    
    // Write SQL to a temporary file
    const tempFile = path.join(__dirname, 'temp-create-bucket.sql');
    fs.writeFileSync(tempFile, sqlCommand);
    
    // Execute SQL using supabase CLI
    console.log(`Creating bucket: ${bucketId}`);
    execSync(`npx supabase db execute --file ${tempFile}`, { stdio: 'inherit' });
    
    // Clean up temp file
    fs.unlinkSync(tempFile);
    
    return true;
  } catch (error) {
    console.error(`Error creating bucket ${bucketId}:`, error.message);
    return false;
  }
}

// Create all storage RLS policies directly
function createStoragePolicies() {
  try {
    const sqlCommand = `
      -- Drop any existing policies
      DROP POLICY IF EXISTS "Give users all access to buckets" ON storage.buckets;
      DROP POLICY IF EXISTS "Allow public users to see bucket info" ON storage.buckets;
      DROP POLICY IF EXISTS "Allow ALL operations for authenticated users" ON storage.objects;
      DROP POLICY IF EXISTS "Allow public access to public buckets" ON storage.objects;
      
      -- Make sure RLS is enabled
      ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
      ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
      
      -- Create simple permissive policies
      CREATE POLICY "Give users all access to buckets" ON storage.buckets
      FOR ALL TO authenticated USING (true) WITH CHECK (true);
      
      CREATE POLICY "Allow public users to see bucket info" ON storage.buckets
      FOR SELECT TO anon USING (public = true);
      
      CREATE POLICY "Allow ALL operations for authenticated users" ON storage.objects
      FOR ALL TO authenticated 
      USING (true) WITH CHECK (true);
      
      CREATE POLICY "Allow public access to public buckets" ON storage.objects
      FOR SELECT TO anon
      USING (bucket_id IN (SELECT id FROM storage.buckets WHERE public = true));
    `.trim();
    
    // Write SQL to a temporary file
    const tempFile = path.join(__dirname, 'temp-create-policies.sql');
    fs.writeFileSync(tempFile, sqlCommand);
    
    // Execute SQL using supabase CLI
    console.log('Creating RLS policies...');
    execSync(`npx supabase db execute --file ${tempFile}`, { stdio: 'inherit' });
    
    // Clean up temp file
    fs.unlinkSync(tempFile);
    
    return true;
  } catch (error) {
    console.error(`Error creating policies:`, error.message);
    return false;
  }
}

// Display current buckets
try {
  console.log('Existing buckets:');
  execSync('npx supabase db execute --file - << EOF\nSELECT id, public FROM storage.buckets;\nEOF', { stdio: 'inherit' });
} catch (error) {
  console.error('Error listing buckets:', error.message);
}

// Create buckets
console.log('\nCreating missing buckets...');
for (const bucketId of REQUIRED_BUCKETS) {
  const isPublic = bucketId !== 'resumes';
  createBucketDirectly(bucketId, isPublic);
}

// Create policies
console.log('\nSetting up storage policies...');
createStoragePolicies();

// Display final bucket list
try {
  console.log('\nFinal bucket list:');
  execSync('npx supabase db execute --file - << EOF\nSELECT id, public FROM storage.buckets;\nEOF', { stdio: 'inherit' });
} catch (error) {
  console.error('Error listing buckets:', error.message);
}

console.log('\nSetup complete! All buckets should now be available.');
console.log('If you continue to have issues, try restarting your Supabase instance with:');
console.log('  npx supabase stop && npx supabase start'); 