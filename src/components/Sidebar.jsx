import React, { useState } from "react";
import {
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  IconButton, Toolbar, Box
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BarChartIcon from "@mui/icons-material/BarChart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

const navItems = [
  { label: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { label: "Users", icon: <PeopleIcon />, path: "/users" },
  { label: "Projects", icon: <AssignmentIcon />, path: "/projects" },
  { label: "Kanban", icon: <AssignmentIcon />, path: "/kanban" },
  { label: "Tasks", icon: <AssignmentIcon />, path: "/tasks" },
  { label: "Notifications", icon: <NotificationsActiveIcon />, path: "/notifications" },
  { label: "Profile", icon: <AccountCircleIcon />, path: "/profile" },
  { label: "Reports", icon: <BarChartIcon />, path: "/reports" }
];
  return (
    <>
      <IconButton
        color="inherit"
        edge="start"
        onClick={() => setOpen(true)}
        sx={{ position: "fixed", top: 18, left: 18, zIndex: 1301 }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer open={open} onClose={() => setOpen(false)}>
        <Toolbar />
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => setOpen(false)}
        >
          <List>
            {navItems.map(item => (
              <ListItem key={item.label} disablePadding>
                <ListItemButton onClick={() => navigate(item.path)}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
