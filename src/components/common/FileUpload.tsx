import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@mui/material';

interface FileUploadProps {
  bucketName: string;
  onUploadComplete: (url: string) => void;
  acceptedFileTypes?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ bucketName, onUploadComplete, acceptedFileTypes }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    // Create a unique file path using timestamp and original filename
    const filePath = `${Date.now()}_${file.name}`;

    const { data, error } = await supabase.storage.from(bucketName).upload(filePath, file);

    if (error) {
      setError(error.message);
      setUploading(false);
      return;
    }

    // Get the public URL
    const { publicURL } = supabase.storage.from(bucketName).getPublicUrl(data.path);
    onUploadComplete(publicURL);
    setUploading(false);
  };

  return (
    <div>
      <input 
        type="file" 
        accept={acceptedFileTypes} 
        onChange={handleFileChange} 
        style={{ display: 'none' }} 
        id="file-upload-input"
      />
      <label htmlFor="file-upload-input">
        <Button variant="outlined" component="span" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload File'}
        </Button>
      </label>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default FileUpload; 