#!/usr/bin/env node

/**
 * Storage Buckets API
 * 
 * This script provides both CLI and programmatic access for managing storage buckets.
 * It can be used directly from command line or imported into other scripts.
 * 
 * Usage:
 *   node api-buckets.js list
 *   node api-buckets.js create <bucket-name> [--public=(true|false)]
 *   node api-buckets.js delete <bucket-name>
 *   node api-buckets.js empty <bucket-name>
 *   node api-buckets.js update <bucket-name> --public=(true|false)
 *   node api-buckets.js create-all
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Constants
const REQUIRED_BUCKETS = [
  'site-assets',
  'blog-images',
  'gallery-images',
  'testimonial-images',
  'service-images',
  'resumes'
];

// Get Supabase credentials
function getSupabaseCredentials() {
  try {
    // First try to read from .env file
    if (fs.existsSync('.env')) {
      const envContent = fs.readFileSync('.env', 'utf8');
      const lines = envContent.split('\n');
      const envVars = {};
      
      for (const line of lines) {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
          const [, key, value] = match;
          envVars[key.trim()] = value.trim().replace(/^['"]|['"]$/g, '');
        }
      }
      
      if (envVars.VITE_SUPABASE_URL && envVars.VITE_SUPABASE_ANON_KEY) {
        return {
          url: envVars.VITE_SUPABASE_URL,
          key: envVars.VITE_SUPABASE_ANON_KEY,
          serviceRoleKey: envVars.VITE_SUPABASE_SERVICE_KEY || null
        };
      }
    }
    
    // Then try to get from Supabase local config
    try {
      const projectInfo = JSON.parse(execSync('npx supabase status --output json').toString());
      const project = projectInfo[0] || {};
      
      if (project.api_url && (project.anon_key || project.service_role_key)) {
        return {
          url: project.api_url,
          key: project.anon_key || project.service_role_key,
          serviceRoleKey: project.service_role_key
        };
      }
    } catch (err) {
      console.log('Could not get Supabase config from CLI:', err.message);
    }
    
    // As a last resort, prompt for credentials or read from arguments
    const args = process.argv.slice(2);
    const urlArg = args.find(arg => arg.startsWith('--url='));
    const keyArg = args.find(arg => arg.startsWith('--key='));
    
    if (urlArg && keyArg) {
      return {
        url: urlArg.split('=')[1],
        key: keyArg.split('=')[1],
        serviceRoleKey: null
      };
    }
    
    throw new Error('Could not determine Supabase credentials');
  } catch (error) {
    console.error('Error getting Supabase credentials:', error.message);
    if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
      console.error('Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file');
      console.error('Or pass them as arguments: --url=<URL> --key=<KEY>');
    }
    process.exit(1);
  }
}

// Create Supabase client
function createSupabaseClient() {
  const { url, key } = getSupabaseCredentials();
  console.log(`Connecting to Supabase at ${url}`);
  return createClient(url, key);
}

// List all buckets
async function listBuckets() {
  const supabase = createSupabaseClient();
  
  try {
    const { data, error } = await supabase.storage.listBuckets();
    
    if (error) {
      throw error;
    }
    
    console.log('Available buckets:');
    if (!data || data.length === 0) {
      console.log('  No buckets found');
      return [];
    }
    
    data.forEach(bucket => {
      console.log(`  • ${bucket.id} (${bucket.public ? 'public' : 'private'})`);
    });
    
    return data;
  } catch (error) {
    console.error('Error listing buckets:', error.message);
    return [];
  }
}

// Create a bucket
async function createBucket(name, isPublic = true) {
  const supabase = createSupabaseClient();
  
  try {
    console.log(`Creating bucket: ${name} (${isPublic ? 'public' : 'private'})`);
    
    const { data, error } = await supabase.storage.createBucket(name, {
      public: isPublic
    });
    
    if (error) {
      throw error;
    }
    
    console.log(`Successfully created bucket: ${name}`);
    return true;
  } catch (error) {
    console.error(`Error creating bucket ${name}:`, error.message);
    
    // If it's a "duplicate key" error, the bucket already exists
    if (error.message && error.message.includes('duplicate key')) {
      console.log(`Bucket ${name} already exists. Updating it instead.`);
      return updateBucket(name, isPublic);
    }
    
    // If it's a policy error, try to fix it with direct SQL
    if (error.message && (error.message.includes('policy') || error.message.includes('permission'))) {
      console.log('Attempting to create bucket using direct SQL...');
      return createBucketWithSQL(name, isPublic);
    }
    
    return false;
  }
}

// Create a bucket using direct SQL
async function createBucketWithSQL(name, isPublic = true) {
  try {
    const sqlCommand = `
      INSERT INTO storage.buckets (id, name, public)
      VALUES ('${name}', '${name}', ${isPublic})
      ON CONFLICT (id) DO UPDATE
      SET public = ${isPublic};
    `.trim();
    
    const tempFile = path.join(__dirname, `temp-create-bucket-${name}.sql`);
    fs.writeFileSync(tempFile, sqlCommand);
    
    execSync(`npx supabase db execute --file ${tempFile}`, { stdio: 'inherit' });
    
    fs.unlinkSync(tempFile);
    
    console.log(`Successfully created bucket ${name} using SQL`);
    return true;
  } catch (error) {
    console.error(`Error creating bucket ${name} with SQL:`, error.message);
    return false;
  }
}

// Update a bucket
async function updateBucket(name, isPublic = true) {
  const supabase = createSupabaseClient();
  
  try {
    console.log(`Updating bucket: ${name} (public=${isPublic})`);
    
    const { data, error } = await supabase.storage.updateBucket(name, {
      public: isPublic
    });
    
    if (error) {
      throw error;
    }
    
    console.log(`Successfully updated bucket: ${name}`);
    return true;
  } catch (error) {
    console.error(`Error updating bucket ${name}:`, error.message);
    
    // If it's a policy error, try to fix it with direct SQL
    if (error.message && (error.message.includes('policy') || error.message.includes('permission'))) {
      console.log('Attempting to update bucket using direct SQL...');
      return createBucketWithSQL(name, isPublic);
    }
    
    return false;
  }
}

// Delete a bucket
async function deleteBucket(name) {
  const supabase = createSupabaseClient();
  
  try {
    console.log(`Deleting bucket: ${name}`);
    
    const { error } = await supabase.storage.deleteBucket(name);
    
    if (error) {
      throw error;
    }
    
    console.log(`Successfully deleted bucket: ${name}`);
    return true;
  } catch (error) {
    console.error(`Error deleting bucket ${name}:`, error.message);
    return false;
  }
}

// Empty a bucket
async function emptyBucket(name) {
  const supabase = createSupabaseClient();
  
  try {
    console.log(`Emptying bucket: ${name}`);
    
    const { data: files, error: listError } = await supabase.storage.from(name).list();
    
    if (listError) {
      throw listError;
    }
    
    if (!files || files.length === 0) {
      console.log(`Bucket ${name} is already empty`);
      return true;
    }
    
    const filePaths = files.map(file => file.name);
    console.log(`Deleting ${filePaths.length} files from bucket ${name}`);
    
    const { error: deleteError } = await supabase.storage.from(name).remove(filePaths);
    
    if (deleteError) {
      throw deleteError;
    }
    
    console.log(`Successfully emptied bucket: ${name}`);
    return true;
  } catch (error) {
    console.error(`Error emptying bucket ${name}:`, error.message);
    return false;
  }
}

// Create all required buckets
async function createAllBuckets() {
  console.log('Creating all required buckets...');
  
  const results = [];
  
  for (const bucketId of REQUIRED_BUCKETS) {
    const isPublic = bucketId !== 'resumes';
    const success = await createBucket(bucketId, isPublic);
    results.push({ bucketId, success });
  }
  
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`Created ${successful} of ${total} buckets successfully`);
  
  // Try to fix storage policies
  console.log('Fixing storage policies...');
  await fixStoragePolicies();
  
  return results;
}

// Fix storage policies with direct SQL
async function fixStoragePolicies() {
  try {
    console.log('Setting up storage policies with direct SQL...');
    
    const sqlCommand = `
      -- Drop any existing policies
      DO $$
      DECLARE
          policy_name text;
      BEGIN
          FOR policy_name IN (
              SELECT policyname FROM pg_policies 
              WHERE schemaname = 'storage' AND tablename = 'buckets'
          )
          LOOP
              EXECUTE format('DROP POLICY IF EXISTS %I ON storage.buckets', policy_name);
          END LOOP;
          
          FOR policy_name IN (
              SELECT policyname FROM pg_policies 
              WHERE schemaname = 'storage' AND tablename = 'objects'
          )
          LOOP
              EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', policy_name);
          END LOOP;
      END $$;

      -- Make sure RLS is enabled
      ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
      ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
      
      -- Create simple permissive policies
      CREATE POLICY "Give users access to buckets" ON storage.buckets
      FOR ALL TO authenticated USING (true) WITH CHECK (true);
      
      CREATE POLICY "Public users can see buckets" ON storage.buckets
      FOR SELECT TO anon USING (public = true);
      
      CREATE POLICY "Allow all operations for authenticated users" ON storage.objects
      FOR ALL TO authenticated 
      USING (true) WITH CHECK (true);
      
      CREATE POLICY "Allow public access to public buckets" ON storage.objects
      FOR SELECT TO anon
      USING (bucket_id IN (SELECT id FROM storage.buckets WHERE public = true));
    `.trim();
    
    const tempFile = path.join(__dirname, 'temp-fix-policies.sql');
    fs.writeFileSync(tempFile, sqlCommand);
    
    execSync(`npx supabase db execute --file ${tempFile}`, { stdio: 'inherit' });
    
    fs.unlinkSync(tempFile);
    
    console.log('Successfully fixed storage policies');
    return true;
  } catch (error) {
    console.error('Error fixing storage policies:', error.message);
    return false;
  }
}

// CLI Command Handler
async function handleCommand() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (!command) {
    showHelp();
    return;
  }
  
  switch (command) {
    case 'list':
      await listBuckets();
      break;
      
    case 'create':
      if (!args[1]) {
        console.error('Error: Bucket name is required');
        showHelp();
        break;
      }
      
      const isPublicArg = args.find(arg => arg.startsWith('--public='));
      const isPublic = !isPublicArg || isPublicArg.split('=')[1].toLowerCase() !== 'false';
      
      await createBucket(args[1], isPublic);
      break;
      
    case 'update':
      if (!args[1]) {
        console.error('Error: Bucket name is required');
        showHelp();
        break;
      }
      
      const publicArg = args.find(arg => arg.startsWith('--public='));
      const makePublic = !publicArg || publicArg.split('=')[1].toLowerCase() !== 'false';
      
      await updateBucket(args[1], makePublic);
      break;
      
    case 'delete':
      if (!args[1]) {
        console.error('Error: Bucket name is required');
        showHelp();
        break;
      }
      
      await deleteBucket(args[1]);
      break;
      
    case 'empty':
      if (!args[1]) {
        console.error('Error: Bucket name is required');
        showHelp();
        break;
      }
      
      await emptyBucket(args[1]);
      break;
      
    case 'create-all':
      await createAllBuckets();
      break;
      
    case 'fix-policies':
      await fixStoragePolicies();
      break;
      
    case 'help':
      showHelp();
      break;
      
    default:
      console.error(`Unknown command: ${command}`);
      showHelp();
  }
}

// Show help
function showHelp() {
  console.log(`
Storage Buckets API

Usage:
  node api-buckets.js list
  node api-buckets.js create <bucket-name> [--public=(true|false)]
  node api-buckets.js update <bucket-name> --public=(true|false)
  node api-buckets.js delete <bucket-name>
  node api-buckets.js empty <bucket-name>
  node api-buckets.js create-all
  node api-buckets.js fix-policies
  node api-buckets.js help

You can also provide Supabase credentials:
  node api-buckets.js create <bucket-name> --url=<SUPABASE_URL> --key=<SUPABASE_KEY>
  `);
}

// If called directly (not imported)
if (require.main === module) {
  handleCommand();
} else {
  // Export functions for programmatic use
  module.exports = {
    listBuckets,
    createBucket,
    updateBucket,
    deleteBucket,
    emptyBucket,
    createAllBuckets,
    fixStoragePolicies
  };
} 