'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Divider,
} from '@mui/material';
import { Info as InfoIcon, BugReport as BugIcon } from '@mui/icons-material';
import { clientEnv, getEnvInfo } from '../lib/env';

export default function EnvInfo(): React.JSX.Element {
  const envInfo = getEnvInfo();

  // Only show in development or when debug is enabled
  if (!envInfo.isDevelopment && !clientEnv.enableDebug) {
    return <></>;
  }

  return (
    <Card sx={{ maxWidth: 600, margin: 2 }}>
      <CardContent>
        <Box display='flex' alignItems='center' gap={1} mb={2}>
          <InfoIcon color='primary' />
          <Typography variant='h6' component='h2'>
            Environment Information
          </Typography>
        </Box>

        <Box mb={2}>
          <Typography variant='body2' color='text.secondary' gutterBottom>
            Application Details
          </Typography>
          <Typography variant='body1'>
            <strong>Name:</strong> {clientEnv.appName}
          </Typography>
          <Typography variant='body1'>
            <strong>Version:</strong> {clientEnv.appVersion}
          </Typography>
          <Typography variant='body1'>
            <strong>URL:</strong> {clientEnv.appUrl}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box mb={2}>
          <Typography variant='body2' color='text.secondary' gutterBottom>
            Environment
          </Typography>
          <Chip
            label={envInfo.nodeEnv}
            color={envInfo.isDevelopment ? 'warning' : 'success'}
            size='small'
          />
        </Box>

        <Box mb={2}>
          <Typography variant='body2' color='text.secondary' gutterBottom>
            Feature Flags
          </Typography>
          <Box display='flex' gap={1} flexWrap='wrap'>
            <Chip
              label={`Analytics: ${envInfo.features.analytics ? 'ON' : 'OFF'}`}
              color={envInfo.features.analytics ? 'success' : 'default'}
              size='small'
            />
            <Chip
              label={`PWA: ${envInfo.features.pwa ? 'ON' : 'OFF'}`}
              color={envInfo.features.pwa ? 'success' : 'default'}
              size='small'
            />
            <Chip
              label={`Debug: ${envInfo.features.debug ? 'ON' : 'OFF'}`}
              color={envInfo.features.debug ? 'warning' : 'default'}
              size='small'
            />
          </Box>
        </Box>

        <Box>
          <Typography variant='body2' color='text.secondary' gutterBottom>
            API Configuration
          </Typography>
          <Typography variant='body2' sx={{ wordBreak: 'break-all' }}>
            <strong>API URL:</strong> {clientEnv.apiUrl}
          </Typography>
        </Box>

        {clientEnv.googleAnalyticsId && (
          <Box mt={2}>
            <Typography variant='body2' color='text.secondary' gutterBottom>
              External Services
            </Typography>
            <Typography variant='body2'>
              <strong>Google Analytics:</strong> {clientEnv.googleAnalyticsId}
            </Typography>
          </Box>
        )}

        <Box mt={2} display='flex' alignItems='center' gap={1}>
          <BugIcon color='action' fontSize='small' />
          <Typography variant='caption' color='text.secondary'>
            This component only shows in development or when debug mode is
            enabled
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
