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
      
      // Create policy for inserting job applications
      console.log('Adding insert policy for job_applications...');
      try {
        await client.query(`
          CREATE POLICY "Anyone can create a job application"
          ON public.job_applications
          FOR INSERT
          TO public
          WITH CHECK (true);
        `);
        console.log('Added insert policy for job_applications');
      } catch (err) {
        if (err.message.includes('already exists')) {
          console.log('Insert policy for job_applications already exists');
        } else {
          console.error('Error adding insert policy for job_applications:', err.message);
        }
      }
      
      // Create policy for viewing job applications
      console.log('Adding select policy for job_applications...');
      try {
        await client.query(`
          CREATE POLICY "Only authenticated users can view job applications"
          ON public.job_applications
          FOR SELECT
          TO authenticated
          USING (true);
        `);
        console.log('Added select policy for job_applications');
      } catch (err) {
        if (err.message.includes('already exists')) {
          console.log('Select policy for job_applications already exists');
        } else {
          console.error('Error adding select policy for job_applications:', err.message);
        }
      }
      
      // Create policy for updating job applications
      console.log('Adding update policy for job_applications...');
      try {
        await client.query(`
          CREATE POLICY "Only authenticated users can update job applications"
          ON public.job_applications
          FOR UPDATE
          TO authenticated
          USING (true);
        `);
        console.log('Added update policy for job_applications');
      } catch (err) {
        if (err.message.includes('already exists')) {
          console.log('Update policy for job_applications already exists');
        } else {
          console.error('Error adding update policy for job_applications:', err.message);
        }
      }
      
      // Create policy for deleting job applications
      console.log('Adding delete policy for job_applications...');
      try {
        await client.query(`
          CREATE POLICY "Only authenticated users can delete job applications"
          ON public.job_applications
          FOR DELETE
          TO authenticated
          USING (true);
        `);
        console.log('Added delete policy for job_applications');
      } catch (err) {
        if (err.message.includes('already exists')) {
          console.log('Delete policy for job_applications already exists');
        } else {
          console.error('Error adding delete policy for job_applications:', err.message);
        }
      }
      
      console.log('All job application policies have been set up');
    } finally {
      client.release();
      await pool.end();
    }
  } catch (err) {
    console.error('Connection error:', err);
  }
}

executeSQL(); 