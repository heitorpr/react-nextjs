'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogProps as MuiDialogProps,
  Typography,
  IconButton,
  Box,
  SxProps,
  Theme,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { Button } from '../Button';

export interface ModalProps extends Omit<MuiDialogProps, 'title'> {
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  onClose?: () => void;
  showCloseButton?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  sx?: SxProps<Theme>;
}

export const Modal: React.FC<ModalProps> = ({
  title,
  children,
  actions,
  onClose,
  showCloseButton = true,
  maxWidth = 'sm',
  fullWidth = true,
  open,
  sx,
  ...props
}) => {
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      sx={sx}
      {...props}
    >
      {title && (
        <DialogTitle>
          <Box
            display='flex'
            alignItems='center'
            justifyContent='space-between'
          >
            <Typography variant='h6' component='div'>
              {title}
            </Typography>
            {showCloseButton && (
              <IconButton
                aria-label='close'
                onClick={handleClose}
                sx={{ ml: 2 }}
              >
                <CloseIcon />
              </IconButton>
            )}
          </Box>
        </DialogTitle>
      )}

      <DialogContent dividers>{children}</DialogContent>

      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
};

/**
 * Confirmation Modal Component
 */
export interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'info',
  onConfirm,
  onCancel,
  loading = false,
}) => {
  const confirmVariant =
    variant === 'danger'
      ? 'danger'
      : variant === 'warning'
        ? 'warning'
        : 'primary';

  return (
    <Modal open={open} title={title} onClose={onCancel} maxWidth='sm'>
      <Typography variant='body1' sx={{ mb: 2 }}>
        {message}
      </Typography>

      <Box display='flex' gap={2} justifyContent='flex-end' sx={{ mt: 3 }}>
        <Button variant='outlined' onClick={onCancel} disabled={loading}>
          {cancelText}
        </Button>
        <Button variant={confirmVariant} onClick={onConfirm} loading={loading}>
          {confirmText}
        </Button>
      </Box>
    </Modal>
  );
};

export default Modal;
