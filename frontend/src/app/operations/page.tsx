'use client';

import React from 'react';
import { Container, Typography, Paper, Box, Alert } from '@mui/material';
import { Settings } from '@mui/icons-material';
import { useAuth } from '@/components/AuthProvider';

export default function OperationsPage(): React.JSX.Element {
  const { user } = useAuth();

  return (
    <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Settings sx={{ mr: 2, fontSize: 32 }} />
          <Typography variant='h4' component='h1'>
            Operations Center
          </Typography>
        </Box>

        <Alert severity='info' sx={{ mb: 3 }}>
          This is the operations center. Only users with admin or operator roles
          can access this page.
        </Alert>

        <Typography variant='body1' sx={{ mb: 3 }}>
          Welcome to the operations center, {user?.name}! This area contains
          operational functions and tools.
        </Typography>

        <Box sx={{ p: 3, backgroundColor: 'grey.100', borderRadius: 1 }}>
          <Typography variant='h6' gutterBottom>
            Available Operations Functions:
          </Typography>
          <Typography variant='body2' component='div'>
            <ul>
              <li>System monitoring and health checks</li>
              <li>Data processing and analysis</li>
              <li>Operational reports and dashboards</li>
              <li>Configuration management</li>
              <li>Task scheduling and automation</li>
            </ul>
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant='body2' color='text.secondary'>
            This page requires admin or operator role to access. Your current
            roles: {user?.roles.map(role => role.name).join(', ')}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
