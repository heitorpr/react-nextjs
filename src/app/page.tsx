'use client';

import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import { Favorite, GitHub } from '@mui/icons-material';
import PWAInstaller from '../components/PWAInstaller';
import EnvInfo from '../components/EnvInfo';

export default function Home(): React.JSX.Element {
  const handleClick = (): void => {
    alert('Hello from Material-UI!');
  };

  return (
    <>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            Hello World App
          </Typography>
          <IconButton color='inherit'>
            <GitHub />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth='md' sx={{ mt: 4, mb: 4 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: 'center',
              backgroundColor: 'primary.light',
              color: 'white',
            }}
          >
            <Typography variant='h2' component='h1' gutterBottom>
              Hello World!
            </Typography>
            <Typography variant='h5' component='p' sx={{ mb: 3 }}>
              Welcome to your modern Next.js app with Material-UI and TypeScript
            </Typography>
            <Button
              variant='contained'
              color='secondary'
              size='large'
              startIcon={<Favorite />}
              onClick={handleClick}
              sx={{ mt: 2 }}
            >
              Click Me!
            </Button>
          </Paper>

          <Paper elevation={2} sx={{ p: 3, width: '100%' }}>
            <Typography
              variant='h4'
              component='h2'
              gutterBottom
              color='primary'
            >
              Features
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant='body1'>
                ✅ Next.js 15 with App Router
              </Typography>
              <Typography variant='body1'>
                ✅ TypeScript for type safety
              </Typography>
              <Typography variant='body1'>
                ✅ Material-UI for beautiful components
              </Typography>
              <Typography variant='body1'>✅ Emotion for styling</Typography>
              <Typography variant='body1'>
                ✅ Modern React 19 features
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Container>

      <EnvInfo />
      <PWAInstaller />
    </>
  );
}
