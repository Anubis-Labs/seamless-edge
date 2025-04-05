import { createClient } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient'; // Adjust path if needed

// --- Individual Service Implementations ---

// Blog posts service (Table: blog_posts)
export const blogService = {
  getPosts: async (filters: Record<string, any> = {}) => {
    let query = supabase.from('blog_posts').select('*');
    
    // Apply filters if provided
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    
    // Update sorting to use published_at
    query = query.order('published_at', { ascending: false });
    
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },
  
  getPublishedPosts: async (limit?: number) => {
    let query = supabase.from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },
  
  getFeaturedPosts: async (limit?: number) => {
    // Since "featured" doesn't exist, let's get most recent published posts instead
    let query = supabase.from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },
  
  getPostById: async (id: number) => {
    const { data, error } = await supabase.from('blog_posts').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  
  getPostBySlug: async (slug: string) => {
    const { data, error } = await supabase.from('blog_posts').select('*').eq('slug', slug).single();
    if (error) throw error;
    return data;
  },
  
  createPost: async (postData: any) => {
    // Ensure updated_at is set for new posts
    const dataToSave = {
      ...postData,
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase.from('blog_posts').insert(dataToSave).select();
    if (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
    return data[0];
  },
  
  updatePost: async (id: number, postData: any) => {
    // Ensure updated_at is refreshed
    const dataToSave = {
      ...postData,
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase.from('blog_posts').update(dataToSave).eq('id', id).select();
    if (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }
    return data[0];
  },
  
  deletePost: async (id: number) => {
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) {
      console.error('Error deleting blog post:', error);
      throw error;
    }
    return { success: true };
  },
  
  publishPost: async (id: number) => {
    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        status: 'published',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  unpublishPost: async (id: number) => {
    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        status: 'draft',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  }
};

// Gallery/projects service (Table: projects)
export const galleryService = {
  getProjects: async (filters: Record<string, any> = {}) => {
    let query = supabase.from('projects').select('*');
    // Add filtering/sorting as needed
    query = query.order('end_date', { ascending: false });
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },
  getProjectById: async (id: number) => {
    const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  createProject: async (projectData: any) => {
    try {
      // Sanitize project data
      const cleanData = { ...projectData };
      
      // Ensure comparison_images is valid JSON if it exists
      if (cleanData.comparison_images) {
        if (typeof cleanData.comparison_images !== 'string') {
          cleanData.comparison_images = JSON.stringify(cleanData.comparison_images);
        }
      }
      
      const { data, error } = await supabase.from('projects').insert(cleanData).select();
      if (error) throw error;
      return data[0];
    } catch (err) {
      console.error("Error creating project:", err);
      throw err;
    }
  },
  updateProject: async (id: number, projectData: any) => {
    try {
      // Sanitize project data
      const cleanData = { ...projectData };
      
      // Ensure comparison_images is valid JSON if it exists
      if (cleanData.comparison_images) {
        if (typeof cleanData.comparison_images !== 'string') {
          cleanData.comparison_images = JSON.stringify(cleanData.comparison_images);
        }
      }
      
      const { data, error } = await supabase.from('projects').update(cleanData).eq('id', id).select();
      if (error) throw error;
      return data[0];
    } catch (err) {
      console.error("Error updating project:", err);
      throw err;
    }
  },
  deleteProject: async (id: number) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  }
};

// Testimonials service (Table: testimonials)
export const testimonialService = {
  getTestimonials: async (filters: Record<string, any> = {}) => {
    let query = supabase.from('testimonials').select('*');
     // Add filtering/sorting as needed, e.g., based on status (not approved)
    query = query.order('created_at', { ascending: false });
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },
   getTestimonialById: async (id: number) => {
    const { data, error } = await supabase.from('testimonials').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  createTestimonial: async (testimonialData: any) => {
    const { data, error } = await supabase.from('testimonials').insert(testimonialData).select(); // Use status not approved
    if (error) throw error;
    return data[0];
  },
  updateTestimonial: async (id: number, testimonialData: any) => {
    const { data, error } = await supabase.from('testimonials').update(testimonialData).eq('id', id).select();
    if (error) throw error;
    return data[0];
  },
  approveTestimonial: async (id: number) => { // Example specific action
    const { data, error } = await supabase.from('testimonials').update({ status: 'approved' }).eq('id', id).select();
    if (error) throw error;
    return data[0];
  },
  deleteTestimonial: async (id: number) => {
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  }
};

// Messages/Contact service (Table: messages)
export const messageService = {
  getMessages: async (filters: Record<string, any> = {}) => {
    let query = supabase.from('messages').select('*');
    // Add filtering/sorting as needed, e.g., based on read status
    query = query.order('created_at', { ascending: false });
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },
  getMessageById: async (id: number) => {
    const { data, error } = await supabase.from('messages').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  markAsRead: async (id: number) => {
    const { data, error } = await supabase.from('messages').update({ read: true }).eq('id', id).select();
    if (error) throw error;
    return data[0]; // Return the updated message
  },
  updateMessage: async (id: number, updateData: Partial<any>) => { // Using Partial<any> for flexibility, define Message type if available
    const { data, error } = await supabase
      .from('messages')
      .update(updateData)
      .eq('id', id)
      .select(); // Select the updated record(s)
    if (error) throw error;
    return data ? data[0] : null; // Return the first updated record or null
  },
  deleteMessage: async (id: number) => {
    const { error } = await supabase.from('messages').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  }
};

// Services service (Assuming Table: services)
export const servicesService = {
  getServices: async () => {
    const { data, error } = await supabase.from('services').select('*').order('name', { ascending: true });
    if (error) throw error;
    return data || [];
  },
  getServiceById: async (id: number) => {
    const { data, error } = await supabase.from('services').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  createService: async (serviceData: any) => {
    // Ensure both image fields are set if either is provided
    const preparedData = { ...serviceData };
    if (preparedData.image && !preparedData.image_url) {
      preparedData.image_url = preparedData.image;
    } else if (preparedData.image_url && !preparedData.image) {
      preparedData.image = preparedData.image_url;
    }
    
    // Filter out category field if it's not accepted by the database
    // This is a temporary fix until the database schema is updated
    const { category, ...safeData } = preparedData;
    
    try {
      // First try with category (preferred if the column exists)
      const { data, error } = await supabase.from('services').insert(preparedData).select();
      if (error && error.message && error.message.includes("column of 'services'")) {
        // If error mentions column not found, try without category
        const { data: fallbackData, error: fallbackError } = await supabase.from('services').insert(safeData).select();
        if (fallbackError) throw fallbackError;
        return fallbackData[0];
      }
      if (error) throw error;
      return data[0];
    } catch (err) {
      console.error("Service creation error:", err);
      throw err;
    }
  },
  updateService: async (id: number, serviceData: any) => {
    // Remove the image_url sync logic
    const preparedData = { ...serviceData };
    
    // Filter out category field if it's not accepted by the database
    // This is a temporary fix until the database schema is updated
    const { category, ...safeData } = preparedData;
    
    try {
      // First try with category (preferred if the column exists)
      const { data, error } = await supabase.from('services').update(preparedData).eq('id', id).select();
      if (error && error.message && error.message.includes("column of 'services'")) {
        // If error mentions column not found, try without category
        const { data: fallbackData, error: fallbackError } = await supabase.from('services').update(safeData).eq('id', id).select();
        if (fallbackError) throw fallbackError;
        return fallbackData[0];
      }
      if (error) throw error;
      return data[0];
    } catch (err) {
      console.error("Service update error:", err);
      throw err;
    }
  },
  deleteService: async (id: number) => {
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  }
};

// Jobs service (Assuming Table: jobs - adapt schema as needed)
export const jobsService = {
  getJobs: async () => {
    // Assuming a 'jobs' table exists
    const { data, error } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  getJobById: async (id: number) => {
    const { data, error } = await supabase.from('jobs').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  createJob: async (jobData: any) => {
    const { data, error } = await supabase.from('jobs').insert(jobData).select();
    if (error) throw error;
    return data[0];
  },
  updateJob: async (id: number, jobData: any) => {
    const { data, error } = await supabase.from('jobs').update(jobData).eq('id', id).select();
    if (error) throw error;
    return data[0];
  },
  deleteJob: async (id: number) => {
    const { error } = await supabase.from('jobs').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  }
};

// Bookings service (Implementation from admin-setup.md - already added)
export const bookingService = {
  // ... existing booking service functions ...
  getBookings: async (filters: Record<string, any> = {}) => {
    let query = supabase.from('bookings').select(`
      *, 
      clients(id, first_name, last_name, email, phone)
    `);

    if (filters.startDate) {
      query = query.gte('date', filters.startDate);
    }
    if (filters.endDate) {
      query = query.lte('date', filters.endDate);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.serviceType) {
      query = query.eq('service_type', filters.serviceType);
    }

    const { data, error } = await query.order('date', { ascending: true });

    if (error) throw error;
    return data || []; // Ensure array return
  },

  getBookingById: async (id: number) => {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        clients(id, first_name, last_name, email, phone)
      `)
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  createBooking: async (bookingData: any) => {
    const { data, error } = await supabase
      .from('bookings')
      .insert(bookingData)
      .select();

    if (error) throw error;
    return data[0];
  },

  updateBooking: async (id: number, bookingData: any) => {
    const { data, error } = await supabase
      .from('bookings')
      .update(bookingData)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  },

  deleteBooking: async (id: number) => {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  },

  sendReminder: async (bookingId: number) => {
    console.warn("Supabase Edge Function call for 'send-booking-reminder' not implemented.");
    return { success: true }; // Placeholder
  }
};


// Client Management Service (Implementation from admin-setup.md - already added)
export const clientService = {
  // ... existing client service functions ...
   getClients: async (filters: Record<string, any> = {}) => {
    let query = supabase.from('clients').select('*');

    // Apply filters
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.city) {
      query = query.eq('city', filters.city);
    }
    if (filters.search) {
      query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    }

    const { data, error } = await query
      .order('last_name', { ascending: true });

    if (error) throw error;
    return data || []; // Ensure array return
  },

  getClientById: async (clientId: number) => { // Get simple client data
     const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .single();
    if (error) throw error;
    return data;
  },

  getClientWithDetails: async (clientId: number) => {
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .single();

    if (clientError) throw clientError;

    // Get related data, handle potential errors gracefully
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .eq('client_id', clientId);

    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('*')
      .eq('client_id', clientId);

    if (projectsError) console.error("Error fetching client projects:", projectsError.message);
    if (bookingsError) console.error("Error fetching client bookings:", bookingsError.message);

    return {
      ...client,
      projects: projects || [],
      bookings: bookings || []
    };
  },

  createClient: async (clientData: any) => {
    const { data, error } = await supabase
      .from('clients')
      .insert(clientData)
      .select();

    if (error) throw error;
    return data[0];
  },

  updateClient: async (id: number, clientData: any) => {
    const { data, error } = await supabase
      .from('clients')
      .update(clientData)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  },

  deleteClient: async (id: number) => {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  },

  sendClientEmail: async (clientId: number, emailData: any) => {
    console.warn("Supabase Edge Function call for 'send-client-email' not implemented.");
    return { success: true }; // Placeholder
  }
};

// Settings Service (Table: settings)
// Assuming a simple key-value store per section
export const settingsService = {
  getSettings: async (section: string | null = null) => {
    let query = supabase.from('settings').select('*');
    if (section) {
      query = query.eq('section', section);
    }
    const { data, error } = await query;
    if (error) throw error;

    const settings: Record<string, Record<string, any>> = {};
    (data || []).forEach((item: any) => {
      if (!settings[item.section]) {
        settings[item.section] = {};
      }
      try {
        // Attempt to parse JSON, otherwise keep as string
        settings[item.section][item.key] = JSON.parse(item.value);
      } catch (e) {
        settings[item.section][item.key] = item.value;
      }
    });
    return settings;
  },

  // Gets settings for a specific section as a flat object
  getSectionSettings: async (section: string): Promise<Record<string, any>> => {
    const { data, error } = await supabase
      .from('settings')
      .select('key, value')
      .eq('section', section);
    if (error) throw error;
    
    const sectionSettings: Record<string, any> = {};
    (data || []).forEach((item: any) => {
         try {
            sectionSettings[item.key] = JSON.parse(item.value);
         } catch(e) {
            sectionSettings[item.key] = item.value;
         }
    });
    return sectionSettings;
  },

  updateSettings: async (section: string, settingsToUpdate: Record<string, any>) => {
    const updates = Object.entries(settingsToUpdate).map(([key, value]) => ({
      section,
      key,
      value: typeof value === 'object' ? JSON.stringify(value) : String(value) // Store as string
    }));

    const { error } = await supabase
      .from('settings')
      .upsert(updates, { onConflict: 'section,key' });

    if (error) {
        console.error("Error updating settings:", error);
        throw error;
    }
    return { success: true };
  }
};

// --- Storage Service --- 
const DEFAULT_BUCKET = 'site-assets'; // Assuming a bucket for general site assets

export const storageService = {
  /**
   * Uploads a file to Supabase Storage.
   * @param file The file object to upload.
   * @param bucketName The name of the bucket (defaults to DEFAULT_BUCKET).
   * @param filePath Optional file path including filename within the bucket.
   * @param options Optional upload options (e.g., { upsert: true }).
   * @returns The path of the uploaded file within the bucket.
   */
  uploadFile: async (
    file: File,
    bucketName: string = DEFAULT_BUCKET,
    filePath?: string,
    options: { upsert?: boolean } = { upsert: false } 
  ): Promise<string> => {
    // We'll skip the session check and let Supabase handle auth errors directly
    // This prevents users from being logged out unnecessarily
    
    const path = filePath || `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`; // Use timestamp prefix if no path provided
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(path, file, {
        cacheControl: '3600', // Default cache control
        upsert: options.upsert, // Allow overwriting
      });

    if (error) {
      console.error('Error uploading file:', error);
      
      // Better error reporting without session invalidation
      if (error.message.includes('Unauthorized') || error.message.includes('JWT')) {
        throw new Error('Authentication error: Please try refreshing the page.');
      }
      
      throw error;
    }
    
    if (!data) {
      throw new Error('Upload failed: No data returned from server');
    }
    
    return data.path;
  },

  /**
   * Gets the public URL for a file in Supabase Storage.
   * @param filePath The path of the file within the bucket.
   * @param bucketName The name of the bucket (defaults to DEFAULT_BUCKET).
   * @returns The public URL object { publicUrl: string }.
   */
  getPublicUrl: (
    filePath: string,
    bucketName: string = DEFAULT_BUCKET
  ): { publicUrl: string } => {
    const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
    return data;
  },
  
  /**
   * Lists all files in a bucket or specific folder path
   * @param bucketName The name of the bucket to list files from
   * @param folderPath Optional folder path to filter by
   * @returns Array of file objects
   */
  listFiles: async (
    bucketName: string = DEFAULT_BUCKET,
    folderPath?: string
  ) => {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(folderPath || '');
      
    if (error) {
      console.error('Error listing files:', error);
      throw error;
    }
    
    return data || [];
  },
  
  /**
   * Deletes a file from storage
   * @param filePath Path to the file to delete
   * @param bucketName The name of the bucket
   * @returns Success indicator
   */
  deleteFile: async (
    filePath: string,
    bucketName: string = DEFAULT_BUCKET
  ): Promise<boolean> => {
    // We'll remove explicit auth check here as well
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);
      
    if (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
    
    return true;
  }
};

// Job applications service (Table: job_applications)
export const jobApplicationsService = {
  getApplications: async (filters: Record<string, any> = {}) => {
    let query = supabase.from('job_applications').select('*');
    
    // Apply filters if provided
    if (filters.jobId) {
      query = query.eq('job_id', filters.jobId);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    
    // Sort by creation date, newest first
    query = query.order('created_at', { ascending: false });
    
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },
  
  getApplicationById: async (id: number) => {
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },
  
  createApplication: async (applicationData: any) => {
    const { data, error } = await supabase
      .from('job_applications')
      .insert(applicationData)
      .select();
    if (error) throw error;
    return data[0];
  },
  
  updateApplicationStatus: async (id: number, status: string) => {
    const { data, error } = await supabase
      .from('job_applications')
      .update({ status })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },
  
  deleteApplication: async (id: number) => {
    const { error } = await supabase
      .from('job_applications')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return { success: true };
  }
};

// --- Consolidate all services into a single export ---

const supabaseService = {
  blog: blogService,
  gallery: galleryService,
  testimonials: testimonialService,
  messages: messageService,
  bookings: bookingService,
  clients: clientService,
  settings: settingsService,
  services: servicesService,
  jobs: jobsService,
  jobApplications: jobApplicationsService, // Add job applications service
  storage: storageService,
};

export default supabaseService; 