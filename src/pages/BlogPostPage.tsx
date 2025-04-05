import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FaCalendarAlt, FaTags, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import supabaseService from '../services/supabaseService';
import PageHero from '../components/common/PageHero';

// Define interface for blog post based on database schema
interface BlogPost {
  id: number;
  title: string;
  summary?: string;
  content: string;
  category: string;
  author_id: string | null;
  published_at: string;
  featured_image?: string | null;
  status: string;
  slug: string;
  tags: string[];
  created_at?: string;
  updated_at?: string;
  // For displaying author info if joined with profiles
  profiles?: { name: string | null } | null;
}

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const postData = await supabaseService.blog.getPostBySlug(slug);
        
        if (!postData) {
          setError('Blog post not found');
          return;
        }
        
        setPost(postData);
        
        // Fetch related posts from the same category
        if (postData.category) {
          const posts = await supabaseService.blog.getPosts({ 
            category: postData.category, 
            status: 'published' 
          });
          
          // Filter out the current post and limit to 3 related posts
          const filtered = posts
            .filter((p: BlogPost) => p.id !== postData.id)
            .slice(0, 3);
            
          setRelatedPosts(filtered || []);
        }
      } catch (err: any) {
        console.error('Error fetching blog post:', err);
        setError('Failed to load blog post. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPost();
  }, [slug]);

  // Format date for display
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Date Unknown';
    try {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return 'Invalid Date';
    }
  };

  // Handle 404 or errors
  if (!isLoading && (error || !post)) {
    return (
      <>
        <Helmet>
          <title>Post Not Found | Seamless Edge</title>
        </Helmet>
        
        <PageHero 
          backgroundImage="/images/blog-hero.jpg"
          title="Blog Post Not Found" 
          subtitle="We couldn't find the blog post you're looking for"
        />
        
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {error || "The requested blog post could not be found"}
          </h2>
          <p className="text-gray-600 mb-8">
            The blog post you're looking for might have been removed or is temporarily unavailable.
          </p>
          <Link to="/blog" className="inline-flex items-center px-6 py-3 bg-accent-forest text-white rounded-lg hover:bg-accent-navy transition-colors">
            <FaArrowLeft className="mr-2" /> Back to Blog
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post?.title || 'Loading...'} | Seamless Edge Blog</title>
        <meta name="description" content={post?.summary || 'Loading blog post...'} />
      </Helmet>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-32">
          <FaSpinner className="animate-spin text-4xl text-accent-forest" />
        </div>
      ) : post && (
        <>
          {/* Hero section with post image */}
          <PageHero 
            backgroundImage={post.featured_image || '/images/blog-hero.jpg'}
            title={post.title} 
            subtitle={post.summary || ''}
          />
          
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Main content */}
                <div className="w-full md:w-3/4">
                  <div className="bg-white rounded-lg shadow-md p-8">
                    {/* Post meta information */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent-forest bg-opacity-10 text-accent-forest">
                        {post.category}
                      </span>
                      <span className="flex items-center">
                        <FaCalendarAlt className="mr-1" /> {formatDate(post.published_at)}
                      </span>
                      {post.tags && post.tags.length > 0 && (
                        <span className="flex items-center">
                          <FaTags className="mr-1" /> 
                          {Array.isArray(post.tags) 
                            ? post.tags.join(', ')
                            : typeof post.tags === 'string' 
                              ? post.tags
                              : ''}
                        </span>
                      )}
                    </div>
                    
                    {/* Post content */}
                    <div 
                      className="prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                    
                    {/* Back button */}
                    <div className="mt-12 pt-6 border-t border-gray-100">
                      <Link to="/blog" className="inline-flex items-center text-accent-forest hover:text-accent-navy transition-colors">
                        <FaArrowLeft className="mr-2" /> Back to all articles
                      </Link>
                    </div>
                  </div>
                </div>
                
                {/* Sidebar */}
                <div className="w-full md:w-1/4">
                  <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Related Articles</h3>
                    
                    {relatedPosts.length > 0 ? (
                      <div className="space-y-6">
                        {relatedPosts.map(relatedPost => (
                          <div key={relatedPost.id} className="group">
                            <Link to={`/blog/${relatedPost.slug}`} className="block">
                              <div className="h-32 mb-2 overflow-hidden rounded">
                                <img 
                                  src={relatedPost.featured_image || '/images/placeholder.jpg'} 
                                  alt={relatedPost.title}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              </div>
                              <h4 className="font-medium text-accent-navy group-hover:text-accent-forest transition-colors">
                                {relatedPost.title}
                              </h4>
                              <p className="text-sm text-gray-500 mt-1">
                                {formatDate(relatedPost.published_at)}
                              </p>
                            </Link>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No related articles found.</p>
                    )}
                    
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <Link 
                        to="/blog" 
                        className="inline-flex items-center justify-center w-full px-4 py-2 bg-accent-forest text-white rounded-lg hover:bg-accent-navy transition-colors"
                      >
                        View All Articles
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default BlogPostPage; 