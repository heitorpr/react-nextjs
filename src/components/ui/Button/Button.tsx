'use client';

import React from 'react';
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  CircularProgress,
  SxProps,
  Theme,
} from '@mui/material';

export interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'danger'
    | 'success'
    | 'warning'
    | 'outlined'
    | 'text';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
  sx?: SxProps<Theme>;
}

const variantMap: Record<string, MuiButtonProps['variant']> = {
  primary: 'contained',
  secondary: 'contained',
  danger: 'contained',
  success: 'contained',
  warning: 'contained',
  outlined: 'outlined',
  text: 'text',
};

const colorMap: Record<string, MuiButtonProps['color']> = {
  primary: 'primary',
  secondary: 'secondary',
  danger: 'error',
  success: 'success',
  warning: 'warning',
  outlined: 'primary',
  text: 'primary',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  loading = false,
  loadingText,
  fullWidth = false,
  children,
  disabled,
  sx,
  ...props
}) => {
  const muiVariant = variantMap[variant];
  const muiColor = colorMap[variant];

  return (
    <MuiButton
      variant={muiVariant}
      color={muiColor}
      size={size}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      sx={sx}
      {...props}
    >
      {loading && (
        <CircularProgress
          size={size === 'small' ? 16 : size === 'large' ? 24 : 20}
          sx={{ mr: loadingText || children ? 1 : 0 }}
        />
      )}
      {loading && loadingText ? loadingText : children}
    </MuiButton>
  );
};

export default Button;
