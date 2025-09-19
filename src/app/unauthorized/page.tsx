'use client';

import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Alert,
} from '@mui/material';
import { Warning, Home } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

export default function UnauthorizedPage(): React.JSX.Element {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleGoHome = () => {
    router.push('/');
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/auth/signin');
  };

  return (
    <Container maxWidth='sm' sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Box sx={{ mb: 3 }}>
          <Warning sx={{ fontSize: 64, color: 'warning.main' }} />
        </Box>

        <Typography variant='h4' component='h1' gutterBottom>
          Access Denied
        </Typography>

        <Alert severity='warning' sx={{ mb: 3, textAlign: 'left' }}>
          You don't have the necessary permissions to access this resource.
        </Alert>

        {user && (
          <Typography variant='body1' color='text.secondary' sx={{ mb: 3 }}>
            Current user: {user.name} ({user.email})
          </Typography>
        )}

        <Typography variant='body2' color='text.secondary' sx={{ mb: 4 }}>
          Please contact your administrator if you believe you should have
          access to this function.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant='contained'
            startIcon={<Home />}
            onClick={handleGoHome}
          >
            Go Home
          </Button>
          <Button variant='outlined' onClick={handleSignOut}>
            Sign Out
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
