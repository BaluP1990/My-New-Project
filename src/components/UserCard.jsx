// components/UserCard.jsx
import React from 'react';
import { Card, CardContent, Typography, Avatar } from '@mui/material';
import { useUser } from '../context/UserContext'; // Adjust the import path if necessary

const UserCard = () => {
  const { user } = useUser();

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', padding: 2, margin: 2 }}>
      <Avatar sx={{ width: 56, height: 56, marginRight: 2 }}>
        {user?.role.charAt(0).toUpperCase()}
      </Avatar>
      <CardContent>
        <Typography variant="h6">{user ? user.role : 'Guest'}</Typography>
        <Typography variant="body2">Logged in</Typography>
      </CardContent>
    </Card>
  );
};

export default UserCard;
