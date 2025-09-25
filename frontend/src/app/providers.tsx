'use client';

import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import { UIProvider } from '@/store/uiStore';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UIProvider>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </UIProvider>
  );
}
