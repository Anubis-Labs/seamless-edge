import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';

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
    image: '/images/blog/maintenance.jpg',
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
    image: '/images/blog/repairs.jpg',
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
    image: '/images/blog/finishes.jpg',
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
    image: '/images/blog/basement.jpg',
    featured: false
  },
  {
    id: 5,
    title: 'The Impact of Quality Drywall on Your Home Value',
    summary: 'Learn how investing in professional drywall installation and finishing can significantly increase your property value.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque...',
    category: 'Tips',
    author: 'Steve Johnson',
    publishDate: '2023-06-11',
    readTime: '4 min read',
    image: '/images/blog/value.jpg',
    featured: false
  },
  {
    id: 6,
    title: 'Sustainable Drywall Practices: Our Commitment to Eco-Friendly Solutions',
    summary: 'Discover how we\'re implementing environmentally responsible practices in our drywall installation and repair services.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque...',
    category: 'Sustainability',
    author: 'Allie Smith',
    publishDate: '2023-05-02',
    readTime: '5 min read',
    image: '/images/blog/eco.jpg',
    featured: false
  }
];

// For demo purposes, we'll create placeholder image URLs
// These would be replaced with actual images in production
const getPlaceholderImage = (id: number) => {
  return `https://source.unsplash.com/random/800x600?drywall,wall,construction,${id}`;
};

// Filter categories
const categories = ['All', 'Maintenance', 'Repairs', 'Techniques', 'Case Studies', 'Tips', 'Sustainability'];

const BlogPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Filter posts based on selected category
  const filteredPosts = activeCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  // Format date for display
  const formatDate = (dateString: string) => {
    const options = { 
      year: 'numeric' as const, 
      month: 'long' as const, 
      day: 'numeric' as const 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <>
      <Helmet>
        <title>Blog & Resources | Seamless Edge</title>
        <meta name="description" content="Explore drywall tips, industry insights, and expert advice from the Seamless Edge team. Learn about maintenance, repairs, and the latest techniques." />
      </Helmet>

      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog & Resources</h1>
          <p className="text-xl mb-0">Expert insights, industry tips, and project showcases from the Seamless Edge team</p>
        </div>
      </section>
      
      {/* Blog Introduction */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <p className="text-xl mb-8">
            Welcome to our blog, where industry insights, project tips, and expert advice come together. Stay updated on the latest trends in drywall finishing and learn how to maintain your surfaces for lasting beauty.
          </p>
          
          {/* Filter Controls */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Browse by Topic</h2>
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    activeCategory === category
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Posts */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Featured Articles</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredPosts
              .filter(post => post.featured)
              .map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-lg overflow-hidden shadow-lg flex flex-col md:flex-row"
                >
                  <div 
                    className="md:w-2/5 h-60 md:h-auto bg-cover bg-center"
                    style={{ backgroundImage: `url(${post.image || getPlaceholderImage(post.id)})` }}
                  />
                  <div className="md:w-3/5 p-6">
                    <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded mb-2">
                      {post.category}
                    </span>
                    <h3 className="text-2xl font-semibold mb-2">{post.title}</h3>
                    <p className="text-gray-600 mb-4">{post.summary}</p>
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <span className="mr-3">{formatDate(post.publishDate)}</span>
                      <span>{post.readTime}</span>
                    </div>
                    <a href={`/blog/${post.id}`} className="text-primary font-medium hover:underline inline-flex items-center">
                      Read Article
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </section>
      
      {/* All Posts */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Latest Articles</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-gray-50 rounded-lg overflow-hidden shadow-md"
              >
                <div 
                  className="h-48 bg-cover bg-center"
                  style={{ backgroundImage: `url(${post.image || getPlaceholderImage(post.id)})` }}
                />
                <div className="p-6">
                  <span className="inline-block bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded mb-2">
                    {post.category}
                  </span>
                  <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{post.summary}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span className="mr-3">{formatDate(post.publishDate)}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <a href={`/blog/${post.id}`} className="text-primary font-medium hover:underline inline-flex items-center">
                    Read Article
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Newsletter Signup */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl mb-8">Subscribe to our newsletter for the latest drywall tips, industry insights, and exclusive offers.</p>
          
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
            <button
              type="submit"
              className="bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-primary-dark transition duration-300"
            >
              Subscribe
            </button>
          </form>
          <p className="text-sm text-gray-500 mt-4">We respect your privacy. Unsubscribe at any time.</p>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Apply what you've learned and let our experts help you create the perfect drywall finish for your space.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/quote" className="bg-white text-primary font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition duration-300">Get a Free Quote</a>
            <a href="/contact" className="bg-transparent border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-primary transition duration-300">Contact Us</a>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogPage; 