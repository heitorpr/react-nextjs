'use client';

import React from 'react';
import { Container, Typography, Paper, Box, Alert } from '@mui/material';
import { People } from '@mui/icons-material';
import { useAuth } from '@/components/AuthProvider';

export default function AdminPage(): React.JSX.Element {
  const { user } = useAuth();

  return (
    <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <People sx={{ mr: 2, fontSize: 32 }} />
          <Typography variant='h4' component='h1'>
            Administration
          </Typography>
        </Box>

        <Alert severity='warning' sx={{ mb: 3 }}>
          This is the administration panel. Only users with admin role can
          access this page.
        </Alert>

        <Typography variant='body1' sx={{ mb: 3 }}>
          Welcome to the administration panel, {user?.name}! This area contains
          system administration functions.
        </Typography>

        <Box sx={{ p: 3, backgroundColor: 'grey.100', borderRadius: 1 }}>
          <Typography variant='h6' gutterBottom>
            Available Administration Functions:
          </Typography>
          <Typography variant='body2' component='div'>
            <ul>
              <li>User management and role assignment</li>
              <li>System configuration and settings</li>
              <li>Security and access control</li>
              <li>Audit logs and monitoring</li>
              <li>Backup and maintenance operations</li>
              <li>Integration and API management</li>
            </ul>
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant='body2' color='text.secondary'>
            This page requires admin role to access. Your current roles:{' '}
            {user?.roles.map(role => role.name).join(', ')}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
