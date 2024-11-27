// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { TextField, Button, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Container, Grid, IconButton, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import './TaskManager.css';

// const TaskManager = () => {
//   const [tasks, setTasks] = useState([]);
//   const [task, setTask] = useState({
//     username: '',
//     title: '',
//     description: '',
//     duedate: '',
//     priority: 'Low'
//   });
//   const [editingTask, setEditingTask] = useState(null);
//   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
//   const [taskToDeleteId, setTaskToDeleteId] = useState(null);

//   const fetchTasks = async () => {
//     try {
//       const response = await axios.get('http://localhost:4000/api/tasks/gettasks');
//       setTasks(response.data);
//     } catch (error) {
//       console.error('Error fetching tasks:', error);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editingTask) {
      
//         await axios.put(`http://localhost:4000/api/tasks/updatetasks/${editingTask._id}`, task);
//         setEditingTask(null);
//       } else {
      
//         await axios.post('http://localhost:4000/api/tasks/addtasks', task);
//       }
//       fetchTasks();
//       resetForm();
//     } catch (error) {
//       console.error('Error saving task:', error);
//     }
//   };

//   const handleChange = (e) => {
//     setTask({
//       ...task,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleEdit = (taskToEdit) => {
//     setTask({
//       username: taskToEdit.username,
//       title: taskToEdit.title,
//       description: taskToEdit.description,
//       duedate: taskToEdit.duedate,
//       priority: taskToEdit.priority
//     });
//     setEditingTask(taskToEdit);
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`http://localhost:4000/api/tasks/deltasks/${id}`);
//       fetchTasks();
//     } catch (error) {
//       console.error('Error deleting task:', error);
//     }
//   };

//   const resetForm = () => {
//     setTask({
//       username: '',
//       title: '',
//       description: '',
//       duedate: '',
//       priority: 'Low'
//     });
//   };

//   const handleDialogClose = () => {
//     setOpenDeleteDialog(false);
//     setTaskToDeleteId(null);
//   };

//   const handleOpenDeleteDialog = (id) => {
//     setTaskToDeleteId(id);
//     setOpenDeleteDialog(true);
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   const getPriorityClass = (priority) => {
//     switch (priority) {
//       case 'High':
//         return 'priority-high';
//       case 'Medium':
//         return 'priority-medium';
//       case 'Low':
//         return 'priority-low';
//       default:
//         return '';
//     }
//   };

//   return (
//     <Container className="container" style={{ paddingTop: '5rem' }}>
//       <Typography variant="h4" className="title" gutterBottom>Task Manager</Typography>

//       <form onSubmit={handleSubmit} className="form-container">
//         <Grid container spacing={2}>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="Username"
//               name="username"
//               value={task.username}
//               onChange={handleChange}
//               fullWidth
//               required
//               className="text-field"
//             />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="Title"
//               name="title"
//               value={task.title}
//               onChange={handleChange}
//               fullWidth
//               required
//               className="text-field"
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               label="Description"
//               name="description"
//               value={task.description}
//               onChange={handleChange}
//               fullWidth
//               multiline
//               rows={4}
//               required
//               className="description-textarea"
//             />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               label="Due Date"
//               name="duedate"
//               type="date"
//               value={task.duedate}
//               onChange={handleChange}
//               fullWidth
//               InputLabelProps={{ shrink: true }}
//               required
//               className="due-date"
//             />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <Select
//               name="priority"
//               value={task.priority}
//               onChange={handleChange}
//               fullWidth
//               required
//             >
//               <MenuItem value="Low">Low</MenuItem>
//               <MenuItem value="Medium">Medium</MenuItem>
//               <MenuItem value="High">High</MenuItem>
//             </Select>
//           </Grid>
//           <Grid item xs={12}>
//             <Button type="submit" variant="contained" color="primary" className="add-button">
//               {editingTask ? 'Update Task' : 'Add Task'}
//             </Button>
//           </Grid>
//         </Grid>
//       </form>

//       <TableContainer component={Paper} className="table-container">
//         <Table>
//           <TableHead className="table-header">
//             <TableRow>
//               <TableCell>Username</TableCell>
//               <TableCell>Title</TableCell>
//               <TableCell>Description</TableCell>
//               <TableCell>Due Date</TableCell>
//               <TableCell>Priority</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {tasks.map(task => (
//               <TableRow key={task._id}>
//                 <TableCell>{task.username}</TableCell>
//                 <TableCell>{task.title}</TableCell>
//                 <TableCell>{task.description}</TableCell>
//                 <TableCell>{new Date(task.duedate).toLocaleDateString()}</TableCell>
//                 <TableCell className={getPriorityClass(task.priority)}>
//                   {task.priority}
//                 </TableCell>
//                 <TableCell>
//                   <IconButton color="primary" onClick={() => handleEdit(task)}>
//                     <EditIcon />
//                   </IconButton>
//                   <IconButton color="secondary" onClick={() => handleOpenDeleteDialog(task._id)}>
//                     <DeleteIcon />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <Dialog open={openDeleteDialog} onClose={handleDialogClose}>
//         <DialogTitle>Confirm Deletion</DialogTitle>
//         <DialogContent>
//           <Typography>Are you sure you want to delete this task?</Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleDialogClose} color="primary">
//             Cancel
//           </Button>
//           <Button
//             onClick={async () => {
//               await handleDelete(taskToDeleteId);
//               handleDialogClose();
//             }}
//             color="secondary"
//           >
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Container>
//   );
// };

// export default TaskManager;


import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Button, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Container, Grid, IconButton, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchTasks, addTask, updateTask, deleteTask } from '../redux/taskSlice';

