import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import QuotePage from './pages/QuotePage';
import ResponsiveTest from './pages/ResponsiveTest';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import GalleryPage from './pages/GalleryPage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
import BookingPage from './pages/BookingPage';
import PaymentsPage from './pages/PaymentsPage';
import NotFoundPage from './pages/NotFoundPage';
import TeamPage from './pages/TeamPage';
import JobsPage from './pages/JobsPage';
import JobDetailPage from './pages/JobDetailPage';
// Admin pages
import AdminLoginPage from './pages/admin/LoginPage';
import AdminDashboard from './pages/admin/Dashboard';
import CalculatorSettingsPage from './pages/admin/CalculatorSettings';
import BlogManagementPage from './pages/admin/BlogManagement';
import GalleryManagement from './pages/admin/GalleryManagement';
import ServicesManagement from './pages/admin/ServicesManagement';
import TestimonialsManagement from './pages/admin/TestimonialsManagement';
import MessagesManagement from './pages/admin/MessagesManagement';
import SiteSettings from './pages/admin/SiteSettings';
import BookingsManagement from './pages/admin/BookingsManagement';
import JobsManagement from './pages/admin/JobsManagement';
// Admin components
import AdminLayout from './components/admin/AdminLayout';
// Auth components
import ProtectedRoute from './components/auth/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/quote" element={<Layout><QuotePage /></Layout>} />
        <Route path="/responsive-test" element={<Layout><ResponsiveTest /></Layout>} />
        <Route path="/about" element={<Layout><AboutPage /></Layout>} />
        <Route path="/services" element={<Layout><ServicesPage /></Layout>} />
        <Route path="/gallery" element={<Layout><GalleryPage key="gallery-page" /></Layout>} />
        <Route path="/blog" element={<Layout><BlogPage key="blog-page" /></Layout>} />
        <Route path="/team" element={<Layout><TeamPage /></Layout>} />
        <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
        <Route path="/booking" element={<Layout><BookingPage /></Layout>} />
        <Route path="/payments" element={<Layout><PaymentsPage /></Layout>} />
        <Route path="/jobs" element={<Layout><JobsPage /></Layout>} />
        <Route path="/jobs/:id" element={<Layout><JobDetailPage /></Layout>} />
        
        {/* Admin Authentication */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        
        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/calculator-settings" element={<AdminLayout><CalculatorSettingsPage /></AdminLayout>} />
          <Route path="/admin/blog" element={<AdminLayout><BlogManagementPage /></AdminLayout>} />
          <Route path="/admin/gallery" element={<AdminLayout><GalleryManagement /></AdminLayout>} />
          <Route path="/admin/services" element={<AdminLayout><ServicesManagement /></AdminLayout>} />
          <Route path="/admin/testimonials" element={<AdminLayout><TestimonialsManagement /></AdminLayout>} />
          <Route path="/admin/clients" element={<AdminLayout><div>Client Management (Coming Soon)</div></AdminLayout>} />
          <Route path="/admin/bookings" element={<AdminLayout><BookingsManagement /></AdminLayout>} />
          <Route path="/admin/messages" element={<AdminLayout><MessagesManagement /></AdminLayout>} />
          <Route path="/admin/settings" element={<AdminLayout><SiteSettings /></AdminLayout>} />
          <Route path="/admin/jobs" element={<AdminLayout><JobsManagement /></AdminLayout>} />
        </Route>
        
        {/* 404 Page */}
        <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
