import React, { useEffect } from 'react';

// This component suppresses specific warnings in the development environment
const WarningSuppressor: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Store original console methods
    const originalWarn = console.warn;
    const originalError = console.error;
    
    // Override console.warn to filter out specific warnings
    console.warn = (...args) => {
      const warningText = args[0] || '';
      if (typeof warningText === 'string') {
        // React Router warnings
        if (warningText.includes('React Router Future Flag Warning') || 
            warningText.includes('v7_startTransition') || 
            warningText.includes('v7_relativeSplatPath')) {
          return;
        }
        
        // UNSAFE_componentWillMount warnings
        if (warningText.includes('Using UNSAFE_componentWillMount in strict mode')) {
          return;
        }
        
        // Null value in textarea warning
        if (warningText.includes('`value` prop on `textarea` should not be null')) {
          return;
        }
      }
      
      // Pass other warnings through
      originalWarn.apply(console, args);
    };
    
    // Similarly for console.error if needed
    console.error = (...args) => {
      const errorText = args[0] || '';
      if (typeof errorText === 'string') {
        // Add specific error suppressions here if needed
      }
      
      // Pass other errors through
      originalError.apply(console, args);
    };
    
    // Cleanup function to restore original console methods
    return () => {
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, []);
  
  // This component doesn't render anything, just returns its children
  return <>{children}</>;
};

export default WarningSuppressor; 