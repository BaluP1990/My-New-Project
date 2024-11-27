import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Typography, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
 
const TaskForm = ({ onAddTask, editIndex, taskToEdit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [priority, setPriority] = useState('Medium');
  const [userName, setUserName] = useState('');
 
  useEffect(() => {
    if (editIndex >= 0 && taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setDueDate(taskToEdit.dueDate ? new Date(taskToEdit.dueDate) : null);
      setPriority(taskToEdit.priority);
      setUserName(taskToEdit.userName || '');
    }
  }, [editIndex, taskToEdit]);
 
  const handleSubmit = (e) => {
    e.preventDefault();
    const task = {
      title,
      description,
      dueDate,
      priority,
      userName,
    };
    onAddTask(task);
    setTitle('');
    setDescription('');
    setDueDate(null);
    setPriority('Medium');
    setUserName('');
  };
 
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
        <Typography variant="h6" gutterBottom>
          {editIndex >= 0 ? 'Add Task' : 'Add New Task'}
        </Typography>
        <Grid container spacing={2}>
        <Grid item xs={12}>
            <TextField
              label="User Name"
              variant="outlined"
              fullWidth
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <DatePicker
              label="Due Date"
              value={dueDate}
              onChange={(date) => setDueDate(date)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Priority"
              variant="outlined"
              select
              fullWidth
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              SelectProps={{
                native: true,
              }}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </TextField>
          </Grid>
 
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              {editIndex >= 0 ? 'ADD&UPDATE' : 'Add Task'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};
 
export default TaskForm;