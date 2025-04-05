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
      // Enable RLS on job_applications table
      console.log('Enabling RLS on job_applications table...');
      await client.query(`
        ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
      `);
      
      // Set up storage bucket policies one by one
      console.log('Setting up storage bucket policies...');
      
      // 1. Gallery Images - Public Read Access
      try {
        await client.query(`
          CREATE POLICY "Gallery Images Public Read Access"
          ON storage.objects
          FOR SELECT
          TO public
          USING (bucket_id = 'gallery-images');
        `);
        console.log('Created gallery images public read policy');
      } catch (err) {
        if (err.message.includes('already exists')) {
          console.log('Gallery images public read policy already exists');
        } else {
          console.error('Error creating gallery images public read policy:', err.message);
        }
      }
      
      // 2. Gallery Images - Authenticated Users Upload
      try {
        await client.query(`
          CREATE POLICY "Authenticated Users Can Upload Gallery Images"
          ON storage.objects
          FOR INSERT
          TO authenticated
          WITH CHECK (bucket_id = 'gallery-images');
        `);
        console.log('Created gallery images upload policy');
      } catch (err) {
        if (err.message.includes('already exists')) {
          console.log('Gallery images upload policy already exists');
        } else {
          console.error('Error creating gallery images upload policy:', err.message);
        }
      }
      
      // 3. Gallery Images - Authenticated Users Update
      try {
        await client.query(`
          CREATE POLICY "Authenticated Users Can Update Gallery Images"
          ON storage.objects
          FOR UPDATE
          TO authenticated
          USING (bucket_id = 'gallery-images');
        `);
        console.log('Created gallery images update policy');
      } catch (err) {
        if (err.message.includes('already exists')) {
          console.log('Gallery images update policy already exists');
        } else {
          console.error('Error creating gallery images update policy:', err.message);
        }
      }
      
      // 4. Gallery Images - Authenticated Users Delete
      try {
        await client.query(`
          CREATE POLICY "Authenticated Users Can Delete Gallery Images"
          ON storage.objects
          FOR DELETE
          TO authenticated
          USING (bucket_id = 'gallery-images');
        `);
        console.log('Created gallery images delete policy');
      } catch (err) {
        if (err.message.includes('already exists')) {
          console.log('Gallery images delete policy already exists');
        } else {
          console.error('Error creating gallery images delete policy:', err.message);
        }
      }
      
      // 5. Resumes - Authenticated Users View
      try {
        await client.query(`
          CREATE POLICY "Only Authenticated Users Can View Resumes"
          ON storage.objects
          FOR SELECT
          TO authenticated
          USING (bucket_id = 'resumes');
        `);
        console.log('Created resumes view policy');
      } catch (err) {
        if (err.message.includes('already exists')) {
          console.log('Resumes view policy already exists');
        } else {
          console.error('Error creating resumes view policy:', err.message);
        }
      }
      
      // 6. Resumes - Public Upload
      try {
        await client.query(`
          CREATE POLICY "Anyone Can Upload Resumes"
          ON storage.objects
          FOR INSERT
          TO public
          WITH CHECK (bucket_id = 'resumes');
        `);
        console.log('Created resumes upload policy');
      } catch (err) {
        if (err.message.includes('already exists')) {
          console.log('Resumes upload policy already exists');
        } else {
          console.error('Error creating resumes upload policy:', err.message);
        }
      }
      
      // 7. Job Applications - Public Insert
      try {
        await client.query(`
          CREATE POLICY "Anyone can create a job application"
          ON public.job_applications
          FOR INSERT
          TO public
          WITH CHECK (true);
        `);
        console.log('Created job applications insert policy');
      } catch (err) {
        if (err.message.includes('already exists')) {
          console.log('Job applications insert policy already exists');
        } else {
          console.error('Error creating job applications insert policy:', err.message);
        }
      }
      
      // 8. Job Applications - Authenticated Select/Update/Delete
      try {
        await client.query(`
          CREATE POLICY "Only authenticated users can view job applications"
          ON public.job_applications
          FOR SELECT
          TO authenticated
          USING (true);
        `);
        console.log('Created job applications select policy');
      } catch (err) {
        if (err.message.includes('already exists')) {
          console.log('Job applications select policy already exists');
        } else {
          console.error('Error creating job applications select policy:', err.message);
        }
      }
      
      console.log('Storage policies setup completed!');
    } finally {
      client.release();
      await pool.end();
    }
  } catch (err) {
    console.error('Connection error:', err);
  }
}

executeSQL(); 