'use client';

import React from 'react';
import { Container, Typography, Paper, Box, Alert } from '@mui/material';
import { useAuth } from '@/components/AuthProvider';

export default function HelloWorldPage(): React.JSX.Element {
  const { user } = useAuth();

  return (
    <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant='h4' component='h1' gutterBottom>
          Hello World Function
        </Typography>

        <Alert severity='info' sx={{ mb: 3 }}>
          This is a sample function to demonstrate the system behavior.
        </Alert>

        <Box sx={{ mb: 3 }}>
          <Typography variant='h6' gutterBottom>
            Welcome, {user?.name}!
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            This is the Hello World function page. It demonstrates:
          </Typography>
        </Box>

        <Box component='ul' sx={{ pl: 2 }}>
          <li>
            <Typography variant='body1'>
              Authentication and user information display
            </Typography>
          </li>
          <li>
            <Typography variant='body1'>
              Permission-based access control
            </Typography>
          </li>
          <li>
            <Typography variant='body1'>Navigation menu integration</Typography>
          </li>
          <li>
            <Typography variant='body1'>
              Responsive layout with Material-UI
            </Typography>
          </li>
        </Box>

        <Box sx={{ mt: 4, p: 3, backgroundColor: 'grey.100', borderRadius: 1 }}>
          <Typography variant='h6' gutterBottom>
            User Information:
          </Typography>
          <Typography variant='body2'>
            <strong>Name:</strong> {user?.name}
          </Typography>
          <Typography variant='body2'>
            <strong>Email:</strong> {user?.email}
          </Typography>
          <Typography variant='body2'>
            <strong>Roles:</strong>{' '}
            {user?.roles.map(role => role.name).join(', ')}
          </Typography>
          <Typography variant='body2'>
            <strong>Permissions:</strong>{' '}
            {user?.permissions.map(permission => permission.name).join(', ')}
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant='body2' color='text.secondary'>
            This function requires 'read' permission to access. Users with
            different roles will see different navigation options based on their
            permissions.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
