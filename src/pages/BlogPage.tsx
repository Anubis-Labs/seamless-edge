import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import PageHero from '../components/common/PageHero';
import supabaseService from '../services/supabaseService';
import { FaSpinner, FaCalendarAlt, FaTags, FaClock } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Define BlogPost type based on database schema
interface BlogPost {
  id: number;
  title: string;
  summary?: string;
  content: string;
  category: string;
  author_id: string | null;
  published_at: string;
  featured_image?: string | null;
  status: string; // 'draft' | 'published'
  slug: string;
  tags: string[];
  created_at?: string;
  updated_at?: string;
  profiles?: { name: string | null } | null;
}

const BlogPage: React.FC = () => {
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fetch blog posts on mount
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Only fetch published posts
        const fetchedPosts = await supabaseService.blog.getPublishedPosts();
        setAllPosts(fetchedPosts || []);
        
        // Also fetch featured posts separately
        const featuredPosts = await supabaseService.blog.getFeaturedPosts(3);
        setFeaturedPosts(featuredPosts || []);

        // Dynamically generate categories from fetched posts
        const uniqueCategories = ["All", ...new Set(fetchedPosts.map((post: BlogPost) => post.category).filter(Boolean) as string[])];
        setCategories(uniqueCategories);
      } catch (err: any) {
        console.error("Error fetching blog posts:", err);
        setError("Failed to load blog posts. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Animation variants for smooth UI transitions
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date Unknown';
    try {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (e) {
        console.error("Error formatting date:", dateString, e);
        return 'Invalid Date';
    }
  };
  
  // Filter posts by category and search term
  const filteredPosts = allPosts.filter(post => {
    // Filter by category if not "All"
    const categoryMatch = selectedCategory === "All" || post.category === selectedCategory;
    
    // Filter by search term
    const searchMatch = !searchTerm || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.summary || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return categoryMatch && searchMatch;
  });

  return (
    <>
      <Helmet>
        <title>Blog | Seamless Edge</title>
        <meta name="description" content="Read our latest articles on home maintenance, repairs, and more." />
      </Helmet>
      
      <PageHero 
        backgroundImage="/images/blog-hero.jpg"
        title="Our Blog" 
        subtitle="Insights, tips, and expert advice for homeowners"
      />
      
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <div className="mb-20">
              <h2 className="text-3xl font-bold mb-10 text-center text-accent-navy">Featured Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {featuredPosts.map(post => (
                  <motion.div
                    key={post.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Link to={`/blog/${post.slug}`}>
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={post.featured_image || '/images/placeholder.jpg'} 
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-forest bg-opacity-10 text-accent-forest mr-2">
                            {post.category}
                          </span>
                          <span className="flex items-center">
                            <FaCalendarAlt className="mr-1" /> {formatDate(post.published_at)}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-accent-navy mb-2">{post.title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{post.summary}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-accent-forest font-medium">Read more</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          
          {/* Filters */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-accent-forest text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="w-full md:w-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-64 pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-forest focus:border-transparent"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FaSearch />
                </div>
              </div>
            </div>
          </div>
          
          {/* Blog posts */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <FaSpinner className="animate-spin text-4xl text-accent-forest" />
            </div>
          ) : error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center">
              {error}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium text-gray-600">No blog posts found matching your criteria.</h3>
              <button 
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchTerm("");
                }}
                className="mt-4 px-6 py-2 bg-accent-forest text-white rounded-full hover:bg-accent-navy transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map(post => (
                <motion.div
                  key={post.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                  transition={{ duration: 0.5 }}
                >
                  <Link to={`/blog/${post.slug}`}>
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={post.featured_image || '/images/placeholder.jpg'} 
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2">
                          {post.category}
                        </span>
                        <span className="flex items-center">
                          <FaCalendarAlt className="mr-1" /> {formatDate(post.published_at)}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-accent-navy mb-2">{post.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{post.summary}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-accent-forest font-medium">Read more</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

const FaSearch = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

export default BlogPage; 