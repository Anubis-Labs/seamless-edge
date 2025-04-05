import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { FaSpinner } from 'react-icons/fa';

const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isResetView, setIsResetView] = useState<boolean>(false);
  const [resetEmail, setResetEmail] = useState<string>('');
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [resetLoading, setResetLoading] = useState<boolean>(false);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await authService.isAuthenticated();
      if (authenticated) {
        navigate('/admin/dashboard');
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetMessage(null);
    
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const user = await authService.login(email, password);
      if (user) {
        navigate('/admin/dashboard');
      } 
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      setError('Please enter your email address');
      return;
    }

    setResetLoading(true);
    setError(null);
    setResetMessage(null);
    try {
        await authService.requestPasswordReset(resetEmail);
        setResetMessage('If an account exists for this email, password reset instructions have been sent.');
        setResetEmail('');
    } catch (err: any) {
        console.error('Password reset request error:', err);
        setError(err.message || 'Failed to send reset instructions. Please try again later.');
        setResetMessage(null);
    } finally {
        setResetLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Helmet>
        <title>Admin {isResetView ? 'Reset Password' : 'Login'} | Seamless Edge</title>
      </Helmet>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img 
          src="/logo.png" 
          alt="Seamless Edge Logo" 
          className="mx-auto h-12 w-auto"
        />
        <h2 className="mt-6 text-center text-3xl font-heading font-semibold text-accent-navy">
          {isResetView ? 'Reset Password' : 'Admin Login'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
              <div className="mb-4 rounded-md bg-red-50 p-4">
                  <div className="flex">
                      <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">Error</h3>
                          <div className="mt-2 text-sm text-red-700">
                              <p>{error}</p>
                          </div>
                      </div>
                  </div>
              </div>
          )}
          {resetMessage && (
              <div className="mb-4 rounded-md bg-blue-50 p-4">
                  <div className="flex">
                      <div className="ml-3">
                          <h3 className="text-sm font-medium text-blue-800">Check your email</h3>
                          <div className="mt-2 text-sm text-blue-700">
                              <p>{resetMessage}</p>
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {!isResetView ? (
            <form className="space-y-6" onSubmit={handleLoginSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                <div className="mt-1">
                  <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-accent-forest focus:border-accent-forest sm:text-sm" placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <div className="mt-1">
                  <input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-accent-forest focus:border-accent-forest sm:text-sm" />
                </div>
              </div>
              <div className="flex items-center justify-end">
                <div className="text-sm">
                  <button type="button" onClick={() => { setIsResetView(true); setError(null); setResetMessage(null); }} className="font-medium text-accent-forest hover:text-accent-forest-dark">
                    Forgot your password?
                  </button>
                </div>
              </div>
              <div>
                <button type="submit" disabled={loading} className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${ loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-accent-forest hover:bg-accent-forest-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-forest' }`}>
                  {loading ? <><FaSpinner className="animate-spin h-5 w-5 mr-2"/> Signing in...</> : 'Sign in'}
                </button>
              </div>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleResetSubmit}>
               <div>
                  <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700">Email address</label>
                  <p className="mt-1 text-sm text-gray-500">Enter the email address associated with your account.</p>
                  <div className="mt-2">
                    <input id="reset-email" name="reset-email" type="email" autoComplete="email" required value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-accent-forest focus:border-accent-forest sm:text-sm" placeholder="you@example.com" />
                  </div>
                </div>
                <div className="flex items-center justify-end">
                    <div className="text-sm">
                        <button type="button" onClick={() => { setIsResetView(false); setError(null); setResetMessage(null); }} className="font-medium text-accent-forest hover:text-accent-forest-dark">
                            Back to Login
                        </button>
                    </div>
                </div>
                <div>
                    <button type="submit" disabled={resetLoading} className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${ resetLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-accent-forest hover:bg-accent-forest-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-forest' }`}>
                      {resetLoading ? <><FaSpinner className="animate-spin h-5 w-5 mr-2"/> Sending...</> : 'Send Reset Instructions'}
                    </button>
                </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage; 