#!/usr/bin/env node

/**
 * Image Upload API
 * 
 * This script provides both CLI and programmatic access for managing images
 * in Supabase storage buckets.
 * 
 * Usage:
 *   node api-images.js list <bucket-name> [--folder=path/to/folder]
 *   node api-images.js upload <file-path> <bucket-name> [--folder=path/to/folder]
 *   node api-images.js delete <file-path> <bucket-name>
 *   node api-images.js download <file-path> <bucket-name> [--output=local/path]
 *   node api-images.js get-url <file-path> <bucket-name>
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Constants
const DEFAULT_BUCKET = 'site-assets';

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

// List files in a bucket
async function listFiles(bucketName = DEFAULT_BUCKET, folder = '') {
  const supabase = createSupabaseClient();
  
  try {
    console.log(`Listing files in bucket: ${bucketName}${folder ? `, folder: ${folder}` : ''}`);
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(folder);
    
    if (error) {
      throw error;
    }
    
    console.log(`Files in ${bucketName}${folder ? `/${folder}` : ''}:`);
    
    if (!data || data.length === 0) {
      console.log('  No files found');
      return [];
    }
    
    data.forEach((item, index) => {
      const icon = item.metadata ? '📄' : '📁';
      console.log(`  ${index + 1}. ${icon} ${item.name}${item.metadata ? ` (${formatSize(item.metadata.size)})` : ''}`);
    });
    
    return data;
  } catch (error) {
    console.error(`Error listing files in bucket ${bucketName}:`, error.message);
    return [];
  }
}

// Format file size
function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
}

// Upload a file
async function uploadFile(filePath, bucketName = DEFAULT_BUCKET, folder = '') {
  const supabase = createSupabaseClient();
  
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    const fileContent = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);
    const storagePath = folder ? `${folder}/${fileName}` : fileName;
    
    console.log(`Uploading file: ${fileName} to ${bucketName}/${storagePath}`);
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(storagePath, fileContent, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      throw error;
    }
    
    console.log(`Successfully uploaded file: ${fileName}`);
    console.log(`Storage path: ${data.path}`);
    
    // Get and display the public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);
    
    console.log(`Public URL: ${urlData.publicUrl}`);
    
    return data;
  } catch (error) {
    console.error(`Error uploading file to bucket ${bucketName}:`, error.message);
    return null;
  }
}

// Delete a file
async function deleteFile(filePath, bucketName = DEFAULT_BUCKET) {
  const supabase = createSupabaseClient();
  
  try {
    console.log(`Deleting file: ${filePath} from bucket: ${bucketName}`);
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);
    
    if (error) {
      throw error;
    }
    
    console.log(`Successfully deleted file: ${filePath}`);
    return data;
  } catch (error) {
    console.error(`Error deleting file from bucket ${bucketName}:`, error.message);
    return null;
  }
}

// Download a file
async function downloadFile(filePath, bucketName = DEFAULT_BUCKET, outputPath) {
  const supabase = createSupabaseClient();
  
  try {
    console.log(`Downloading file: ${filePath} from bucket: ${bucketName}`);
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .download(filePath);
    
    if (error) {
      throw error;
    }
    
    if (!data) {
      throw new Error('No data received from download');
    }
    
    // If no output path specified, use the filename from the path
    const finalOutputPath = outputPath || path.basename(filePath);
    
    // Convert Blob to Buffer and write to file
    const buffer = Buffer.from(await data.arrayBuffer());
    fs.writeFileSync(finalOutputPath, buffer);
    
    console.log(`Successfully downloaded file to: ${finalOutputPath}`);
    return { path: finalOutputPath, data };
  } catch (error) {
    console.error(`Error downloading file from bucket ${bucketName}:`, error.message);
    return null;
  }
}

// Get public URL for a file
async function getPublicUrl(filePath, bucketName = DEFAULT_BUCKET) {
  const supabase = createSupabaseClient();
  
  try {
    console.log(`Getting public URL for file: ${filePath} from bucket: ${bucketName}`);
    
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
    
    console.log(`Public URL: ${data.publicUrl}`);
    return data.publicUrl;
  } catch (error) {
    console.error(`Error getting public URL for file from bucket ${bucketName}:`, error.message);
    return null;
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
      const bucketForList = args[1] || DEFAULT_BUCKET;
      const folderArg = args.find(arg => arg.startsWith('--folder='));
      const folder = folderArg ? folderArg.split('=')[1] : '';
      
      await listFiles(bucketForList, folder);
      break;
      
    case 'upload':
      if (!args[1]) {
        console.error('Error: File path is required');
        showHelp();
        break;
      }
      
      const filePath = args[1];
      const bucketForUpload = args[2] || DEFAULT_BUCKET;
      const folderArgUpload = args.find(arg => arg.startsWith('--folder='));
      const folderForUpload = folderArgUpload ? folderArgUpload.split('=')[1] : '';
      
      await uploadFile(filePath, bucketForUpload, folderForUpload);
      break;
      
    case 'delete':
      if (!args[1]) {
        console.error('Error: File path is required');
        showHelp();
        break;
      }
      
      const filePathToDelete = args[1];
      const bucketForDelete = args[2] || DEFAULT_BUCKET;
      
      await deleteFile(filePathToDelete, bucketForDelete);
      break;
      
    case 'download':
      if (!args[1]) {
        console.error('Error: File path is required');
        showHelp();
        break;
      }
      
      const filePathToDownload = args[1];
      const bucketForDownload = args[2] || DEFAULT_BUCKET;
      const outputArg = args.find(arg => arg.startsWith('--output='));
      const outputPath = outputArg ? outputArg.split('=')[1] : null;
      
      await downloadFile(filePathToDownload, bucketForDownload, outputPath);
      break;
      
    case 'get-url':
      if (!args[1]) {
        console.error('Error: File path is required');
        showHelp();
        break;
      }
      
      const filePathForUrl = args[1];
      const bucketForUrl = args[2] || DEFAULT_BUCKET;
      
      await getPublicUrl(filePathForUrl, bucketForUrl);
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
Image Upload API

Usage:
  node api-images.js list <bucket-name> [--folder=path/to/folder]
  node api-images.js upload <file-path> <bucket-name> [--folder=path/to/folder]
  node api-images.js delete <file-path> <bucket-name>
  node api-images.js download <file-path> <bucket-name> [--output=local/path]
  node api-images.js get-url <file-path> <bucket-name>
  node api-images.js help

You can also provide Supabase credentials:
  node api-images.js <command> --url=<SUPABASE_URL> --key=<SUPABASE_KEY>

Default bucket: ${DEFAULT_BUCKET}
  `);
}

// If called directly (not imported)
if (require.main === module) {
  handleCommand();
} else {
  // Export functions for programmatic use
  module.exports = {
    listFiles,
    uploadFile,
    deleteFile,
    downloadFile,
    getPublicUrl
  };
} 