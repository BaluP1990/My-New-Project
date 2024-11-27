// src/components/Dashboard.js
import React from 'react';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import ReportsPage from '../pages/ReportsPage';

const Dashboard = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <TopBar />
      <Sidebar />
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, marginLeft: '240px' }}
      >
        <Toolbar />
        {/* <TaskForm />
        <TaskList /> */}
        <ReportsPage/>
      </Box>
    </Box>
  );
};

export default Dashboard;
