'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import { User, AuthContextType } from '@/types/auth';
import { hasPermission, hasRole } from '@/lib/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(status === 'loading');
  }, [status]);

  const signIn = async () => {
    // This will be handled by NextAuth's signIn function
    // Implementation will be in the sign-in page
  };

  const signOut = async () => {
    // This will be handled by NextAuth's signOut function
    // Implementation will be in the navigation component
  };

  const hasPermissionCheck = (permission: string): boolean => {
    return hasPermission(session?.user as User, permission);
  };

  const hasRoleCheck = (role: string): boolean => {
    return hasRole(session?.user as User, role);
  };

  const value: AuthContextType = {
    user: (session?.user as User) || null,
    loading,
    signIn,
    signOut,
    hasPermission: hasPermissionCheck,
    hasRole: hasRoleCheck,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthContextProvider>{children}</AuthContextProvider>
    </SessionProvider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
