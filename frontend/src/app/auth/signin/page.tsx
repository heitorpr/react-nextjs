'use client';

import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SignInPage(): React.JSX.Element {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    getSession().then(session => {
      if (session) {
        router.push('/');
      }
    });
  }, [router]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth='sm' sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant='h4' component='h1' gutterBottom>
          Backoffice Access
        </Typography>

        <Typography variant='body1' color='text.secondary' sx={{ mb: 4 }}>
          Please sign in with your Google account to access the backoffice
          system.
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant='contained'
            size='large'
            onClick={handleGoogleSignIn}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : undefined}
            sx={{
              backgroundColor: '#4285f4',
              '&:hover': {
                backgroundColor: '#357ae8',
              },
            }}
          >
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </Button>
        </Box>

        <Typography variant='body2' color='text.secondary' sx={{ mt: 3 }}>
          Only authorized users with company Google accounts can access this
          system.
        </Typography>
      </Paper>
    </Container>
  );
}
