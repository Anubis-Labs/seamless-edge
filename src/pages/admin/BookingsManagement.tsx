import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { FaPlus, FaEdit, FaTrash, FaStar, FaCalendarAlt, FaClock, FaUserAlt, 
         FaSearch, FaFilter, FaPaperPlane, FaCheck, FaTimes, FaMapMarkerAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { bookingService } from '../../services/supabaseService';

// Define interface for Client
interface Client {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
}

// Define interface for Booking
interface Booking {
  id: number;
  client_id: number;
  service_type: string;
  date: string;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  notes: string;
  location: string;
  created_at: string;
  client?: Client;
}

const BookingsManagement: React.FC = () => {
  // State for bookings and UI
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [editMode, setEditMode] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStartDate, setFilterStartDate] = useState<Date | null>(null);
  const [filterEndDate, setFilterEndDate] = useState<Date | null>(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterServiceType, setFilterServiceType] = useState('');
  
  // New booking form state
  const [newBooking, setNewBooking] = useState<Partial<Booking>>({
    service_type: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    start_time: '09:00',
    end_time: '10:00',
    status: 'scheduled',
    notes: '',
    location: '',
    client_id: 0
  });
  const [bookingDate, setBookingDate] = useState<Date>(new Date());
  
  // Service types options (would come from a database in production)
  const serviceTypes = [
    'Kitchen Remodel',
    'Bathroom Renovation',
    'Basement Finishing',
    'Full Home Renovation',
    'Deck Construction',
    'Drywall Installation',
    'Drywall Repair',
    'Painting',
    'Cabinet Installation',
    'Trim Work'
  ];
  
  // Status options
  const statusOptions = [
    'scheduled',
    'confirmed',
    'completed',
    'cancelled',
    'no-show'
  ];
  
  // Load mock data for development
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In production, this would call the real bookingService
        const mockClients: Client[] = [
          {
            id: 1,
            first_name: 'John',
            last_name: 'Smith',
            email: 'john.smith@example.com',
            phone: '206-555-1234',
            address: '123 Main St',
            city: 'Seattle',
            state: 'WA',
            zip: '98101'
          },
          {
            id: 2,
            first_name: 'Sarah',
            last_name: 'Johnson',
            email: 'sarah.johnson@example.com',
            phone: '503-555-5678',
            address: '456 Oak Ave',
            city: 'Portland',
            state: 'OR',
            zip: '97201'
          },
          {
            id: 3,
            first_name: 'Michael',
            last_name: 'Chen',
            email: 'michael.chen@example.com',
            phone: '425-555-9012',
            address: '789 Elm St',
            city: 'Bellevue',
            state: 'WA',
            zip: '98004'
          },
          {
            id: 4,
            first_name: 'Emily',
            last_name: 'Davis',
            email: 'emily.davis@example.com',
            phone: '253-555-3456',
            address: '101 Pine Dr',
            city: 'Tacoma',
            state: 'WA',
            zip: '98402'
          }
        ];
        
        setClients(mockClients);
        
        // Use stored bookings from localStorage or create mock data
        const mockBookings: Booking[] = [
          {
            id: 1,
            client_id: 1,
            service_type: 'Kitchen Remodel',
            date: '2023-12-15',
            start_time: '09:00',
            end_time: '12:00',
            status: 'completed',
            notes: 'Initial consultation',
            location: '123 Main St, Seattle, WA',
            created_at: '2023-11-30',
            client: mockClients[0]
          },
          {
            id: 2,
            client_id: 2,
            service_type: 'Bathroom Renovation',
            date: '2023-12-20',
            start_time: '13:00',
            end_time: '15:00',
            status: 'confirmed',
            notes: 'Design review meeting',
            location: '456 Oak Ave, Portland, OR',
            created_at: '2023-12-01',
            client: mockClients[1]
          },
          {
            id: 3,
            client_id: 3,
            service_type: 'Deck Construction',
            date: '2024-01-05',
            start_time: '10:00',
            end_time: '12:00',
            status: 'scheduled',
            notes: 'Initial site assessment',
            location: '789 Elm St, Bellevue, WA',
            created_at: '2023-12-10',
            client: mockClients[2]
          },
          {
            id: 4,
            client_id: 4,
            service_type: 'Drywall Repair',
            date: '2024-01-10',
            start_time: '14:00',
            end_time: '16:00',
            status: 'scheduled',
            notes: 'Repair water damage',
            location: '101 Pine Dr, Tacoma, WA',
            created_at: '2023-12-05',
            client: mockClients[3]
          },
          {
            id: 5,
            client_id: 1,
            service_type: 'Kitchen Remodel',
            date: '2024-01-15',
            start_time: '09:00',
            end_time: '17:00',
            status: 'scheduled',
            notes: 'Installation start date',
            location: '123 Main St, Seattle, WA',
            created_at: '2023-12-12',
            client: mockClients[0]
          }
        ];
        
        // Load from localStorage or use mock data if not available
        const storedBookings = localStorage.getItem('seamlessedge_bookings');
        const bookingsData = storedBookings ? JSON.parse(storedBookings) : mockBookings;
        
        // If we load from localStorage, attach client objects
        if (storedBookings) {
          bookingsData.forEach((booking: Booking) => {
            booking.client = mockClients.find(client => client.id === booking.client_id);
          });
        }
        
        setBookings(bookingsData);
        
        // Store mock data in localStorage for persistence during development
        if (!storedBookings) {
          localStorage.setItem('seamlessedge_bookings', JSON.stringify(bookingsData));
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading bookings:', error);
        toast.error('Failed to load bookings data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter bookings based on search and filters
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = searchTerm === '' || 
      booking.client?.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.client?.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.location.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = filterStatus === '' || booking.status === filterStatus;
    const matchesServiceType = filterServiceType === '' || booking.service_type === filterServiceType;
    
    const bookingDate = new Date(booking.date);
    const matchesStartDate = !filterStartDate || bookingDate >= filterStartDate;
    const matchesEndDate = !filterEndDate || bookingDate <= filterEndDate;
    
    return matchesSearch && matchesStatus && matchesServiceType && matchesStartDate && matchesEndDate;
  });
  
  // Sort bookings by date (most recent first)
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
  
  // Add new booking
  const handleAddNew = () => {
    setSelectedBooking(null);
    setNewBooking({
      service_type: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      start_time: '09:00',
      end_time: '10:00',
      status: 'scheduled',
      notes: '',
      location: '',
      client_id: clients.length > 0 ? clients[0].id : 0
    });
    setBookingDate(new Date());
    setEditMode(false);
    setIsModalOpen(true);
  };
  
  // Edit booking
  const handleEdit = (booking: Booking) => {
    setSelectedBooking(booking);
    setNewBooking({
      ...booking
    });
    setBookingDate(new Date(booking.date));
    setEditMode(true);
    setIsModalOpen(true);
  };
  
  // Delete booking
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await bookingService.deleteBooking(id);
        setBookings(bookings.filter(booking => booking.id !== id));
        toast.success('Booking deleted successfully');
      } catch (error) {
        console.error('Error deleting booking:', error);
        toast.error('Failed to delete booking');
      }
    }
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewBooking({
      ...newBooking,
      [name]: value
    });
  };
  
  // Handle date change
  const handleDateChange = (date: Date | null) => {
    if (date) {
      setBookingDate(date);
      setNewBooking({
        ...newBooking,
        date: format(date, 'yyyy-MM-dd')
      });
    }
  };
  
  // Save booking
  const handleSaveBooking = async () => {
    try {
      if (!newBooking.client_id || !newBooking.service_type || !newBooking.date || 
          !newBooking.start_time || !newBooking.end_time || !newBooking.status) {
        toast.error('Please fill in all required fields');
        return;
      }
      
      if (editMode && selectedBooking) {
        // Update existing booking
        const updatedBooking = await bookingService.updateBooking(selectedBooking.id, newBooking);
        
        // Attach client object
        updatedBooking.client = clients.find(client => client.id === updatedBooking.client_id);
        
        setBookings(bookings.map(booking => 
          booking.id === selectedBooking.id ? updatedBooking : booking
        ));
        toast.success('Booking updated successfully');
      } else {
        // Create new booking
        const createdBooking = await bookingService.createBooking({
          ...newBooking,
          created_at: new Date().toISOString().split('T')[0]
        });
        
        // Attach client object
        createdBooking.client = clients.find(client => client.id === createdBooking.client_id);
        
        setBookings([...bookings, createdBooking]);
        toast.success('Booking created successfully');
      }
      
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving booking:', error);
      toast.error('Failed to save booking');
    }
  };
  
  // Send reminder
  const handleSendReminder = async (bookingId: number) => {
    try {
      await bookingService.sendReminder(bookingId);
      toast.success('Reminder sent successfully');
    } catch (error) {
      console.error('Error sending reminder:', error);
      toast.error('Failed to send reminder');
    }
  };
  
  // Get status badge style
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no-show':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Helmet>
        <title>Bookings Management | Seamless Edge Admin</title>
      </Helmet>
      
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Bookings Management</h1>
        
        {/* Filter and Search Section */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="col-span-1 lg:col-span-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search client, service, location..."
                  className="w-full px-4 py-2 border rounded-lg pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
            
            {/* Date Range Filter */}
            <div>
              <DatePicker
                selected={filterStartDate}
                onChange={setFilterStartDate}
                className="w-full px-4 py-2 border rounded-lg"
                placeholderText="Start date"
                dateFormat="MM/dd/yyyy"
                isClearable
              />
            </div>
            
            <div>
              <DatePicker
                selected={filterEndDate}
                onChange={setFilterEndDate}
                className="w-full px-4 py-2 border rounded-lg"
                placeholderText="End date"
                dateFormat="MM/dd/yyyy"
                isClearable
              />
            </div>
            
            {/* Status Filter */}
            <div>
              <select
                className="w-full px-4 py-2 border rounded-lg appearance-none bg-white"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Additional Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
            {/* Service Type Filter */}
            <div>
              <select
                className="w-full px-4 py-2 border rounded-lg appearance-none bg-white"
                value={filterServiceType}
                onChange={(e) => setFilterServiceType(e.target.value)}
              >
                <option value="">All Service Types</option>
                {serviceTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            {/* Clear Filters Button */}
            <div>
              <button
                className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100"
                onClick={() => {
                  setSearchTerm('');
                  setFilterStartDate(null);
                  setFilterEndDate(null);
                  setFilterStatus('');
                  setFilterServiceType('');
                }}
              >
                Clear Filters
              </button>
            </div>
            
            {/* Add New Booking Button - moved to the right */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end">
              <button
                className="px-4 py-2 bg-accent-forest text-white rounded-lg hover:bg-accent-navy flex items-center"
                onClick={handleAddNew}
              >
                <FaPlus className="mr-2" /> Add New Booking
              </button>
            </div>
          </div>
        </div>
        
        {/* Bookings Table */}
        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-forest"></div>
            <p className="mt-2 text-gray-600">Loading bookings...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedBookings.length > 0 ? (
                    sortedBookings.map(booking => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FaCalendarAlt className="text-gray-400 mr-2" />
                            <span>{new Date(booking.date).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FaClock className="text-gray-400 mr-2" />
                            <span>{booking.start_time} - {booking.end_time}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FaUserAlt className="text-gray-400 mr-2" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {booking.client?.first_name} {booking.client?.last_name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {booking.client?.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{booking.service_type}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FaMapMarkerAlt className="text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900 truncate max-w-xs">{booking.location}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyle(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleSendReminder(booking.id)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                            title="Send reminder"
                          >
                            <FaPaperPlane />
                          </button>
                          <button
                            onClick={() => handleEdit(booking)}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                            title="Edit booking"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(booking.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete booking"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                        No bookings found. Try adjusting your filters or add a new booking.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination could be added here for large datasets */}
          </>
        )}
      </div>
      
      {/* Add/Edit Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {editMode ? 'Edit Booking' : 'Add New Booking'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Client Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client *</label>
                  <select
                    name="client_id"
                    value={newBooking.client_id}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="">Select Client</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.first_name} {client.last_name} - {client.email}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Service Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Type *</label>
                  <select
                    name="service_type"
                    value={newBooking.service_type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="">Select Service Type</option>
                    {serviceTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <DatePicker
                    selected={bookingDate}
                    onChange={handleDateChange}
                    className="w-full px-3 py-2 border rounded-md"
                    dateFormat="MM/dd/yyyy"
                    required
                  />
                </div>
                
                {/* Time Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
                    <input
                      type="time"
                      name="start_time"
                      value={newBooking.start_time}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
                    <input
                      type="time"
                      name="end_time"
                      value={newBooking.end_time}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>
                </div>
                
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                  <select
                    name="status"
                    value={newBooking.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={newBooking.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Enter appointment location"
                    required
                  />
                </div>
              </div>
              
              {/* Notes */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={newBooking.notes}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={4}
                  placeholder="Enter any additional notes or details about this booking"
                ></textarea>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveBooking}
                  className="px-4 py-2 bg-accent-forest text-white rounded-md hover:bg-accent-navy"
                >
                  {editMode ? 'Update Booking' : 'Create Booking'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsManagement; 