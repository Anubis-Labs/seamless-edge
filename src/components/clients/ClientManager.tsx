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
  Grid,
  IconButton,
  InputAdornment,
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
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridFilterModel } from '@mui/x-data-grid';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment from 'moment';

interface Client {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  company?: string;
  notes?: string;
  client_type: string;
  status: 'active' | 'inactive' | 'lead';
  source?: string;
  created_at: string;
  updated_at: string;
  last_contact_date?: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  client_id: number;
  status: string;
  start_date: string;
  end_date?: string;
  total_cost?: number;
  created_at: string;
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
      id={`client-tabpanel-${index}`}
      aria-labelledby={`client-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Define client types and sources
const CLIENT_TYPES = [
  'Residential',
  'Commercial',
  'Contractor',
  'Property Manager',
  'Interior Designer',
  'Other',
];

const CLIENT_SOURCES = [
  'Website',
  'Referral',
  'Google',
  'Social Media',
  'Email Campaign',
  'Direct Mail',
  'Event',
  'Phone Inquiry',
  'Other',
];

export default function ClientManager() {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientProjects, setClientProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isNewClient, setIsNewClient] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
  });

  // Form state
  const [formData, setFormData] = useState<Partial<Client>>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    company: '',
    notes: '',
    client_type: 'Residential',
    status: 'lead',
    source: '',
    last_contact_date: '',
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('last_name', { ascending: true });

      if (error) throw error;

      if (data) {
        setClients(data);
      }
    } catch (error: any) {
      console.error('Error fetching clients:', error.message);
      setError('Failed to load clients. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClientProjects = async (clientId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('client_id', clientId)
        .order('start_date', { ascending: false });

      if (error) throw error;

      if (data) {
        setClientProjects(data);
      } else {
        setClientProjects([]);
      }
    } catch (error: any) {
      console.error('Error fetching client projects:', error.message);
      setError('Failed to load client projects. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (name: string, date: moment.Moment | null) => {
    if (date) {
      setFormData({ ...formData, [name]: date.toISOString() });
    } else {
      setFormData({ ...formData, [name]: undefined });
    }
  };

  const handleNewClient = () => {
    setSelectedClient(null);
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zip_code: '',
      company: '',
      notes: '',
      client_type: 'Residential',
      status: 'lead',
      source: '',
      last_contact_date: '',
    });
    setIsNewClient(true);
    setOpenDialog(true);
  };

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setTabValue(0);
    fetchClientProjects(client.id);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setFormData(client);
    setIsNewClient(false);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedClient(null);
    setFormData({});
  };

  const validateForm = () => {
    if (!formData.first_name || !formData.last_name) {
      setError('First and last name are required');
      return false;
    }
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const handleSaveClient = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const currentTime = new Date().toISOString();
      
      if (isNewClient) {
        // Create new client
        const { data, error } = await supabase
          .from('clients')
          .insert([{
            ...formData,
            created_at: currentTime,
            updated_at: currentTime,
          }])
          .select();

        if (error) throw error;
        if (data) {
          console.log('Client created:', data[0]);
        }
      } else {
        // Update existing client
        const { data, error } = await supabase
          .from('clients')
          .update({
            ...formData,
            updated_at: currentTime,
          })
          .eq('id', selectedClient?.id)
          .select();

        if (error) throw error;
        if (data) {
          console.log('Client updated:', data[0]);
        }
      }

      // Refresh clients
      await fetchClients();
      handleCloseDialog();
    } catch (error: any) {
      console.error('Error saving client:', error.message);
      setError('Failed to save client. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClient = async (clientId: number) => {
    if (!window.confirm('Are you sure you want to delete this client? This action cannot be undone and will remove all associated data.')) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // First check if client has any projects
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('id')
        .eq('client_id', clientId);

      if (projectsError) throw projectsError;

      if (projects && projects.length > 0) {
        throw new Error('Cannot delete client with existing projects. Please remove all projects first or mark the client as inactive.');
      }

      // Delete client
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

      if (error) throw error;

      await fetchClients();
      if (selectedClient?.id === clientId) {
        setSelectedClient(null);
        setClientProjects([]);
      }
    } catch (error: any) {
      console.error('Error deleting client:', error.message);
      setError(`Failed to delete client: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredClients = clients.filter(client => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      client.first_name.toLowerCase().includes(query) ||
      client.last_name.toLowerCase().includes(query) ||
      client.email.toLowerCase().includes(query) ||
      client.phone.includes(query) ||
      (client.company && client.company.toLowerCase().includes(query)) ||
      client.city.toLowerCase().includes(query)
    );
  });

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'active':
        return <Chip label="Active" color="success" size="small" />;
      case 'inactive':
        return <Chip label="Inactive" color="default" size="small" />;
      case 'lead':
      default:
        return <Chip label="Lead" color="info" size="small" />;
    }
  };

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return moment(dateString).format('MMM D, YYYY');
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getFullName = (client: Client) => {
    return `${client.first_name} ${client.last_name}`;
  };

  const columns: GridColDef[] = [
    { 
      field: 'name', 
      headerName: 'Name', 
      width: 200,
      valueGetter: (params) => getFullName(params.row as Client),
      renderCell: (params: GridRenderCellParams) => {
        const client = params.row as Client;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
              {getInitials(client.first_name, client.last_name)}
            </Avatar>
            <Typography>{getFullName(client)}</Typography>
          </Box>
        );
      },
    },
    { 
      field: 'email', 
      headerName: 'Email', 
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        params.value ? params.value : 'N/A'
      ),
    },
    { 
      field: 'phone', 
      headerName: 'Phone', 
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        params.value ? params.value : 'N/A'
      ),
    },
    { 
      field: 'client_type', 
      headerName: 'Type', 
      width: 150,
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 120,
      renderCell: (params: GridRenderCellParams) => getStatusChip(params.value as string),
    },
    { 
      field: 'city', 
      headerName: 'City', 
      width: 150,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Stack direction="row" spacing={1}>
          <IconButton 
            size="small" 
            color="default" 
            onClick={() => handleViewClient(params.row as Client)}
            title="View"
          >
            <PersonIcon fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            color="primary" 
            onClick={() => handleEditClient(params.row as Client)}
            title="Edit"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            color="error" 
            onClick={() => handleDeleteClient(params.row.id)}
            title="Delete"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  const projectColumns: GridColDef[] = [
    { field: 'title', headerName: 'Project', flex: 1 },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Chip 
          label={params.value}
          color={
            params.value === 'completed' ? 'success' : 
            params.value === 'in_progress' ? 'info' : 
            params.value === 'pending' ? 'warning' : 'default'
          }
          size="small"
        />
      ),
    },
    {
      field: 'start_date',
      headerName: 'Start Date',
      width: 120,
      valueFormatter: (params) => formatDate(params.value as string),
    },
    {
      field: 'end_date',
      headerName: 'End Date',
      width: 120,
      valueFormatter: (params) => formatDate(params.value as string),
    },
    {
      field: 'total_cost',
      headerName: 'Total Cost',
      width: 130,
      valueFormatter: (params) => formatCurrency(params.value as number),
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Client Management
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleNewClient}
        >
          Add New Client
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={selectedClient ? 4 : 12}>
          <Paper sx={{ mb: 3, p: 2 }}>
            <TextField
              placeholder="Search clients..."
              variant="outlined"
              fullWidth
              size="small"
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <DataGrid
              rows={filteredClients}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[5, 10, 25, 50]}
              filterModel={filterModel}
              onFilterModelChange={setFilterModel}
              autoHeight
              loading={isLoading}
              sx={{ minHeight: 400 }}
            />
          </Paper>
        </Grid>

        {selectedClient && (
          <Grid item xs={12} md={8}>
            <Paper sx={{ mb: 3 }}>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ width: 56, height: 56, mr: 2, bgcolor: 'primary.main' }}>
                    {getInitials(selectedClient.first_name, selectedClient.last_name)}
                  </Avatar>
                  <Box>
                    <Typography variant="h5">
                      {getFullName(selectedClient)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedClient.client_type} • {selectedClient.status}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={() => handleEditClient(selectedClient)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="error" 
                    size="small" 
                    onClick={() => handleDeleteClient(selectedClient.id)}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>

              <Tabs value={tabValue} onChange={handleTabChange} aria-label="client details tabs" sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tab label="Details" />
                <Tab label="Projects" />
                <Tab label="Notes" />
              </Tabs>

              <TabPanel value={tabValue} index={0}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Contact Information
                        </Typography>
                        <List dense>
                          {selectedClient.email && (
                            <ListItem>
                              <ListItemAvatar>
                                <Avatar>
                                  <EmailIcon />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText 
                                primary="Email" 
                                secondary={selectedClient.email} 
                              />
                              <ListItemSecondaryAction>
                                <IconButton edge="end" size="small" href={`mailto:${selectedClient.email}`}>
                                  <EmailIcon fontSize="small" />
                                </IconButton>
                              </ListItemSecondaryAction>
                            </ListItem>
                          )}
                          {selectedClient.phone && (
                            <ListItem>
                              <ListItemAvatar>
                                <Avatar>
                                  <PhoneIcon />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText 
                                primary="Phone" 
                                secondary={selectedClient.phone} 
                              />
                              <ListItemSecondaryAction>
                                <IconButton edge="end" size="small" href={`tel:${selectedClient.phone}`}>
                                  <PhoneIcon fontSize="small" />
                                </IconButton>
                              </ListItemSecondaryAction>
                            </ListItem>
                          )}
                          {selectedClient.company && (
                            <ListItem>
                              <ListItemAvatar>
                                <Avatar>
                                  <BusinessIcon />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText 
                                primary="Company" 
                                secondary={selectedClient.company} 
                              />
                            </ListItem>
                          )}
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Address
                        </Typography>
                        {selectedClient.address ? (
                          <List dense>
                            <ListItem>
                              <ListItemAvatar>
                                <Avatar>
                                  <LocationIcon />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={selectedClient.address}
                                secondary={`${selectedClient.city}, ${selectedClient.state} ${selectedClient.zip_code}`}
                              />
                              <ListItemSecondaryAction>
                                <IconButton 
                                  edge="end" 
                                  size="small"
                                  href={`https://maps.google.com/?q=${encodeURIComponent(
                                    `${selectedClient.address}, ${selectedClient.city}, ${selectedClient.state} ${selectedClient.zip_code}`
                                  )}`}
                                  target="_blank"
                                >
                                  <LocationIcon fontSize="small" />
                                </IconButton>
                              </ListItemSecondaryAction>
                            </ListItem>
                          </List>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No address provided
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Additional Information
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="body2" color="text.secondary">
                              Client Type
                            </Typography>
                            <Typography variant="body1">
                              {selectedClient.client_type}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="body2" color="text.secondary">
                              Status
                            </Typography>
                            <Typography variant="body1">
                              {getStatusChip(selectedClient.status)}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="body2" color="text.secondary">
                              Source
                            </Typography>
                            <Typography variant="body1">
                              {selectedClient.source || 'Not specified'}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="body2" color="text.secondary">
                              Last Contact
                            </Typography>
                            <Typography variant="body1">
                              {selectedClient.last_contact_date ? 
                                formatDate(selectedClient.last_contact_date) : 'Never'}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                {clientProjects.length > 0 ? (
                  <DataGrid
                    rows={clientProjects}
                    columns={projectColumns}
                    initialState={{
                      pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                      },
                    }}
                    pageSizeOptions={[5, 10, 25]}
                    autoHeight
                    loading={isLoading}
                  />
                ) : (
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                      No projects found for this client.
                    </Typography>
                    <Button 
                      variant="outlined" 
                      sx={{ mt: 2 }}
                      // This button would typically link to project creation with this client pre-selected
                    >
                      Create Project
                    </Button>
                  </Box>
                )}
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <Box sx={{ p: 2 }}>
                  {selectedClient.notes ? (
                    <Typography variant="body1" component="div" sx={{ whiteSpace: 'pre-line' }}>
                      {selectedClient.notes}
                    </Typography>
                  ) : (
                    <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
                      No notes added for this client.
                    </Typography>
                  )}
                  <Button 
                    variant="outlined" 
                    sx={{ mt: 2 }}
                    onClick={() => handleEditClient(selectedClient)}
                  >
                    Add/Edit Notes
                  </Button>
                </Box>
              </TabPanel>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Client Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {isNewClient ? 'Add New Client' : 'Edit Client'}
        </DialogTitle>
        <DialogContent dividers>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  name="first_name"
                  label="First Name"
                  fullWidth
                  value={formData.first_name || ''}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                />
                <TextField
                  name="last_name"
                  label="Last Name"
                  fullWidth
                  value={formData.last_name || ''}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                />
                <TextField
                  name="email"
                  label="Email"
                  type="email"
                  fullWidth
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  margin="normal"
                />
                <TextField
                  name="phone"
                  label="Phone"
                  fullWidth
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                  margin="normal"
                />
                <TextField
                  name="company"
                  label="Company"
                  fullWidth
                  value={formData.company || ''}
                  onChange={handleInputChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="address"
                  label="Address"
                  fullWidth
                  value={formData.address || ''}
                  onChange={handleInputChange}
                  margin="normal"
                />
                <TextField
                  name="city"
                  label="City"
                  fullWidth
                  value={formData.city || ''}
                  onChange={handleInputChange}
                  margin="normal"
                />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      name="state"
                      label="State"
                      fullWidth
                      value={formData.state || ''}
                      onChange={handleInputChange}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      name="zip_code"
                      label="ZIP Code"
                      fullWidth
                      value={formData.zip_code || ''}
                      onChange={handleInputChange}
                      margin="normal"
                    />
                  </Grid>
                </Grid>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Client Type</InputLabel>
                  <Select
                    name="client_type"
                    value={formData.client_type || 'Residential'}
                    onChange={handleSelectChange}
                    label="Client Type"
                  >
                    {CLIENT_TYPES.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status || 'lead'}
                    onChange={handleSelectChange}
                    label="Status"
                  >
                    <MenuItem value="lead">Lead</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Source</InputLabel>
                  <Select
                    name="source"
                    value={formData.source || ''}
                    onChange={handleSelectChange}
                    label="Source"
                  >
                    <MenuItem value="">Not specified</MenuItem>
                    {CLIENT_SOURCES.map((source) => (
                      <MenuItem key={source} value={source}>
                        {source}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Box sx={{ mt: 2 }}>
                  <DatePicker
                    label="Last Contact Date"
                    value={formData.last_contact_date ? moment(formData.last_contact_date) : null}
                    onChange={(date) => handleDateChange('last_contact_date', date)}
                    slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="notes"
                  label="Notes"
                  multiline
                  rows={6}
                  fullWidth
                  value={formData.notes || ''}
                  onChange={handleInputChange}
                  margin="normal"
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSaveClient} 
            variant="contained" 
            color="primary" 
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Client'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 