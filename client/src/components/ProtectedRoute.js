import React from 'react';
import { Navigate } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isConnected, user, loading } = useWeb3();

  // Check localStorage as fallback if context hasn't loaded yet
  const hasStoredUser = localStorage.getItem('user');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  // If not connected and no stored user, redirect to login
  if (!isConnected && !hasStoredUser) {
    return <Navigate to="/login" replace />;
  }

  // If admin only route and user is not admin, redirect to search page
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/search" replace />;
  }

  return children;
};

export default ProtectedRoute;
