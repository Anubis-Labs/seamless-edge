import React, { useState, useEffect, useCallback } from 'react';
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
  FaImage,
  FaSpinner
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import supabaseService from '../../services/supabaseService';
import FileUpload from '../../components/common/FileUpload';
import { supabase } from '../../lib/supabaseClient'; // Import supabase client for auth

// Define blog post interface matching Supabase schema
interface BlogPost {
  id: number;
  title: string;
  summary?: string; // Assuming this was added via migration
  content: string;
  category: string;
  author_id: string | null; // Changed from author: string
  published_at: string | null; // Renamed from publish_date, allow null
  // read_time?: string; // Removed, doesn't exist in schema
  featured_image?: string | null; // Renamed from image, allow null
  // featured: boolean; // Removed, doesn't exist in schema
  status: string; // 'draft' | 'published'
  slug: string;
  tags: string[]; // Assuming stored as JSONB, handle parsing/stringifying
  created_at?: string;
  updated_at?: string;
  // Add fields to display author name if needed later
  profiles?: { name: string | null } | null;
}

// Categories - consider fetching these from DB or config later
const categories = [
  'Maintenance',
  'Repairs',
  'Techniques',
  'Case Studies',
  'Guides'
];

const BlogManagementPage: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  // const [showOnlyFeatured, setShowOnlyFeatured] = useState(false); // Removed
  const [showOnlyPublished, setShowOnlyPublished] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Fetch posts from Supabase
  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Modify service call if needed to fetch author profile name
      // Example: .select('*, profiles(name)')
      const data = await supabaseService.blog.getPosts(); 
      // Ensure tags is an array
      const formattedData = (data || []).map((post: any) => ({
        ...post,
        tags: Array.isArray(post.tags) ? post.tags : [], // Handle if tags are not array
        published_at: post.published_at || null, // Ensure null if missing
        author_id: post.author_id || null
      }));
      setBlogPosts(formattedData as BlogPost[]);
    } catch (err: any) {
      console.error("Error fetching blog posts:", err);
      setError('Failed to fetch blog posts. Please try again.');
      toast.error('Failed to fetch blog posts.');
      setBlogPosts([]); // Clear posts on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);
  
  // Apply filters (client-side for now)
  useEffect(() => {
    let filtered = [...blogPosts];
    
    // ... filtering logic ... 
    // Remove author text search or adapt if fetching profiles
    // if (searchTerm) { ... }
    
    // Remove featured filter as column doesn't exist
    // if (showOnlyFeatured) { ... }

    setFilteredPosts(filtered);
  }, [blogPosts, selectedCategory, searchTerm, /* showOnlyFeatured, */ showOnlyPublished]); // Removed showOnlyFeatured
  
  // Format date for display
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    try {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (e) {
        console.error("Error formatting date:", dateString, e);
        return dateString; 
    }
  };
  
  // Handle deleting a post
  const handleDeleteClick = (id: number) => {
    setPostToDelete(id);
    setShowDeleteModal(true);
  };
  
  // Confirm Delete Action
  const confirmDelete = async () => {
    if (!postToDelete) return;
    // Use isSaving state here for consistency
    setIsSaving(true); 
    try {
      await supabaseService.blog.deletePost(postToDelete);
      toast.success('Blog post deleted successfully!');
      setPostToDelete(null);
      setShowDeleteModal(false);
      await fetchPosts();
    } catch (err: any) {
      console.error("Error deleting post:", err);
      toast.error(`Failed to delete post: ${err.message}`);
      setError(`Failed to delete post: ${err.message}`);
    } finally {
      // Ensure saving state is reset
      setIsSaving(false);
    }
  };

  // Handle cancelling edit
  const handleCancelEdit = () => {
    setEditingPost(null);
    setIsCreatingNew(false);
    setError(null);
  };

  // Handle editing a post
  const handleEditClick = (post: BlogPost) => {
     // Ensure tags are handled correctly on edit start
    setEditingPost({
      ...JSON.parse(JSON.stringify(post)), // Deep copy
      tags: Array.isArray(post.tags) ? post.tags : [],
      published_at: post.published_at ? post.published_at.split('T')[0] : new Date().toISOString().split('T')[0] // Format for date input
    });
    setIsCreatingNew(false);
  };
  
  // Handle creating a new post
  const handleCreateClick = () => {
    // Use author_id: null initially and correct field names
    const newPost: Partial<BlogPost> = { // Use Partial initially
      title: '',
      summary: '',
      content: '<p></p>',
      category: categories[0],
      author_id: null, // Set to null initially
      published_at: new Date().toISOString(), // Store full ISO string initially
      featured_image: '',
      status: 'draft', 
      slug: '',
      tags: []
    };
    setEditingPost(newPost as BlogPost); // Cast carefully or refine type
    setIsCreatingNew(true);
  };
  
  // Handle saving a post (Create or Update)
  const handleSavePost = async () => {
    if (!editingPost) return;
    
    // Fetch current user ID before saving
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        toast.error("You must be logged in to save a post.");
        setIsSaving(false);
        return;
    }

    setIsSaving(true);
    setError(null);

    // Update validation check
    if (!editingPost.title || !editingPost.slug || !editingPost.category || !editingPost.published_at) {
      toast.error("Please fill in Title, Slug, Category, and Publish Date.");
      setIsSaving(false);
      return;
    }

    try {
      // Prepare data carefully, excluding DB-managed fields, adding author_id
      const { id, created_at, updated_at, profiles, ...dataToSubmit } = {
          ...editingPost,
          author_id: user.id, // Set author_id to current user
          tags: JSON.stringify(editingPost.tags || []) // Ensure tags are stringified for JSONB
      };

      if (isCreatingNew) {
        await supabaseService.blog.createPost(dataToSubmit);
        toast.success('Blog post created!');
      } else {
        if (!id) {
          throw new Error("Cannot update post without a valid ID.");
        }
        await supabaseService.blog.updatePost(id, dataToSubmit);
        toast.success('Blog post updated!');
      }
      setEditingPost(null);
      setIsCreatingNew(false);
      await fetchPosts(); // Refetch data
    } catch (err: any) {
      console.error("Error saving post:", err);
      const errorMessage = `Failed to save post: ${err.message}`;
      // Check for specific Supabase errors if needed
      if (err.message?.includes("duplicate key value violates unique constraint")) {
         toast.error("Failed to save: A post with this slug already exists.");
      } else {
         toast.error(errorMessage);
      }
      setError(errorMessage); // Show error in the component/modal
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle input changes in edit form (adjust for published_at)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (editingPost) {
       // Handle date input correctly
       const newValue = name === 'published_at' ? (value ? new Date(value).toISOString() : null) : value;
      setEditingPost({
        ...editingPost,
        [name]: newValue
      });
    }
  };
  
  // Handle checkbox changes in edit form (remove 'featured')
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (editingPost) {
      // Only handle status conversion now
      if (name === 'published') { 
        setEditingPost({
          ...editingPost,
          status: checked ? 'published' : 'draft'
        });
      } 
      // Removed else block for featured checkbox
    }
  };
  
  // Handle tags input (ensure it sets array)
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value ? e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '') : [];
    if (editingPost) {
      setEditingPost({
        ...editingPost,
        tags
      });
    }
  };
  
  // ... handleSlugGeneration ...
  
  // Update image upload handler to use featured_image
  const handleImageUpload = (imageUrl: string) => {
    if (editingPost) {
      setEditingPost({
        ...editingPost,
        featured_image: imageUrl
      });
      toast.success('Image uploaded successfully');
    }
  };
  
  // ... handleSlugGeneration (Add if missing) ...
  const handleSlugGeneration = () => {
    if (editingPost) {
      const slug = (editingPost.title || '')
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // remove non-word [a-z0-9_], non-whitespace, non-hyphen chars
        .replace(/\s+/g, '-') // swap whitespace for single hyphen
        .replace(/-+/g, '-'); // collapse multiple hyphens
      
      setEditingPost({
        ...editingPost,
        slug
      });
    }
  };
  
  return (
    <>
      {/* ... Helmet ... */}
      
      <div className="mb-8">
       {/* ... Title, Error display ... */} 
      </div>
      
      {/* Controls - remove featured filter toggle */}
      {!editingPost && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          {/* ... Search, Category Filter, Create Button ... */}
          <div className="flex flex-wrap gap-4 mb-4 justify-between items-center">
            <div className="relative flex-grow max-w-md">
              <input
                type="text"
                placeholder="Search posts..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-accent-forest focus:border-accent-forest w-full disabled:opacity-50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isLoading}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            
            <select
              className="py-2 px-4 border border-gray-300 rounded-lg focus:ring-accent-forest focus:border-accent-forest disabled:opacity-50"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              disabled={isLoading}
            >
              <option value="All">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <button
              onClick={handleCreateClick}
              className="bg-accent-forest text-white px-4 py-2 rounded-lg flex items-center justify-center hover:bg-accent-forest-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              <FaPlus className="mr-2" /> Add New Post
            </button>
          </div>
          
          {/* Toggle filters - remove Featured */}
          <div className="flex flex-wrap gap-4">
            {/* <label className="inline-flex items-center"> ... Featured checkbox removed ... </label> */}
            
            <label className="inline-flex items-center">
              <input 
                type="checkbox" 
                className="rounded border-gray-300 text-accent-forest focus:ring-accent-forest h-4 w-4 disabled:opacity-50"
                checked={showOnlyPublished}
                onChange={(e) => setShowOnlyPublished(e.target.checked)}
                disabled={isLoading}
              />
              <span className="ml-2 text-sm text-gray-700">Published posts only</span>
            </label>
          </div>
        </div>
      )}
      
      {/* Blog Posts List or Loading State */}
      {!editingPost && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
             <div className="py-12 text-center text-gray-500 flex items-center justify-center">
               <FaSpinner className="animate-spin h-5 w-5 mr-3" />
               Loading posts...
             </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-700 text-sm font-medium">
                  <tr>
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Date</th> 
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-8 text-gray-500">No posts found.</td></tr>
                  ) : (
                    filteredPosts.map(post => (
                      <tr key={post.id} className="border-b border-gray-200 hover:bg-gray-50 text-gray-800">
                        <td className="py-3 px-4 font-medium">{post.title}</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {post.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{formatDate(post.published_at)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded bg-gray-200 flex-shrink-0 mr-3 overflow-hidden">
                              {post.featured_image ? (
                                <img 
                                  src={post.featured_image} 
                                  alt={post.title} 
                                  className="h-full w-full object-cover"
                                  onError={(e) => (e.currentTarget.src = '/placeholder-image.png')}
                                />
                              ) : (
                                <div className="h-full w-full bg-gray-300 flex items-center justify-center">
                                  <FaImage className="text-gray-500" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-800">{post.title}</div>
                              <div className="text-xs text-gray-500 truncate max-w-xs">{post.summary}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {post.status === 'published' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              <FaCheckCircle className="mr-1" /> Published
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <FaTimesCircle className="mr-1" /> Draft
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <button 
                              className="text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={() => handleEditClick(post)}
                              title="Edit"
                              disabled={isSaving}
                            >
                              <FaEdit />
                            </button>
                            <button 
                              className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={() => handleDeleteClick(post.id)}
                              title="Delete"
                              disabled={isSaving}
                            >
                              <FaTrash />
                            </button>
                            <a 
                              href={post.slug ? `/blog/${post.slug}` : '#'}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className={`text-gray-600 hover:text-gray-800 ${!post.slug ? 'opacity-50 cursor-not-allowed' : ''}`}
                              title="View Post"
                              aria-disabled={!post.slug}
                              onClick={(e) => !post.slug && e.preventDefault()}
                            >
                              <FaEye />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      
      {/* Edit/Create Form */}
      {editingPost && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-accent-navy">
              {isCreatingNew ? 'Create New Blog Post' : 'Edit Blog Post'}
            </h2>
            <div className="flex items-center gap-3">
              <button
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center disabled:opacity-50"
                onClick={handleCancelEdit}
                disabled={isSaving}
              >
                <FaTimesCircle className="mr-2" />
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-accent-forest text-white rounded-lg hover:bg-accent-forest/90 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSavePost}
                disabled={isSaving}
              >
                {isSaving ? <FaSpinner className="animate-spin mr-2" /> : <FaSave className="mr-2" />}
                {isSaving ? 'Saving...' : 'Save Post'}
              </button>
            </div>
          </div>
          
          <form onSubmit={(e) => { e.preventDefault(); handleSavePost(); }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Post Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={editingPost.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-accent-forest focus:border-accent-forest disabled:bg-gray-100"
                    placeholder="Enter post title"
                    disabled={isSaving}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                      URL Slug
                    </label>
                    <button
                      type="button"
                      onClick={handleSlugGeneration}
                      className="text-xs text-accent-forest hover:text-accent-navy disabled:opacity-50"
                      disabled={isSaving}
                    >
                      Generate from title
                    </button>
                  </div>
                  <input
                    type="text"
                    name="slug"
                    value={editingPost.slug}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-accent-forest focus:border-accent-forest disabled:bg-gray-100"
                    placeholder="enter-url-slug"
                    disabled={isSaving}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Summary
                  </label>
                  <textarea
                    name="summary"
                    value={editingPost.summary}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-accent-forest focus:border-accent-forest disabled:bg-gray-100"
                    placeholder="Brief summary of your post"
                    rows={2}
                    disabled={isSaving}
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    name="content"
                    value={editingPost.content}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-accent-forest focus:border-accent-forest disabled:bg-gray-100"
                    placeholder="Blog post content (HTML supported)"
                    rows={15}
                    disabled={isSaving}
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-1">
                    HTML formatting is supported. Use tags like &lt;p&gt;, &lt;h3&gt;, &lt;ul&gt;, &lt;li&gt;, etc.
                  </p>
                </div>
                
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
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-accent-forest focus:border-accent-forest disabled:bg-gray-100"
                    placeholder="e.g. repairs, maintenance, tips (comma separated)"
                    disabled={isSaving}
                  />
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Featured Image
                  </label>
                  <div className="border border-gray-300 rounded-lg p-2">
                    <div className="aspect-w-16 aspect-h-9 mb-3 bg-gray-100 rounded overflow-hidden">
                      {editingPost.featured_image ? (
                        <img 
                          src={editingPost.featured_image} 
                          alt="Featured" 
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gray-200">
                          <FaImage className="text-4xl text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <FileUpload
                        bucketName="blog-images"
                        onUploadComplete={handleImageUpload}
                        acceptedFileTypes="image/*"
                        label="Upload Image"
                      />
                      <div className="flex items-center">
                        <input
                          type="text"
                          name="featured_image"
                          value={editingPost.featured_image || ''}
                          onChange={handleInputChange}
                          className="flex-grow px-3 py-1 text-sm rounded border border-gray-300 focus:ring-accent-forest focus:border-accent-forest disabled:bg-gray-100"
                          placeholder="Or enter image URL directly"
                          disabled={isSaving}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={editingPost.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-accent-forest focus:border-accent-forest disabled:bg-gray-100"
                    disabled={isSaving}
                  >
                    {categories.filter(c => c !== 'All').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <div className="flex items-center mb-1">
                    <FaCalendarAlt className="text-gray-500 mr-2" />
                    <label className="block text-sm font-medium text-gray-700">
                      Publish Date
                    </label>
                  </div>
                  <input
                    type="date"
                    name="published_at"
                    value={(editingPost.published_at || '').split('T')[0]}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-accent-forest focus:border-accent-forest disabled:bg-gray-100"
                    disabled={isSaving}
                  />
                </div>
                
                <div className="flex items-center space-x-3">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="published"
                      checked={editingPost.status === 'published'}
                      onChange={handleCheckboxChange}
                      className="form-checkbox h-5 w-5 text-accent-forest rounded focus:ring-accent-forest"
                      disabled={isSaving}
                    />
                    <span className="ml-2 text-gray-700">Published</span>
                  </label>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete the post "{blogPosts.find(p => p.id === postToDelete)?.title || 'this post'}"? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50" onClick={() => setShowDeleteModal(false)} disabled={isLoading}>Cancel</button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed" onClick={confirmDelete} disabled={isLoading}>
                 {isLoading ? <FaSpinner className="animate-spin mr-2" /> : <FaTrash className="mr-2" />} {isLoading ? 'Deleting...' : 'Delete'}
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