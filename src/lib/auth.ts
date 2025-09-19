import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { AuthService } from '@/services/authService';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        token.accessToken = account.access_token;
        // Create user object with roles and permissions
        const session = { user };
        token.user = AuthService.createUserFromSession(session as any, token);
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user;
      } else if (session.user) {
        session.user = AuthService.createUserFromSession(session, token);
      }
      return session;
    },
    async signIn({ user }) {
      // Check if email is allowed to sign in
      const email = user.email || '';
      return AuthService.isEmailAllowed(email);
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
};

// Re-export helper functions from AuthService for backward compatibility
export const hasPermission = AuthService.hasPermission;
export const hasRole = AuthService.hasRole;
export const hasAnyPermission = AuthService.hasAnyPermission;
export const hasAnyRole = AuthService.hasAnyRole;
