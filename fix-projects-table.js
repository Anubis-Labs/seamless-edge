const { Pool } = require('pg');

// Connect to Postgres
async function executeSQL() {
  // Connection info
  const connectionString = `postgresql://postgres.abydznvlrzlcukrhxgqv:U&kTE6hiB+P*Zek@aws-0-ca-central-1.pooler.supabase.com:6543/postgres`;
  
  try {
    console.log('Connecting to Postgres...');
    const pool = new Pool({
      connectionString: connectionString,
      ssl: { rejectUnauthorized: false } // Required for Supabase
    });
    
    console.log('Executing SQL...');
    const client = await pool.connect();
    
    try {
      // 1. Add missing image columns to projects table
      console.log('Adding columns to projects table...');
      await client.query(`
        ALTER TABLE public.projects
        ADD COLUMN IF NOT EXISTS before_image TEXT,
        ADD COLUMN IF NOT EXISTS after_image TEXT,
        ADD COLUMN IF NOT EXISTS comparison_images JSONB DEFAULT '[]';
      `);
      console.log('Project table updated successfully');
      
      // 2. Ensure job_applications table exists
      console.log('Creating job_applications table if not exists...');
      await client.query(`
        CREATE TABLE IF NOT EXISTS public.job_applications (
          id SERIAL PRIMARY KEY,
          full_name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT NOT NULL,
          position TEXT,
          message TEXT,
          resume_url TEXT,
          job_id INTEGER REFERENCES public.jobs(id) ON DELETE SET NULL,
          status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'interviewed', 'accepted', 'rejected')),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
      `);
      console.log('Job applications table created/verified');
      
      // 3. Create storage buckets if they don't exist
      console.log('Creating storage buckets...');
      
      try {
        await client.query(`
          INSERT INTO storage.buckets (id, name, public)
          VALUES ('gallery-images', 'gallery-images', true)
          ON CONFLICT (id) DO UPDATE
          SET public = true;
        `);
        console.log('Gallery images bucket created/updated');
      } catch (err) {
        console.error('Error with gallery-images bucket:', err.message);
      }
      
      try {
        await client.query(`
          INSERT INTO storage.buckets (id, name, public)
          VALUES ('resumes', 'resumes', false)
          ON CONFLICT (id) DO UPDATE
          SET public = false;
        `);
        console.log('Resumes bucket created/updated');
      } catch (err) {
        console.error('Error with resumes bucket:', err.message);
      }
      
      console.log('Database structure update completed!');
    } finally {
      client.release();
      await pool.end();
    }
  } catch (err) {
    console.error('Connection error:', err);
  }
}

executeSQL(); 