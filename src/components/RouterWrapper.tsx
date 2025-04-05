import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';

// This component wraps BrowserRouter and suppresses the future flag warnings
const RouterWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Original console.warn reference
    const originalWarn = console.warn;
    
    // Override console.warn to filter out React Router future flag warnings
    console.warn = (...args) => {
      // Check if the warning is about React Router future flags
      const warningText = args[0] || '';
      if (typeof warningText === 'string' && 
         (warningText.includes('React Router Future Flag Warning') || 
          warningText.includes('v7_startTransition') || 
          warningText.includes('v7_relativeSplatPath'))) {
        // Suppress these specific warnings
        return;
      }
      
      // Pass other warnings through to the original implementation
      originalWarn.apply(console, args);
    };
    
    // Cleanup function to restore original console.warn
    return () => {
      console.warn = originalWarn;
    };
  }, []);
  
  return <BrowserRouter>{children}</BrowserRouter>;
};

export default RouterWrapper; 