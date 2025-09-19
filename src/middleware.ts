import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { getRouteConfig, isPublicRoute } from '@/config/routes';
import { AuthService } from '@/services/authService';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Get route configuration for current path
    const config = getRouteConfig(pathname);

    if (config) {
      const user = token?.user as any;

      if (!user) {
        return NextResponse.redirect(new URL('/auth/signin', req.url));
      }

      // Check access using AuthService
      if (!AuthService.hasAccess(user, config as any)) {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        if (isPublicRoute(pathname)) {
          return true;
        }

        // All other routes require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js|workbox-.*|offline.html).*)',
  ],
};
