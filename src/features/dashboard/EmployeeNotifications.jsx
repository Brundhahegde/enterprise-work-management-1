import React, { useEffect, useState, useContext } from 'react';
import { Paper, Typography, List, ListItem, ListItemText, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import DeleteIcon from '@mui/icons-material/Delete';
import { AuthContext, ROLES } from '../../context/AuthContext';

const LS_KEY_NOTIF = "notif_list";

const EmployeeNotifications = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    function update() {
      const stored = localStorage.getItem(LS_KEY_NOTIF);
      setNotifications(stored ? JSON.parse(stored) : []);
    }
    update();
    const interval = setInterval(update, 1000);
    window.addEventListener("storage", update);
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", update);
    };
  }, []);

 
  const handleMarkRead = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
    localStorage.setItem(LS_KEY_NOTIF, JSON.stringify(notifications.filter(n => n.id !== id)));
  };

  const handleDelete = (id) => handleMarkRead(id);

  
  const handleSend = () => {
    if (!msg.trim()) return;
    const notif = {
      id: Date.now(),
      message: msg.trim(),
      date: new Date().toISOString().split('T')[0],
    };
    const prev = JSON.parse(localStorage.getItem(LS_KEY_NOTIF) || "[]");
    localStorage.setItem(LS_KEY_NOTIF, JSON.stringify([notif, ...prev]));
    setOpen(false);
    setMsg("");
  };


  const canSend = user && (user.role === ROLES.ADMIN || user.role === ROLES.MANAGER);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Notifications
      </Typography>
      {canSend && (
        <>
          <Button variant="contained" sx={{ mb: 2 }} color="secondary" onClick={() => setOpen(true)}>
            Send Notification
          </Button>
          <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Send Notification</DialogTitle>
            <DialogContent>
              <TextField
                label="Message"
                fullWidth
                multiline
                minRows={2}
                margin="normal"
                value={msg}
                onChange={e => setMsg(e.target.value)}
                autoFocus
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button disabled={!msg.trim()} onClick={handleSend} variant="contained">
                Send
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
      <List>
        {notifications.length === 0 && (
          <ListItem><ListItemText primary="No notifications." /></ListItem>
        )}
        {notifications.map(n => (
          <ListItem key={n.id}
            secondaryAction={
              <>
                <IconButton onClick={() => handleMarkRead(n.id)} title="Mark as Read"><DoneIcon /></IconButton>
                <IconButton color="error" onClick={() => handleDelete(n.id)} title="Delete"><DeleteIcon /></IconButton>
              </>
            }>
            <ListItemText primary={n.message} secondary={n.date} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default EmployeeNotifications;
