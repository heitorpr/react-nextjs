# Operations Backoffice BFF

Backend for Frontend (BFF) service built with FastAPI for the Operations Backoffice system.

## 🚀 Features

- **FastAPI**: Modern, fast web framework for building APIs
- **Authentication**: JWT token validation from frontend
- **Authorization**: Role-based access control
- **CORS**: Configured for frontend integration
- **Health Checks**: Built-in health monitoring
- **Docker**: Containerized for Kubernetes deployment

## 📋 API Endpoints

### Authentication Required
All endpoints require a valid JWT token in the Authorization header.

### Core Endpoints

- `GET /health` - Health check
- `GET /api/me` - Get current user info
- `GET /api/users` - Get all users (Admin only)
- `GET /api/permissions` - Get all permissions (Admin only)
- `GET /api/users/{user_id}/permissions` - Get user permissions (Admin only)
- `PUT /api/users/{user_id}/permissions` - Update user permissions (Admin only)

## 🛠️ Development

### Prerequisites
- Python 3.13+
- [uv](https://docs.astral.sh/uv/getting-started/installation/) (recommended) or pip

### Setup with uv (Recommended)

```bash
# Install uv if you haven't already
pip install uv

# Install dependencies and create virtual environment
uv sync --dev

# Copy environment variables
cp env.example .env

# Run the development server
uv run uvicorn app.main:app --reload
```

### Setup with pip (Alternative)

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -e .

# Copy environment variables
cp env.example .env

# Run the development server
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

### API Documentation

Visit `http://localhost:8000/docs` for interactive API documentation.

## 🧪 Testing

```bash
# Run tests
uv run pytest

# Run tests with coverage
uv run pytest --cov=app

# Run linting
uv run flake8 app/
uv run black app/
uv run isort app/

# Type checking
uv run mypy app/

# Format code
uv run black app/
uv run isort app/
```

## 🐳 Docker

### Build Image

```bash
docker build -t operations-backoffice-bff .
```

### Run Container

```bash
docker run -p 8000:8000 operations-backoffice-bff
```

## ☸️ Kubernetes Deployment

### Deploy with ArgoCD

1. Apply the ArgoCD application:
```bash
kubectl apply -f k8s/argo-application.yaml
```

2. ArgoCD will automatically deploy the service to the `operations` namespace.

### Manual Deployment

```bash
kubectl apply -f k8s/deployment.yaml
```

## 🔐 Security

- **JWT Validation**: All requests require valid JWT tokens
- **CORS**: Configured to allow requests from frontend only
- **Role-based Access**: Admin endpoints protected by role checks
- **Non-root Container**: Runs as non-root user in Docker

## 📊 Monitoring

- **Health Endpoint**: `/health` for Kubernetes health checks
- **Metrics**: Prometheus metrics available at `/metrics`
- **Logging**: Structured logging with correlation IDs

## 🔧 Configuration

### Environment Variables

- `ENVIRONMENT`: Application environment (development/production)
- `FRONTEND_URL`: Frontend URL for CORS configuration
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for JWT token validation
- `REDIS_URL`: Redis connection string (for caching/sessions)

### Secrets

Store sensitive data in Kubernetes secrets:
- `operations-backoffice-secrets`

## 🚀 Deployment Pipeline

1. **CI**: GitHub Actions runs tests and builds Docker image
2. **Registry**: Image pushed to container registry
3. **ArgoCD**: Automatically syncs and deploys new image
4. **Health Check**: Kubernetes validates deployment health

## 📚 API Usage Examples

### Get Current User
```bash
curl -H "Authorization: Bearer <jwt-token>" \
     http://localhost:8000/api/me
```

### Get All Users (Admin)
```bash
curl -H "Authorization: Bearer <admin-jwt-token>" \
     http://localhost:8000/api/users
```

### Update User Permissions (Admin)
```bash
curl -X PUT \
     -H "Authorization: Bearer <admin-jwt-token>" \
     -H "Content-Type: application/json" \
     -d '{"user_id": "2", "permission_ids": ["read", "write"]}' \
     http://localhost:8000/api/users/2/permissions
```
