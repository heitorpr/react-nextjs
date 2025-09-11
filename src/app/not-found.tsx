'use client';

import React from 'react';
import { Container, Typography, Button, Box, Paper } from '@mui/material';
import {
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import Link from 'next/link';

export default function NotFound(): React.JSX.Element {
  return (
    <Container maxWidth='md' sx={{ mt: 4, mb: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          textAlign: 'center',
          backgroundColor: 'primary.light',
          color: 'white',
        }}
      >
        <Typography variant='h1' component='h1' gutterBottom>
          404
        </Typography>

        <Typography variant='h4' component='h2' gutterBottom>
          Page Not Found
        </Typography>

        <Typography variant='h6' component='p' sx={{ mb: 3 }}>
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It
          might have been moved, deleted, or you entered the wrong URL.
        </Typography>

        <Box display='flex' gap={2} justifyContent='center' flexWrap='wrap'>
          <Button
            variant='contained'
            color='secondary'
            size='large'
            startIcon={<HomeIcon />}
            component={Link}
            href='/'
          >
            Go Home
          </Button>
          <Button
            variant='outlined'
            color='inherit'
            size='large'
            startIcon={<ArrowBackIcon />}
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </Box>

        <Box mt={3}>
          <Typography variant='body2' sx={{ opacity: 0.8 }}>
            Error 404 | {new Date().toLocaleString()}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
