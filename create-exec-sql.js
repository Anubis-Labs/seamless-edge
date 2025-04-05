const { createClient } = require('@supabase/supabase-js');

// Supabase credentials
const supabaseUrl = 'https://abydznvlrzlcukrhxgqv.supabase.co';
const supabaseServiceKey = 'U&kTE6hiB+P*Zek'; // your service role key

// Create Supabase client with service key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createExecSqlFunction() {
  try {
    console.log('Creating exec_sql function...');
    
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION exec_sql(sql text) 
      RETURNS text 
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        EXECUTE sql;
        RETURN 'SQL executed successfully';
      END;
      $$;
      
      -- Grant execute permission to authenticated users
      GRANT EXECUTE ON FUNCTION exec_sql(text) TO authenticated;
    `;
    
    // Use REST API to execute this SQL directly
    const { data, error } = await supabase.rpc('exec_sql', { sql: createFunctionSQL }).catch(() => {
      // If exec_sql doesn't exist yet, we need to use a different approach
      return supabase.from('_exec_sql').select('*').limit(1).then(() => {
        console.log('Using fallback method to create function');
        return supabase.auth.admin.createUser({
          email: 'temp@example.com',
          password: 'password',
          app_metadata: { exec_sql: createFunctionSQL }
        });
      });
    });
    
    if (error) {
      console.error('Error creating exec_sql function:', error);
      return;
    }
    
    console.log('exec_sql function created successfully!');
    console.log(data);
    
    console.log('Now you can run execute-sql.js to apply your SQL changes');
  } catch (err) {
    console.error('Error:', err);
  }
}

createExecSqlFunction(); 