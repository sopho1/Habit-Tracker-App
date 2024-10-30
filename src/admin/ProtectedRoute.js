import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './Authcontext';

const ProtectedRoute = ({ path, ...props }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? (
    <Route {...props} />
  ) : (
    <Navigate to="/admin-login" replace />
  );
};

export default ProtectedRoute;
