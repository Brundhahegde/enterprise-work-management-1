import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext, ROLES } from '../context/AuthContext';

const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "User Management", path: "/users", roles: [ROLES.ADMIN] },
  { label: "Projects", path: "/projects", roles: [ROLES.ADMIN, ROLES.MANAGER] },
  { label: "Tasks", path: "/tasks", roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE] },
  { label: "Notifications", path: "/notifications" },
  { label: "Reports", path: "/reports", roles: [ROLES.ADMIN, ROLES.MANAGER] },
  { label: "Recent Activity", path: "/activity", roles: [ROLES.ADMIN, ROLES.MANAGER] },
  { label: "Profile", path: "/profile" }
];

export default function MainNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  // Show navItem if no roles specified, or user's role is allowed
  const canShow = (item) => {
    if (!item.roles) return true;
    return user && item.roles.includes(user.role);
  };

  return (
    <AppBar position="static" color="primary" sx={{ mb: 3 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Enterprise Work Management System
        </Typography>
        <Box>
          {navItems.filter(canShow).map(item => (
            <Button
              key={item.path}
              color={location.pathname === item.path ? 'secondary' : 'inherit'}
              onClick={() => navigate(item.path)}
              sx={{ fontWeight: 'bold' }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
