import React, { useEffect, useState } from 'react';
import {
  Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

const LS_KEY_PROJECTS = "projects_list";
const LS_KEY_NOTIF = "notif_list";

const getInitialProjects = async () => {
  const fromLS = localStorage.getItem(LS_KEY_PROJECTS);
  if (fromLS) return JSON.parse(fromLS);
  const res = await fetch('/src/data/projects.json');
  const data = await res.json();
  localStorage.setItem(LS_KEY_PROJECTS, JSON.stringify(data));
  return data;
};

const ManagerProjects = () => {
  const [projects, setProjects] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); 
  const [form, setForm] = useState({ id: null, name: '', manager: '', status: 'To Do' });

  useEffect(() => {
    getInitialProjects().then(setProjects);
  }, []);

  useEffect(() => {
    if (projects.length) localStorage.setItem(LS_KEY_PROJECTS, JSON.stringify(projects));
  }, [projects]);

  const openAdd = () => {
    setDialogMode('add');
    setForm({ id: null, name: '', manager: '', status: 'To Do' });
    setOpenDialog(true);
  };
  const openEdit = (p) => {
    setDialogMode('edit');
    setForm(p);
    setOpenDialog(true);
  };
  const closeDialog = () => {
    setOpenDialog(false);
    setForm({ id: null, name: '', manager: '', status: 'To Do' });
  };
  const handleChange = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleSave = () => {
    if (!form.name || !form.manager) return;
    if (dialogMode === 'add') {
      const newProj = { ...form, id: projects.length ? Math.max(...projects.map(p => p.id)) + 1 : 1 };
      setProjects([...projects, newProj]);
    } else {
      setProjects(projects.map(p => p.id === form.id ? { ...form } : p));
    }
    closeDialog();
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this project?')) setProjects(projects.filter(p => p.id !== id));
  };

  
  const notifyProject = (project) => {
    const notif = {
      id: Date.now(),
      message: `Update on project "${project.name}" - Status: ${project.status}` ,
      date: new Date().toISOString().split('T')[0]
    };
   
    const prev = JSON.parse(localStorage.getItem(LS_KEY_NOTIF) || "[]");
    localStorage.setItem(LS_KEY_NOTIF, JSON.stringify([notif, ...prev]));
    alert('Notification sent to team!');
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Projects Overview (Manager)
      </Typography>
      <Button variant="contained" sx={{ mb: 2 }} onClick={openAdd}>+ Add Project</Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Project Name</TableCell>
            <TableCell>Manager</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {projects.map(p => (
            <TableRow key={p.id}>
              <TableCell>{p.name}</TableCell>
              <TableCell>{p.manager}</TableCell>
              <TableCell>{p.status}</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => openEdit(p)}><EditIcon fontSize="small" /></IconButton>
                <IconButton color="error" onClick={() => handleDelete(p.id)}><DeleteIcon fontSize="small" /></IconButton>
                <IconButton color="primary" onClick={() => notifyProject(p)} title="Send Notification">
                  <NotificationsActiveIcon fontSize="small"/>
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={openDialog} onClose={closeDialog}>
        <DialogTitle>{dialogMode === 'add' ? 'Add Project' : 'Edit Project'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Project Name"
            fullWidth
            margin="normal"
            value={form.name}
            onChange={e => handleChange('name', e.target.value)}
          />
          <TextField
            label="Manager"
            fullWidth
            margin="normal"
            value={form.manager}
            onChange={e => handleChange('manager', e.target.value)}
          />
          <TextField
            label="Status"
            fullWidth
            margin="normal"
            value={form.status}
            onChange={e => handleChange('status', e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={!form.name || !form.manager}>
            {dialogMode === 'add' ? 'Add' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ManagerProjects;
