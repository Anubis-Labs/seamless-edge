# Seamless Edge Backend Architecture

## Architecture Overview

This document outlines the backend architecture for the Seamless Edge website and admin panel, using a combination of Supabase as the primary backend service and Vercel Serverless Functions for additional functionality.

![Architecture Diagram](https://i.imgur.com/PLACEHOLDER.png)

### Core Components
 14 backspace backspace fuck you Siri Version of yourself for a week obsessed with their bodies what happened where are they in the kitchen we need farmer OK yeah OK you totally put him to sleep chair I watched it I was impressed it was a perfect execution and then I was like texting you like you probably try I've been watching severance nothing yeah lumos what are you doing come here three years whatever it was longer than that
1. **Supabase**: Provides database, authentication, storage, and real-time functionality
2. **Vercel Frontend**: Hosts the React application for both public website and admin panel
3. **Vercel Serverless Functions**: Handles complex business logic and third-party integrations

### Key Benefits

- **Serverless Architecture**: No servers to manage or scale
- **Cost-Effective**: Pay-as-you-go pricing aligned with usage
- **Developer Experience**: Streamlined development and deployment
- **Performance**: Global edge network for both frontend and backend
- **Scalability**: Automatic scaling based on demand

## Detailed Technical Specification

### 1. Database Schema (Supabase)

#### `blog_posts` Table
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

#### `projects` Table
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

#### `testimonials` Table
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

#### `messages` Table
- `id` (int, primary key)
- `name` (text)
- `email` (text)
- `phone` (text)
- `message` (text)
- `subject` (text)
- `read` (boolean)
- `created_at` (timestamp)

#### `users` Table
- `id` (uuid, primary key)
- `username` (text)
- `email` (text)
- `password_hash` (text)
- `role` (text)
- `created_at` (timestamp)

#### `clients` Table
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

#### `bookings` Table
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

#### `settings` Table
- `id` (int, primary key)
- `section` (text) - e.g., "general", "appearance", "seo", etc.
- `key` (text)
- `value` (text/json)
- `description` (text)
- `updated_at` (timestamp)

### 2. Authentication System (Supabase Auth)

#### User Roles
- **Super Admin**: Full access to all functionality
- **Content Admin**: Access to content management only
- **Client**: Access to client portal only (future feature)

#### Authentication Flow
1. User submits credentials via login form
2. Supabase Auth validates credentials and issues JWT
3. JWT stored in browser and included in subsequent requests
4. Row-Level Security (RLS) policies enforce access control

#### Security Policies
```sql
-- Example RLS policy for blog_posts table
CREATE POLICY "Admins can do anything" ON blog_posts
    USING (auth.role() = 'admin');

CREATE POLICY "Content admins can read and edit" ON blog_posts
    USING (auth.role() = 'content_admin')
    WITH CHECK (auth.role() = 'content_admin');

CREATE POLICY "Public can only read published posts" ON blog_posts
    USING (published = true);
```

### 3. Storage System (Supabase Storage)

#### Storage Buckets
- `blog-images`: For blog post images
- `project-images`: For project gallery images
- `testimonial-attachments`: For any testimonial media
- `site-assets`: For logos, icons, and other site assets

#### Security Rules
```typescript
// Example storage policy
{
  "name": "project-images",
  "owner": "system",
  "public": false,
  "file_size_limit": 10485760, // 10MB
  "allowed_mime_types": ["image/jpeg", "image/png", "image/webp"],
  "security": {
    "role_based": {
      "admin": {
        "permissions": ["select", "insert", "update", "delete"]
      },
      "authenticated": {
        "permissions": ["select"]
      },
      "anon": {
        "permissions": ["select"]
      }
    }
  }
}
```

### 4. Vercel Serverless Functions

#### API Routes Structure
```
/api
├── admin/
│   ├── dashboard-stats.ts
│   ├── export-data.ts
│   └── import-data.ts
├── blog/
│   ├── [id].ts
│   ├── index.ts
│   └── publish.ts
├── bookings/
│   ├── [id].ts
│   ├── calendar.ts
│   ├── index.ts
│   └── reminders.ts
├── clients/
│   ├── [id].ts
│   ├── index.ts
│   └── notifications.ts
├── projects/
│   ├── [id].ts
│   └── index.ts
├── testimonials/
│   ├── [id].ts
│   ├── approve.ts
│   └── index.ts
└── webhooks/
    ├── email.ts
    └── third-party.ts
```

#### Common Function Patterns

**Data Aggregation:**
```typescript
// api/admin/dashboard-stats.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Initialize Supabase client with server context
  const supabase = createServerSupabaseClient({ req, res });
  
  // Check authentication
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    // Fetch multiple data sources and aggregate
    const [blogStats, projectStats, messageStats] = await Promise.all([
      supabase
        .from('blog_posts')
        .select('count', { count: 'exact' })
        .eq('published', true),
      supabase
        .from('projects')
        .select('count', { count: 'exact' }),
      supabase
        .from('messages')
        .select('count', { count: 'exact' })
        .eq('read', false),
    ]);
    
    // Process and return aggregated data
    return res.status(200).json({
      blogPostCount: blogStats.count || 0,
      projectCount: projectStats.count || 0,
      unreadMessageCount: messageStats.count || 0,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
```

**External Integrations:**
```typescript
// api/bookings/reminders.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import sgMail from '@sendgrid/mail';

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { bookingId } = req.body;
  if (!bookingId) {
    return res.status(400).json({ error: 'Booking ID is required' });
  }
  
  const supabase = createServerSupabaseClient({ req, res });
  
  try {
    // Fetch booking with client information
    const { data: booking, error } = await supabase
      .from('bookings')
      .select(`
        *,
        clients(first_name, last_name, email)
      `)
      .eq('id', bookingId)
      .single();
      
    if (error) throw error;
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    // Send reminder email
    const msg = {
      to: booking.clients.email,
      from: 'no-reply@seamlessedge.com',
      subject: 'Reminder: Your Upcoming Appointment',
      templateId: 'd-xxxxxxxxxxxxx', // SendGrid template ID
      dynamicTemplateData: {
        first_name: booking.clients.first_name,
        service_type: booking.service_type,
        date: new Date(booking.date).toLocaleDateString(),
        time: booking.start_time,
        location: booking.location,
      },
    };
    
    await sgMail.send(msg);
    
    // Update booking record
    await supabase
      .from('bookings')
      .update({ reminder_sent: true })
      .eq('id', bookingId);
      
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending reminder:', error);
    return res.status(500).json({ error: 'Failed to send reminder' });
  }
}
```

**Complex Business Logic:**
```typescript
// api/admin/quote-calculator.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { serviceType, squareFootage, options, location } = req.body;
  
  if (!serviceType || !squareFootage || !location) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }
  
  const supabase = createServerSupabaseClient({ req, res });
  
  try {
    // Fetch pricing rules from settings
    const { data: pricingRules, error } = await supabase
      .from('settings')
      .select('value')
      .eq('section', 'pricing')
      .eq('key', 'rules')
      .single();
      
    if (error) throw error;
    
    // Complex calculation logic
    const rules = JSON.parse(pricingRules.value);
    let basePrice = calculateBasePrice(serviceType, squareFootage, rules);
    let optionsPrice = calculateOptionsPrice(options, rules);
    let locationMultiplier = getLocationMultiplier(location, rules);
    
    const totalPrice = (basePrice + optionsPrice) * locationMultiplier;
    const breakdown = {
      basePrice,
      optionsPrice,
      locationMultiplier,
      totalPrice,
    };
    
    return res.status(200).json({
      quote: {
        total: totalPrice,
        breakdown,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    });
  } catch (error) {
    console.error('Error calculating quote:', error);
    return res.status(500).json({ error: 'Failed to calculate quote' });
  }
}

// Helper functions
function calculateBasePrice(serviceType, squareFootage, rules) {
  // Complex pricing calculation
  const serviceRule = rules.services.find(s => s.type === serviceType);
  return serviceRule.basePrice + (squareFootage * serviceRule.pricePerSqFt);
}

function calculateOptionsPrice(options, rules) {
  // Sum up all selected options
  return options.reduce((total, option) => {
    const optionRule = rules.options.find(o => o.id === option);
    return total + (optionRule ? optionRule.price : 0);
  }, 0);
}

function getLocationMultiplier(location, rules) {
  // Apply location-based pricing adjustment
  const locationRule = rules.locations.find(l => l.zipCode === location);
  return locationRule ? locationRule.multiplier : 1;
}
```

### 5. Frontend Integration

#### Supabase Client Setup
```typescript
// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

#### Authentication Hook
```typescript
// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User, Session } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current session
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    };
    
    getSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      throw error;
    }
    
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  };

  return {
    user,
    session,
    loading,
    signIn,
    signOut,
  };
}
```

#### Data Fetching Example
```typescript
// hooks/useBlogPosts.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useBlogPosts(options = { limit: 10, featured: false }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      
      try {
        let query = supabase
          .from('blog_posts')
          .select('*', { count: 'exact' })
          .eq('published', true)
          .order('publish_date', { ascending: false });
          
        // Apply filters
        if (options.featured) {
          query = query.eq('featured', true);
        }
        
        // Apply pagination
        if (options.limit) {
          query = query.limit(options.limit);
        }
        
        const { data, error, count: totalCount } = await query;
        
        if (error) throw error;
        
        setPosts(data || []);
        setCount(totalCount || 0);
      } catch (err) {
        setError(err);
        console.error('Error fetching blog posts:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [options.limit, options.featured]);

  return { posts, loading, error, count };
}
```

#### Real-time Subscription Example
```typescript
// components/admin/MessageNotifications.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export function MessageNotifications() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    const fetchUnreadCount = async () => {
      const { data, error, count } = await supabase
        .from('messages')
        .select('*', { count: 'exact' })
        .eq('read', false);
        
      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }
      
      setUnreadCount(count || 0);
      setLoading(false);
    };
    
    fetchUnreadCount();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          // Update count based on the change
          if (payload.eventType === 'INSERT' && !payload.new.read) {
            setUnreadCount((prevCount) => prevCount + 1);
          } else if (
            payload.eventType === 'UPDATE' && 
            !payload.old.read && 
            payload.new.read
          ) {
            setUnreadCount((prevCount) => prevCount - 1);
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <div className="notification-badge">
      {loading ? (
        <span>Loading...</span>
      ) : (
        unreadCount > 0 && <span className="badge">{unreadCount}</span>
      )}
    </div>
  );
}
```

#### Serverless Function Call Example
```typescript
// components/admin/SendBookingReminder.tsx
import { useState } from 'react';

