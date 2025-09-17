'use client';

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import {
  UserList,
  DataTable,
  LoadingExamples,
} from '../../components/examples';
import OfflineIndicator from '@/components/OfflineIndicator';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function UIDemoPage(): React.JSX.Element {
  const [value, setValue] = useState(0);
  const router = useRouter();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleBack = () => {
    router.push('/');
  };

  return (
    <Box>
      <AppBar position='static'>
        <Toolbar>
          <IconButton
            edge='start'
            color='inherit'
            onClick={handleBack}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            UI Components Demo
          </Typography>
        </Toolbar>
      </AppBar>

      <OfflineIndicator />

      <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label='UI demo tabs'
            >
              <Tab label='Loading Examples' />
              <Tab label='User List' />
              <Tab label='Data Table' />
            </Tabs>
          </Box>

          <TabPanel value={value} index={0}>
            <LoadingExamples />
          </TabPanel>

          <TabPanel value={value} index={1}>
            <UserList />
          </TabPanel>

          <TabPanel value={value} index={2}>
            <DataTable />
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
}
