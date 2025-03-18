import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import PageHero from '../components/common/PageHero';

// Sample blog post data - in a real app, this would come from a CMS or backend
const blogPosts = [
  {
    id: 1,
    title: 'Drywall Maintenance Tips for Lasting Beauty',
    summary: 'Learn practical ways to keep your drywall looking flawless year-round with these essential maintenance tips.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque...',
    category: 'Maintenance',
    author: 'Steve Johnson',
    publishDate: '2023-10-15',
    readTime: '5 min read',
    image: '/images/services/drywall-installation.jpg',
    featured: true
  },
  {
    id: 2,
    title: 'Common Drywall Repair Issues & How We Fix Them',
    summary: 'Discover the most frequent drywall problems homeowners face and how our professional techniques can restore your walls.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque...',
    category: 'Repairs',
    author: 'Allie Smith',
    publishDate: '2023-09-28',
    readTime: '7 min read',
    image: '/images/services/tools.jpg',
    featured: true
  },
  {
    id: 3,
    title: 'Choosing the Right Finish: Level 5 vs. Knockdown vs. Custom',
    summary: 'Not sure which drywall finish is right for your project? We break down the differences to help you decide.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque...',
    category: 'Techniques',
    author: 'Steve Johnson',
    publishDate: '2023-08-19',
    readTime: '6 min read',
    image: '/images/services/texture-application.jpg',
    featured: false
  },
  {
    id: 4,
    title: 'Project Spotlight: Modern Basement Transformation',
    summary: 'See how we transformed a basic unfinished basement into a stylish living space with premium drywall techniques.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque...',
    category: 'Case Studies',
    author: 'Allie Smith',
    publishDate: '2023-07-25',
    readTime: '8 min read',
    image: '/images/services/drywall-taping.jpg',
    featured: false
  },
  {
    id: 5,
    title: 'Eco-Friendly Drywall Options for Sustainable Homes',
    summary: 'Explore environmentally-conscious drywall materials and techniques for those looking to build or renovate with sustainability in mind.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque...',
    category: 'Materials',
    author: 'Steve Johnson',
    publishDate: '2023-06-12',
    readTime: '6 min read',
    image: '/images/services/consultation.jpg',
    featured: false
  },
  {
    id: 6,
    title: 'How to Prepare Your Home for a Drywall Project',
    summary: 'Follow our step-by-step guide to ensure your home is properly prepared before our team arrives for your drywall project.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque...',
    category: 'Tips',
    author: 'Allie Smith',
    publishDate: '2023-05-30',
    readTime: '5 min read',
    image: '/images/services/drywall-installation.jpg',
    featured: false
  }
];

// Extract categories for filter
const categories = ["All", ...new Set(blogPosts.map(post => post.category))];

const BlogPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Filter posts based on category and search term
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get featured posts
  const featuredPosts = filteredPosts.filter(post => post.featured);
  // Get other posts
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <>
      <Helmet>
        <title>Drywall Blog | Tips & Inspiration | Seamless Edge</title>
        <meta name="description" content="Stay up-to-date with professional drywall tips, project showcases, and industry insights on the Seamless Edge blog." />
        <meta name="keywords" content="drywall blog, drywall tips, wall finishing techniques, drywall repair advice" />
        <link rel="canonical" href="https://seamlessedgeco.com/blog" />
        {/* Open Graph / Social Media */}
        <meta property="og:title" content="Drywall Tips & Inspiration Blog | Seamless Edge" />
        <meta property="og:description" content="Professional advice, project showcases, and industry insights from Calgary's premier drywall specialists." />
        <meta property="og:image" content="/images/services/texture-application.jpg" />
        <meta property="og:url" content="https://seamlessedgeco.com/blog" />
        <meta property="og:type" content="website" />
      </Helmet>

      <PageHero 
        title="Drywall Blog & Tips" 
        subtitle="Expert advice, project showcases, and industry knowledge for your drywall projects"
        backgroundImage="/images/updated/services/sage-office-plants.jpg"
      />

      <section className="py-12 bg-gradient-to-b from-neutral-offwhite/50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              {/* Search box */}
              <div className="flex-grow">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-accent-forest focus:border-accent-forest"
                />
              </div>
              
              {/* Category filter */}
              <div className="w-full md:w-auto">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-accent-forest focus:border-accent-forest bg-white"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "All" ? "All Categories" : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold font-heading mb-8 text-accent-navy text-center">Featured Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {featuredPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="bg-white rounded-lg overflow-hidden shadow-md transition-shadow duration-300 hover:shadow-lg"
                  >
                    <div className="h-64 relative">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-accent-forest text-white text-xs font-medium px-2 py-1 rounded-full">
                        {post.category}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold font-heading mb-2 text-accent-navy">{post.title}</h3>
                      <p className="text-gray-600 mb-4 font-body">{post.summary}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 font-body">{formatDate(post.publishDate)} • {post.readTime}</span>
                        <button className="text-accent-forest font-medium hover:underline">Read More</button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          
          {/* All Articles */}
          <div>
            <h2 className="text-3xl font-bold font-heading mb-8 text-accent-navy text-center">All Articles</h2>
            {filteredPosts.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-xl font-bold text-gray-700 mb-2">No articles found</h3>
                <p className="text-gray-500">Try changing your search terms or category filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {regularPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:translate-y-[-5px]"
                  >
                    <div className="h-48 relative">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 bg-accent-forest/80 text-white text-xs font-medium px-2 py-1 rounded-full">
                        {post.category}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold font-heading mb-2 text-accent-navy">{post.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 font-body line-clamp-2">{post.summary}</p>
                      <div className="flex items-center justify-between mt-auto text-sm text-gray-500 pt-3 border-t border-gray-100">
                        <span>{formatDate(post.publishDate)}</span>
                        <button className="text-accent-forest font-medium">Read More</button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
          
          {/* Debugging element to verify we're on the blog page */}
          <div className="fixed top-0 right-0 bg-accent-forest text-white p-1 text-xs m-1 z-[9999] rounded">
            Blog Page
          </div>
        </div>
      </section>
      
      {/* Newsletter section */}
      <section className="py-16 bg-gradient-to-b from-neutral-offwhite/50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl font-bold font-heading mb-4 text-accent-navy">Get Expert Tips Delivered</h2>
            <p className="text-gray-600 mb-6">Subscribe to our newsletter for the latest drywall tips and industry insights.</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-grow px-4 py-2 rounded-md border border-gray-300 focus:ring-accent-forest focus:border-accent-forest"
              />
              <button className="px-6 py-2 bg-accent-forest text-white font-medium rounded-md hover:bg-accent-forest/90 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogPage; 