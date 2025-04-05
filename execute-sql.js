const fs = require('fs');
const { Pool } = require('pg');

// Read the SQL file
const sqlFilePath = './src/sql/apply-all-fixes.sql';
const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

// Split SQL into individual statements
function splitSqlStatements(sql) {
  // Remove comments and split by semicolons
  const statements = [];
  let currentStatement = '';
  let inComment = false;
  let inMultilineComment = false;
  
  const lines = sql.split('\n');
  for (const line of lines) {
    let processedLine = line;
    
    // Skip comment lines
    if (line.trim().startsWith('--')) {
      continue;
    }
    
    // Handle multiline comments
    if (inMultilineComment) {
      const endIndex = line.indexOf('*/');
      if (endIndex !== -1) {
        processedLine = line.substring(endIndex + 2);
        inMultilineComment = false;
      } else {
        continue;
      }
    }
    
    const startCommentIndex = processedLine.indexOf('/*');
    if (startCommentIndex !== -1) {
      const endCommentIndex = processedLine.indexOf('*/', startCommentIndex);
      if (endCommentIndex !== -1) {
        processedLine = 
          processedLine.substring(0, startCommentIndex) + 
          processedLine.substring(endCommentIndex + 2);
      } else {
        processedLine = processedLine.substring(0, startCommentIndex);
        inMultilineComment = true;
      }
    }
    
    if (processedLine.trim()) {
      currentStatement += processedLine + '\n';
    }
    
    // If statement ends with semicolon, add it to the list
    if (processedLine.trim().endsWith(';')) {
      if (currentStatement.trim()) {
        statements.push(currentStatement);
        currentStatement = '';
      }
    }
  }
  
  // Add the last statement if it exists
  if (currentStatement.trim()) {
    statements.push(currentStatement);
  }
  
  return statements;
}

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
      // Split SQL into statements
      const statements = splitSqlStatements(sqlContent);
      console.log(`Found ${statements.length} SQL statements to execute`);
      
      // Execute each statement
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        if (!statement.trim()) continue;
        
        try {
          console.log(`Executing statement ${i+1}/${statements.length}...`);
          await client.query(statement);
          console.log(`Statement ${i+1} executed successfully`);
        } catch (err) {
          console.error(`Error executing statement ${i+1}:`, err.message);
          console.log('Continuing to next statement...');
        }
      }
      
      console.log('SQL execution completed!');
    } finally {
      client.release();
      await pool.end();
    }
  } catch (err) {
    console.error('Connection error:', err);
  }
}

executeSQL(); 