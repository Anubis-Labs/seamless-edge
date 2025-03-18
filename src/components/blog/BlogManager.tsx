import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  Alert,
  Chip,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Delete as DeleteIcon, Edit as EditIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import FileUpload from '../common/FileUpload';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string;
  author_id: string;
  category: string;
  tags: string[];
  status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface BlogCategory {
  id: number;
  name: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`blog-tabpanel-${index}`}
      aria-labelledby={`blog-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function BlogManager() {
  const [tabValue, setTabValue] = useState(0);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isNewPost, setIsNewPost] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image: '',
    category: '',
    tags: [],
    status: 'draft',
  });

  // Custom tags input state
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchBlogPosts();
    fetchCategories();
  }, []);

  const fetchBlogPosts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        // Parse tags from JSON string if needed
        const posts = data.map((post: any) => ({
          ...post,
          tags: Array.isArray(post.tags) ? post.tags : JSON.parse(post.tags || '[]'),
        }));
        setBlogPosts(posts);
      }
    } catch (error: any) {
      console.error('Error fetching blog posts:', error.message);
      setError('Failed to load blog posts. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;

      if (data) {
        setCategories(data);
      }
    } catch (error: any) {
      console.error('Error fetching categories:', error.message);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleNewPost = () => {
    setSelectedPost(null);
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      featured_image: '',
      category: '',
      tags: [],
      status: 'draft',
    });
    setIsNewPost(true);
    setOpenDialog(true);
    setPreviewMode(false);
  };

  const handleEditPost = (post: BlogPost) => {
    setSelectedPost(post);
    setFormData({
      ...post,
      tags: Array.isArray(post.tags) ? post.tags : [],
    });
    setIsNewPost(false);
    setOpenDialog(true);
    setPreviewMode(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPost(null);
    setFormData({});
    setPreviewMode(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Auto-generate slug from title if it's a new post and slug hasn't been manually edited
    if (name === 'title' && isNewPost && (!formData.slug || formData.slug === generateSlug(formData.title || ''))) {
      setFormData({
        ...formData,
        title: value,
        slug: generateSlug(value),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleEditorChange = (content: string) => {
    setFormData({ ...formData, content });
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags?.includes(tagInput.trim())) {
        setFormData({
          ...formData,
          tags: [...(formData.tags || []), tagInput.trim()],
        });
      }
      setTagInput('');
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(tag => tag !== tagToDelete) || [],
    });
  };

  const handleImageUpload = (url: string) => {
    setFormData({ ...formData, featured_image: url });
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const validateForm = () => {
    if (!formData.title) {
      setError('Title is required');
      return false;
    }
    
    if (!formData.slug) {
      setError('Slug is required');
      return false;
    }
    
    if (!formData.content) {
      setError('Content is required');
      return false;
    }
    
    return true;
  };

  const handleSavePost = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Prepare data for saving
      const postData = {
        ...formData,
        tags: JSON.stringify(formData.tags),
        published_at: formData.status === 'published' ? new Date().toISOString() : formData.published_at,
        updated_at: new Date().toISOString(),
      };

      if (isNewPost) {
        // Create new post
        const { data, error } = await supabase
          .from('blog_posts')
          .insert([{ ...postData, created_at: new Date().toISOString() }])
          .select();

        if (error) throw error;
        if (data) {
          console.log('Blog post created:', data[0]);
        }
      } else {
        // Update existing post
        const { data, error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', selectedPost?.id)
          .select();

        if (error) throw error;
        if (data) {
          console.log('Blog post updated:', data[0]);
        }
      }

      // Refresh the blog posts
      await fetchBlogPosts();
      handleCloseDialog();
    } catch (error: any) {
      console.error('Error saving blog post:', error.message);
      setError('Failed to save blog post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async (postId: number) => {
    if (!window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      await fetchBlogPosts();
      handleCloseDialog();
    } catch (error: any) {
      console.error('Error deleting blog post:', error.message);
      setError('Failed to delete blog post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePreview = () => {
    setPreviewMode(!previewMode);
  };

  const columns: GridColDef[] = [
    { field: 'title', headerName: 'Title', flex: 1 },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Chip 
          label={params.value}
          color={params.value === 'published' ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    { 
      field: 'category', 
      headerName: 'Category', 
      width: 150 
    },
    { 
      field: 'published_at', 
      headerName: 'Published Date', 
      width: 180,
      valueFormatter: (params) => {
        if (!params.value) return 'Not published';
        return new Date(params.value as string).toLocaleDateString();
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Stack direction="row" spacing={1}>
          <IconButton 
            size="small" 
            color="primary" 
            onClick={() => handleEditPost(params.row)}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            color="error" 
            onClick={() => handleDeletePost(params.row.id)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            color="info" 
            onClick={() => window.open(`/blog/${params.row.slug}`, '_blank')}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Blog Management
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleNewPost}
        >
          Create New Post
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="blog management tabs">
          <Tab label="All Posts" />
          <Tab label="Published" />
          <Tab label="Drafts" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <DataGrid
            rows={blogPosts}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 25]}
            checkboxSelection
            disableRowSelectionOnClick
            autoHeight
            loading={isLoading}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <DataGrid
            rows={blogPosts.filter(post => post.status === 'published')}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 25]}
            checkboxSelection
            disableRowSelectionOnClick
            autoHeight
            loading={isLoading}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <DataGrid
            rows={blogPosts.filter(post => post.status === 'draft')}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 25]}
            checkboxSelection
            disableRowSelectionOnClick
            autoHeight
            loading={isLoading}
          />
        </TabPanel>
      </Paper>

      {/* Blog Post Editor Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="lg"
        scroll="paper"
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              {isNewPost ? 'Create New Blog Post' : 'Edit Blog Post'}
            </Typography>
            <Button onClick={handleTogglePreview}>
              {previewMode ? 'Edit Mode' : 'Preview'}
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {previewMode ? (
            <Box>
              <Typography variant="h4" gutterBottom>
                {formData.title}
              </Typography>
              {formData.featured_image && (
                <Box sx={{ mb: 2 }}>
                  <img 
                    src={formData.featured_image} 
                    alt={formData.title}
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                </Box>
              )}
              <Box sx={{ mb: 2 }}>
                <Chip label={formData.category} size="small" sx={{ mr: 1 }} />
                {formData.tags?.map((tag) => (
                  <Chip key={tag} label={tag} size="small" sx={{ mr: 1 }} />
                ))}
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" fontStyle="italic">
                  {formData.excerpt}
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box dangerouslySetInnerHTML={{ __html: formData.content || '' }} />
            </Box>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <TextField
                  name="title"
                  label="Post Title"
                  fullWidth
                  value={formData.title || ''}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                />
                <TextField
                  name="slug"
                  label="Post Slug"
                  fullWidth
                  value={formData.slug || ''}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                  helperText="This will be used in the URL (e.g., /blog/your-slug)"
                />
                <TextField
                  name="excerpt"
                  label="Excerpt/Summary"
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.excerpt || ''}
                  onChange={handleInputChange}
                  margin="normal"
                  helperText="A brief summary of the post (used in lists and SEO)"
                />
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Content
                  </Typography>
                  <ReactQuill
                    value={formData.content || ''}
                    onChange={handleEditorChange}
                    modules={quillModules}
                    style={{ height: '300px', marginBottom: '50px' }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Post Settings
                    </Typography>
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Status</InputLabel>
                      <Select
                        name="status"
                        value={formData.status || 'draft'}
                        onChange={handleSelectChange}
                        label="Status"
                      >
                        <MenuItem value="draft">Draft</MenuItem>
                        <MenuItem value="published">Published</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Category</InputLabel>
                      <Select
                        name="category"
                        value={formData.category || ''}
                        onChange={handleSelectChange}
                        label="Category"
                      >
                        {categories.map((category) => (
                          <MenuItem key={category.id} value={category.name}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </CardContent>
                </Card>
                <Card sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Tags
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      {formData.tags?.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          onDelete={() => handleDeleteTag(tag)}
                          sx={{ m: 0.5 }}
                        />
                      ))}
                    </Box>
                    <TextField
                      label="Add Tags"
                      value={tagInput}
                      onChange={handleTagInputChange}
                      onKeyDown={handleTagInputKeyDown}
                      fullWidth
                      helperText="Press Enter to add a tag"
                    />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Featured Image
                    </Typography>
                    {formData.featured_image && (
                      <Box sx={{ mb: 2 }}>
                        <img 
                          src={formData.featured_image} 
                          alt="Featured" 
                          style={{ width: '100%', height: 'auto' }}
                        />
                      </Box>
                    )}
                    <FileUpload
                      bucketName="blog-images"
                      onUploadComplete={handleImageUpload}
                      acceptedFileTypes="image/*"
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSavePost} 
            variant="contained" 
            color="primary" 
            disabled={isLoading || previewMode}
          >
            {isLoading ? 'Saving...' : 'Save Post'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 