# Operations Backoffice

A modern operations management system with a React frontend and Python BFF (Backend for Frontend).

## 🏗️ Architecture

- **Frontend**: React/Next.js deployed on AWS Amplify
- **Backend**: Python FastAPI BFF deployed on Kubernetes via ArgoCD
- **Authentication**: Google OAuth with role-based access control

## 📁 Project Structure

```
├── frontend/          # React/Next.js application
├── backend/           # Python FastAPI BFF
├── docs/             # Documentation
├── scripts/          # Cross-service scripts
└── .github/          # GitHub Actions workflows
```

## 🚀 Quick Start

### Unified Development (Recommended)

Run both frontend and backend with a single command:

#### Linux/macOS (with Make)
```bash
# Setup everything
make setup

# Start both services
make dev
```

#### Linux/macOS (with Shell Script)
```bash
# Setup everything
./scripts/dev.sh setup

# Start both services
./scripts/dev.sh dev
```

#### Windows
```cmd
# Setup everything
dev.bat setup

# Start both services
dev.bat dev
```

This will start:
- **Backend**: http://localhost:8000 (FastAPI with Docker Compose)
- **Frontend**: http://localhost:3000 (Next.js development server)

### Individual Service Development

#### Frontend Only
```bash
cd frontend
npm install
npm run dev
```

#### Backend Only
```bash
cd backend
uv sync --dev
cp .env.example .env
docker-compose up --build
```

**Note**: See [backend/SETUP.md](backend/SETUP.md) for detailed setup instructions.

## 🛠️ Development Commands

### Available Commands

#### Linux/macOS (Make)
```bash
make help           # Show all available commands
make setup          # Setup both backend and frontend
make dev            # Start both services in development mode
make dev-backend    # Start only backend
make dev-frontend   # Start only frontend
make test           # Run tests for both services
make lint           # Run linting for both services
make format         # Format code for both services
make clean          # Clean all build artifacts
```

#### Windows (Batch)
```cmd
dev.bat help           # Show all available commands
dev.bat setup          # Setup both backend and frontend
dev.bat dev            # Start both services in development mode
dev.bat dev-backend    # Start only backend
dev.bat dev-frontend   # Start only frontend
dev.bat test           # Run tests for both services
dev.bat lint           # Run linting for both services
dev.bat format         # Format code for both services
dev.bat clean          # Clean all build artifacts
```

## 🚀 Deployment

### Frontend (AWS Amplify)
- Connected to `frontend/` directory
- Auto-deploys on push to main branch
- Environment variables configured in Amplify console

### Backend (Kubernetes/ArgoCD)
- Docker image built from `backend/` directory
- Deployed via ArgoCD application
- Configuration in `backend/k8s/`

## 🔧 Environment Variables

### Frontend
```env
NEXTAUTH_URL=https://your-app.amplifyapp.com
NEXTAUTH_SECRET=your-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Backend
```env
FRONTEND_URL=https://your-app.amplifyapp.com
DATABASE_URL=postgresql://...
JWT_SECRET=your-jwt-secret
```

## 📚 Documentation

- [Frontend Documentation](frontend/README.md)
- [Backend API Documentation](backend/README.md)
- [Deployment Guide](docs/deployment.md)

## 🔐 Authentication & Authorization

- **Authentication**: Google OAuth via NextAuth.js
- **Authorization**: Role-based access control (Admin, Operator, Viewer)
- **Token Flow**: JWT tokens from frontend to BFF

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
pytest
```

## 📊 Monitoring

- **Frontend**: AWS Amplify monitoring
- **Backend**: Kubernetes metrics and logs
- **Health Checks**: `/health` endpoints on both services

## 🤝 Contributing

1. Create feature branch from `main`
2. Make changes in appropriate directory (`frontend/` or `backend/`)
3. Test locally
4. Submit pull request
5. ArgoCD will auto-deploy backend changes
6. Amplify will auto-deploy frontend changes

## 📄 License

Private - Company Internal Use
