// import React, { useState } from 'react';
// import { AppBar, Toolbar, Typography, IconButton, Badge, Popover } from '@mui/material';
// import NotificationsIcon from '@mui/icons-material/Notifications';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import LogoutIcon from '@mui/icons-material/Logout';

// const TopBar = ({ user, onLogout, notificationCount }) => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const handleClickAccountIcon = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClosePopover = () => {
//     setAnchorEl(null);
//   };

//   const handleLogout = () => {
//     handleClosePopover();
//     onLogout();
//   };

//   const open = Boolean(anchorEl);
//   const id = open ? 'simple-popover' : undefined;

//   return (
//     <>
//       <AppBar position="fixed">
//         <Toolbar>
//           <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
//             Task Management Dashboard
//           </Typography>
//           <IconButton 
//             color="inherit" 
//             aria-label="notifications" 
          
//           >
//             <Badge badgeContent={notificationCount} color="error">
//               <NotificationsIcon />
//             </Badge>
//           </IconButton>
//           <IconButton color="inherit" aria-label="user" onClick={handleClickAccountIcon}>
//             <AccountCircleIcon />
//           </IconButton>
//         </Toolbar>
//       </AppBar>

//       <Popover
//         id={id}
//         open={open}
//         anchorEl={anchorEl}
//         onClose={handleClosePopover}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//         transformOrigin={{ vertical: 'top', horizontal: 'center' }}
//       >
//         <div style={{ padding: '10px' }}>
//           <Typography variant="body1" color="text.primary" style={{marginLeft:'15px'}}>
//               {user ? user.role : 'Guest'} 
//           </Typography>
//           <IconButton onClick={handleLogout} color="inherit" aria-label="logout">
//             <LogoutIcon />
//             <Typography variant="body2">Logout</Typography>
//           </IconButton>
//         </div>
//       </Popover>
//     </>
//   );
// };

// export default TopBar;


import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Badge, Popover, Box } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

const TopBar = ({ user, onLogout, notificationCount }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClickAccountIcon = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClosePopover();
    onLogout();
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Task Management Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', marginRight: '16px' }}>
            {/* <Box sx={{ textAlign: 'center', marginRight: '10px' }}>
              <Typography variant="caption">Low</Typography>
              <Typography variant="body2">{notificationCount.low}</Typography>
            </Box>
            <Box sx={{ textAlign: 'center', marginRight: '10px' }}>
              <Typography variant="caption">Medium</Typography>
              <Typography variant="body2">{notificationCount.medium}</Typography>
            </Box>
            <Box sx={{ textAlign: 'center', marginRight: '10px' }}>
              <Typography variant="caption">High</Typography>
              <Typography variant="body2">{notificationCount.high}</Typography>
            </Box> */}
            <IconButton 
              color="inherit" 
              aria-label="notifications" 
            >
              <Badge badgeContent={notificationCount.total} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Box>
          <IconButton color="inherit" aria-label="user" onClick={handleClickAccountIcon}>
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <div style={{ padding: '10px' }}>
          <Typography variant="body1" color="text.primary" style={{ marginLeft: '15px' }}>
            {user ? user.role : 'Guest'} 
          </Typography>
          <IconButton onClick={handleLogout} color="inherit" aria-label="logout">
            <LogoutIcon />
            <Typography variant="body2">Logout</Typography>
          </IconButton>
        </div>
      </Popover>
    </>
  );   
};

export default TopBar;
