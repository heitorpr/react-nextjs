# Operations Backoffice - Architecture Overview

## 🏗️ System Architecture

This project implements a modern **Backend for Frontend (BFF)** pattern with the following components:

### Frontend (React/Next.js)
- **Location**: `frontend/` directory
- **Technology**: Next.js 15 with React 18
- **Deployment**: AWS Amplify
- **Authentication**: NextAuth.js with Google OAuth
- **UI Framework**: Material-UI

### Backend (Python BFF)
- **Location**: `backend/` directory
- **Technology**: FastAPI with Python 3.13
- **Package Manager**: uv (fast Python package installer)
- **Deployment**: Kubernetes via ArgoCD
- **Authentication**: JWT token validation
- **API**: RESTful API with OpenAPI documentation

## 🔄 Request Flow

```mermaid
graph TB
    A[User Browser] --> B[Next.js Frontend]
    B --> C[NextAuth.js]
    C --> D[Google OAuth]
    D --> C
    C --> B
    B --> E[JWT Token]
    E --> F[FastAPI BFF]
    F --> G[Business Logic]
    G --> H[Response]
    H --> F
    F --> B
    B --> A
```

## 🔐 Authentication & Authorization

### Frontend Authentication
1. User clicks "Sign in with Google"
2. NextAuth.js handles OAuth flow
3. Google returns user profile
4. NextAuth.js creates JWT session token
5. Token stored in HTTP-only cookie

### Backend Authorization
1. Frontend sends JWT token in Authorization header
2. FastAPI validates JWT signature
3. Extract user claims from token
4. Apply role-based access control
5. Return authorized data

### Role Hierarchy
- **Admin**: Full access to all features
- **Operator**: Access to operational functions
- **Viewer**: Read-only access

## 🌐 Deployment Architecture

### Frontend (AWS Amplify)
```
GitHub Repository → AWS Amplify → CloudFront CDN → User Browser
```

**Benefits:**
- Global CDN distribution
- Automatic SSL certificates
- Built-in CI/CD
- Environment management
- Branch-based deployments

### Backend (Kubernetes + ArgoCD)
```
GitHub Repository → GitHub Actions → Container Registry → ArgoCD → Kubernetes → Load Balancer
```

**Benefits:**
- Scalable container orchestration
- GitOps deployment model
- Automatic rollbacks
- Health checks and monitoring
- Service mesh ready

## 📁 Monorepo Structure

```
operations-backoffice/
├── frontend/                 # React/Next.js app
│   ├── src/
│   │   ├── app/             # Next.js App Router
│   │   ├── components/      # React components
│   │   ├── lib/             # Utilities & API client
│   │   └── types/           # TypeScript definitions
│   ├── package.json
│   └── next.config.js
├── backend/                  # Python FastAPI BFF
│   ├── app/
│   │   ├── main.py          # FastAPI application
│   │   ├── models/          # Pydantic models
│   │   └── scripts/         # Development scripts
│   ├── tests/               # Test suite
│   ├── k8s/                 # Kubernetes manifests
│   ├── Dockerfile
│   ├── pyproject.toml       # Project configuration (uv)
│   └── Makefile             # Development commands
├── docs/                    # Documentation
├── scripts/                 # Cross-service scripts
└── .github/workflows/       # CI/CD pipelines
```

## 🔄 CI/CD Pipeline

### Frontend Pipeline
1. **Trigger**: Push to `main` branch affecting `frontend/`
2. **Test**: Run Jest tests, ESLint, TypeScript checks
3. **Build**: Create production build
4. **Deploy**: AWS Amplify auto-deploys

### Backend Pipeline
1. **Trigger**: Push to `main` branch affecting `backend/`
2. **Test**: Run pytest, linting, type checking
3. **Build**: Create Docker image
4. **Push**: Upload to container registry
5. **Deploy**: ArgoCD auto-syncs new image

## 🔧 Environment Configuration

### Frontend Environment Variables
```env
NEXT_PUBLIC_APP_NAME=Operations Backoffice
NEXT_PUBLIC_APP_URL=https://your-app.amplifyapp.com
NEXT_PUBLIC_API_URL=https://api.operations.yourcompany.com
NEXTAUTH_URL=https://your-app.amplifyapp.com
NEXTAUTH_SECRET=your-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Backend Environment Variables
```env
ENVIRONMENT=production
FRONTEND_URL=https://your-app.amplifyapp.com
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your-jwt-secret
```

## 🛡️ Security Considerations

### Frontend Security
- HTTPS enforced
- Content Security Policy
- XSS protection
- CSRF protection via SameSite cookies
- Secure JWT storage

### Backend Security
- JWT signature validation
- CORS configured for frontend only
- Rate limiting (recommended)
- Input validation with Pydantic
- Non-root container execution

## 📊 Monitoring & Observability

### Frontend Monitoring
- AWS Amplify built-in monitoring
- Error tracking (Sentry recommended)
- Performance monitoring
- User analytics

### Backend Monitoring
- Kubernetes metrics
- Application logs
- Health check endpoints
- Prometheus metrics (recommended)

## 🚀 Scaling Considerations

### Frontend Scaling
- AWS Amplify auto-scales
- CloudFront CDN handles global traffic
- Edge caching for static assets

### Backend Scaling
- Kubernetes horizontal pod autoscaling
- Load balancer distribution
- Database connection pooling
- Redis caching (recommended)

## 🔄 Data Flow

1. **User Authentication**: Frontend → Google OAuth → NextAuth.js → JWT
2. **API Requests**: Frontend → JWT Token → FastAPI → Business Logic
3. **Permission Checks**: FastAPI → Role Validation → Data Access
4. **Response**: Business Logic → FastAPI → Frontend → UI Update

## 🛠️ Development Workflow

1. **Feature Development**: Create branch, make changes in appropriate directory
2. **Local Testing**: Run both frontend and backend locally
3. **Code Review**: Submit PR with tests passing
4. **Deployment**: Merge to main triggers automatic deployment
5. **Monitoring**: Verify deployment health and functionality
