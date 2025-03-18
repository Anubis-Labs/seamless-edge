import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { supabase } from '@/lib/supabaseClient';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Chip,
  Stack,
  Alert,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const localizer = momentLocalizer(moment);

// Define booking status options
const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'confirmed', label: 'Confirmed', color: 'success' },
  { value: 'completed', label: 'Completed', color: 'info' },
  { value: 'cancelled', label: 'Cancelled', color: 'error' },
];

// Define service types
const SERVICE_TYPES = [
  'Initial Consultation',
  'Drywall Installation',
  'Drywall Repair',
  'Drywall Finishing',
  'Painting',
  'Complete Renovation',
];

interface Booking {
  id: number;
  title: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  service_type: string;
  start_time: string;
  end_time: string;
  status: string;
  notes: string;
  created_at: string;
}

interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resource: Booking;
}

export default function BookingCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Booking | null>(null);
  const [isNewBooking, setIsNewBooking] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<Booking>>({
    title: '',
    client_name: '',
    client_email: '',
    client_phone: '',
    service_type: '',
    start_time: '',
    end_time: '',
    status: 'pending',
    notes: '',
  });

  // Fetch bookings from Supabase
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('start_time', { ascending: true });

      if (error) throw error;

      if (data) {
        // Convert to calendar events
        const calendarEvents = data.map((booking: Booking) => ({
          id: booking.id,
          title: `${booking.service_type} - ${booking.client_name}`,
          start: new Date(booking.start_time),
          end: new Date(booking.end_time),
          resource: booking,
        }));

        setEvents(calendarEvents);
      }
    } catch (error: any) {
      console.error('Error fetching bookings:', error.message);
      setError('Failed to load bookings. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEventSelect = (event: CalendarEvent) => {
    setSelectedEvent(event.resource);
    setFormData({
      ...event.resource,
      start_time: event.resource.start_time,
      end_time: event.resource.end_time,
    });
    setIsNewBooking(false);
    setOpenDialog(true);
  };

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setSelectedEvent(null);
    setFormData({
      title: '',
      client_name: '',
      client_email: '',
      client_phone: '',
      service_type: '',
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      status: 'pending',
      notes: '',
    });
    setIsNewBooking(true);
    setOpenDialog(true);
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
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
    setFormData({});
  };

  const validateForm = () => {
    const requiredFields = [
      'client_name', 
      'client_email', 
      'service_type', 
      'start_time', 
      'end_time'
    ];
    
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        setError(`${field.replace('_', ' ')} is required`);
        return false;
      }
    }
    
    if (formData.client_email && !/\S+@\S+\.\S+/.test(formData.client_email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const handleSaveBooking = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError(null);

    try {
      if (isNewBooking) {
        // Create new booking
        const { data, error } = await supabase
          .from('bookings')
          .insert([formData])
          .select();

        if (error) throw error;
        if (data) {
          console.log('Booking created:', data[0]);
        }
      } else {
        // Update existing booking
        const { data, error } = await supabase
          .from('bookings')
          .update(formData)
          .eq('id', selectedEvent?.id)
          .select();

        if (error) throw error;
        if (data) {
          console.log('Booking updated:', data[0]);
        }
      }

      // Refresh the bookings
      await fetchBookings();
      handleCloseDialog();
    } catch (error: any) {
      console.error('Error saving booking:', error.message);
      setError('Failed to save booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBooking = async () => {
    if (!selectedEvent?.id) return;

    if (!window.confirm('Are you sure you want to delete this booking?')) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', selectedEvent.id);

      if (error) throw error;

      await fetchBookings();
      handleCloseDialog();
    } catch (error: any) {
      console.error('Error deleting booking:', error.message);
      setError('Failed to delete booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusChip = (status: string) => {
    const statusOption = STATUS_OPTIONS.find(option => option.value === status);
    return (
      <Chip 
        label={statusOption?.label || status} 
        color={statusOption?.color as any || 'default'} 
        size="small" 
      />
    );
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="h1">
          Booking Calendar
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => handleSelectSlot({ 
            start: new Date(), 
            end: new Date(new Date().getTime() + 60 * 60 * 1000) 
          })}
        >
          New Booking
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ flexGrow: 1, height: 'calc(100vh - 200px)' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectEvent={handleEventSelect}
          onSelectSlot={handleSelectSlot}
          eventPropGetter={(event) => {
            const status = event.resource.status;
            let backgroundColor = '#3174ad'; // default
            
            if (status === 'confirmed') backgroundColor = '#4caf50';
            if (status === 'cancelled') backgroundColor = '#f44336';
            if (status === 'pending') backgroundColor = '#ff9800';
            if (status === 'completed') backgroundColor = '#2196f3';
            
            return { style: { backgroundColor } };
          }}
          views={['month', 'week', 'day', 'agenda']}
          defaultView="week"
          style={{ height: '100%' }}
        />
      </Box>

      {/* Booking Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {isNewBooking ? 'Create New Booking' : 'Edit Booking'}
        </DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  name="client_name"
                  label="Client Name"
                  fullWidth
                  value={formData.client_name || ''}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="client_email"
                  label="Client Email"
                  type="email"
                  fullWidth
                  value={formData.client_email || ''}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="client_phone"
                  label="Client Phone"
                  fullWidth
                  value={formData.client_phone || ''}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Service Type</InputLabel>
                  <Select
                    name="service_type"
                    value={formData.service_type || ''}
                    onChange={handleSelectChange}
                    label="Service Type"
                  >
                    {SERVICE_TYPES.map((service) => (
                      <MenuItem key={service} value={service}>
                        {service}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <DateTimePicker
                  label="Start Time"
                  value={formData.start_time ? moment(formData.start_time) : null}
                  onChange={(date) => handleDateChange('start_time', date)}
                  slotProps={{ textField: { fullWidth: true, required: true } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DateTimePicker
                  label="End Time"
                  value={formData.end_time ? moment(formData.end_time) : null}
                  onChange={(date) => handleDateChange('end_time', date)}
                  slotProps={{ textField: { fullWidth: true, required: true } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status || 'pending'}
                    onChange={handleSelectChange}
                    label="Status"
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="notes"
                  label="Notes"
                  multiline
                  rows={4}
                  fullWidth
                  value={formData.notes || ''}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          {!isNewBooking && (
            <Button onClick={handleDeleteBooking} color="error">
              Delete
            </Button>
          )}
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSaveBooking} 
            variant="contained" 
            color="primary" 
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 