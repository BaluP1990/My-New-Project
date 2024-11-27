// import React, { useState, useEffect } from 'react';
// import TaskCard from '../components/TaskCard';
// import { Container, Typography, Grid, Box, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

// const LOCAL_STORAGE_KEY = 'tasks';

// const HomePage = () => {
//   const [tasks, setTasks] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [selectedIndex, setSelectedIndex] = useState(null);

//   useEffect(() => {
//     const savedTasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
//     setTasks(savedTasks);
//   }, []);

//   const handleDeleteTask = (index) => {
//     setSelectedIndex(index);
//     setOpen(true);
//   };

//   const handleConfirmDelete = () => {
//     setTasks((prevTasks) => {
//       const updatedTasks = prevTasks.filter((_, i) => i !== selectedIndex);
//       localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTasks));
//       return updatedTasks;
//     });
//     setOpen(false);
//   };

//   const handleCancelDelete = () => {
//     setOpen(false);
//   };

//   return (
//     <Box 
//       style={{ 
//         padding: '2rem',
//         maxWidth: '100%',
//         boxSizing: 'border-box',
//         paddingTop: '5rem'
//       }}
//     >
//       <Container 
//         maxWidth="lg" 
//         style={{ 
//           padding: 0,
//           width: '90%',
//           maxWidth: '3000px',
//           margin: '0 auto' 
//         }}
//       >
//         <Typography variant="h4" gutterBottom style={{ fontSize: '20px' }}>
//           My Tasks
//         </Typography>
//         <Grid 
//           container 
//           spacing={4}
//           style={{ justifyContent: 'flex-start' }} 
//         >
//           {tasks.length > 0 ? (
//             tasks.map((task, index) => (
//               <Grid 
//                 item 
//                 xs={12} 
//                 sm={tasks.length === 2 ? 12 : 6} 
//                 md={tasks.length === 2 ? 6 : 4}  
//                 key={index}
//                 style={{ 
//                   display: 'flex',
//                   marginBottom: '1rem'
//                 }}
//               >
//                 <TaskCard
//                   task={task}
//                   onDelete={() => handleDeleteTask(index)}
//                 />
//               </Grid>
//             ))
//           ) : (
//             <Grid 
//               item 
//               xs={12} 
//               style={{ 
//                 display: 'flex', 
//                 justifyContent: 'center', 
//                 width: '100%' 
//               }}
//             >
//               <Typography 
//                 variant="h6" 
//                 color="text.secondary" 
//                 style={{ 
//                   paddingTop: '1rem', 
//                   fontSize: '20px', 
//                   whiteSpace: 'nowrap' 
//                 }}
//               >
//                 No tasks available
//               </Typography>
//             </Grid>
//           )}
//         </Grid>
//       </Container>
      
//       <Dialog open={open} onClose={handleCancelDelete}>
//         <DialogTitle>Confirm Delete</DialogTitle>
//         <DialogContent>
//           Are you sure you want to delete this task?
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCancelDelete} color="primary">
//             Cancel
//           </Button>
//           <Button onClick={handleConfirmDelete} color="error">
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default HomePage;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem, Snackbar } from '@mui/material';
import { fetchTasks, deleteTask, updateTask } from '../redux/taskSlice';
import TaskCard from '../components/TaskCard';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tasks = useSelector(state => state.tasks.tasks);
  const status = useSelector(state => state.tasks.status);
  
  const [open, setOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [formValues, setFormValues] = useState({
    username: '',
    title: '',
    description: '',
    duedate: '',
    priority: 'Low',
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTasks());
    }
  }, [dispatch, status]);

  const handleEdit = (task) => {
    setCurrentTask(task);
    setFormValues(task);
    setOpen(true);
  };
  
  const handleDelete = (id) => {
    setTaskToDelete(id);
    setConfirmDialogOpen(true);
  };

  const confirmDelete = () => {
    dispatch(deleteTask(taskToDelete));
    setSnackbarMessage('Task deleted successfully');
    setSnackbarOpen(true);
    setConfirmDialogOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentTask(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateTask({ id: currentTask._id, task: formValues }));
    setSnackbarMessage('Task updated successfully');
    setSnackbarOpen(true);
    handleClose();
  };

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container style={{ paddingTop: '1rem' }}>
      <Grid container spacing={2}>
        {tasks.map(task => (
          <Grid item xs={12} sm={6} md={4} key={task._id}>
            <TaskCard 
              task={task} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
            />
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Username"
              name="username"
              value={formValues.username}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Title"
              name="title"
              value={formValues.title}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Description"
              name="description"
              value={formValues.description}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              multiline
              rows={4}
            />
            <TextField
              label="Due Date"
              name="duedate"
              type="date"
              value={formValues.duedate}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              select
              label="Priority"
              name="priority"
              value={formValues.priority}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </TextField>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" color="primary">Update</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this task?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="primary">Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        autoHideDuration={3000}
      />
    </Container>
  );
};

export default HomePage;





