# Operations Backoffice

A secure backoffice application for operations teams with Google SSO authentication and role-based access control.

## Features

- ✅ Google Single Sign-On (SSO) Authentication
- ✅ Role-based Access Control (RBAC)
- ✅ Permission-based Navigation
- ✅ Secure Route Protection
- ✅ Next.js 15 with App Router
- ✅ TypeScript for type safety
- ✅ Material-UI for modern UI components
- ✅ Responsive Design
- ✅ Error Boundaries and Loading States

## Getting Started

### Prerequisites

- Node.js 18+ (use `nvm use lts/rod` for this project)
- Google OAuth credentials

### Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials:
   - Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
   - Set application type to "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://yourdomain.com/api/auth/callback/google` (production)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd operations-backoffice
```

2. Install dependencies:

```bash
npm install
```

3. Create environment variables:

```bash
# Create .env.local file with the following variables:

# Application Configuration
NEXT_PUBLIC_APP_NAME=Operations Backoffice
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Authentication Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Environment
NODE_ENV=development
```

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Authentication & Authorization

### User Roles

The system supports three user roles:

- **Admin**: Full access to all functions
- **Operator**: Access to operational functions
- **Viewer**: Read-only access

### Permissions

- **read**: Can view content
- **write**: Can modify content
- **delete**: Can delete content
- **manage_users**: Can manage user accounts

### Route Protection

- `/` - Dashboard (requires authentication)
- `/hello` - Hello World function (requires 'read' permission)
- `/operations` - Operations center (requires admin/operator role)
- `/admin` - Administration panel (requires admin role)
- `/auth/signin` - Login page (public)
- `/unauthorized` - Access denied page (public)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/auth/          # NextAuth.js API routes
│   ├── auth/              # Authentication pages
│   ├── admin/             # Admin functions
│   ├── operations/        # Operations functions
│   ├── hello/             # Hello World function
│   └── unauthorized/      # Access denied page
├── components/            # Reusable components
│   ├── AuthProvider.tsx   # Authentication context
│   ├── Navigation.tsx     # Main navigation
│   └── ui/               # Basic UI components
├── lib/                   # Utility functions and configurations
│   └── auth.ts           # Authentication configuration
├── middleware.ts          # Route protection middleware
└── types/                 # TypeScript type definitions
    └── auth.ts           # Authentication types
```

## Adding New Functions

1. Create a new page in `src/app/[function-name]/page.tsx`
2. Add the function to the navigation menu in `src/components/Navigation.tsx`
3. Configure route protection in `src/middleware.ts`
4. Define required permissions/roles for the function

## Security Considerations

- All routes are protected by default
- User roles and permissions are checked on both client and server side
- Google OAuth provides secure authentication
- JWT tokens are used for session management
- Middleware ensures unauthorized users cannot access protected routes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
