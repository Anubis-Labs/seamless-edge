# Seamless Edge Admin Panel Setup Guide

## Overview

The Seamless Edge website includes a comprehensive admin panel that allows you to manage your website content including blog posts, project gallery, testimonials, quote calculator settings, and more. This guide will help you set up the admin panel with a real Supabase database for production use.

## Current Implementation

The current admin implementation uses:

- React for the frontend UI
- Local browser storage for temporary data persistence
- Mock authentication with hardcoded admin credentials
- Simulated API responses for all database operations

This allows you to test and use the admin interface without requiring a database connection.

## Setting Up Supabase

To set up a proper database backend for your admin panel, follow these steps:

### 1. Create a Supabase Account

1. Go to [Supabase](https://supabase.com/) and sign up for an account
2. Create a new project (name it "Seamless Edge" or similar)
3. Make note of your project URL and API keys (you'll need these later)

### 2. Set Up Database Tables

Create the following tables in your Supabase database:

#### blog_posts
- `id` (int, primary key)
- `title` (text)
- `summary` (text)
- `content` (text)
- `category` (text)
- `author` (text)
- `publish_date` (timestamp)
- `read_time` (text)
- `image` (text - URL)
- `featured` (boolean)
- `published` (boolean)
- `slug` (text)
- `tags` (array)
- `created_at` (timestamp)

#### projects
- `id` (int, primary key)
- `title` (text)
- `description` (text)
- `category` (text)
- `location` (text)
- `image_before` (text - URL)
- `image_after` (text - URL)
- `additional_images` (array of text - URLs)
- `date_completed` (timestamp)
- `featured` (boolean)
- `testimonial_id` (int, foreign key)
- `created_at` (timestamp)

#### testimonials
- `id` (int, primary key)
- `client_name` (text)
- `client_location` (text)
- `project_type` (text)
- `content` (text)
- `rating` (int)
- `date` (timestamp)
- `featured` (boolean)
- `approved` (boolean)
- `created_at` (timestamp)

#### messages
- `id` (int, primary key)
- `name` (text)
- `email` (text)
- `phone` (text)
- `message` (text)
- `subject` (text)
- `read` (boolean)
- `created_at` (timestamp)

#### users (for admin authentication)
- `id` (uuid, primary key)
- `username` (text)
- `email` (text)
- `password_hash` (text)
- `role` (text)
- `created_at` (timestamp)

#### clients
- `id` (int, primary key)
- `first_name` (text)
- `last_name` (text)
- `email` (text)
- `phone` (text)
- `address` (text)
- `city` (text)
- `state` (text)
- `zip` (text)
- `notes` (text)
- `status` (text)
- `created_at` (timestamp)
- `last_interaction` (timestamp)

#### bookings
- `id` (int, primary key)
- `client_id` (int, foreign key)
- `service_type` (text)
- `date` (timestamp)
- `start_time` (text)
- `end_time` (text)
- `status` (text)
- `notes` (text)
- `location` (text)
- `created_at` (timestamp)

### 3. Enable Row-Level Security

For each table, make sure to set up Row-Level Security (RLS) policies to protect your data:

1. Go to your table in the Supabase dashboard
2. Go to "Authentication" -> "Policies"
3. Create policies that only allow authenticated admin users to access the data

### 4. Update Environment Variables

Create a `.env` file in your project root with the following variables:

```
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Uncomment Supabase Client Initialization

Open `src/services/supabaseService.ts` and uncomment the Supabase client initialization code:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);
```

### 6. Update Auth Service

The current implementation uses a mock authentication system. To use Supabase Auth:

1. Install the required packages:
   ```
   npm install @supabase/supabase-js
   ```

2. Update `src/services/authService.ts` to use Supabase authentication instead of the mock system.

```typescript
import supabase from './supabaseService';

const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    throw error;
  }
  
  return data.user;
};

const logout = async () => {
  await supabase.auth.signOut();
  localStorage.removeItem('admin_token');
};

const isAuthenticated = () => {
  return supabase.auth.getSession() !== null;
};

// ... rest of the service
```

## Admin Dashboard Features

The admin panel includes several key management sections that need to be configured when switching to a production Supabase setup:

### Dashboard Overview

The main dashboard (`Dashboard.tsx`) provides:
- Key metrics and statistics about website activity
- Recent messages and inquiries
- Content update notifications
- Quick actions for common tasks

To connect the dashboard to Supabase:
1. Update data fetching methods to pull real-time data from Supabase
2. Implement Supabase real-time subscriptions for live updates
3. Configure metric calculations to use server-side data

### Content Management

The following content management modules need Supabase integration:

#### Blog Management (`BlogManagement.tsx`)
- Create, edit, and delete blog posts
- Schedule posts for future publication
- Manage categories and tags
- Upload and manage blog images

#### Gallery Management (`GalleryManagement.tsx`)
- Upload and manage project photos
- Organize projects by category
- Link projects to testimonials
- Set featured projects for homepage display

#### Testimonials Management (`TestimonialsManagement.tsx`)
- Review and approve customer testimonials
- Edit testimonial content
- Feature selected testimonials
- Associate testimonials with specific projects

#### Services Management (`ServicesManagement.tsx`)
- Define service categories and offerings
- Set service pricing and details
- Configure service availability
- Manage service imagery

### Bookings Management

The Bookings Management section (`BookingsManagement.tsx`) needs to be created to allow administrators to:

- View and manage service bookings
- Create new appointments
- Reschedule or cancel existing appointments
- Filter bookings by date, service type, or status
- Send reminders to clients about upcoming appointments
- Generate booking reports

To implement Booking Management with Supabase:

1. Create the bookings table in Supabase with the appropriate fields
2. Implement backend functions for CRUD operations on bookings:

```typescript
// Add to supabaseService.ts
export const bookingService = {
  getBookings: async (filters = {}) => {
    let query = supabase.from('bookings').select(`
      *,
      clients(id, first_name, last_name, email, phone)
    `);
    
    // Apply filters
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
    return data;
  },
  
  createBooking: async (bookingData) => {
    const { data, error } = await supabase
      .from('bookings')
      .insert(bookingData)
      .select();
      
    if (error) throw error;
    return data[0];
  },
  
  updateBooking: async (id, bookingData) => {
    const { data, error } = await supabase
      .from('bookings')
      .update(bookingData)
      .eq('id', id)
      .select();
      
    if (error) throw error;
    return data[0];
  },
  
  deleteBooking: async (id) => {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return { success: true };
  },
  
  sendReminder: async (bookingId) => {
    // In production, this would call a Supabase Edge Function
    // that would send an email/SMS reminder
    const { data, error } = await supabase.functions.invoke('send-booking-reminder', {
      body: { bookingId }
    });
    
    if (error) throw error;
    return data;
  }
};
```

3. Create a calendar view for easy visualization of bookings

### Client Management System

The Client Management section (`ClientManagement.tsx`) needs to be developed to allow administrators to:

#### Client Directory

- View and search client database
- Add new clients
- Edit client information
- Filter clients by status or location
- View client history and interactions

#### Client Communication

- Send targeted emails or messages
- Create and manage client groups
- Schedule follow-up reminders
- View message history

#### Client Projects

- Link clients to projects
- Track project status for each client
- View all projects associated with a client
- Manage client-specific pricing

#### Client Billing

- View payment history
- Generate invoices
- Track outstanding balances
- Set up recurring billing

To implement Client Management with Supabase:

1. Create the clients table in Supabase with appropriate fields
2. Implement backend functions for CRUD operations on clients:

```typescript
// Add to supabaseService.ts
export const clientService = {
  getClients: async (filters = {}) => {
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
    return data;
  },
  
  getClientWithProjects: async (clientId) => {
    // Get client data
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .single();
      
    if (clientError) throw clientError;
    
    // Get projects for this client
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .eq('client_id', clientId);
      
    if (projectsError) throw projectsError;
    
    // Get bookings for this client
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('*')
      .eq('client_id', clientId);
      
    if (bookingsError) throw bookingsError;
    
    return {
      ...client,
      projects,
      bookings
    };
  },
  
  createClient: async (clientData) => {
    const { data, error } = await supabase
      .from('clients')
      .insert(clientData)
      .select();
      
    if (error) throw error;
    return data[0];
  },
  
  updateClient: async (id, clientData) => {
    const { data, error } = await supabase
      .from('clients')
      .update(clientData)
      .eq('id', id)
      .select();
      
    if (error) throw error;
    return data[0];
  },
  
  deleteClient: async (id) => {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return { success: true };
  },
  
  sendClientEmail: async (clientId, emailData) => {
    // In production, this would call a Supabase Edge Function
    // that would send an email to the client
    const { data, error } = await supabase.functions.invoke('send-client-email', {
      body: { clientId, ...emailData }
    });
    
    if (error) throw error;
    return data;
  }
};
```

### Site Configuration

The following configuration modules need Supabase integration:

#### Quote Calculator Settings (`CalculatorSettings.tsx`)
- Define service options and pricing rules
- Set discount structures
- Configure calculation formulas
- Manage quote generation settings

#### Site Settings (`SiteSettings.tsx`)

The Site Settings section includes multiple tabs for different aspects of the website configuration:

##### General Settings
- Company information
- Contact details
- Business hours
- Website metadata

##### Appearance Settings
- Logo and favicon
- Theme colors
- Typography options
- Layout preferences

##### SEO Settings
- Meta titles and descriptions
- Open Graph settings
- Structured data configuration
- Sitemap generation

##### Integration Settings
- Google Analytics
- Google Tag Manager
- Facebook Pixel
- Other marketing tools

##### Email Settings
- SMTP configuration
- Email templates
- Transactional email settings
- Marketing email settings

To implement these settings tabs with Supabase:

1. Create a settings table with configuration sections
2. Implement backend functions for updating settings:

```typescript
// Add to supabaseService.ts
export const settingsService = {
  getSettings: async (section = null) => {
    let query = supabase.from('settings').select('*');
    
    if (section) {
      query = query.eq('section', section);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Convert array to object format for easier use
    const settings = {};
    data.forEach(item => {
      if (!settings[item.section]) {
        settings[item.section] = {};
      }
      settings[item.section][item.key] = item.value;
    });
    
    return settings;
  },
  
  updateSettings: async (section, settings) => {
    // Convert object format to array for storage
    const updates = Object.entries(settings).map(([key, value]) => ({
      section,
      key,
      value
    }));
    
    // Use upsert to add or update settings
    const { error } = await supabase
      .from('settings')
      .upsert(updates, { 
        onConflict: 'section,key',
        returning: 'minimal' 
      });
      
    if (error) throw error;
    return { success: true };
  }
};
```

## User Management

To properly manage admin users in your production environment:

### Creating Admin Users

1. Use Supabase Auth UI or API to create new admin users:
   ```typescript
   const createAdminUser = async (email, password, name) => {
     // Create the user in Supabase Auth
     const { data: authData, error: authError } = await supabase.auth.signUp({
       email,
       password,
     });
     
     if (authError) throw authError;
     
     // Add the user to the users table with admin role
     const { data, error } = await supabase
       .from('users')
       .insert({
         id: authData.user.id,
         email,
         name,
         role: 'admin'
       });
       
     if (error) throw error;
     
     return data;
   };
   ```

2. Set up admin permissions:
   - Create role-based policies in Supabase
   - Restrict access to admin-only tables and functions
   - Consider implementing permission levels (super-admin, content-admin, etc.)

### User Role Management

1. Create a user management interface for super-admins
2. Implement role-based access control (RBAC)
3. Create audit logs for admin actions

## Import/Export Functionality

For data migration and backup:

### Data Export

Implement export functions for each content type:
```typescript
const exportData = async (table) => {
  const { data, error } = await supabase
    .from(table)
    .select('*');
    
  if (error) throw error;
  
  // Convert to CSV or JSON
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  // Trigger download
  const a = document.createElement('a');
  a.href = url;
  a.download = `${table}_export_${new Date().toISOString()}.json`;
  a.click();
};
```

### Data Import

Create import utilities:
```typescript
const importData = async (table, data) => {
  // Clear existing data or upsert
  const { error } = await supabase
    .from(table)
    .upsert(data, { onConflict: 'id' });
    
  if (error) throw error;
  
  return { success: true };
};
```

## Analytics Integration

Connect your admin dashboard to analytics services:

1. Set up Supabase PostgreSQL functions to query and summarize data
2. Create custom analytics endpoints for dashboard metrics
3. Implement visualization components for key metrics

Example analytics function:
```sql
CREATE OR REPLACE FUNCTION get_monthly_visitors()
RETURNS TABLE (month text, count bigint) LANGUAGE SQL AS $$
  SELECT 
    to_char(date_trunc('month', created_at), 'YYYY-MM') as month,
    COUNT(*) as count
  FROM page_visits
  GROUP BY date_trunc('month', created_at)
  ORDER BY date_trunc('month', created_at) DESC
  LIMIT 12;
$$;
```

## Webhook Integration

Set up webhooks for external service integration:

### Notification Systems

Configure webhooks for:
- New message notifications
- Content update alerts
- User login notifications

Example webhook setup:
```typescript
const setupWebhook = async (event_type, url) => {
  // In a real implementation, you would store webhook configs in Supabase
  // and use Supabase Edge Functions to trigger them
  const { data, error } = await supabase
    .from('webhooks')
    .insert({
      event_type,
      url,
      active: true
    });
    
  if (error) throw error;
  
  return data;
};
```

## Security Considerations

- Always use environment variables for sensitive credentials
- Never commit API keys to your repository
- Implement proper authentication and authorization
- Set up appropriate Row-Level Security policies in Supabase
- Use HTTPS for all production deployments
- Implement rate limiting for API endpoints
- Set up backup procedures for your database
- Create security audit processes
- Monitor for suspicious login attempts

## Support

If you need assistance setting up your admin panel with Supabase, please contact our development team for support. 