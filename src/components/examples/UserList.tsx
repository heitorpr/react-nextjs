'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Button,
  Grid,
} from '@mui/material';
import {
  Person as PersonIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { AsyncWrapper, LoadingSkeleton } from '../ui';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

// Mock API function
const fetchUsers = async (): Promise<User[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Simulate random errors
  if (Math.random() < 0.2) {
    throw new Error('Failed to fetch users. Please try again.');
  }

  // Return mock data
  return [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'User',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      role: 'Moderator',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
  ];
};

export const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await fetchUsers();
      setUsers(userData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'error';
      case 'moderator':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant='h4' component='h2'>
          Users
        </Typography>
        <Button
          variant='outlined'
          startIcon={<RefreshIcon />}
          onClick={loadUsers}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      <AsyncWrapper
        loading={loading}
        error={error}
        empty={!loading && !error && users.length === 0}
        emptyTitle='No users found'
        emptyDescription='There are no users to display at the moment.'
        emptyActionLabel='Add User'
        onEmptyAction={() => console.log('Add user clicked')}
        onRetry={loadUsers}
        loadingVariant='skeleton'
        minHeight={300}
      >
        <Grid container spacing={3}>
          {users.map(user => (
            <Grid item xs={12} sm={6} md={4} key={user.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      src={user.avatar}
                      sx={{ width: 56, height: 56, mr: 2 }}
                    >
                      <PersonIcon />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant='h6' component='h3'>
                        {user.name}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        {user.email}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={user.role}
                    color={getRoleColor(user.role) as any}
                    size='small'
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </AsyncWrapper>
    </Box>
  );
};

export default UserList;
