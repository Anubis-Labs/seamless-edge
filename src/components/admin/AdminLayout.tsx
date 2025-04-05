import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaBlog, 
  FaImages, 
  FaTools, 
  FaComments, 
  FaUsers, 
  FaCalculator, 
  FaCalendarAlt, 
  FaEnvelope,
  FaBars,
  FaTimes,
  FaCog,
  FaSignOutAlt,
  FaBriefcase,
  FaFileAlt,
  FaDatabase
} from 'react-icons/fa';
import authService, { AppUser } from '../../services/authService';

interface AdminLayoutProps {
  children: React.ReactNode;
}

// Extended AppUser interface with additional fields
interface AdminUser extends AppUser {
  name?: string;
  username?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState<AdminUser | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      const user = await authService.getCurrentUser();
      // Add additional user info that may be needed for display
      if (user) {
        const adminUser: AdminUser = {
          ...user,
          name: user.email?.split('@')[0] || 'Admin', // Use email prefix as name
          username: user.email || 'admin' // Use email as username
        };
        setUserData(adminUser);
      } else {
        setUserData(null);
      }
    };
    
    fetchUserData();
  }, []);
  
  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <FaTachometerAlt /> },
    { name: 'Blog Management', path: '/admin/blog', icon: <FaBlog /> },
    { name: 'Gallery/Projects', path: '/admin/gallery', icon: <FaImages /> },
    { name: 'Services', path: '/admin/services', icon: <FaTools /> },
    { name: 'Testimonials', path: '/admin/testimonials', icon: <FaComments /> },
    { name: 'Client Management', path: '/admin/clients', icon: <FaUsers /> },
    { name: 'Quote Calculator', path: '/admin/calculator-settings', icon: <FaCalculator /> },
    { name: 'Bookings', path: '/admin/bookings', icon: <FaCalendarAlt /> },
    { name: 'Jobs Management', path: '/admin/jobs', icon: <FaBriefcase /> },
    { name: 'Applications', path: '/admin/applications', icon: <FaFileAlt /> },
    { name: 'Messages', path: '/admin/messages', icon: <FaEnvelope /> },
    { name: 'Database Explorer', path: '/admin/database', icon: <FaDatabase /> },
    { name: 'Settings', path: '/admin/settings', icon: <FaCog /> },
  ];
  
  const handleLogout = () => {
    authService.logout();
    navigate('/admin/login');
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden bg-accent-navy text-white p-4 flex justify-between items-center">
        <div className="font-heading font-bold text-xl">Seamless Edge Admin</div>
        <button 
          onClick={toggleSidebar}
          className="text-white focus:outline-none"
        >
          {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>
      
      {/* Sidebar */}
      <div className={`
        bg-accent-navy text-white w-full md:w-64 md:min-h-screen fixed md:relative top-0 md:top-auto
        left-0 h-full md:h-auto z-40 transition-all duration-300 transform
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex flex-col overflow-y-auto
      `}>
        {/* Logo */}
        <div className="p-5 border-b border-accent-navy-light">
          <Link to="/admin" className="flex items-center">
            <span className="font-heading font-bold text-xl">Seamless Edge</span>
          </Link>
        </div>
        
        {/* User Info */}
        <div className="p-4 border-b border-accent-navy-light flex items-center">
          <div className="w-10 h-10 rounded-full bg-accent-forest flex items-center justify-center mr-3">
            <span className="font-semibold text-white">{userData?.name?.charAt(0) || 'A'}</span>
          </div>
          <div>
            <div className="font-medium">{userData?.name || 'Admin User'}</div>
            <div className="text-xs text-gray-300">{userData?.username || 'admin'}</div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="py-4 flex-grow">
          <ul>
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center px-6 py-3 text-sm
                    ${location.pathname === item.path ? 
                      'bg-accent-forest text-white' : 
                      'text-gray-200 hover:bg-accent-navy-light'}
                    transition-colors duration-200
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Logout */}
        <div className="p-4 border-t border-accent-navy-light">
          <button
            onClick={handleLogout}
            className="flex items-center text-gray-300 hover:text-white w-full transition-colors duration-200"
          >
            <FaSignOutAlt className="mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-x-hidden">
        <main className="p-6">
          {children}
        </main>
      </div>
      
      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminLayout; 