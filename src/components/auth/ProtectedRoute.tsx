import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import authService from '../../services/authService';

interface ProtectedRouteProps {
  redirectPath?: string;
  children?: React.ReactNode;
}

/**
 * A wrapper for routes that should only be accessible to authenticated users
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  redirectPath = '/admin/login',
  children 
}) => {
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }
  
  return (
    <>
      {children ? children : <Outlet />}
    </>
  );
};

export default ProtectedRoute; 