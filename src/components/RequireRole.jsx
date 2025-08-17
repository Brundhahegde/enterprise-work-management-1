import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const RequireRole = ({ allowedRoles, children }) => {
  const { user } = useContext(AuthContext);
  if (!user) return null;
  return allowedRoles.includes(user.role) ? children : null;
};

export default RequireRole;
