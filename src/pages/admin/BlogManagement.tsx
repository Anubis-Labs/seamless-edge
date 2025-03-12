import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaSearch, 
  FaTags,
  FaCalendarAlt,
  FaUser,
  FaCheckCircle,
  FaTimesCircle,
  FaSave,
  FaImage
} from 'react-icons/fa';

// Define blog post interface
interface BlogPost {
  id: number;
  title: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  publishDate: string;
  readTime: string;
  image: string;
  featured: boolean;
  published: boolean;
  slug: string;
  tags: string[];
}

// Dummy data for blog posts
const dummyBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Drywall Maintenance Tips for Lasting Beauty',
    summary: 'Learn practical ways to keep your drywall looking flawless year-round with these essential maintenance tips.',
    content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque. Duis vulputate commodo lectus, ac blandit elit tincidunt id.</p><p>Sed et commodo nulla. Sed quis enim vel justo vehicula aliquet. Vivamus ultrices, erat id semper efficitur, libero lacus scelerisque urna, ut hendrerit eros quam non justo.</p><h3>Key Maintenance Tips</h3><ul><li>Regularly dust walls with a soft microfiber cloth</li><li>Address moisture issues immediately</li><li>Fill small holes as soon as they appear</li><li>Use proper cleaning solutions</li></ul>',
    category: 'Maintenance',
    author: 'Steve Johnson',
    publishDate: '2023-10-15',
    readTime: '5 min read',
    image: '/images/services/drywall-installation.jpg',
    featured: true,
    published: true,
    slug: 'drywall-maintenance-tips',
    tags: ['maintenance', 'cleaning', 'repair']
  },
  {
    id: 2,
    title: 'Common Drywall Repair Issues & How We Fix Them',
    summary: 'Discover the most frequent drywall problems homeowners face and how our professional techniques can restore your walls.',
    content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque. Duis vulputate commodo lectus, ac blandit elit tincidunt id.</p><p>Sed et commodo nulla. Sed quis enim vel justo vehicula aliquet. Vivamus ultrices, erat id semper efficitur, libero lacus scelerisque urna, ut hendrerit eros quam non justo.</p><h3>Common Issues</h3><ul><li>Nail pops and screw holes</li><li>Water damage</li><li>Cracks at seams</li><li>Impact damage</li></ul>',
    category: 'Repairs',
    author: 'Allie Smith',
    publishDate: '2023-09-28',
    readTime: '7 min read',
    image: '/images/services/tools.jpg',
    featured: true,
    published: true,
    slug: 'common-drywall-repair-issues',
    tags: ['repairs', 'water damage', 'cracks']
  },
  {
    id: 3,
    title: 'Choosing the Right Finish: Level 5 vs. Knockdown vs. Custom',
    summary: 'Not sure which drywall finish is right for your project? We break down the differences to help you decide.',
    content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque. Duis vulputate commodo lectus, ac blandit elit tincidunt id.</p><p>Sed et commodo nulla. Sed quis enim vel justo vehicula aliquet. Vivamus ultrices, erat id semper efficitur, libero lacus scelerisque urna, ut hendrerit eros quam non justo.</p><h3>Finish Types</h3><ul><li>Level 5 - The premium smooth finish</li><li>Knockdown - Textured but subtle</li><li>Orange Peel - Light texture</li><li>Custom - Artistic and unique</li></ul>',
    category: 'Techniques',
    author: 'Steve Johnson',
    publishDate: '2023-08-19',
    readTime: '6 min read',
    image: '/images/services/texture-application.jpg',
    featured: false,
    published: true,
    slug: 'choosing-right-drywall-finish',
    tags: ['finishes', 'textures', 'level 5', 'knockdown']
  },
  {
    id: 4,
    title: 'Project Spotlight: Modern Basement Transformation',
    summary: 'See how we transformed a basic unfinished basement into a stylish living space with premium drywall techniques.',
    content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque. Duis vulputate commodo lectus, ac blandit elit tincidunt id.</p><p>Sed et commodo nulla. Sed quis enim vel justo vehicula aliquet. Vivamus ultrices, erat id semper efficitur, libero lacus scelerisque urna, ut hendrerit eros quam non justo.</p><h3>Project Details</h3><ul><li>Full basement finishing</li><li>Custom lighting coves</li><li>Soundproofed home theater</li><li>Built-in storage solutions</li></ul>',
    category: 'Case Studies',
    author: 'Allie Smith',
    publishDate: '2023-07-25',
    readTime: '8 min read',
    image: '/images/services/drywall-taping.jpg',
    featured: false,
    published: true,
    slug: 'modern-basement-transformation',
    tags: ['projects', 'basement', 'renovation']
  },
  {
    id: 5,
    title: 'The Ultimate Guide to Soundproofing Your Walls',
    summary: 'Learn how to significantly reduce noise transmission through your walls with professional drywall techniques.',
    content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque. Duis vulputate commodo lectus, ac blandit elit tincidunt id.</p><p>Sed et commodo nulla. Sed quis enim vel justo vehicula aliquet. Vivamus ultrices, erat id semper efficitur, libero lacus scelerisque urna, ut hendrerit eros quam non justo.</p><h3>Soundproofing Methods</h3><ul><li>Double drywall layers with Green Glue</li><li>Resilient channel systems</li><li>Insulation options</li><li>Door and outlet sealing</li></ul>',
    category: 'Guides',
    author: 'Steve Johnson',
    publishDate: '2023-06-12',
    readTime: '10 min read',
    image: '/images/services/texture-application.jpg',
    featured: false,
    published: false,
    slug: 'ultimate-soundproofing-guide',
    tags: ['soundproofing', 'noise reduction', 'insulation']
  }
];

