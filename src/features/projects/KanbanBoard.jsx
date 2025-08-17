import React, { useEffect, useState, useContext } from 'react';
import {
  Paper, Typography, Box, Card, CardContent, Button, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { AuthContext } from '../../context/AuthContext';


const ASSIGNEES = [
  'alice@company.com',
  'bob@company.com',
  'charlie@company.com'
];

const columns = [
  { id: 'To Do', title: 'To Do' },
  { id: 'In Progress', title: 'In Progress' },
  { id: 'Completed', title: 'Completed' }
];

const LS_KEY = 'kanban_tasks';

export default function KanbanBoard({ showAllTasks = true }) {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    status: 'To Do',
    assignedTo: user?.username || ''
  });


  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
      setTasks(JSON.parse(saved));
    } else {
      fetch('/src/data/tasks.json')
        .then(res => res.json())
        .then(ts => {
          setTasks(ts);
          localStorage.setItem(LS_KEY, JSON.stringify(ts));
        });
    }
  }, []);


  useEffect(() => {
    if (tasks.length)
      localStorage.setItem(LS_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const visibleTasks = showAllTasks
    ? tasks
    : tasks.filter(t => t.assignedTo === user.username);

  const grouped = columns.reduce((acc, col) => {
    acc[col.id] = visibleTasks.filter(t => t.status === col.id);
    return acc;
  }, {});

  
  function onDragEnd(result) {
    const { source, destination, draggableId } = result;
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return;
    const updatedTasks = [...tasks];
    const draggedTaskIndex = updatedTasks.findIndex(task => task.id.toString() === draggableId);
    if (draggedTaskIndex === -1) return;
    updatedTasks[draggedTaskIndex] = {
      ...updatedTasks[draggedTaskIndex],
      status: destination.droppableId
    };
    setTasks(updatedTasks);
  }

  
  const handleAddTask = () => {
    const nextId = tasks.length ? Math.max(...tasks.map(t => +t.id)) + 1 : 1;
    setTasks([
      ...tasks,
      {
        id: nextId,
        title: newTask.title,
        status: newTask.status,
        assignedTo: newTask.assignedTo
      }
    ]);
    setOpenDialog(false);
    setNewTask({ title: '', status: 'To Do', assignedTo: user.username });
  };

  
  const handleDelete = id => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const isAdminOrManager = user.role === 'Admin' || user.role === 'Manager';
  const isEmployee = user.role === 'Employee';

  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Kanban Board</Typography>
        {isAdminOrManager && (
          <Button onClick={() => setOpenDialog(true)} variant="contained" color="primary">
            + New Task
          </Button>
        )}
      </Box>

      
      {isAdminOrManager && (
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogContent sx={{ minWidth: 300 }}>
            <TextField
              label="Task Title"
              fullWidth
              margin="normal"
              value={newTask.title}
              onChange={e => setNewTask(t => ({ ...t, title: e.target.value }))}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                value={newTask.status}
                label="Status"
                onChange={e => setNewTask(t => ({ ...t, status: e.target.value }))}
              >
                {columns.map(col => (
                  <MenuItem key={col.id} value={col.id}>{col.title}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Assign To</InputLabel>
              <Select
                value={newTask.assignedTo}
                label="Assign To"
                onChange={e => setNewTask(t => ({ ...t, assignedTo: e.target.value }))}
              >
                {ASSIGNEES.map(a => (
                  <MenuItem key={a} value={a}>{a}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleAddTask} variant="contained" disabled={!newTask.title}>
              Add Task
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {columns.map(column => (
            <Droppable key={column.id} droppableId={column.id}>
              {(provided) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{
                    flex: 1,
                    bgcolor: '#fafcff',
                    minHeight: 350,
                    p: 2,
                    borderRadius: 2,
                    boxShadow: 1
                  }}
                >
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                    {column.title}
                  </Typography>
                  {grouped[column.id].map((task, idx) => (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={idx}>
                      {(provided, snapshot) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{
                            mb: 2,
                            position: 'relative',
                            transition: 'box-shadow 0.2s',
                            boxShadow: snapshot.isDragging ? 5 : 1,
                            bgcolor: snapshot.isDragging ? '#e3f2fd' : 'background.paper'
                          }}
                        >
                          <CardContent sx={{ pb: '32px' }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                              {task.title}
                            </Typography>
                            <Typography variant="caption" sx={{ display: 'block' }}>
                              Status: {task.status}
                            </Typography>
                            <Typography variant="caption">
                              Assignee: {task.assignedTo}
                            </Typography>
                          </CardContent>
                          {(user.role === 'Admin' || user.username === task.assignedTo) && (
                            <IconButton
                              aria-label="delete"
                              onClick={() => handleDelete(task.id)}
                              sx={{ position: 'absolute', top: 2, right: 2 }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          ))}
        </Box>
      </DragDropContext>
    </Paper>
  );
}
