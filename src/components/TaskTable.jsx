import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import './TaskTable.css';

const TaskTable = ({ tasks, onEditTask, onDeleteTask }) => {
  
  return (
    <TableContainer component={Paper} className="table-container">
      <Table className="table">
        <TableHead className="table-head">
          <TableRow>
            <TableCell className="table-cell">Title</TableCell>
            <TableCell className="table-cell">Description</TableCell>
            <TableCell className="table-cell">Due Date</TableCell>
            <TableCell className="table-cell">Priority</TableCell>
            <TableCell className="table-cell">UserName</TableCell>
            <TableCell className="table-cell">Actions</TableCell>            
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task, index) => (
            <TableRow key={index} className="table-row">
              <TableCell className="table-cell">{task.title}</TableCell>
              <TableCell className="table-cell">{task.description}</TableCell>
              <TableCell className="table-cell">{task.dueDate ? new Date(task.dueDate).toDateString() : 'N/A'}</TableCell>
              <TableCell className="table-cell">{task.priority}</TableCell>
              <TableCell className="table-cell">{task.userName}</TableCell>
              <TableCell className="table-cell">
                <Button onClick={() => onEditTask(index)} color="primary" variant="contained" className="button">
                  Edit
                </Button>
                <Button onClick={() => onDeleteTask(index)} color="primary" variant="contained" style={{ marginLeft: '8px' }}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TaskTable;
