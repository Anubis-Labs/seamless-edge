import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../../services/authService';

const AdminLoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        navigate('/admin');
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const user = await authService.login(username, password);
      
      if (user) {
        navigate('/admin');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <Helmet>
        <title>Admin Login | Seamless Edge</title>
      </Helmet>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img 
          src="/logo.png" 
          alt="Seamless Edge Logo" 
          className="mx-auto h-12 w-auto"
        />
        <h2 className="mt-6 text-center text-3xl font-heading font-semibold text-accent-navy">
          Admin Login
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <form className="mb-0 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded">
                {error}
              </div>
            )}
            
            <div>
              <label 
                htmlFor="username" 
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="shadow-sm focus:ring-accent-forest focus:border-accent-forest block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="shadow-sm focus:ring-accent-forest focus:border-accent-forest block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  loading ? 'bg-gray-400' : 'bg-accent-forest hover:bg-accent-forest-dark'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-forest`}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
            
            <div className="text-sm text-center">
              <a 
                href="/" 
                className="font-medium text-accent-navy hover:text-accent-forest"
              >
                Return to Website
              </a>
            </div>
          </form>
          
          {/* Development note - remove in production */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Development credentials: username: <span className="font-mono">admin</span> / password: <span className="font-mono">seamlessedge2023</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage; 