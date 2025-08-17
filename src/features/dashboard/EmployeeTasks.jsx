import React, { useContext, useEffect, useState } from 'react';
import { Paper, Typography, List, ListItem, ListItemText, Box } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';

const LS_KEY = "kanban_tasks";

const EmployeeTasks = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    function updateTasks() {
      const stored = localStorage.getItem(LS_KEY);
      setTasks(stored ? JSON.parse(stored) : []);
    }
    updateTasks();
    const interval = setInterval(updateTasks, 500);
    window.addEventListener("storage", updateTasks);
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", updateTasks);
    };
  }, []);

  const myTasks = tasks.filter(task => task.assignedTo === user.username);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Your Tasks
      </Typography>
      
      <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="caption" display="block">
          Debug: My username: {user.username}
        </Typography>
        <Typography variant="caption" display="block">
          Total tasks loaded: {tasks.length}
        </Typography>
        <Typography variant="caption" display="block">
          Tasks assigned to me: {myTasks.length}
        </Typography>
        {tasks.length > 0 && (
          <Typography variant="caption" display="block">
            All assignees: {[...new Set(tasks.map(t => t.assignedTo))].join(', ')}
          </Typography>
        )}
      </Box>

      <List>
        {myTasks.length > 0 ? (
          myTasks.map(task => (
            <ListItem key={task.id}>
              <ListItemText
                primary={task.title}
                secondary={`Status: ${task.status}`}
              />
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemText primary="No tasks assigned to you yet." />
          </ListItem>
        )}
      </List>
    </Paper>
  );
};

export default EmployeeTasks;