// Categories for filtering
const categories = [
  'All',
  'Maintenance',
  'Repairs',
  'Techniques',
  'Case Studies',
  'Guides'
];

const BlogManagementPage: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(dummyBlogPosts);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(dummyBlogPosts);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false);
  const [showOnlyPublished, setShowOnlyPublished] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  
  // Apply filters
  useEffect(() => {
    let result = [...blogPosts];
    
    // Apply category filter
    if (selectedCategory !== 'All') {
      result = result.filter(post => post.category === selectedCategory);
    }
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        post.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply featured filter
    if (showOnlyFeatured) {
      result = result.filter(post => post.featured);
    }
    
    // Apply published filter
    if (showOnlyPublished) {
      result = result.filter(post => post.published);
    }
    
    setFilteredPosts(result);
  }, [blogPosts, selectedCategory, searchTerm, showOnlyFeatured, showOnlyPublished]);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Handle deleting a post
  const handleDeleteClick = (id: number) => {
    setPostToDelete(id);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = () => {
    if (postToDelete) {
      setBlogPosts(prev => prev.filter(post => post.id !== postToDelete));
      setShowDeleteModal(false);
      setPostToDelete(null);
    }
  };
  
  // Handle editing a post
  const handleEditClick = (post: BlogPost) => {
    setEditingPost({...post});
    setIsCreatingNew(false);
  };
  
  // Handle creating a new post
  const handleCreateClick = () => {
    const newPost: BlogPost = {
      id: blogPosts.length > 0 ? Math.max(...blogPosts.map(p => p.id)) + 1 : 1,
      title: 'New Blog Post',
      summary: 'Enter a summary for your blog post here.',
      content: '<p>Start writing your blog post content here...</p>',
      category: 'Guides',
      author: 'Your Name',
      publishDate: new Date().toISOString().split('T')[0],
      readTime: '5 min read',
      image: '/images/services/drywall-installation.jpg',
      featured: false,
      published: false,
      slug: 'new-blog-post',
      tags: ['drywall']
    };
    
    setEditingPost(newPost);
    setIsCreatingNew(true);
  };
  
  // Handle saving a post
  const handleSavePost = () => {
    if (!editingPost) return;
    
    if (isCreatingNew) {
      setBlogPosts(prev => [...prev, editingPost]);
    } else {
      setBlogPosts(prev => prev.map(post => post.id === editingPost.id ? editingPost : post));
    }
    
    setEditingPost(null);
    setIsCreatingNew(false);
  };
  
  // Handle cancelling edit
  const handleCancelEdit = () => {
    setEditingPost(null);
    setIsCreatingNew(false);
  };
  
  // Handle input changes in edit form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (editingPost) {
      setEditingPost({
        ...editingPost,
        [name]: value
      });
    }
  };
  
  // Handle checkbox changes in edit form
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (editingPost) {
      setEditingPost({
        ...editingPost,
        [name]: checked
      });
    }
  };
  
  // Handle tags input
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim());
    if (editingPost) {
      setEditingPost({
        ...editingPost,
        tags
      });
    }
  };
  
  // Create slug from title
  const handleSlugGeneration = () => {
    if (editingPost) {
      const slug = editingPost.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
      
      setEditingPost({
        ...editingPost,
        slug
      });
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Blog Management | Seamless Edge Admin</title>
      </Helmet>
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-heading text-accent-navy mb-2">Blog Management</h1>
        <p className="text-gray-600 mb-6">
          Create, edit, and manage your blog posts. Use the filters to find specific content.
        </p>
      </div>
      
      {/* Controls */}
      {!editingPost && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-grow">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search posts by title, content, or tags..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-accent-forest focus:border-accent-forest"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            
            {/* Category filter */}
            <div className="w-full md:w-64">
              <select
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-accent-forest focus:border-accent-forest"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            {/* Create button */}
            <button
              className="bg-accent-forest text-white px-4 py-2 rounded-lg hover:bg-accent-forest/90 transition-colors flex items-center justify-center whitespace-nowrap"
              onClick={handleCreateClick}
            >
              <FaPlus className="mr-2" />
              New Post
            </button>
          </div>
          
          {/* Toggle filters */}
          <div className="flex flex-wrap gap-4">
            <label className="inline-flex items-center">
              <input 
                type="checkbox" 
                className="rounded border-gray-300 text-accent-forest focus:ring-accent-forest h-4 w-4"
                checked={showOnlyFeatured}
                onChange={(e) => setShowOnlyFeatured(e.target.checked)}
              />
              <span className="ml-2 text-sm text-gray-700">Featured posts only</span>
            </label>
            
            <label className="inline-flex items-center">
              <input 
                type="checkbox" 
                className="rounded border-gray-300 text-accent-forest focus:ring-accent-forest h-4 w-4"
                checked={showOnlyPublished}
                onChange={(e) => setShowOnlyPublished(e.target.checked)}
              />
              <span className="ml-2 text-sm text-gray-700">Published posts only</span>
            </label>
          </div>
        </div>
      )}
      
      {/* Blog Posts List */}
      {!editingPost && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-700 text-sm font-medium">
                <tr>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Author</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map(post => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded bg-gray-200 flex-shrink-0 mr-3 overflow-hidden">
                            <img 
                              src={post.image} 
                              alt={post.title} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">{post.title}</div>
                            <div className="text-xs text-gray-500 truncate max-w-xs">{post.summary}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {post.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">{post.author}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">{formatDate(post.publishDate)}</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {post.published ? 'Published' : 'Draft'}
                          </span>
                          {post.featured && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <button 
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => handleEditClick(post)}
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleDeleteClick(post.id)}
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                          <a 
                            href={`/blog/${post.slug}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-gray-800"
                            title="View"
                          >
                            <FaEye />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      No blog posts found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Edit/Create Form */}
      {editingPost && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-accent-navy">
              {isCreatingNew ? 'Create New Blog Post' : 'Edit Blog Post'}
            </h2>
            <div className="flex items-center gap-3">
              <button
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                onClick={handleCancelEdit}
              >
                <FaTimesCircle className="mr-2" />
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-accent-forest text-white rounded-lg hover:bg-accent-forest/90 transition-colors flex items-center"
                onClick={handleSavePost}
              >
                <FaSave className="mr-2" />
                Save Post
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main content column */}
            <div className="md:col-span-2 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Post Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={editingPost.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-accent-forest focus:border-accent-forest"
                  placeholder="Enter post title"
                />
              </div>
              
              {/* Slug with auto-generate */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    URL Slug
                  </label>
                  <button
                    type="button"
                    onClick={handleSlugGeneration}
                    className="text-xs text-accent-forest hover:text-accent-navy"
                  >
                    Generate from title
                  </button>
                </div>
                <input
                  type="text"
                  name="slug"
                  value={editingPost.slug}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-accent-forest focus:border-accent-forest"
                  placeholder="enter-url-slug"
                />
              </div>
              
              {/* Summary */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Summary
                </label>
                <textarea
                  name="summary"
                  value={editingPost.summary}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-accent-forest focus:border-accent-forest"
                  placeholder="Brief summary of your post"
                  rows={2}
                ></textarea>
              </div>
              
              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  name="content"
                  value={editingPost.content}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-accent-forest focus:border-accent-forest font-mono text-sm"
                  placeholder="Blog post content (HTML supported)"
                  rows={15}
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">
                  HTML formatting is supported. Use tags like &lt;p&gt;, &lt;h3&gt;, &lt;ul&gt;, &lt;li&gt;, etc.
                </p>
              </div>
              
              {/* Tags */}
              <div>
                <div className="flex items-center mb-1">
                  <FaTags className="text-gray-500 mr-2" />
                  <label className="block text-sm font-medium text-gray-700">
                    Tags
                  </label>
                </div>
                <input
                  type="text"
                  value={editingPost.tags.join(', ')}
                  onChange={handleTagsChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-accent-forest focus:border-accent-forest"
                  placeholder="e.g. repairs, maintenance, tips (comma separated)"
                />
              </div>
            </div>
            
            {/* Sidebar column */}
            <div className="space-y-6">
              {/* Featured image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Featured Image
                </label>
                <div className="border border-gray-300 rounded-lg p-2">
                  <div className="aspect-w-16 aspect-h-9 mb-3 bg-gray-100 rounded overflow-hidden">
                    <img 
                      src={editingPost.image} 
                      alt="Featured" 
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex justify-between">
                    <input
                      type="text"
                      name="image"
                      value={editingPost.image}
                      onChange={handleInputChange}
                      className="flex-grow px-3 py-1 text-sm rounded border border-gray-300 focus:ring-accent-forest focus:border-accent-forest"
                      placeholder="/images/path-to-image.jpg"
                    />
                    <button
                      type="button"
                      className="ml-2 p-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200"
                      title="Upload image (not implemented in demo)"
                    >
                      <FaImage />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={editingPost.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-accent-forest focus:border-accent-forest"
                >
                  {categories.filter(c => c !== 'All').map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              {/* Author */}
              <div>
                <div className="flex items-center mb-1">
                  <FaUser className="text-gray-500 mr-2" />
                  <label className="block text-sm font-medium text-gray-700">
                    Author
                  </label>
                </div>
                <input
                  type="text"
                  name="author"
                  value={editingPost.author}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-accent-forest focus:border-accent-forest"
                  placeholder="Author name"
                />
              </div>
              
              {/* Publish date */}
              <div>
                <div className="flex items-center mb-1">
                  <FaCalendarAlt className="text-gray-500 mr-2" />
                  <label className="block text-sm font-medium text-gray-700">
                    Publish Date
                  </label>
                </div>
                <input
                  type="date"
                  name="publishDate"
                  value={editingPost.publishDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-accent-forest focus:border-accent-forest"
                />
              </div>
              
              {/* Read time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Read Time
                </label>
                <input
                  type="text"
                  name="readTime"
                  value={editingPost.readTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-accent-forest focus:border-accent-forest"
                  placeholder="e.g. 5 min read"
                />
              </div>
              
              {/* Status toggles */}
              <div className="pt-4 border-t border-gray-100">
                <div className="space-y-4">
                  <label className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Featured Post</span>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input 
                        type="checkbox" 
                        name="featured"
                        id="featured"
                        checked={editingPost.featured}
                        onChange={handleCheckboxChange}
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer"
                      />
                      <label 
                        htmlFor="featured"
                        className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                          editingPost.featured ? 'bg-accent-forest' : 'bg-gray-300'
                        }`}
                      ></label>
                    </div>
                  </label>
                  
                  <label className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Published</span>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input 
                        type="checkbox" 
                        name="published"
                        id="published"
                        checked={editingPost.published}
                        onChange={handleCheckboxChange}
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer"
                      />
                      <label 
                        htmlFor="published"
                        className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                          editingPost.published ? 'bg-accent-forest' : 'bg-gray-300'
                        }`}
                      ></label>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete this blog post? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Toggle styles for the checkbox toggles */}
      <style>
        {`
         .toggle-checkbox:checked {
           right: 0;
           border-color: #1F7A5C;
         }
         .toggle-checkbox:checked + .toggle-label {
           background-color: #1F7A5C;
         }
         .toggle-checkbox {
           right: 0;
           transition: all 0.3s;
         }
         .toggle-label {
           transition: all 0.3s;
         }
        `}
      </style>
    </>
  );
};

export default BlogManagementPage; 