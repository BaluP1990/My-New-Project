import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, IconButton, Checkbox, FormControl, InputLabel, Select, MenuItem, Divider } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const TaskList = ({ tasks, onToggleTaskCompletion, onDeleteTask, onEditTask, onFilterChange }) => {
  const [filter, setFilter] = useState('All');
  
  useEffect(() => {
    onFilterChange(filter);
  }, [filter, onFilterChange]);

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'Completed') return task.completed;
    if (filter === 'Incomplete') return !task.completed;
    if (filter === 'High') return task.priority === 'High';
    if (filter === 'Medium') return task.priority === 'Medium';
    if (filter === 'Low') return task.priority === 'Low';
    return true;
  });

  return (
    <>
      <FormControl fullWidth>
        <InputLabel>Filter Tasks</InputLabel>
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          label="Filter Tasks"
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
          <MenuItem value="Incomplete">Incomplete</MenuItem>
          <MenuItem value="High">High Priority</MenuItem>
          <MenuItem value="Medium">Medium Priority</MenuItem>
          <MenuItem value="Low">Low Priority</MenuItem>
        </Select>
      </FormControl>

      <Divider style={{ margin: '2rem 0' }} />

      <List style={{ marginTop: '2rem' }}>
        {filteredTasks.map((task, index) => (
          <ListItem key={index} dense style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox
                checked={task.completed}
                onChange={() => onToggleTaskCompletion(index)}
              />
              <ListItemText
                primary={task.text}
                secondary={`Priority: ${task.priority} ${task.dueDate ? `| Due: ${new Date(task.dueDate).toLocaleDateString()}` : ''}`}
                style={{
                  textDecoration: task.completed ? 'line-through' : 'none',
                }}
              />
            </div>
            <div>
              <IconButton edge="end" onClick={() => onEditTask(index)}>
                <Edit />
              </IconButton>
              <IconButton edge="end" onClick={() => onDeleteTask(index)}>
                <Delete />
              </IconButton>
            </div>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default TaskList;
