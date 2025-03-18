import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Switch,
  FormControlLabel,
  TextField,
  Typography,
  Alert,
  Tabs,
  Tab,
  Paper,
  CircularProgress,
} from '@mui/material';
import Notification from '../common/Notification';

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
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

interface UserSettings {
  email_notifications: boolean;
  dark_mode: boolean;
  default_calendar_view: string;
}

interface AppSettings {
  company_name: string;
  contact_email: string;
  contact_phone: string;
  business_hours: string;
  address: string;
}

const SettingsPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    type: 'info',
  });

  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    role: '',
  });

  const [userSettings, setUserSettings] = useState<UserSettings>({
    email_notifications: true,
    dark_mode: false,
    default_calendar_view: 'week',
  });

  const [appSettings, setAppSettings] = useState<AppSettings>({
    company_name: 'Seamless Edge',
    contact_email: 'info@seamlessedge.com',
    contact_phone: '(555) 123-4567',
    business_hours: 'Mon-Fri: 8am-6pm, Sat: 9am-3pm',
    address: '123 Main St, Suite 100, City, ST 12345',
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  useEffect(() => {
    fetchUserProfile();
    fetchSettings();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Fetch additional profile info from profiles table if exists
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('name, role')
          .eq('id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }

        setUserProfile({
          name: profileData?.name || '',
          email: user.email || '',
          role: profileData?.role || 'admin',
        });
      }
    } catch (error: any) {
      console.error('Error fetching user profile:', error.message);
      setError('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    setLoading(true);
    try {
      // User settings
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      if (userData.user) {
        const { data: userSettingsData, error: settingsError } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', userData.user.id)
          .single();

        if (settingsError && settingsError.code !== 'PGRST116') {
          throw settingsError;
        }

        if (userSettingsData) {
          setUserSettings({
            email_notifications: userSettingsData.email_notifications ?? true,
            dark_mode: userSettingsData.dark_mode ?? false,
            default_calendar_view: userSettingsData.default_calendar_view || 'week',
          });
        }
      }

      // App settings
      const { data: appSettingsData, error: appError } = await supabase
        .from('app_settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (appError && appError.code !== 'PGRST116') {
        throw appError;
      }

      if (appSettingsData) {
        setAppSettings({
          company_name: appSettingsData.company_name || 'Seamless Edge',
          contact_email: appSettingsData.contact_email || 'info@seamlessedge.com',
          contact_phone: appSettingsData.contact_phone || '(555) 123-4567',
          business_hours: appSettingsData.business_hours || 'Mon-Fri: 8am-6pm, Sat: 9am-3pm',
          address: appSettingsData.address || '123 Main St, Suite 100, City, ST 12345',
        });
      }
    } catch (error: any) {
      console.error('Error fetching settings:', error.message);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleUserProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserProfile({ ...userProfile, [name]: value });
  };

  const handleUserSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    const newValue = e.target.type === 'checkbox' ? checked : value;
    setUserSettings({ ...userSettings, [name]: newValue });
  };

  const handleAppSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAppSettings({ ...appSettings, [name]: value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm({ ...passwordForm, [name]: value });
  };

  const validatePasswordForm = () => {
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setError('New passwords do not match');
      return false;
    }
    if (passwordForm.new_password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    return true;
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not found');

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: userProfile.name,
          role: userProfile.role,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      showNotification('Profile updated successfully', 'success');
    } catch (error: any) {
      console.error('Error updating profile:', error.message);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUserSettings = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not found');

      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          email_notifications: userSettings.email_notifications,
          dark_mode: userSettings.dark_mode,
          default_calendar_view: userSettings.default_calendar_view,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      showNotification('User settings saved successfully', 'success');
    } catch (error: any) {
      console.error('Error saving user settings:', error.message);
      setError('Failed to save user settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAppSettings = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('app_settings')
        .upsert({
          id: 1,
          company_name: appSettings.company_name,
          contact_email: appSettings.contact_email,
          contact_phone: appSettings.contact_phone,
          business_hours: appSettings.business_hours,
          address: appSettings.address,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      showNotification('Application settings saved successfully', 'success');
    } catch (error: any) {
      console.error('Error saving app settings:', error.message);
      setError('Failed to save application settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) return;

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ 
        password: passwordForm.new_password 
      });

      if (error) throw error;

      // Clear the form
      setPasswordForm({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });

      showNotification('Password changed successfully', 'success');
    } catch (error: any) {
      console.error('Error changing password:', error.message);
      setError('Failed to change password: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    setNotification({
      open: true,
      message,
      type,
    });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  if (loading && !userProfile.email) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="User Profile" />
          <Tab label="User Preferences" />
          <Tab label="Security" />
          <Tab label="Application Settings" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Card>
            <CardHeader title="User Profile" />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={userProfile.name}
                    onChange={handleUserProfileChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={userProfile.email}
                    disabled
                    helperText="Email cannot be changed"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Role"
                    name="role"
                    value={userProfile.role}
                    disabled
                    helperText="Contact administrator to change role"
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveProfile}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Card>
            <CardHeader title="User Preferences" />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={userSettings.email_notifications}
                        onChange={handleUserSettingsChange}
                        name="email_notifications"
                        color="primary"
                      />
                    }
                    label="Email Notifications"
                  />
                  <Typography variant="body2" color="textSecondary">
                    Receive email notifications for new bookings, testimonials, etc.
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={userSettings.dark_mode}
                        onChange={handleUserSettingsChange}
                        name="dark_mode"
                        color="primary"
                      />
                    }
                    label="Dark Mode"
                  />
                  <Typography variant="body2" color="textSecondary">
                    Enable dark mode for the admin interface
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label="Default Calendar View"
                    name="default_calendar_view"
                    value={userSettings.default_calendar_view}
                    onChange={handleUserSettingsChange as any}
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option value="day">Day</option>
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                    <option value="agenda">Agenda</option>
                  </TextField>
                </Grid>
              </Grid>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveUserSettings}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Save Preferences'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Card>
            <CardHeader title="Change Password" />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Current Password"
                    name="current_password"
                    type="password"
                    value={passwordForm.current_password}
                    onChange={handlePasswordChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="New Password"
                    name="new_password"
                    type="password"
                    value={passwordForm.new_password}
                    onChange={handlePasswordChange}
                    helperText="Password must be at least 8 characters long"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    name="confirm_password"
                    type="password"
                    value={passwordForm.confirm_password}
                    onChange={handlePasswordChange}
                    error={passwordForm.new_password !== passwordForm.confirm_password && passwordForm.confirm_password !== ''}
                    helperText={passwordForm.new_password !== passwordForm.confirm_password && passwordForm.confirm_password !== '' ? "Passwords don't match" : ""}
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleChangePassword}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Change Password'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Card>
            <CardHeader title="Application Settings" />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Company Name"
                    name="company_name"
                    value={appSettings.company_name}
                    onChange={handleAppSettingsChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Contact Email"
                    name="contact_email"
                    value={appSettings.contact_email}
                    onChange={handleAppSettingsChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Contact Phone"
                    name="contact_phone"
                    value={appSettings.contact_phone}
                    onChange={handleAppSettingsChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Business Hours"
                    name="business_hours"
                    value={appSettings.business_hours}
                    onChange={handleAppSettingsChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={appSettings.address}
                    onChange={handleAppSettingsChange}
                    multiline
                    rows={2}
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveAppSettings}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Save Settings'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </TabPanel>
      </Paper>

      <Notification
        open={notification.open}
        message={notification.message}
        type={notification.type}
        onClose={handleCloseNotification}
      />
    </Box>
  );
};

export default SettingsPage; 