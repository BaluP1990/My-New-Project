import React, { useState, useEffect } from 'react';
import TaskForm from '../components/TaskForm';
import TaskTable from '../components/TaskTable';
import TopBar from '../components/TopBar';
import { Container, Typography, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Snackbar, Alert } from '@mui/material';
import './TasksPage.css';

const LOCAL_STORAGE_KEY = 'tasks';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [open, setOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    setTasks(savedTasks);
    setNotificationCount(savedTasks.length);
    console.log('Loaded tasks from localStorage:', savedTasks);
  }, []);

  // Save tasks to localStorage whenever tasks state changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
    setNotificationCount(tasks.length);
    console.log('Saved tasks to localStorage:', tasks);
  }, [tasks]);

  const handleAddTask = (task) => {
    const taskWithPriority = { ...task, priority: task.priority || 'Medium', date: new Date().toISOString().split('T')[0] };
    if (editIndex !== null) {
      setTasks((prevTasks) =>
        prevTasks.map((t, index) => (index === editIndex ? taskWithPriority : t))
      );
      setSnackbarMessage('Task updated successfully!');
    } else {
      setTasks((prevTasks) => [...prevTasks, taskWithPriority]);
      setSnackbarMessage('Task added successfully!');
    }
    setSnackbarOpen(true);
    handleCloseModal();
  };

  const handleEditTask = (index) => {
    setEditIndex(index);
    setOpen(true);
  };

  const handleDeleteTask = (index) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (confirmDelete) {
      setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
      setSnackbarMessage('Task deleted successfully!');
      setSnackbarOpen(true);
    }
  };

  const handleOpenModal = () => {
    setEditIndex(null);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setEditIndex(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const taskToEdit = editIndex !== null ? tasks[editIndex] : null;

  return (
    <>
      <TopBar notificationCount={notificationCount} />
      <Container className="full-page-container" disableGutters>
        <Typography variant="h4" gutterBottom>
          Tasks
        </Typography>
        <Paper className="paper">
          <Grid container spacing={3} direction="column">
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={handleOpenModal}>
                Add New Task
              </Button>
            </Grid>
            <Grid item xs={12}>
              <TaskTable 
                tasks={tasks} 
                onEditTask={handleEditTask} 
                onDeleteTask={handleDeleteTask} 
              />
            </Grid>
          </Grid>
        </Paper>

        <Dialog open={open} onClose={handleCloseModal} fullWidth maxWidth="md">
          <DialogTitle>{editIndex !== null ? 'Edit Task' : 'Add New Task'}</DialogTitle>
          <DialogContent>
            <TaskForm 
              onAddTask={handleAddTask} 
              editIndex={editIndex} 
              taskToEdit={taskToEdit} 
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        
        <Snackbar 
          open={snackbarOpen} 
          autoHideDuration={6000} 
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default TasksPage;
