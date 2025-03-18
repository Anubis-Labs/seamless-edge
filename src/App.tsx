import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/dashboard/Dashboard';
import BookingCalendar from './components/bookings/BookingCalendar';
import BlogManager from './components/blog/BlogManager';
import TestimonialManager from './components/testimonials/TestimonialManager';
import ClientManager from './components/clients/ClientManager';
import SettingsPage from './components/settings/SettingsPage';
import AdminLayout from './components/layout/AdminLayout';
import Login from './components/auth/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import { ThemeProvider, createTheme } from '@mui/material';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/bookings" element={<BookingCalendar />} />
                  <Route path="/blog" element={<BlogManager />} />
                  <Route path="/testimonials" element={<TestimonialManager />} />
                  <Route path="/clients" element={<ClientManager />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Routes>
              </AdminLayout>} />
            </Route>
            
            {/* Redirect all unknown routes to dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
