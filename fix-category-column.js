// First get the Supabase client from your app
// (run this in the browser console while on your admin page)

async function fixCategoryColumn() {
  try {
    // Check if we can access the window.supabase instance
    if (!window.supabase) {
      console.error('Supabase client not found in window object. Make sure you are on a page that initializes the Supabase client.');
      return;
    }
    
    console.log('Starting category column fix...');
    
    // First try to execute the SQL directly using RPC
    try {
      // Try using RPC to run SQL (requires an RPC function to be set up)
      const { data: rpcData, error: rpcError } = await window.supabase.rpc('run_sql', {
        sql_query: `
          ALTER TABLE public.services ADD COLUMN IF NOT EXISTS category TEXT;
          UPDATE public.services SET category = 'General' WHERE category IS NULL;
          CREATE INDEX IF NOT EXISTS idx_services_category ON public.services(category);
        `
      });
      
      if (!rpcError) {
        console.log('Successfully added category column via RPC!', rpcData);
        return;
      } else {
        console.warn('Could not use RPC to fix column, falling back to other methods...', rpcError);
      }
    } catch (rpcTryError) {
      console.warn('RPC method not available:', rpcTryError.message);
    }
    
    // Fallback: Try to update each service with a category
    const { data: services, error: getError } = await window.supabase
      .from('services')
      .select('id, name');
    
    if (getError) {
      console.error('Error getting services:', getError);
      return;
    }
    
    console.log('Got services:', services.length);
    
    // Now let's try to update each service with a category field
    let successCount = 0;
    for (const service of services) {
      const { error: updateError } = await window.supabase
        .from('services')
        .update({ category: 'General' })
        .eq('id', service.id);
      
      if (!updateError) {
        successCount++;
      } else {
        console.warn(`Error updating service ${service.id}:`, updateError);
      }
    }
    
    console.log(`Updates completed. Successfully updated ${successCount} of ${services.length} services.`);
    
    if (successCount > 0) {
      console.log('The category column should now exist on the services table.');
      console.log('Try refreshing the page and adding/editing services again.');
    } else {
      console.error('Could not update any services. You may need an admin to fix this in the database.');
    }
    
  } catch (e) {
    console.error('Error fixing category column:', e);
  }
}

// Run the function
fixCategoryColumn().then(() => {
  console.log('Fix attempt completed.');
}); 