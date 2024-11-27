import React from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box, Toolbar, Button } from '@mui/material';
import { Home, ListAlt, BarChart, CalendarMonth, TaskAltOutlined } from '@mui/icons-material';
import KitchenIcon from '@mui/icons-material/Kitchen';
import StadiumIcon from '@mui/icons-material/Stadium';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ user, onLogout }) => {
  return (
    <Drawer variant="permanent" 
    sx={{ 
      width: 160, 
      flexShrink: 0, 
      '& .MuiDrawer-paper': { 
        width: 200, 
        boxSizing: 'border-box', 
        marginTop: '64px' 
        
      } 
    }} >
      <Toolbar />  
      <Box >
        <List >
          <ListItemButton component={Link} to="/home">
            <ListItemIcon><Home /></ListItemIcon>
            <ListItemText primary="Home" primaryTypographyProps={{ style: { marginLeft: -25 } }} />
          </ListItemButton>
          <ListItemButton component={Link} to="/Tasks">
            <ListItemIcon><ListAlt /></ListItemIcon>
            <ListItemText primary="Tasks" primaryTypographyProps={{ style: { marginLeft: -25 } }} />
          </ListItemButton>
          <ListItemButton component={Link} to="/reports">
            <ListItemIcon><BarChart /></ListItemIcon>
            <ListItemText primary="Reports" primaryTypographyProps={{ style: { marginLeft: -25 } }} />
          </ListItemButton>
          <ListItemButton component={Link} to="/calendarview">
            <ListItemIcon><CalendarMonth /></ListItemIcon>
            <ListItemText primary="Calendar View" primaryTypographyProps={{ style: { marginLeft: -25 } }} />
          </ListItemButton>
          {user.role === 'Administrator' && (
            <>
              <ListItemButton component={Link} to="/TaskManager">
                <ListItemIcon><TaskAltOutlined /></ListItemIcon>
                <ListItemText primary="Task Manager" primaryTypographyProps={{ style: { marginLeft: -25 } }} />
              </ListItemButton>
              <ListItemButton component={Link} to="/TaskStatistics">
                <ListItemIcon><TaskAltOutlined /></ListItemIcon>
                <ListItemText primary="Task Statistics" primaryTypographyProps={{ style: { marginLeft: -25 } }} />
              </ListItemButton>
              <ListItemButton component={Link} to="/HvacDashboard">
                <ListItemIcon><KitchenIcon /></ListItemIcon>
                <ListItemText primary="HvacDashboard" primaryTypographyProps={{ style: { marginLeft: -25 } }} />
              </ListItemButton>
              <ListItemButton component={Link} to="/TicketBooking ">
                <ListItemIcon><StadiumIcon /></ListItemIcon>
                <ListItemText primary="TicketBooking " primaryTypographyProps={{ style: { marginLeft: -25 } }} />
              </ListItemButton>
              <ListItemButton component={Link} to="/TicketAdmin ">
                <ListItemIcon><AccountBalanceIcon /></ListItemIcon>
                <ListItemText primary="TicketAdmin " primaryTypographyProps={{ style: { marginLeft: -25 } }} />
              </ListItemButton>
              {/* <ListItemButton component={Link} to="/PDFRedact ">
                <ListItemIcon><PictureAsPdfIcon /></ListItemIcon>
                <ListItemText primary="PDFRedact" primaryTypographyProps={{ style: { marginLeft: -25 } }} />
              </ListItemButton>
              <ListItemButton component={Link} to="/PDFMerge ">
                <ListItemIcon><PictureAsPdfIcon /></ListItemIcon>
                <ListItemText primary="PDFMerge" primaryTypographyProps={{ style: { marginLeft: -25 } }} />
              </ListItemButton> */}
              <ListItemButton component={Link} to="/PDFManagement ">
                <ListItemIcon><PictureAsPdfIcon /></ListItemIcon>
                <ListItemText primary="PDFManagement" primaryTypographyProps={{ style: { marginLeft: -25 } }} />
              </ListItemButton>
              <ListItemButton component={Link} to="/GoogleMapSearch ">
                <ListItemIcon><PictureAsPdfIcon /></ListItemIcon>
                <ListItemText primary="GoogleMapSearch" primaryTypographyProps={{ style: { marginLeft: -25 } }} />
              </ListItemButton>
            </>
          )}
        </List>
      </Box>
     
    </Drawer>
  );
};

export default Sidebar;