export function SendBookingReminder({ bookingId }) {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const sendReminder = async () => {
    setSending(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await fetch('/api/bookings/reminders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reminder');
      }
      
      setSuccess(true);
    } catch (err) {
      setError(err.message);
      console.error('Error sending reminder:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <button 
        onClick={sendReminder} 
        disabled={sending}
        className="btn btn-primary"
      >
        {sending ? 'Sending...' : 'Send Reminder'}
      </button>
      
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">Reminder sent successfully!</p>}
    </div>
  );
}
```

## Implementation Plan

### Phase 1: Foundation Setup (2-3 weeks)

1. **Supabase Project Creation**
   - Create Supabase project
   - Configure authentication providers
   - Set up database tables according to schema
   - Implement basic RLS policies

2. **Vercel Project Setup**
   - Initialize Next.js project
   - Configure environment variables
   - Set up deployment pipeline
   - Connect to Supabase

3. **Authentication Implementation**
   - Create login/signup flows
   - Set up protected routes
   - Implement role-based access control
   - Create user management interfaces

### Phase 2: Core Functionality (3-4 weeks)

1. **Content Management**
   - Implement blog post CRUD
   - Create project gallery management
   - Develop testimonial management
   - Set up image upload functionality

2. **Client Management**
   - Build client database interface
   - Implement client communication features
   - Create client filtering and search
   - Set up client history tracking

3. **Booking System**
   - Develop booking calendar
   - Implement appointment creation/editing
   - Create booking notifications
   - Set up availability management

### Phase 3: Advanced Features (2-3 weeks)

1. **Analytics Dashboard**
   - Create metrics collection
   - Implement visualization components
   - Set up reporting functionality
   - Develop export capabilities

2. **Site Configuration**
   - Implement settings management
   - Create theme customization
   - Develop SEO configuration
   - Set up integration management

3. **Vercel Serverless Functions**
   - Create complex business logic functions
   - Implement third-party integrations
   - Set up scheduled tasks
   - Develop email notification system

### Phase 4: Optimization & Launch (2 weeks)

1. **Performance Optimization**
   - Implement caching strategies
   - Optimize database queries
   - Improve image loading
   - Enhance frontend performance

2. **Security Auditing**
   - Review RLS policies
   - Check authentication flows
   - Verify data validation
   - Test API endpoints

3. **Documentation & Training**
   - Create user documentation
   - Develop admin guides
   - Record training videos
   - Prepare handover documentation

## DevOps & Deployment

### Environment Configuration

#### Environment Variables

**Vercel Environment Variables:**
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key (server-side only)
SENDGRID_API_KEY=your-sendgrid-key
GOOGLE_CALENDAR_API_KEY=your-google-calendar-key
```

**Local Development (.env.local):**
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SENDGRID_API_KEY=your-sendgrid-key
GOOGLE_CALENDAR_API_KEY=your-google-calendar-key
```

### CI/CD Pipeline

1. **Version Control**
   - GitHub repository
   - Branch protection rules
   - Pull request templates
   - Code owners configuration

2. **Automated Testing**
   - Unit tests for components
   - Integration tests for API
   - E2E tests for critical flows
   - Database migration tests

3. **Deployment Workflow**
   - GitHub Actions for CI
   - Vercel Preview Deployments
   - Supabase Database Migrations
   - Automated environment management

### Monitoring & Maintenance

1. **Error Tracking**
   - Sentry integration
   - Error boundaries in React
   - Server-side error logging
   - Alert notifications

2. **Performance Monitoring**
   - Vercel Analytics
   - Core Web Vitals tracking
   - API response time monitoring
   - Database query performance

3. **Backup Strategy**
   - Automated Supabase backups
   - Regular export of critical data
   - Disaster recovery plan
   - Backup verification process

## Security Considerations

### Authentication Security

1. **Password Policies**
   - Minimum 12 characters
   - Complexity requirements
   - Maximum age policies
   - Failed attempt lockouts

2. **Session Management**
   - Short-lived JWT tokens
   - Secure cookie configuration
   - Idle session timeout
   - Device tracking

3. **Multi-factor Authentication**
   - Support for TOTP authenticators
   - Email verification codes
   - Recovery procedures
   - Admin enforcement options

### Data Protection

1. **Database Security**
   - Row-Level Security (RLS)
   - Column-level encryption for sensitive data
   - Prepared statements for all queries
   - Regular security audits

2. **API Security**
   - Rate limiting
   - CORS configuration
   - Input validation
   - Output sanitization

3. **File Security**
   - Virus scanning for uploads
   - File type validation
   - Size restrictions
   - Access control for stored files

## Troubleshooting Guide

### Common Issues

1. **Authentication Problems**
   - JWT token expiration
   - CORS issues with Supabase
   - Role permission configuration
   - Session management

2. **Database Connection Issues**
   - Connection pool exhaustion
   - Timeout errors
   - Permission denied errors
   - Foreign key constraint failures

3. **Serverless Function Errors**
   - Execution timeout
   - Memory limit exceeded
   - Missing environment variables
   - Module import errors

### Debugging Strategies

1. **Client-Side Debugging**
   - Browser developer tools
   - React DevTools
   - Network request monitoring
   - State management inspection

2. **Server-Side Debugging**
   - Vercel function logs
   - Supabase query debugging
   - Error stack analysis
   - Request/response tracing

## Maintenance & Updates

1. **Regular Updates**
   - Dependency updates
   - Security patches
   - Feature enhancements
   - Performance improvements

2. **Database Maintenance**
   - Index optimization
   - Query performance tuning
   - Data archiving strategy
   - Storage management

3. **Content Management**
   - Regular content audits
   - SEO optimization
   - Media library management
   - Content scheduling

## Future Expansion

1. **Client Portal**
   - Self-service booking
   - Project tracking
   - Document sharing
   - Payment processing

2. **Mobile App Integration**
   - Admin mobile application
   - Field service tools
   - QR code integration
   - Push notifications

3. **Advanced Analytics**
   - Customer behavior analysis
   - Conversion tracking
   - ROI measurement
   - Predictive analytics

## Resources & References

- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Query Documentation](https://tanstack.com/query/latest/docs/react/overview)
- [SendGrid Documentation](https://docs.sendgrid.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/) 