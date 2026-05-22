import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect details of where they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If page is user dashboard or my-borrowed but user is admin, redirect to admin home
  if (user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return children;
};
