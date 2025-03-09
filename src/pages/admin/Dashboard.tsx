import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

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
        
        {/* Admin Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Quote Calculator Settings */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
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
          
          {/* Content Management */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-accent-navy">Content Management</h3>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">
              Update website content, blog posts, and service information.
            </p>
            <Link 
              to="/admin/content" 
              className="text-accent-forest hover:text-accent-navy transition-colors flex items-center"
            >
              Manage Content
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          
          {/* Analytics & Reports */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-accent-navy">Analytics</h3>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">
              View website traffic, quote requests, and conversion metrics.
            </p>
            <Link 
              to="/admin/analytics" 
              className="text-accent-forest hover:text-accent-navy transition-colors flex items-center"
            >
              View Reports
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
        
        {/* Quick Links */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h3>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a 
                href="/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-accent-navy hover:text-accent-forest transition-colors"
              >
                View Website
              </a>
              <Link 
                to="/admin/inquiries" 
                className="text-accent-navy hover:text-accent-forest transition-colors"
              >
                Customer Inquiries
              </Link>
              <Link 
                to="/admin/settings" 
                className="text-accent-navy hover:text-accent-forest transition-colors"
              >
                Site Settings
              </Link>
              <Link 
                to="/admin/users" 
                className="text-accent-navy hover:text-accent-forest transition-colors"
              >
                User Management
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard; 