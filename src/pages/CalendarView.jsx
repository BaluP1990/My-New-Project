import React, { useState, useEffect, useCallback } from 'react';
import Calendar from 'react-calendar';
import { Container, Typography, Paper, Modal, Box, Button, Card, CardContent, CardHeader } from '@mui/material';
import { format } from 'date-fns';
import 'react-calendar/dist/Calendar.css'; 
import './CalendarView.css';

const LOCAL_STORAGE_KEY = 'tasks';

const CalendarView = () => {
  const [date, setDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    setTasks(savedTasks);
  }, []);

  const handleDateChange = useCallback((newDate) => {
    setDate(newDate);
  }, []);

  const handleTaskClick = useCallback((task) => {
    setSelectedTask(task);
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const formattedDate = format(date, 'yyyy-MM-dd');
  const tasksForDate = tasks.filter(task => task.date === formattedDate);

  return (
    <Container
      maxWidth={false}
      style={{
        padding: 0,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h4" gutterBottom style={{ padding: '1rem' }}>
        Calendar View
      </Typography>
      <Paper
        style={{
          flex: 1,
          display: 'flex',
          padding: '1rem',
          height: 'calc(100% - 64px)', // Adjust based on header height
        }}
      >
        <div style={{ flex: 1, marginRight: '1rem', height: '100%' }}>
          <Calendar
            onChange={handleDateChange}
            value={date}
            tileClassName={({ date, view }) => {
              if (view === 'month') {
                const taskDate = format(date, 'yyyy-MM-dd');
                return tasks.some(task => task.date === taskDate) ? 'highlight-tasks' : null;
              }
              return null;
            }}
            style={{ height: '100%', width: '100%' }}
          />
        </div>
        <div style={{ flex: 2, overflowY: 'auto' }}>
          <Typography variant="h6" gutterBottom>
            Tasks for {formattedDate}
          </Typography>
          {tasksForDate.length > 0 ? (
            tasksForDate.map((task, index) => (
              <Button
                key={index}
                variant="outlined"
                style={{ margin: '0.5rem', display: 'block' }}
                onClick={() => handleTaskClick(task)}
              >
                {task.title}
              </Button>
            ))
          ) : (
            <Typography>No tasks for this date.</Typography>
          )}
        </div>
      </Paper>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="task-details-title"
        aria-describedby="task-details-description"
      >
        <Box sx={{ width: 400, margin: 'auto', mt: 5 }}>
          <Card>
            <CardHeader
              title="Task Details"
              subheader={selectedTask ? selectedTask.date : ''}
            />
            <CardContent>
              <Typography variant="h6">Title:</Typography>
              <Typography>{selectedTask ? selectedTask.title : ''}</Typography>
              <Typography variant="h6">Description:</Typography>
              <Typography>{selectedTask ? selectedTask.description : ''}</Typography>
              <Typography variant="h6">Priority:</Typography>
              <Typography>{selectedTask ? selectedTask.priority : ''}</Typography>
              <Typography variant="h6">Due Date:</Typography>
              <Typography>{selectedTask ? selectedTask.dueDate ? format(new Date(selectedTask.dueDate), 'MMMM d, yyyy') : 'No Due Date' : ''}</Typography>
            </CardContent>
            <Button variant="contained" color="primary" onClick={handleClose} style={{ margin: '1rem' }}>
              Close
            </Button>
          </Card>
        </Box>
      </Modal>
    </Container>
  );
};

export default CalendarView;