import './TaskManager.css';

const TaskManager = () => {
  const dispatch = useDispatch();
  const tasks = useSelector(state => state.tasks.tasks);
  const status = useSelector(state => state.tasks.status);

  const [task, setTask] = useState({
    username: '',
    title: '',
    description: '',
    duedate: '',
    priority: 'Low'
  });
  const [editingTask, setEditingTask] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [taskToDeleteId, setTaskToDeleteId] = useState(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTasks());
    }
  }, [dispatch, status]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTask) {
      dispatch(updateTask({ id: editingTask._id, task }));
      setEditingTask(null);
    } else {
      dispatch(addTask(task));
    }
    resetForm();
  };

  const handleChange = (e) => {
    setTask({
      ...task,
      [e.target.name]: e.target.value
    });
  };

  const handleEdit = (taskToEdit) => {
    setTask(taskToEdit);
    setEditingTask(taskToEdit);
  };

  const handleDelete = (id) => {
    dispatch(deleteTask(id));
    handleDialogClose();
  };

  const resetForm = () => {
    setTask({
      username: '',
      title: '',
      description: '',
      duedate: '',
      priority: 'Low'
    });
  };

  const handleDialogClose = () => {
    setOpenDeleteDialog(false);
    setTaskToDeleteId(null);
  };

  const handleOpenDeleteDialog = (id) => {
    setTaskToDeleteId(id);
    setOpenDeleteDialog(true);
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'High':
        return 'priority-high';
      case 'Medium':
        return 'priority-medium';
      case 'Low':
        return 'priority-low';
      default:
        return '';
    }
  };

  return (
    <Container className="container">
      <Typography variant="h4" className="title" gutterBottom>Task Manager</Typography>

      <form onSubmit={handleSubmit} className="form-container">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Username"
              name="username"
              value={task.username}
              onChange={handleChange}
              fullWidth
              required
              className="text-field"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Title"
              name="title"
              value={task.title}
              onChange={handleChange}
              fullWidth
              required
              className="text-field"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              value={task.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              required
              className="description-textarea"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Due Date"
              name="duedate"
              type="date"
              value={task.duedate}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
              className="due-date"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Select
              name="priority"
              value={task.priority}
              onChange={handleChange}
              fullWidth
              required
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" className="add-button">
              {editingTask ? 'Update Task' : 'Add Task'}
            </Button>
          </Grid>
        </Grid>
      </form>

      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead className="table-header">
            <TableRow>
              <TableCell>Username</TableCell>
           <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map(task => (
              <TableRow key={task._id}>
                <TableCell>{task.username}</TableCell>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>{new Date(task.duedate).toLocaleDateString()}</TableCell>
                <TableCell className={getPriorityClass(task.priority)}>
                  {task.priority}
                </TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(task)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleOpenDeleteDialog(task._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDeleteDialog} onClose={handleDialogClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this task?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => handleDelete(taskToDeleteId)}
            color="secondary"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TaskManager;

