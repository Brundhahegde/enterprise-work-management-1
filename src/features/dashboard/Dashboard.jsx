import React, { useContext, useState, useMemo } from 'react';
import { Box, Grid, Paper, Typography, Chip, AppBar, Toolbar, Button, IconButton } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import RequireRole from '../../components/RequireRole';
import { AuthContext, ROLES } from '../../context/AuthContext';
import AdminUsers from './AdminUsers';
import ManagerProjects from './ManagerProjects';
import EmployeeTasks from './EmployeeTasks';
import EmployeeNotifications from './EmployeeNotifications';
import KanbanBoard from '../projects/KanbanBoard';
import Profile from './Profile';
import ReportsDashboard from './ReportsDashboard';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupsIcon from '@mui/icons-material/Groups';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import RecentActivityFeed from './RecentActivityFeed';
export default function Dashboard() {
  const [mode, setMode] = useState('light');
  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    if (logout) logout();
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const toggleTheme = () => setMode(m => (m === 'light' ? 'dark' : 'light'));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary', width: '100vw', overflowX: 'hidden' }}>
       
        <AppBar position="static" color="default" sx={{ mb: 4, boxShadow: 0 }}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: { xs: 2, md: 10 } }}>
            <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 700 }}>
              Enterprise Dashboard
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={toggleTheme} color="inherit">{mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}</IconButton>
              <Button variant="outlined" color="primary" onClick={handleLogout} sx={{ fontWeight: 'bold' }}>Logout</Button>
            </Box>
          </Toolbar>
        </AppBar>
       
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" color="primary" sx={{ fontWeight: 800 }}>
            Dashboard
          </Typography>
          <Chip label={user?.role} color="info" size="small" sx={{ ml: 2, fontWeight: 'bold' }} />
          <Typography variant="body2" sx={{ ml: 2 }}>Welcome, <b>{user?.username}</b></Typography>
        </Box>
        
        <Grid container spacing={4} alignItems="stretch" sx={{ mb: 4 }}>
          <RequireRole allowedRoles={[ROLES.ADMIN]}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <GroupsIcon sx={{ mr: 1, color: 'primary.main', fontSize: 26 }} />
                  <Typography variant="h6" fontWeight={700}>User Management (Admin)</Typography>
                </Box>
                <AdminUsers />
              </Paper>
            </Grid>
          </RequireRole>
          <RequireRole allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AssignmentIcon sx={{ mr: 1, color: 'primary.main', fontSize: 26 }} />
                  <Typography variant="h6" fontWeight={700}>Projects Overview (Manager)</Typography>
                </Box>
                <ManagerProjects />
              </Paper>
            </Grid>
          </RequireRole>
        </Grid>
        <Grid container spacing={4} alignItems="stretch" sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} mb={2}>Your Tasks</Typography>
              <EmployeeTasks />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <NotificationsActiveIcon sx={{ mr: 1, color: 'secondary.main', fontSize: 26 }} />
                <Typography variant="h6" fontWeight={700}>Notifications</Typography>
              </Box>
              <EmployeeNotifications />
            </Paper>
          </Grid>
        </Grid>
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Paper elevation={4} sx={{ p: 3 }}>
              <KanbanBoard showAllTasks={user.role !== "Employee"} />
            </Paper>
          </Grid>
        </Grid>
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Profile />
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <ReportsDashboard />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
    <RecentActivityFeed />
  </Grid>
        </Grid>
        
        <Box sx={{ mt: 6, pb: 2, color: "text.secondary", textAlign: "center" }}>
          <Typography variant="caption" fontWeight={500}>Enterprise Work Management System</Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
