# Hello World Next.js App

A modern React Next.js application built with TypeScript and Material-UI.

## Features

- ⚡ **Next.js 15** with App Router
- 🔷 **TypeScript** for type safety
- 🎨 **Material-UI** for beautiful components
- 💅 **Emotion** for styling
- ⚛️ **React 19** with latest features
- 🧪 **Jest & React Testing Library** for comprehensive testing
- 📊 **Test Coverage** reporting
- 🔍 **ESLint & Prettier** for code quality
- 🪝 **Pre-commit Hooks** with Husky & lint-staged
- 🔧 **Environment Variables** with type safety and validation
- 📱 **PWA Support** with offline capabilities
- ⚡ **Service Worker** with stale-while-revalidate strategy
- 🎯 **Absolute Imports** for cleaner import paths

## Absolute Imports

This project is configured with absolute imports to make your import paths cleaner and more maintainable. Instead of using relative paths like `../../../components/Button`, you can use absolute paths like `@/components/Button`.

### Available Aliases

- `@/*` - Points to `./src/*`
- `@/components/*` - Points to `./src/components/*`
- `@/lib/*` - Points to `./src/lib/*`
- `@/app/*` - Points to `./src/app/*`
- `@/types/*` - Points to `./src/types/*`
- `@/__tests__/*` - Points to `./src/__tests__/*`

### Examples

```typescript
// ❌ Before (relative imports)
import { Button } from '../../../components/ui/Button';
import { validateEnv } from '../../lib/env';
import { User } from '../../../types/user';

// ✅ After (absolute imports)
import { Button } from '@/components/ui/Button';
import { validateEnv } from '@/lib/env';
import { User } from '@/types/user';
```

### Benefits

- **Cleaner code**: No more `../../../` chains
- **Easier refactoring**: Moving files doesn't break imports
- **Better IDE support**: Autocomplete and go-to-definition work better
- **Consistent paths**: Same import path regardless of file location

## Prerequisites

- Node.js LTS/jod (v22.x) - use `nvm use` to switch to the correct version
- npm or yarn

## Getting Started

First, ensure you're using the correct Node.js version:

```bash
nvm use
```

Then, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm test` - Run tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:coverage:open` - Open coverage report in browser
- `npm run test:ci` - Run tests for CI/CD pipeline
- `npm run generate-icons` - Generate PWA icons
- `npm run build:pwa` - Build for PWA deployment

## Project Structure

```
src/
├── app/
│   ├── layout.tsx    # Root layout with Material-UI theme
│   ├── page.tsx      # Home page component
│   ├── providers.tsx # Material-UI theme providers
│   └── theme.ts      # Material-UI theme configuration
├── __tests__/
│   ├── app/          # Component tests
│   ├── integration/  # Integration tests
│   └── utils/        # Test utilities
├── components/
│   └── PWAInstaller.tsx # PWA installation component
├── public/
│   ├── manifest.json    # PWA manifest
│   ├── sw.js           # Service worker
│   ├── offline.html    # Offline fallback page
│   └── icons/          # PWA icons
└── scripts/
    └── generate-icons.js # Icon generation script
```

## Testing

This project includes a comprehensive testing setup with:

