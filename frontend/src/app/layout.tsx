import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { AuthProvider } from '@/components/AuthProvider';
import { UnifiedErrorBoundary } from '@/components/errors/UnifiedErrorBoundary';
import Navigation from '@/components/Navigation';
import { Box, CssBaseline } from '@mui/material';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Operations Backoffice',
  description:
    'Operations team backoffice system with authentication and role-based access',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Backoffice',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'Operations Backoffice',
    title: 'Operations Backoffice',
    description:
      'Operations team backoffice system with authentication and role-based access',
  },
  icons: {
    icon: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#1976d2',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <CssBaseline />
        <UnifiedErrorBoundary level='global'>
          <Providers>
            <AuthProvider>
              <Box sx={{ display: 'flex' }}>
                <Navigation />
                <Box
                  component='main'
                  sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { md: `calc(100% - 240px)` },
                    ml: { md: '240px' },
                    mt: '64px', // Account for AppBar height
                  }}
                >
                  {children}
                </Box>
              </Box>
            </AuthProvider>
          </Providers>
        </UnifiedErrorBoundary>
      </body>
    </html>
  );
}
