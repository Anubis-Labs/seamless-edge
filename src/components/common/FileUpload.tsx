import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { supabase } from '../../lib/supabaseClient';
import { toast } from 'react-toastify';
import { FaUpload } from 'react-icons/fa';
import { Box, CircularProgress, TextField, Typography } from '@mui/material';

interface Bucket {
  id: string;
  name: string;
  public: boolean;
}

interface FileUploadProps {
  bucketName?: string;
  onUploadComplete: (url: string) => void;
  acceptedFileTypes?: string;
  label?: string;
  allowUrlInput?: boolean;
  initialUrl?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  bucketName = 'site-assets', 
  onUploadComplete, 
  acceptedFileTypes = 'image/*',
  label = 'Upload File',
  allowUrlInput = true,
  initialUrl = ''
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState(initialUrl);
  const [bucketsExist, setBucketsExist] = useState<Record<string, boolean>>({});
  const [sessionChecked, setSessionChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const isLoggedIn = !!data.session;
        console.log("Authentication status:", isLoggedIn ? "Logged in" : "Not logged in");
        setIsAuthenticated(isLoggedIn);
        setSessionChecked(true);
      } catch (err) {
        console.error("Error checking authentication:", err);
        setSessionChecked(true);
      }
    };
    
    checkAuth();
  }, []);

  // Check if buckets exist on component mount
  useEffect(() => {
    const checkBuckets = async () => {
      if (!sessionChecked) return;
      
      try {
        console.log("Checking storage buckets...");
        const { data: buckets, error } = await supabase.storage.listBuckets();
        
        if (error) {
          console.error("Error listing buckets:", error);
          return;
        }
        
        if (!buckets || buckets.length === 0) {
          console.log("No storage buckets found!");
          return;
        }
        
        console.log("Available buckets:", buckets.map((b: Bucket) => b.id));
        
        const bucketMap: Record<string, boolean> = {};
        buckets.forEach((bucket: Bucket) => {
          bucketMap[bucket.id] = true;
        });
        
        setBucketsExist(bucketMap);
      } catch (err) {
        console.error("Error checking buckets:", err);
      }
    };
    
    checkBuckets();
  }, [sessionChecked]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to upload files');
      }
      
      console.log(`Attempting to upload file to bucket: ${bucketName}`);
      
      // Check if bucket exists before uploading
      if (!bucketsExist[bucketName]) {
        throw new Error(`The storage bucket "${bucketName}" does not exist`);
      }
      
      // Create a unique file path using timestamp and original filename
      const filePath = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      
      // Log the current auth state to debug
      const { data: sessionData } = await supabase.auth.getSession();
      console.log("Auth state before upload:", sessionData.session ? "Authenticated" : "Not authenticated");
      
      // Use direct Supabase client instead of service
      const { data, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw uploadError;
      }
      
      if (!data) {
        throw new Error('No data returned from upload');
      }
      
      console.log("Upload successful, path:", data.path);
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path);
      
      console.log("Public URL generated:", urlData.publicUrl);
      
      onUploadComplete(urlData.publicUrl);
      toast.success('File uploaded successfully');
    } catch (err: any) {
      console.error('Upload error:', err);
      
      let errorMessage = 'Error uploading file';
      
      // Check for specific error messages
      if (err.message?.includes('permission denied') || err.message?.includes('row-level security policy')) {
        errorMessage = 'Permission denied: Please check that you have access to upload files';
        console.error('This is likely an RLS policy issue or an authentication problem');
      } else if (err.message?.includes('network')) {
        errorMessage = 'Network error: Please check your internet connection';
      } else if (err.message) {
        errorMessage = `Error: ${err.message}`;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (!urlInput || urlInput.trim() === '') {
      setError('Please enter a valid URL');
      return;
    }
    
    // Simple validation to check if it's a URL
    if (!urlInput.startsWith('http')) {
      setError('Please enter a valid URL starting with http:// or https://');
      return;
    }
    
    onUploadComplete(urlInput);
    toast.success('URL added successfully');
    setError(null);
  };
  
  return (
    <Box sx={{ 
      padding: 2, 
      border: '1px dashed #ccc', 
      borderRadius: 1,
      marginBottom: 2,
      backgroundColor: '#f9f9f9'
    }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="contained"
            component="label"
            disabled={uploading || !isAuthenticated}
            startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <FaUpload />}
            sx={{ minWidth: '150px' }}
          >
            {uploading ? 'Uploading...' : label}
            <input
              type="file"
              accept={acceptedFileTypes}
              hidden
              onChange={handleFileChange}
            />
          </Button>
          
          {!isAuthenticated && (
            <Typography color="error" variant="caption">
              You must be logged in to upload files
            </Typography>
          )}
        </Box>
        
        {allowUrlInput && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <TextField
              label="Or enter image URL"
              value={urlInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrlInput(e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
            />
            <Button 
              variant="outlined" 
              onClick={handleUrlSubmit}
              disabled={!urlInput.trim()}
            >
              Use URL
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default FileUpload; 