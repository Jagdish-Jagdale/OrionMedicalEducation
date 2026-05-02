import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import PageLoader from './PageLoader';

const ProtectedRoute = ({ children }) => {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return <PageLoader />;
  }

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
