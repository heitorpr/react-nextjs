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

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

### Backend Development

```bash
cd backend
# Install Python 3.13 and uv first (see backend/SETUP.md)
uv sync --dev
cp env.example .env
uv run python scripts/dev.py
```

**Note**: See [backend/SETUP.md](backend/SETUP.md) for detailed setup instructions including Python 3.13 and uv installation.

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
