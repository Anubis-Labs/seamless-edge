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
      // Enable RLS on projects table if not already enabled
      console.log('Checking RLS on projects table...');
      await client.query(`
        ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
      `);
      
      // Create an admin policy to allow all operations on projects
      console.log('Adding admin policy for projects...');
      try {
        await client.query(`
          CREATE POLICY "Allow authenticated users full access to projects" 
          ON public.projects
          FOR ALL 
          TO authenticated 
          USING (true)
          WITH CHECK (true);
        `);
        console.log('Added admin policy for projects');
      } catch (err) {
        if (err.message.includes('already exists')) {
          console.log('Admin policy for projects already exists');
        } else {
          console.error('Error adding admin policy for projects:', err.message);
        }
      }
      
      // Create an anon policy for select only
      console.log('Adding anon policy for projects...');
      try {
        await client.query(`
          CREATE POLICY "Allow public read access to projects" 
          ON public.projects
          FOR SELECT 
          TO anon 
          USING (true);
        `);
        console.log('Added anon select policy for projects');
      } catch (err) {
        if (err.message.includes('already exists')) {
          console.log('Anon select policy for projects already exists');
        } else {
          console.error('Error adding anon select policy for projects:', err.message);
        }
      }
      
      // Check if 'image' field exists in projects
      console.log('Checking for image field in projects...');
      const { rows } = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'projects'
        AND column_name = 'image';
      `);
      
      // Add 'image' field if it doesn't exist
      if (rows.length === 0) {
        console.log('Adding image field to projects table...');
        await client.query(`
          ALTER TABLE public.projects 
          ADD COLUMN IF NOT EXISTS image TEXT;
        `);
        console.log('Added image field to projects table');
      } else {
        console.log('Image field already exists in projects table');
      }
      
      console.log('All policies and fields have been configured');
    } finally {
      client.release();
      await pool.end();
    }
  } catch (err) {
    console.error('Connection error:', err);
  }
}

executeSQL(); 