- **Jest** - JavaScript testing framework
- **React Testing Library** - Simple and complete testing utilities
- **TypeScript support** - Full type safety in tests
- **Coverage reporting** - Track test coverage
- **Material-UI testing utilities** - Custom render with theme provider
- **Jest DOM matchers** - Additional assertions like `toBeInTheDocument()`

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI
npm run test:ci
```

## Environment Variables

This project includes a comprehensive environment variables setup with type safety and validation.

### Setup

1. **Copy the example file:**

   ```bash
   cp .env.example .env.local
   ```

2. **Update the values** in `.env.local` with your actual configuration

### Configuration Files

- **`.env.example`** - Template with all available environment variables
- **`.env.local`** - Local development configuration (ignored by git)
- **`src/types/env.d.ts`** - TypeScript definitions for environment variables
- **`src/lib/env.ts`** - Environment utilities with validation

### Available Variables

#### Client-side (NEXT*PUBLIC*\*)

- `NEXT_PUBLIC_APP_NAME` - Application name
- `NEXT_PUBLIC_APP_VERSION` - Application version
- `NEXT_PUBLIC_APP_URL` - Application URL
- `NEXT_PUBLIC_API_URL` - API endpoint URL
- `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` - Google Analytics tracking ID
- `NEXT_PUBLIC_SENTRY_DSN` - Sentry error tracking DSN
- `NEXT_PUBLIC_ENABLE_ANALYTICS` - Enable/disable analytics
- `NEXT_PUBLIC_ENABLE_PWA` - Enable/disable PWA features
- `NEXT_PUBLIC_ENABLE_DEBUG` - Enable/disable debug mode

#### Server-side

- `API_SECRET_KEY` - Secret key for API authentication
- `DATABASE_URL` - Database connection string
- `NODE_ENV` - Environment (development/production/test)

### Usage

```typescript
import { clientEnv, serverEnv, getEnvInfo } from '@/lib/env';

// Client-side usage
const appName = clientEnv.appName;
const isDebugEnabled = clientEnv.enableDebug;

// Server-side usage (API routes)
const secretKey = serverEnv.apiSecretKey;

// Environment info
const envInfo = getEnvInfo();
console.log(envInfo.isDevelopment); // true in development
```

### Validation

The environment configuration includes automatic validation:

```typescript
import { validateEnv } from '@/lib/env';

const validation = validateEnv();
if (!validation.isValid) {
  console.warn('Missing required environment variables');
}
```

### Example Component

The project includes an `EnvInfo` component that displays environment information in development mode or when debug is enabled.

## Code Quality

This project uses several tools to maintain high code quality:

### ESLint

- Configured with Next.js and Prettier integration
- Enforces consistent coding standards
- Catches potential bugs and code smells

### Prettier

- Automatic code formatting
- Consistent code style across the project
- Integrated with ESLint for seamless workflow

### Pre-commit Hooks

- **Husky**: Git hooks management
- **lint-staged**: Runs linters only on staged files
- Automatically formats and lints code before commits

### Usage

```bash
# Check for linting issues
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Format all files
npm run format

# Check formatting without fixing
npm run format:check
```

## Test Coverage

This project maintains high test coverage standards:

- **Statements**: 95% minimum
- **Functions**: 95% minimum
- **Lines**: 95% minimum
- **Branches**: 85% minimum

Coverage reports are generated in the `/coverage` directory and can be viewed by opening `coverage/lcov-report/index.html` in your browser.

```

## PWA Features

This project includes comprehensive Progressive Web App (PWA) support:

### **Offline Capabilities**
- **Service Worker** with Workbox integration
- **Stale-While-Revalidate** strategy for HTTP requests
- **Offline fallback** page for when network is unavailable
- **Cache strategies** for different asset types:
  - API calls: StaleWhileRevalidate (5 min cache)
  - Images: CacheFirst (30 days cache)
  - Fonts: CacheFirst (1 year cache)
  - CSS/JS: StaleWhileRevalidate (7 days cache)
  - HTML pages: NetworkFirst (24 hours cache)

### **Installation**
- **Install prompt** for supported browsers
- **App manifest** with proper metadata
- **Icons** in multiple sizes for different devices
- **Standalone mode** support

### **PWA Configuration**
- Service worker automatically registers in production
- Disabled in development mode for easier debugging
- Custom offline page with retry functionality
- Push notification support (ready for implementation)

### **Testing PWA Features**
1. Build the project: `npm run build`
2. Start production server: `npm run start`
3. Open in Chrome/Edge and check:
   - Application tab → Service Workers
   - Application tab → Manifest
   - Network tab → Offline mode
   - Install prompt should appear

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Material-UI Documentation](https://mui.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
```
