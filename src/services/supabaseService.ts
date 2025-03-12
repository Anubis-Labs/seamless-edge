// This is a mock Supabase service for development purposes.
// In a real application, you would use the actual Supabase client.
// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
// const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';
// const supabase = createClient(supabaseUrl, supabaseKey);

// Blog posts service
export const blogService = {
  getPosts: async () => {
    // In a real app with Supabase:
    // return await supabase.from('blog_posts').select('*').order('publishDate', { ascending: false });
    
    // For now, return mock data from local storage or hardcoded data
    const storedPosts = localStorage.getItem('seamlessedge_blog_posts');
    return storedPosts ? JSON.parse(storedPosts) : [];
  },
  
  getPostById: async (id: number) => {
    // In a real app with Supabase:
    // return await supabase.from('blog_posts').select('*').eq('id', id).single();
    
    // For now, return from local storage if available
    const storedPosts = localStorage.getItem('seamlessedge_blog_posts');
    const posts = storedPosts ? JSON.parse(storedPosts) : [];
    return posts.find((post: any) => post.id === id) || null;
  },
  
  createPost: async (postData: any) => {
    // In a real app with Supabase:
    // return await supabase.from('blog_posts').insert(postData);
    
    // For now, store in local storage
    const storedPosts = localStorage.getItem('seamlessedge_blog_posts');
    const posts = storedPosts ? JSON.parse(storedPosts) : [];
    const newPost = { ...postData, id: Date.now() };
    const updatedPosts = [...posts, newPost];
    localStorage.setItem('seamlessedge_blog_posts', JSON.stringify(updatedPosts));
    return newPost;
  },
  
  updatePost: async (id: number, postData: any) => {
    // In a real app with Supabase:
    // return await supabase.from('blog_posts').update(postData).eq('id', id);
    
    // For now, update in local storage
    const storedPosts = localStorage.getItem('seamlessedge_blog_posts');
    const posts = storedPosts ? JSON.parse(storedPosts) : [];
    const updatedPosts = posts.map((post: any) => post.id === id ? { ...post, ...postData } : post);
    localStorage.setItem('seamlessedge_blog_posts', JSON.stringify(updatedPosts));
    return { ...posts.find((post: any) => post.id === id), ...postData };
  },
  
  deletePost: async (id: number) => {
    // In a real app with Supabase:
    // return await supabase.from('blog_posts').delete().eq('id', id);
    
    // For now, delete from local storage
    const storedPosts = localStorage.getItem('seamlessedge_blog_posts');
    const posts = storedPosts ? JSON.parse(storedPosts) : [];
    const updatedPosts = posts.filter((post: any) => post.id !== id);
    localStorage.setItem('seamlessedge_blog_posts', JSON.stringify(updatedPosts));
    return { success: true };
  }
};

// Gallery/projects service
export const galleryService = {
  getProjects: async () => {
    // In a real app with Supabase:
    // return await supabase.from('projects').select('*').order('createdAt', { ascending: false });
    
    // For now, return mock data from local storage or hardcoded data
    const storedProjects = localStorage.getItem('seamlessedge_projects');
    return storedProjects ? JSON.parse(storedProjects) : [];
  },
  
  getProjectById: async (id: number) => {
    // In a real app with Supabase:
    // return await supabase.from('projects').select('*').eq('id', id).single();
    
    // For now, return from local storage if available
    const storedProjects = localStorage.getItem('seamlessedge_projects');
    const projects = storedProjects ? JSON.parse(storedProjects) : [];
    return projects.find((project: any) => project.id === id) || null;
  },
  
  createProject: async (projectData: any) => {
    // In a real app with Supabase:
    // return await supabase.from('projects').insert(projectData);
    
    // For now, store in local storage
    const storedProjects = localStorage.getItem('seamlessedge_projects');
    const projects = storedProjects ? JSON.parse(storedProjects) : [];
    const newProject = { ...projectData, id: Date.now() };
    const updatedProjects = [...projects, newProject];
    localStorage.setItem('seamlessedge_projects', JSON.stringify(updatedProjects));
    return newProject;
  },
  
  updateProject: async (id: number, projectData: any) => {
    // In a real app with Supabase:
    // return await supabase.from('projects').update(projectData).eq('id', id);
    
    // For now, update in local storage
    const storedProjects = localStorage.getItem('seamlessedge_projects');
    const projects = storedProjects ? JSON.parse(storedProjects) : [];
    const updatedProjects = projects.map((project: any) => 
      project.id === id ? { ...project, ...projectData } : project
    );
    localStorage.setItem('seamlessedge_projects', JSON.stringify(updatedProjects));
    return { ...projects.find((project: any) => project.id === id), ...projectData };
  },
  
  deleteProject: async (id: number) => {
    // In a real app with Supabase:
    // return await supabase.from('projects').delete().eq('id', id);
    
    // For now, delete from local storage
    const storedProjects = localStorage.getItem('seamlessedge_projects');
    const projects = storedProjects ? JSON.parse(storedProjects) : [];
    const updatedProjects = projects.filter((project: any) => project.id !== id);
    localStorage.setItem('seamlessedge_projects', JSON.stringify(updatedProjects));
    return { success: true };
  }
};

