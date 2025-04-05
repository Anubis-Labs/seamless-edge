import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import Layout from './components/layout/Layout';
import authService, { AppUser } from './services/authService';
import RouterWrapper from './components/RouterWrapper';
import WarningSuppressor from './components/WarningSuppressor';

// Page components
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import GalleryPage from './pages/GalleryPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import BookingPage from './pages/BookingPage';
import JobsPage from './pages/JobsPage';
import JobDetailPage from './pages/JobDetailPage';
import ContactPage from './pages/ContactPage';
import QuotePage from './pages/QuotePage';
import PaymentsPage from './pages/PaymentsPage';
import NotFoundPage from './pages/NotFoundPage';

// Admin pages
import AdminLoginPage from './pages/admin/LoginPage';
import Dashboard from './pages/admin/Dashboard';
import CalculatorSettings from './pages/admin/CalculatorSettings';
import BlogManagement from './pages/admin/BlogManagement';
import GalleryManagement from './pages/admin/GalleryManagement';
import ServicesManagement from './pages/admin/ServicesManagement';
import TestimonialsManagement from './pages/admin/TestimonialsManagement';
import MessagesManagement from './pages/admin/MessagesManagement';
import SiteSettings from './pages/admin/SiteSettings';
import BookingsManagement from './pages/admin/BookingsManagement';
import JobsManagement from './pages/admin/JobsManagement';
import ClientManagement from './pages/admin/ClientManagement.tsx';
import ResetPasswordPage from './pages/admin/ResetPasswordPage';
import ApplicationsManagement from './pages/admin/ApplicationsManagement';
import DatabaseExplorer from './pages/admin/DatabaseExplorer';

// Admin components
import AdminLayout from './components/admin/AdminLayout';

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

// Updated Protected Route Component
const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);

  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (isMounted) {
          setIsAuthenticated(!!currentUser);
          setUser(currentUser);
        }
      } catch (error) {
        if (isMounted) {
          setIsAuthenticated(false);
          setUser(null);
        }
      }
    };

    checkAuth();

    // Listen for auth state changes
    const subscription = authService.onAuthStateChange((currentUser) => {
      if (isMounted) {
        console.log("Auth state changed:", currentUser);
        setIsAuthenticated(!!currentUser);
        setUser(currentUser);
      }
    });

    return () => {
        isMounted = false;
        // Unsubscribe using the correct method if subscription object provides it
        if (subscription && typeof subscription.unsubscribe === 'function') {
             subscription.unsubscribe();
        } else if (subscription && (subscription as any).data?.subscription) {
             // Handle the structure seen in previous attempts if needed
            (subscription as any).data.subscription.unsubscribe();
        }
    }; // Cleanup subscription
  }, []);

  if (isAuthenticated === null) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <AdminLayout>
      <Outlet context={{ user }} />
    </AdminLayout>
  );
};

const App: React.FC = () => {
  return (
    <WarningSuppressor>
      <ThemeProvider theme={theme}>
        <RouterWrapper>
          <Routes>
            {/* Public Admin Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Protected Admin Routes Group */}
            <Route path="/admin" element={<ProtectedRoute />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="calculator-settings" element={<CalculatorSettings />} />
              <Route path="blog" element={<BlogManagement />} />
              <Route path="gallery" element={<GalleryManagement />} />
              <Route path="services" element={<ServicesManagement />} />
              <Route path="testimonials" element={<TestimonialsManagement />} />
              <Route path="clients" element={<ClientManagement />} />
              <Route path="bookings" element={<BookingsManagement />} />
              <Route path="messages" element={<MessagesManagement />} />
              <Route path="settings" element={<SiteSettings />} />
              <Route path="jobs" element={<JobsManagement />} />
              <Route path="applications" element={<ApplicationsManagement />} />
              <Route path="database" element={<DatabaseExplorer />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Route>

            {/* Main Site Routes (using Layout) */}
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/about" element={<Layout><AboutPage /></Layout>} />
            <Route path="/services" element={<Layout><ServicesPage /></Layout>} />
            <Route path="/gallery" element={<Layout><GalleryPage /></Layout>} />
            <Route path="/blog" element={<Layout><BlogPage /></Layout>} />
            <Route path="/blog/:slug" element={<Layout><BlogPostPage /></Layout>} />
            <Route path="/booking" element={<Layout><BookingPage /></Layout>} />
            <Route path="/jobs" element={<Layout><JobsPage /></Layout>} />
            <Route path="/jobs/:id" element={<Layout><JobDetailPage /></Layout>} />
            <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
            <Route path="/quote" element={<Layout><QuotePage /></Layout>} />
            <Route path="/payments" element={<Layout><PaymentsPage /></Layout>} />

            {/* Catch-all for non-admin, non-defined routes */}
            <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
          </Routes>
        </RouterWrapper>
      </ThemeProvider>
    </WarningSuppressor>
  );
};

export default App;
