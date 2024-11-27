// import React from 'react';
// import { Card, CardContent, Typography, CardActions, Button, CardMedia } from '@mui/material';
// import TaskIcon from '@mui/icons-material/Task'; 

// const TaskCard = ({ task, onDelete }) => {
//   if (!task) {
//     return null; 
//   }

//   return (
//     <Card
//       variant="outlined"
//       style={{
//         display: 'flex',
//         alignItems: 'center',
//         marginBottom: '1rem',
//         width: '100%',
//         maxWidth: '400px', // Fixed width for consistency
//         minWidth: '300px', // Prevents cards from becoming too small
//         boxSizing: 'border-box'
//       }}
//     >
//       <CardMedia
//         style={{
//           width: 80,
//           height: 80,
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           marginRight: '1rem'
//         }}
//       >
//         <TaskIcon style={{ fontSize: 50, color: '#3f51b5' }} />
//       </CardMedia>
//       <CardContent style={{ flex: 1 }}>
//         <Typography variant="h6" component="div">
//           {task.title || 'No Title'}
//         </Typography>
//         <Typography color="text.secondary">
//           Priority: {task.priority || 'No Priority'}
//         </Typography>
//         <Typography color="text.secondary">
//           Date: {task.date || 'No Date'}
//         </Typography>
//       </CardContent>
//       <CardActions>
//         <Button size="small" color="error" onClick={onDelete}>Delete</Button>
//       </CardActions>
//     </Card>
//   );
// };

// export default TaskCard;


import React from 'react';
import { Card, CardContent, Typography, CardActions, Button, Box } from '@mui/material';
import { Task } from '@mui/icons-material'; 

const TaskCard = ({ task, onEdit, onDelete }) => {
  return (
    <Card variant="outlined" style={{ margin: '1rem', display: 'flex' ,width:'250px'}}>
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          padding: '1rem' 
        }}
      >
        <Task fontSize="large" />
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5">{task.title}</Typography>
        <Typography color="textSecondary">{task.username}</Typography>
        <Typography variant="body2">{task.description}</Typography>
        <Typography variant="body2" color="textSecondary">
          Due: {new Date(task.duedate).toLocaleDateString()}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Priority: {task.priority}
        </Typography>

        <Button size="small" onClick={() => onEdit(task)} >Edit</Button>
        <Button size="small" onClick={() => onDelete(task._id)}>Delete</Button>
        
      </CardContent>
      <CardActions>

      </CardActions>
    </Card>
  );
};

export default TaskCard;

