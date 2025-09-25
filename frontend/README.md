# Operations Backoffice Frontend

React/Next.js frontend application for the Operations Backoffice system.

## 🚀 Features

- **Next.js 15**: Latest React framework with App Router
- **Material-UI**: Modern UI components
- **NextAuth.js**: Google OAuth authentication
- **Role-based Access**: Admin, Operator, and Viewer roles
- **PWA Support**: Progressive Web App capabilities
- **TypeScript**: Full type safety

## 📋 Pages & Features

### Authentication
- Google OAuth sign-in
- Role-based access control
- Protected routes with middleware

### Dashboard
- Role-based quick actions
- System information
- Navigation menu

### Core Functions
- **Hello World**: Basic functionality demo
- **Operations**: Operational tools (Admin/Operator)
- **Administration**: User management (Admin only)

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Environment Variables

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint

# Format code
npm run format
```

## 🚀 Deployment

### AWS Amplify

1. Connect repository to Amplify
2. Set build directory to `frontend/`
3. Configure environment variables in Amplify console
4. Enable auto-deployment on push to main branch

### Build Commands

```bash
npm run build
npm run start
```

## 🔐 Authentication Flow

1. User clicks "Sign in with Google"
2. Redirected to Google OAuth
3. Google returns user info
4. NextAuth.js creates JWT token
5. User redirected to dashboard
6. Role-based navigation and permissions applied

## 🎨 UI Components

### Layout Components
- `DashboardLayout`: Consistent page layout
- `Navigation`: Role-based navigation menu
- `PageContainer`: Reusable page wrapper

### UI Components
- `Button`: Enhanced button with loading states
- `Modal`: Reusable modal dialogs
- `DataTable`: Advanced table with sorting/pagination
- `LoadingSpinner`: Loading indicators

### Error Handling
- `UnifiedErrorBoundary`: Centralized error handling
- Error pages for different scenarios

## 📱 PWA Features

- Service worker for offline support
- App manifest for installation
- Caching strategies for performance

## 🔧 Configuration

### Routes & Permissions
- `src/config/routes.ts`: Route protection rules
- `src/config/auth.ts`: User roles and permissions
- `src/middleware.ts`: Route protection middleware

### Navigation
- Dynamic menu based on user permissions
- Role-based quick actions on dashboard

## 📊 Performance

- Code splitting with dynamic imports
- Image optimization
- Bundle analysis
- Performance monitoring

## 🚀 Deployment Pipeline

1. **Push to main**: Triggers GitHub Actions
2. **CI**: Runs tests and linting
3. **Amplify**: Auto-deploys from frontend/ directory
4. **Health Check**: Validates deployment

## 🔗 Backend Integration

The frontend communicates with the Python BFF via:
- JWT tokens for authentication
- REST API calls for user/permission management
- CORS-enabled requests

### API Endpoints Used
- `/api/me` - Current user info
- `/api/users` - User management (Admin)
- `/api/permissions` - Permission management (Admin)
