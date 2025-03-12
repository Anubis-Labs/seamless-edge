import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { 
  FaUsers, 
  FaCalendarCheck, 
  FaComments, 
  FaEnvelope, 
  FaExclamationCircle,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaBlog,
  FaImages
} from 'react-icons/fa';

// Dummy data for statistics
const stats = [
  { 
    id: 1, 
    name: 'Quote Requests', 
    value: 24, 
    change: 12, 
    changeType: 'increase', 
    period: 'from last month',
    icon: <FaUsers className="text-blue-400" size={20} />,
    color: 'bg-blue-50',
    link: '/admin/quotes'
  },
  { 
    id: 2, 
    name: 'Bookings', 
    value: 18, 
    change: 7, 
    changeType: 'increase', 
    period: 'from last month',
    icon: <FaCalendarCheck className="text-green-500" size={20} />,
    color: 'bg-green-50',
    link: '/admin/bookings'
  },
  { 
    id: 3, 
    name: 'Client Messages', 
    value: 32, 
    change: 4, 
    changeType: 'decrease', 
    period: 'from last month',
    icon: <FaEnvelope className="text-purple-500" size={20} />,
    color: 'bg-purple-50',
    link: '/admin/messages'
  },
  { 
    id: 4, 
    name: 'Testimonials', 
    value: 8, 
    change: 2, 
    changeType: 'increase', 
    period: 'from last month',
    icon: <FaComments className="text-yellow-500" size={20} />,
    color: 'bg-yellow-50',
    link: '/admin/testimonials'
  }
];

// Dummy data for recent activity
const recentActivity = [
  {
    id: 1,
    type: 'quote',
    title: 'New quote request received',
    details: 'Kitchen drywall repair and texture matching',
    user: 'Michael Johnson',
    email: 'mjohnson@example.com',
    timestamp: '2 hours ago',
    status: 'pending'
  },
  {
    id: 2,
    type: 'booking',
    title: 'New booking confirmation',
    details: 'Level 5 finish for new construction',
    user: 'Sarah Martinez',
    email: 'smartinez@example.com',
    timestamp: '5 hours ago',
    status: 'confirmed'
  },
  {
    id: 3,
    type: 'message',
    title: 'New contact form message',
    details: 'Question about textured ceiling removal',
    user: 'David Wilson',
    email: 'dwilson@example.com',
    timestamp: '1 day ago',
    status: 'unread'
  },
  {
    id: 4,
    type: 'booking',
    title: 'Booking rescheduled',
    details: 'Basement renovation moved to next week',
    user: 'Jennifer Lopez',
    email: 'jlopez@example.com',
    timestamp: '1 day ago',
    status: 'updated'
  },
  {
    id: 5,
    type: 'quote',
    title: 'Quote approved',
    details: 'Garage drywall installation',
    user: 'Thomas Brown',
    email: 'tbrown@example.com',
    timestamp: '2 days ago',
    status: 'approved'
  },
];

