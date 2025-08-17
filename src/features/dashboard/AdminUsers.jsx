import React, { useEffect, useState } from 'react';
import {
  Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const LS_KEY = "users_list";
const ROLE_OPTIONS = ["Admin", "Manager", "Employee"];

const getInitialUsers = async () => {
  const fromLS = localStorage.getItem(LS_KEY);
  if (fromLS) return JSON.parse(fromLS);
  const res = await fetch('/src/data/users.json');
  const data = await res.json();
  localStorage.setItem(LS_KEY, JSON.stringify(data));
  return data;
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); 
  const [form, setForm] = useState({ id: null, name: '', email: '', role: 'Employee' });

  
  useEffect(() => {
    getInitialUsers().then(setUsers);
  }, []);

  
  useEffect(() => {

    if (users.length) localStorage.setItem(LS_KEY, JSON.stringify(users));
  }, [users]);

  const openAddUser = () => {
    setDialogMode('add');
    setForm({ id: null, name: '', email: '', role: 'Employee' });
    setOpenDialog(true);
  };

  const openEditUser = (user) => {
    setDialogMode('edit');
    setForm(user);
    setOpenDialog(true);
  };

  const closeDialog = () => {
    setOpenDialog(false);
    setForm({ id: null, name: '', email: '', role: 'Employee' });
  };

  const handleFormChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
  };

  const handleSave = () => {
    if (!form.name || !form.email) return;
    if (dialogMode === 'add') {
     
      const newUser = { ...form, id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1 };
      setUsers([...users, newUser]);
    } else {
      setUsers(users.map(u => u.id === form.id ? { ...form } : u));
    }
    setOpenDialog(false);
    setForm({ id: null, name: '', email: '', role: 'Employee' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this user?')) setUsers(users.filter(u => u.id !== id));
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        User Management (Admin)
      </Typography>
      <Button variant="contained" sx={{ mb: 2 }} onClick={openAddUser}>+ Add User</Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => openEditUser(user)}><EditIcon fontSize="small" /></IconButton>
                <IconButton color="error" onClick={() => handleDelete(user.id)}><DeleteIcon fontSize="small" /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>


      <Dialog open={openDialog} onClose={closeDialog}>
        <DialogTitle>{dialogMode === 'add' ? 'Add User' : 'Edit User'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={form.name}
            onChange={e => handleFormChange('name', e.target.value)}
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={form.email}
            onChange={e => handleFormChange('email', e.target.value)}
          />
          <Select
            label="Role"
            fullWidth
            margin="normal"
            value={form.role}
            onChange={e => handleFormChange('role', e.target.value)}
            sx={{ mt: 2 }}
          >
            {ROLE_OPTIONS.map(roleOpt => (
              <MenuItem key={roleOpt} value={roleOpt}>{roleOpt}</MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={!form.name || !form.email}>
            {dialogMode === 'add' ? 'Add' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default AdminUsers;
