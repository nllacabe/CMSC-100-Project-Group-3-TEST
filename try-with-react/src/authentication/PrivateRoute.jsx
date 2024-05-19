// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthenticationProv';

const PrivateRoute = ({ element }) => {
  const { isAuthenticated } = useAuth();  
  return isAuthenticated ? element : <Navigate to="/" />;  //goes back to signup if isAuthenticated is false
};

export default PrivateRoute;
