// // import React, { useState } from 'react';
// // import { useUser } from '../context/UserContext'; 
// // import { useNavigate } from 'react-router-dom'; 
// // import './Login.css'; 

// // const Login = () => {
// //   const { login } = useUser();
// //   const [username, setUsername] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [isSubmitting, setIsSubmitting] = useState(false); 
// //   const navigate = useNavigate(); 

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setIsSubmitting(true); 
// //     try {
// //       await login(username, password); 
// //       navigate('/home'); 
// //     } catch (error) {
// //       console.error(error);
// //     } finally {
// //       setIsSubmitting(false); 
// //     }
// //   };

// //   return (
// //     <form onSubmit={handleSubmit} className="login-form" aria-label="Login Form">
// //       <h2>Login</h2>
// //       <div>
// //         <label htmlFor="username">Username</label>
// //         <input
// //           type="text"
// //           id="username"
// //           placeholder="Username"
// //           required
// //           value={username}
// //           onChange={(e) => setUsername(e.target.value)}
// //           autoComplete="username"
// //           aria-label="Username"
// //         />
// //       </div>
// //       <div>
// //         <label htmlFor="password">Password</label>
// //         <input
// //           type="password"
// //           id="password"
// //           placeholder="Password"
// //           required
// //           value={password}
// //           onChange={(e) => setPassword(e.target.value)}
// //           autoComplete="current-password"
// //           aria-label="Password"
// //         />
// //       </div>
// //       <button type="submit" disabled={isSubmitting}>
// //         {isSubmitting ? 'Logging in...' : "Login"}
// //       </button>
// //     </form>
// //   );
// // };

// // export default Login;


// import React, { useState } from 'react';
// import { TextField, Button } from '@mui/material';

// const Login = ({ onLogin }) => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (username === 'admin' && password === 'admin@123') {
//       onLogin('admin'); // Call onLogin with admin role
//     } else if (username === 'user' && password === 'user@123') {
//       onLogin('user'); // Call onLogin with user role
//     } else {
//       alert('Invalid credentials');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <TextField
//         label="Username"
//         value={username}
//         onChange={(e) => setUsername(e.target.value)}
//         fullWidth
//         required
//       />
//       <TextField
//         label="Password"
//         type="password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         fullWidth
//         required
//       />
//       <Button type="submit" variant="contained" color="primary">Login</Button>
//     </form>
//   );
// };

// export default Login;


import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import './Login.css'; 

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Effect to load credentials from local storage
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');
    
    if (storedUsername) {
      setUsername(storedUsername);
    }
    if (storedPassword) {
      setPassword(storedPassword);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (username === 'Administrator' && password === 'admin@123') {
     
      localStorage.setItem('username', username);
      localStorage.setItem('password', password);
      onLogin('Administrator'); 
    } else if (username === 'user' && password === 'user@123') {
    
      localStorage.setItem('username', username);
      localStorage.setItem('password', password);
      onLogin('user'); 
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="login-background">
      <div className="login-card">
        <Typography variant="h5" className="login-title">Login</Typography>
        <form onSubmit={handleSubmit}>
          <Box className="login-input">
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              required
              InputProps={{
                className: 'MuiInputBase-root',
              }}
              InputLabelProps={{ sx: { color: '#ffffff' } }}
            />
          </Box>
          <Box className="login-input">
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              InputProps={{
                className: 'MuiInputBase-root',
              }}
              InputLabelProps={{ sx: { color: '#ffffff' } }}
            />
          </Box>
          <Button type="submit" variant="contained" className="login-button">Login</Button>
        </form>
        <Box className="login-links">
          
        </Box>
      </div>
    </div>
  );
};

export default Login;