// Testimonials service
export const testimonialService = {
  getTestimonials: async () => {
    // In a real app with Supabase:
    // return await supabase.from('testimonials').select('*').order('createdAt', { ascending: false });
    
    // For now, return mock data from local storage or hardcoded data
    const storedTestimonials = localStorage.getItem('seamlessedge_testimonials');
    return storedTestimonials ? JSON.parse(storedTestimonials) : [];
  },
  
  createTestimonial: async (testimonialData: any) => {
    // In a real app with Supabase:
    // return await supabase.from('testimonials').insert(testimonialData);
    
    // For now, store in local storage
    const storedTestimonials = localStorage.getItem('seamlessedge_testimonials');
    const testimonials = storedTestimonials ? JSON.parse(storedTestimonials) : [];
    const newTestimonial = { ...testimonialData, id: Date.now() };
    const updatedTestimonials = [...testimonials, newTestimonial];
    localStorage.setItem('seamlessedge_testimonials', JSON.stringify(updatedTestimonials));
    return newTestimonial;
  },
  
  updateTestimonial: async (id: number, testimonialData: any) => {
    // In a real app with Supabase:
    // return await supabase.from('testimonials').update(testimonialData).eq('id', id);
    
    // For now, update in local storage
    const storedTestimonials = localStorage.getItem('seamlessedge_testimonials');
    const testimonials = storedTestimonials ? JSON.parse(storedTestimonials) : [];
    const updatedTestimonials = testimonials.map((testimonial: any) => 
      testimonial.id === id ? { ...testimonial, ...testimonialData } : testimonial
    );
    localStorage.setItem('seamlessedge_testimonials', JSON.stringify(updatedTestimonials));
    return { ...testimonials.find((testimonial: any) => testimonial.id === id), ...testimonialData };
  },
  
  deleteTestimonial: async (id: number) => {
    // In a real app with Supabase:
    // return await supabase.from('testimonials').delete().eq('id', id);
    
    // For now, delete from local storage
    const storedTestimonials = localStorage.getItem('seamlessedge_testimonials');
    const testimonials = storedTestimonials ? JSON.parse(storedTestimonials) : [];
    const updatedTestimonials = testimonials.filter((testimonial: any) => testimonial.id !== id);
    localStorage.setItem('seamlessedge_testimonials', JSON.stringify(updatedTestimonials));
    return { success: true };
  }
};

// Messages/Contact service
export const messageService = {
  getMessages: async () => {
    // In a real app with Supabase:
    // return await supabase.from('messages').select('*').order('createdAt', { ascending: false });
    
    // For now, return mock data from local storage or hardcoded data
    const storedMessages = localStorage.getItem('seamlessedge_messages');
    return storedMessages ? JSON.parse(storedMessages) : [];
  },
  
  markAsRead: async (id: number) => {
    // In a real app with Supabase:
    // return await supabase.from('messages').update({ read: true }).eq('id', id);
    
    // For now, update in local storage
    const storedMessages = localStorage.getItem('seamlessedge_messages');
    const messages = storedMessages ? JSON.parse(storedMessages) : [];
    const updatedMessages = messages.map((message: any) => 
      message.id === id ? { ...message, read: true } : message
    );
    localStorage.setItem('seamlessedge_messages', JSON.stringify(updatedMessages));
    return { success: true };
  },
  
  deleteMessage: async (id: number) => {
    // In a real app with Supabase:
    // return await supabase.from('messages').delete().eq('id', id);
    
    // For now, delete from local storage
    const storedMessages = localStorage.getItem('seamlessedge_messages');
    const messages = storedMessages ? JSON.parse(storedMessages) : [];
    const updatedMessages = messages.filter((message: any) => message.id !== id);
    localStorage.setItem('seamlessedge_messages', JSON.stringify(updatedMessages));
    return { success: true };
  }
};

