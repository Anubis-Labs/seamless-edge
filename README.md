# Seamless Edge - Drywall Services Website

A modern, responsive website for Seamless Edge, a drywall installation and finishing services company based in Alberta.

## Features

- **Modern UI Design**: Clean, responsive interface optimized for all device sizes
- **Interactive Quote Calculator**: Allows customers to get quick price estimates
- **Admin Dashboard**: Secure admin interface to manage website content and calculator settings
- **Service Showcase**: Highlights the company's drywall services with rich visuals
- **Performance Optimized**: Fast loading times with modern web technologies
- **Careers Section**: Job listings with detailed information and application integration
- **Blog & Gallery**: Showcase projects and share industry insights
- **Responsive Navigation**: Mobile-friendly menu with smooth transitions

## Technologies Used

- **Frontend Framework**: React with TypeScript
- **Styling**: Tailwind CSS for responsive design
- **Routing**: React Router for seamless navigation
- **Animation**: Framer Motion for smooth UI animations
- **SEO**: React Helmet for search engine optimization
- **Icons**: React Icons for consistent visual elements
- **Form Handling**: Managed form state with React Hooks

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/Anubis-Labs/seamless-edge.git
   cd seamless-edge
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```
   npm start
   # or
   yarn start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Admin Access

The website includes an admin dashboard for managing calculator settings, job listings, and other content:

- **URL**: `/admin/login`
- **Default Credentials**:
  - Username: admin
  - Password: seamlessedge2023

⚠️ Note: For production, please change these default credentials!

## Project Structure

- `/src/components`: Reusable UI components
- `/src/pages`: Page layout components
- `/src/services`: Service layer for API interactions
- `/src/data`: Static data and calculator settings
- `/src/components/admin`: Admin-specific components
- `/src/pages/admin`: Admin page components
- `/src/components/forms`: Form components including job application forms
- `/src/components/layout`: Layout components like Header, Footer, and PageHero

## Key Features Highlights

### Careers & Job Management
- Public-facing job listings page with featured positions
- Detailed job view with responsibilities, requirements, and benefits
- Admin interface for creating, editing, and managing job postings
- Open application system integrated with contact form

### Interactive Elements
- Animated page transitions and UI elements
- Interactive quote calculator with dynamic pricing
- Mobile-responsive design with custom animations

## License

[MIT](LICENSE)

## Contact

Seamless Edge - [contact@seamlessedge.com](mailto:contact@seamlessedge.com)

Project Link: [https://github.com/Anubis-Labs/seamless-edge](https://github.com/Anubis-Labs/seamless-edge)

# Seamless Edge Admin System

A comprehensive admin panel for managing a construction/renovation business, focusing on drywall and painting services. This system provides a complete interface for managing bookings, blog content, testimonials, clients, and business analytics.

## Features

### Dashboard
- Business metrics and KPIs
- Revenue tracking and visualization
- Project status overview
- Recent activity feed
- Upcoming bookings

### Booking Calendar
- Visual calendar interface for scheduling
- Create, update, and delete bookings
- Client information collection
- Service type categorization
- Status tracking (pending, confirmed, completed, cancelled)

### Blog Manager
- Create and edit blog posts with rich text editor
- Media upload for featured images
- Category and tag management
- Draft/publish workflow
- Content preview

### Testimonial Manager
- Client testimonial collection and management
- Approval workflow (pending, approved, rejected)
- Rating system
- Featured testimonials for homepage display

### Client Manager
- Client database with detailed profiles
- Project history tracking
- Search and filtering capabilities
- Lead management
- Contact information storage

## Tech Stack

- **Frontend**: React with TypeScript
- **UI Framework**: Material UI
- **State Management**: React Hooks
- **Routing**: React Router
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Charts**: Chart.js with react-chartjs-2
- **Calendar**: react-big-calendar
- **Rich Text Editor**: React Quill

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/seamless-edge-admin.git
   cd seamless-edge-admin
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with your Supabase credentials:
   ```
   REACT_APP_SUPABASE_URL=https://your-project.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your-anon-key
   ```

4. Start the development server:
   ```
   npm start
   ```

## Database Setup

The application requires the following tables in your Supabase project:

- `blog_posts`: Store blog content
- `blog_categories`: Categories for blog posts
- `testimonials`: Client testimonials and ratings
- `clients`: Client information and status
- `projects`: Project details linked to clients
- `bookings`: Appointment and scheduling information

See the SQL setup scripts in the `/docs` directory for detailed schema information.

## Supabase Storage Buckets

Create the following storage buckets in your Supabase project:

- `blog-images`: For blog featured images and content media
- `testimonial-images`: For client photos in testimonials
- `project-images`: For project gallery images

## Authentication

This admin system uses Supabase authentication. To set up admin users:

1. Go to your Supabase dashboard
2. Navigate to Authentication → Users
3. Invite users via email or create them directly
4. Assign appropriate permissions

## Deployment

To build for production:

```
npm run build
```

The built files will be in the `build` directory, ready to be deployed to your hosting service of choice.

## License

MIT 