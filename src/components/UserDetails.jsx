import React from 'react';
import { Card, CardContent, Typography, Avatar, Divider, Box } from '@mui/material';
import PropTypes from 'prop-types';

// Example UserDetails component
const UserDetails = ({ user }) => {
  return (
    <Card sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar alt={user.name} src={user.avatar} sx={{ width: 56, height: 56, mr: 2 }} />
          <Typography variant="h5">{user.name}</Typography>
        </Box>
        <Divider />
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Email:</Typography>
          <Typography variant="body2">{user.email}</Typography>
        </Box>
        <Box sx={{ mt: 1 }}>
          <Typography variant="subtitle1">Phone:</Typography>
          <Typography variant="body2">{user.phone}</Typography>
        </Box>
        <Box sx={{ mt: 1 }}>
          <Typography variant="subtitle1">Address:</Typography>
          <Typography variant="body2">{user.address}</Typography>
        </Box>
        <Box sx={{ mt: 1 }}>
          <Typography variant="subtitle1">Bio:</Typography>
          <Typography variant="body2">{user.bio}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

UserDetails.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string,
    address: PropTypes.string,
    bio: PropTypes.string,
    avatar: PropTypes.string,
  }).isRequired,
};

export default UserDetails;