// Bookings service
export const bookingService = {
  getBookings: async (filters: Record<string, any> = {}) => {
    // In a real app with Supabase:
    // let query = supabase.from('bookings').select(`
    //   *,
    //   clients(id, first_name, last_name, email, phone)
    // `);
    
    // if (filters.startDate) {
    //   query = query.gte('date', filters.startDate);
    // }
    // if (filters.endDate) {
    //   query = query.lte('date', filters.endDate);
    // }
    // if (filters.status) {
    //   query = query.eq('status', filters.status);
    // }
    // if (filters.serviceType) {
    //   query = query.eq('service_type', filters.serviceType);
    // }
    
    // const { data, error } = await query.order('date', { ascending: true });
    // if (error) throw error;
    // return data;
    
    // For now, return mock data from local storage or hardcoded data
    const storedBookings = localStorage.getItem('seamlessedge_bookings');
    return storedBookings ? JSON.parse(storedBookings) : [];
  },
  
  getBookingById: async (id: number) => {
    // In a real app with Supabase:
    // const { data, error } = await supabase
    //   .from('bookings')
    //   .select(`
    //     *,
    //     clients(id, first_name, last_name, email, phone)
    //   `)
    //   .eq('id', id)
    //   .single();
    // if (error) throw error;
    // return data;
    
    // For now, return from local storage if available
    const storedBookings = localStorage.getItem('seamlessedge_bookings');
    const bookings = storedBookings ? JSON.parse(storedBookings) : [];
    return bookings.find((booking: any) => booking.id === id) || null;
  },
  
  createBooking: async (bookingData: any) => {
    // In a real app with Supabase:
    // const { data, error } = await supabase
    //   .from('bookings')
    //   .insert(bookingData)
    //   .select();
    // if (error) throw error;
    // return data[0];
    
    // For now, store in local storage
    const storedBookings = localStorage.getItem('seamlessedge_bookings');
    const bookings = storedBookings ? JSON.parse(storedBookings) : [];
    const newBooking = { ...bookingData, id: Date.now() };
    const updatedBookings = [...bookings, newBooking];
    localStorage.setItem('seamlessedge_bookings', JSON.stringify(updatedBookings));
    return newBooking;
  },
  
  updateBooking: async (id: number, bookingData: any) => {
    // In a real app with Supabase:
    // const { data, error } = await supabase
    //   .from('bookings')
    //   .update(bookingData)
    //   .eq('id', id)
    //   .select();
    // if (error) throw error;
    // return data[0];
    
    // For now, update in local storage
    const storedBookings = localStorage.getItem('seamlessedge_bookings');
    const bookings = storedBookings ? JSON.parse(storedBookings) : [];
    const updatedBookings = bookings.map((booking: any) => 
      booking.id === id ? { ...booking, ...bookingData } : booking
    );
    localStorage.setItem('seamlessedge_bookings', JSON.stringify(updatedBookings));
    return { ...bookings.find((booking: any) => booking.id === id), ...bookingData };
  },
  
  deleteBooking: async (id: number) => {
    // In a real app with Supabase:
    // const { error } = await supabase
    //   .from('bookings')
    //   .delete()
    //   .eq('id', id);
    // if (error) throw error;
    // return { success: true };
    
    // For now, delete from local storage
    const storedBookings = localStorage.getItem('seamlessedge_bookings');
    const bookings = storedBookings ? JSON.parse(storedBookings) : [];
    const updatedBookings = bookings.filter((booking: any) => booking.id !== id);
    localStorage.setItem('seamlessedge_bookings', JSON.stringify(updatedBookings));
    return { success: true };
  },
  
  sendReminder: async (bookingId: number) => {
    // In a real app with Supabase, this would call a Supabase Edge Function
    // that would send an email/SMS reminder
    
    // For now, just simulate successful sending
    console.log(`Reminder sent for booking ${bookingId}`);
    return { success: true };
  }
};

// Create a single export for all services
const supabaseService = {
  blog: blogService,
  gallery: galleryService,
  testimonials: testimonialService,
  messages: messageService,
  bookings: bookingService
};

export default supabaseService; 