// Dummy alert notifications
const alerts = [
  {
    id: 1,
    title: 'Server maintenance scheduled',
    message: 'The website will be down for maintenance on Sunday, 2am-4am.',
    type: 'info',
    timestamp: 'Tomorrow'
  },
  {
    id: 2,
    title: 'Low inventory alert',
    message: 'You are running low on Level 5 finish compound. Consider ordering more.',
    type: 'warning',
    timestamp: 'Today'
  }
];

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  
  const handleLogout = () => {
    authService.logout();
    navigate('/admin/login');
  };
  
  return (
    <div className="admin-dashboard bg-gray-50 min-h-screen">
      <Helmet>
        <title>Admin Dashboard | Seamless Edge</title>
      </Helmet>
      
      {/* Admin Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-heading font-semibold text-accent-navy">Admin Dashboard</h1>
          
          <div className="flex items-center">
            <span className="mr-4 text-sm text-gray-600">
              Logged in as <span className="font-semibold">{user?.username}</span>
            </span>
            <button 
              onClick={handleLogout} 
              className="text-sm text-accent-forest hover:text-accent-navy transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-heading font-semibold text-gray-800 mb-4">
            Welcome to the Admin Dashboard
          </h2>
          <p className="text-gray-600">
            From here, you can manage various aspects of your website including quote calculator settings,
            content management, and more.
          </p>
        </div>
        
        {/* Welcome & Stats Summary */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold font-heading text-accent-navy mb-2">Dashboard</h1>
          <p className="text-gray-600 mb-6">
            Welcome to your admin dashboard. Here's what's happening with your business today.
          </p>
          
          {/* Alerts */}
          {alerts.length > 0 && (
            <div className="mb-6">
              {alerts.map(alert => (
                <div 
                  key={alert.id}
                  className={`p-4 rounded-lg mb-3 border ${
                    alert.type === 'warning' 
                      ? 'bg-yellow-50 border-yellow-200 text-yellow-800' 
                      : 'bg-blue-50 border-blue-200 text-blue-800'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <FaExclamationCircle className={alert.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'} />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium">{alert.title}</h3>
                      <div className="mt-1 text-sm">{alert.message}</div>
                      <div className="mt-2 text-xs text-gray-500">
                        {alert.timestamp}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map(stat => (
              <div 
                key={stat.id}
                className={`${stat.color} rounded-lg p-6 shadow-sm border border-gray-200`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm font-medium mb-1">{stat.name}</p>
                    <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                    
                    <div className="mt-1 flex items-center text-sm">
                      {stat.changeType === 'increase' ? (
                        <FaArrowUp className="text-green-500 mr-1" size={12} />
                      ) : (
                        <FaArrowDown className="text-red-500 mr-1" size={12} />
                      )}
                      <span 
                        className={stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}
                      >
                        {stat.change}%
                      </span>
                      <span className="text-gray-600 ml-1">{stat.period}</span>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-full bg-white shadow-sm">
                    {stat.icon}
                  </div>
                </div>
                
                <div className="mt-4">
                  <Link 
                    to={stat.link}
                    className="text-sm font-medium text-accent-forest hover:text-accent-navy flex items-center"
                  >
                    <span>View all</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Recent Activity Feed */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-accent-navy">Recent Activity</h2>
            <Link 
              to="/admin/activity"
              className="text-sm text-accent-forest hover:text-accent-navy flex items-center"
            >
              View all activity
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          
          <div className="space-y-5">
            {recentActivity.map(activity => (
              <div key={activity.id} className="flex items-start border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                {/* Activity Icon */}
                <div className={`
                  flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4
                  ${activity.type === 'quote' ? 'bg-blue-100' : 
                    activity.type === 'booking' ? 'bg-green-100' : 
                    'bg-purple-100'}
                `}>
                  {activity.type === 'quote' && <FaUsers className="text-blue-600" />}
                  {activity.type === 'booking' && <FaCalendarCheck className="text-green-600" />}
                  {activity.type === 'message' && <FaEnvelope className="text-purple-600" />}
                </div>
                
                {/* Activity Content */}
                <div className="flex-grow">
                  <div className="flex flex-wrap justify-between">
                    <h3 className="text-base font-medium text-gray-800">{activity.title}</h3>
                    <span className="text-xs text-gray-500">{activity.timestamp}</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                  
                  <div className="flex justify-between mt-2">
                    <div className="text-sm text-gray-500">
                      From: {activity.user} ({activity.email})
                    </div>
                    
                    <div className={`
                      text-xs rounded-full px-2 py-1 font-medium
                      ${activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        activity.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                        activity.status === 'unread' ? 'bg-red-100 text-red-800' : 
                        activity.status === 'updated' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'}
                    `}>
                      {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <Link 
                      to={`/admin/${activity.type}s`}
                      className="inline-flex items-center text-xs font-medium text-accent-forest hover:text-accent-navy"
                    >
                      <FaEye className="mr-1" size={12} />
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Admin Tools Grid */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-accent-navy mb-6">Quick Access</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quote Calculator Settings */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-accent-navy">Quote Calculator</h3>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-4">
                Configure pricing, services, and calculation settings for the quote calculator.
              </p>
              <Link 
                to="/admin/calculator-settings" 
                className="text-accent-forest hover:text-accent-navy transition-colors flex items-center"
              >
                Manage Settings 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            
            {/* Blog Management */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-accent-navy">Blog Management</h3>
                <FaBlog className="h-6 w-6 text-accent-forest" />
              </div>
              <p className="text-gray-600 mb-4">
                Create, edit, and publish blog posts. Manage categories and optimize SEO.
              </p>
              <Link 
                to="/admin/blog" 
                className="text-accent-forest hover:text-accent-navy transition-colors flex items-center"
              >
                Manage Blog 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            
            {/* Jobs Management */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-accent-navy">Careers</h3>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-4">
                Manage job listings, applications, and career opportunities across the website.
              </p>
              <Link 
                to="/admin/jobs" 
                className="text-accent-sage hover:text-accent-gold transition-colors flex items-center"
              >
                Manage Jobs 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard; 