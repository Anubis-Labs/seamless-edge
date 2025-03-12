import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Chatbot from '../chatbot/Chatbot';

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
      <Header />
      <main className={`flex-grow w-full max-w-full ${paddingClass}`}>
        {children}
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Layout; 