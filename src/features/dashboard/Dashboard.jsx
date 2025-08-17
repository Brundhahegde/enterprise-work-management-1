import React, { useContext } from 'react';
import { Box, Typography, Chip, Button } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    if (logout) logout();
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Typography variant="h3" color="primary" fontWeight={800} mb={2}>
        Welcome to Your Dashboard!
      </Typography>
      <Typography variant="h6" sx={{ mb: 4 }}>
        {user && (
          <>
            Hello, <b>{user.username}</b>{' '}
            <Chip
              label={user.role}
              color="info"
              size="small"
              sx={{
                fontWeight: 'bold',
                letterSpacing: 0.5,
                ml: 1,
                verticalAlign: 'middle',
              }}
            />
          </>
        )}
      </Typography>
      <Button
        variant="outlined"
        color="primary"
        size="large"
        onClick={handleLogout}
        sx={{ fontWeight: 'bold', mt: 2 }}
      >
        Logout
      </Button>
    </Box>
  );
}
