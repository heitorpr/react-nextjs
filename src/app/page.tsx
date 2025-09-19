'use client';

import React from 'react';
import {
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Alert,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  People as PeopleIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useDashboard } from '@/hooks/useDashboard';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function Dashboard(): React.JSX.Element {
  const { user, navigateToFunction, getAvailableActions, getSystemInfo } =
    useDashboard();

  // Get icon component for action
  const getActionIcon = (iconName: string) => {
    switch (iconName) {
      case 'Home':
        return <HomeIcon />;
      case 'Settings':
        return <SettingsIcon />;
      case 'People':
        return <PeopleIcon />;
      default:
        return <HomeIcon />;
    }
  };

  const availableActions = getAvailableActions();
  const systemInfo = getSystemInfo();

  return (
    <DashboardLayout
      title='Operations Dashboard'
      subtitle={`Welcome back, ${systemInfo.user}! Here's an overview of available functions.`}
    >
      <Alert severity='info' sx={{ mb: 4 }}>
        This is the main dashboard for the operations backoffice system.
        Available functions are shown based on your role and permissions.
      </Alert>

      <Grid container spacing={3}>
        {availableActions.map(action => (
          <Grid item xs={12} sm={6} md={4} key={action.title}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {getActionIcon(action.icon)}
                  <Typography variant='h6' component='h2' sx={{ ml: 1 }}>
                    {action.title}
                  </Typography>
                </Box>
                <Typography variant='body2' color='text.secondary'>
                  {action.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size='small'
                  variant='contained'
                  onClick={() => navigateToFunction(action.path)}
                >
                  Access Function
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
        <Typography variant='h6' gutterBottom>
          System Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant='body2' color='text.secondary'>
              <strong>User:</strong> {systemInfo.user} ({user?.email})
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant='body2' color='text.secondary'>
              <strong>Roles:</strong> {systemInfo.roles}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant='body2' color='text.secondary'>
              <strong>App:</strong> {systemInfo.appName} v
              {systemInfo.appVersion}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant='body2' color='text.secondary'>
              <strong>Environment:</strong> {systemInfo.environment}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </DashboardLayout>
  );
}
