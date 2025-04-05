import React, { useEffect, useState, ErrorInfo, Component } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import MobileFooter from './MobileFooter';
import Chatbot from '../chatbot/Chatbot';

// Error boundary for catching rendering errors
class ComponentErrorBoundary extends Component<{children: React.ReactNode, fallback?: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode, fallback?: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Component error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }
    return this.props.children;
  }
}

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [paddingClass, setPaddingClass] = useState('');
  
  useEffect(() => {
    // Only apply padding on non-home pages
    if (location.pathname !== '/') {
      setPaddingClass('pt-24 md:pt-28');
    } else {
      setPaddingClass('');
    }
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden max-w-full">
      <ComponentErrorBoundary fallback={
        <div className="bg-primary text-white p-4">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold">Seamless Edge</h1>
          </div>
        </div>
      }>
        <Header />
      </ComponentErrorBoundary>
      
      <main className={`flex-grow w-full max-w-full ${paddingClass}`}>
        <ComponentErrorBoundary fallback={
          <div className="container mx-auto p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">We're experiencing technical difficulties</h2>
            <p className="mb-4">Please try refreshing the page or contact us directly.</p>
            <p>Phone: (403) 555-7890</p>
            <p>Email: info@seamlessedge.com</p>
          </div>
        }>
          {children}
        </ComponentErrorBoundary>
      </main>
      
      <ComponentErrorBoundary>
        {/* Desktop Footer - hidden on mobile */}
        <div className="hidden sm:block">
          <Footer />
        </div>
        {/* Mobile Footer - visible only on mobile */}
        <MobileFooter />
      </ComponentErrorBoundary>
      
      <ComponentErrorBoundary>
        <Chatbot />
      </ComponentErrorBoundary>
    </div>
  );
};

export default Layout; 