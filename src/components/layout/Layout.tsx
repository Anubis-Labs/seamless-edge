import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Chatbot from '../chatbot/Chatbot';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden max-w-full">
      <Header />
      <main className="flex-grow w-full max-w-full">
        {children}
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Layout; 