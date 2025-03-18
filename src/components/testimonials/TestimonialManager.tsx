import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Rating,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  CheckCircle as ApproveIcon,
  Block as RejectIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import FileUpload from '../common/FileUpload';

interface Testimonial {
  id: number;
  client_name: string;
  client_title?: string;
  client_company?: string;
  client_location?: string;
  client_image?: string;
  content: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  service_type?: string;
  display_on_homepage: boolean;
  created_at: string;
  updated_at: string;
}

// Define service types
const SERVICE_TYPES = [
  'Drywall Installation',
  'Drywall Repair',
  'Drywall Finishing',
  'Painting',
  'Complete Renovation',
  'General Services',
];

export default function TestimonialManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [isNewTestimonial, setIsNewTestimonial] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Form state
  const [formData, setFormData] = useState<Partial<Testimonial>>({
    client_name: '',
    client_title: '',
    client_company: '',
    client_location: '',
    client_image: '',
    content: '',
    rating: 5,
    status: 'pending',
    service_type: '',
    display_on_homepage: false,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setTestimonials(data);
      }
    } catch (error: any) {
      console.error('Error fetching testimonials:', error.message);
      setError('Failed to load testimonials. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleRatingChange = (_event: React.SyntheticEvent, newValue: number | null) => {
    setFormData({ ...formData, rating: newValue || 0 });
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterStatus(e.target.value);
  };

  const handleNewTestimonial = () => {
    setSelectedTestimonial(null);
    setFormData({
      client_name: '',
      client_title: '',
      client_company: '',
      client_location: '',
      client_image: '',
      content: '',
      rating: 5,
      status: 'pending',
      service_type: '',
      display_on_homepage: false,
    });
    setIsNewTestimonial(true);
    setOpenDialog(true);
  };

  const handleEditTestimonial = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setFormData(testimonial);
    setIsNewTestimonial(false);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTestimonial(null);
    setFormData({});
  };

  const handleImageUpload = (url: string) => {
    setFormData({ ...formData, client_image: url });
  };

  const validateForm = () => {
    if (!formData.client_name) {
      setError('Client name is required');
      return false;
    }
    
    if (!formData.content) {
      setError('Testimonial content is required');
      return false;
    }
    
    return true;
  };

  const handleSaveTestimonial = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const currentTime = new Date().toISOString();
      
      if (isNewTestimonial) {
        // Create new testimonial
        const { data, error } = await supabase
          .from('testimonials')
          .insert([{
            ...formData,
            created_at: currentTime,
            updated_at: currentTime,
          }])
          .select();

        if (error) throw error;
        if (data) {
          console.log('Testimonial created:', data[0]);
        }
      } else {
        // Update existing testimonial
        const { data, error } = await supabase
          .from('testimonials')
          .update({
            ...formData,
            updated_at: currentTime,
          })
          .eq('id', selectedTestimonial?.id)
          .select();

        if (error) throw error;
        if (data) {
          console.log('Testimonial updated:', data[0]);
        }
      }

      // Refresh testimonials
      await fetchTestimonials();
      handleCloseDialog();
    } catch (error: any) {
      console.error('Error saving testimonial:', error.message);
      setError('Failed to save testimonial. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTestimonial = async (testimonialId: number) => {
    if (!window.confirm('Are you sure you want to delete this testimonial? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', testimonialId);

      if (error) throw error;

      await fetchTestimonials();
      handleCloseDialog();
    } catch (error: any) {
      console.error('Error deleting testimonial:', error.message);
      setError('Failed to delete testimonial. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeStatus = async (testimonialId: number, newStatus: 'pending' | 'approved' | 'rejected') => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('testimonials')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', testimonialId);

      if (error) throw error;

      await fetchTestimonials();
    } catch (error: any) {
      console.error('Error updating testimonial status:', error.message);
      setError('Failed to update testimonial status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'approved':
        return <Chip label="Approved" color="success" size="small" />;
      case 'rejected':
        return <Chip label="Rejected" color="error" size="small" />;
      case 'pending':
      default:
        return <Chip label="Pending" color="warning" size="small" />;
    }
  };

  const columns: GridColDef[] = [
    { field: 'client_name', headerName: 'Client', width: 180 },
    { 
      field: 'rating', 
      headerName: 'Rating', 
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Rating value={params.value} readOnly size="small" />
      ),
    },
    { 
      field: 'content', 
      headerName: 'Testimonial', 
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {params.value}
        </Typography>
      ),
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 120,
      renderCell: (params: GridRenderCellParams) => getStatusChip(params.value as string),
    },
    { 
      field: 'display_on_homepage', 
      headerName: 'Homepage', 
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        params.value ? 
        <Chip label="Yes" color="info" size="small" /> : 
        <Chip label="No" size="small" variant="outlined" />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Stack direction="row" spacing={1}>
          <IconButton 
            size="small" 
            color="primary" 
            onClick={() => handleEditTestimonial(params.row)}
            title="Edit"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            color="error" 
            onClick={() => handleDeleteTestimonial(params.row.id)}
            title="Delete"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
          {params.row.status !== 'approved' && (
            <IconButton 
              size="small" 
              color="success" 
              onClick={() => handleChangeStatus(params.row.id, 'approved')}
              title="Approve"
            >
              <ApproveIcon fontSize="small" />
            </IconButton>
          )}
          {params.row.status !== 'rejected' && (
            <IconButton 
              size="small" 
              color="default" 
              onClick={() => handleChangeStatus(params.row.id, 'rejected')}
              title="Reject"
            >
              <RejectIcon fontSize="small" />
            </IconButton>
          )}
        </Stack>
      ),
    },
  ];

  const filteredTestimonials = testimonials.filter(testimonial => {
    if (filterStatus === 'all') return true;
    return testimonial.status === filterStatus;
  });

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Testimonial Management
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleNewTestimonial}
        >
          Add Testimonial
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 3, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="status-filter-label">Filter by Status</InputLabel>
              <Select
                labelId="status-filter-label"
                value={filterStatus}
                label="Filter by Status"
                onChange={handleFilterChange}
              >
                <MenuItem value="all">All Testimonials</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                Total: {filteredTestimonials.length} testimonials
              </Typography>
              <Typography variant="body2" color="success.main" sx={{ mr: 1 }}>
                Approved: {testimonials.filter(t => t.status === 'approved').length}
              </Typography>
              <Typography variant="body2" color="warning.main" sx={{ mr: 1 }}>
                Pending: {testimonials.filter(t => t.status === 'pending').length}
              </Typography>
              <Typography variant="body2" color="error.main">
                Rejected: {testimonials.filter(t => t.status === 'rejected').length}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <DataGrid
        rows={filteredTestimonials}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
          sorting: {
            sortModel: [{ field: 'created_at', sort: 'desc' }],
          },
        }}
        pageSizeOptions={[5, 10, 25]}
        checkboxSelection
        disableRowSelectionOnClick
        autoHeight
        loading={isLoading}
        sx={{ mb: 4 }}
      />

      {/* Featured Testimonials Preview */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Featured Testimonials Preview
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          These testimonials are marked to display on the homepage.
        </Typography>

        <Grid container spacing={3}>
          {testimonials
            .filter(t => t.status === 'approved' && t.display_on_homepage)
            .slice(0, 3)
            .map(testimonial => (
              <Grid item xs={12} md={4} key={testimonial.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
                      {testimonial.client_image && (
                        <Box
                          component="img"
                          src={testimonial.client_image}
                          alt={testimonial.client_name}
                          sx={{ 
                            width: 60, 
                            height: 60, 
                            borderRadius: '50%', 
                            objectFit: 'cover',
                            mr: 2
                          }}
                        />
                      )}
                      <Box>
                        <Typography variant="h6">{testimonial.client_name}</Typography>
                        {testimonial.client_title && (
                          <Typography variant="body2" color="text.secondary">
                            {testimonial.client_title}
                            {testimonial.client_company && ` at ${testimonial.client_company}`}
                          </Typography>
                        )}
                        {testimonial.client_location && (
                          <Typography variant="body2" color="text.secondary">
                            {testimonial.client_location}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    <Rating value={testimonial.rating} readOnly size="small" sx={{ mb: 1 }} />
                    <Typography variant="body2" paragraph>
                      "{testimonial.content}"
                    </Typography>
                    {testimonial.service_type && (
                      <Chip 
                        label={testimonial.service_type} 
                        size="small" 
                        color="primary" 
                        variant="outlined" 
                      />
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          {testimonials.filter(t => t.status === 'approved' && t.display_on_homepage).length === 0 && (
            <Grid item xs={12}>
              <Alert severity="info">
                No testimonials are currently marked to display on homepage.
              </Alert>
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Testimonial Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {isNewTestimonial ? 'Add New Testimonial' : 'Edit Testimonial'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                name="client_name"
                label="Client Name"
                fullWidth
                value={formData.client_name || ''}
                onChange={handleInputChange}
                margin="normal"
                required
              />
              <TextField
                name="client_title"
                label="Client Title/Position"
                fullWidth
                value={formData.client_title || ''}
                onChange={handleInputChange}
                margin="normal"
              />
              <TextField
                name="client_company"
                label="Client Company"
                fullWidth
                value={formData.client_company || ''}
                onChange={handleInputChange}
                margin="normal"
              />
              <TextField
                name="client_location"
                label="Client Location"
                fullWidth
                value={formData.client_location || ''}
                onChange={handleInputChange}
                margin="normal"
                placeholder="e.g., Austin, TX"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Service Type</InputLabel>
                <Select
                  name="service_type"
                  value={formData.service_type || ''}
                  onChange={handleSelectChange}
                  label="Service Type"
                >
                  <MenuItem value="">None</MenuItem>
                  {SERVICE_TYPES.map((service) => (
                    <MenuItem key={service} value={service}>
                      {service}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Client Photo
                </Typography>
                {formData.client_image && (
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                    <Box
                      component="img"
                      src={formData.client_image}
                      alt="Client"
                      sx={{ 
                        width: 100, 
                        height: 100, 
                        borderRadius: '50%', 
                        objectFit: 'cover' 
                      }}
                    />
                  </Box>
                )}
                <FileUpload
                  bucketName="testimonial-images"
                  onUploadComplete={handleImageUpload}
                  acceptedFileTypes="image/*"
                />
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography component="legend">Rating</Typography>
                <Rating
                  name="rating"
                  value={formData.rating || 5}
                  onChange={handleRatingChange}
                  precision={0.5}
                />
              </Box>
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status || 'pending'}
                  onChange={handleSelectChange}
                  label="Status"
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.display_on_homepage || false}
                    onChange={handleSwitchChange}
                    name="display_on_homepage"
                  />
                }
                label="Display on Homepage"
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="content"
                label="Testimonial Content"
                fullWidth
                multiline
                rows={4}
                value={formData.content || ''}
                onChange={handleInputChange}
                margin="normal"
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSaveTestimonial} 
            variant="contained" 
            color="primary" 
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Testimonial'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 