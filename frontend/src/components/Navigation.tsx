'use client';

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  Avatar,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Logout,
  Dashboard,
  Settings,
  People,
  Home,
} from '@mui/icons-material';
import { signOut } from 'next-auth/react';
import { useAuth } from '@/components/AuthProvider';
import { useNavigation } from '@/hooks/useNavigation';

const DRAWER_WIDTH = 240;

export default function Navigation(): React.JSX.Element {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user } = useAuth();
  const {
    mobileOpen,
    getAvailableMenuItems,
    isMenuItemActive,
    toggleMobileDrawer,
    handleNavigation,
  } = useNavigation();
  const theme = useTheme();

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    handleProfileMenuClose();
    await signOut({ callbackUrl: '/auth/signin' });
  };

  // Get icon component
  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Home':
        return <Home />;
      case 'Settings':
        return <Settings />;
      case 'People':
        return <People />;
      default:
        return <Home />;
    }
  };

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant='h6' noWrap component='div'>
          Backoffice
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {getAvailableMenuItems().map(item => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={isMenuItemActive(item.path)}
              onClick={() => handleNavigation(item.path)}
            >
              <ListItemIcon>{getIcon(item.icon)}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position='fixed' sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            edge='start'
            onClick={toggleMobileDrawer}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant='h6' noWrap component='div' sx={{ flexGrow: 1 }}>
            Operations Backoffice
          </Typography>
          {user && (
            <IconButton
              size='large'
              aria-label='account of current user'
              aria-controls='primary-search-account-menu'
              aria-haspopup='true'
              onClick={handleProfileMenuOpen}
              color='inherit'
            >
              <Avatar
                src={user.image}
                alt={user.name}
                sx={{ width: 32, height: 32 }}
              />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
      >
        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <AccountCircle fontSize='small' />
          </ListItemIcon>
          <ListItemText>{user?.name}</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <Logout fontSize='small' />
          </ListItemIcon>
          <ListItemText>Sign Out</ListItemText>
        </MenuItem>
      </Menu>

      <Box
        component='nav'
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
        aria-label='mailbox folders'
      >
        <Drawer
          variant='temporary'
          open={mobileOpen}
          onClose={toggleMobileDrawer}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant='permanent'
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
}
