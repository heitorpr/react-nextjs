# Operations Backoffice Backend

FastAPI backend service for the Operations Backoffice system.

## 🚀 Features

- **FastAPI**: Modern, fast web framework with automatic OpenAPI documentation
- **PostgreSQL**: Async database with SQLAlchemy 2.0 and Alembic migrations
- **Authentication**: Signature-based request validation
- **Monitoring**: Prometheus metrics and health checks
- **Docker**: Fully containerized with Docker Compose
- **Type Safety**: Full Python type hints with Pydantic
- **Async Support**: High-performance async/await patterns

## 📋 API Endpoints

### Core Endpoints

- `GET /docs` - Interactive API documentation (Swagger UI)
- `GET /health` - Health check endpoint
- `GET /metrics` - Prometheus metrics
- `GET /api/heroes` - Get all heroes
- `GET /api/teams` - Get all teams
- `POST /api/heroes` - Create new hero
- `POST /api/teams` - Create new team

### Authentication
All endpoints require signature validation with:
- `x-signature` header
- `x-timestamp` header
- Request body signing

## 🛠️ Development

### Prerequisites
- Python 3.13+
- [uv](https://docs.astral.sh/uv/getting-started/installation/) (recommended)
- Docker & Docker Compose

### Setup

```bash
# Clone and navigate to backend
cd backend

# Copy environment variables
cp .env.example .env

# Install dependencies
uv sync

# Start with Docker Compose
docker-compose up -d --build
```

The API will be available at `http://localhost:8000`

### Environment Variables

```env
# Database Configuration
APP_DB_USER=postgres
APP_DB_NAME=operations_backoffice_dev
APP_DB_HOST=db
APP_DB_PORT=5432
APP_DB_PASSWORD=password
APP_DB_POOL_SIZE=5

# API Configuration
APP_TIMESTAMP_SIGNING_THRESHOLD=120000
APP_SECRET_KEY=your-secret-key-here

# Application Configuration
APP_DEBUG=true
APP_NAME=operations_backoffice_backend
APP_NAMESPACE=operations
```

## 🧪 Testing

```bash
# Run tests
uv run pytest

# Run tests with coverage
uv run pytest --cov=src --cov-report=html

# Run linting
uv run ruff check .

# Fix linting issues
uv run ruff check . --fix

# Format code
uv run ruff format .
```

## 🚀 Deployment

### Docker Compose (Development)

```bash
# Start all services
docker-compose up -d --build

# Start with monitoring (Prometheus, Grafana)
docker-compose --profile debug up -d --build

# Stop services
docker-compose down
```

### Database Migrations

```bash
# Run migrations
docker-compose exec app alembic upgrade head

# Create new migration
docker-compose exec app alembic revision --autogenerate -m "description"

# Check migration status
docker-compose exec app alembic current
```

## 🔧 Configuration

### Project Structure

```
src/
├── core/           # Core functionality (settings, database)
├── domain/         # Domain models and repositories
└── web/           # Web layer (API routes, services)
    ├── api/       # API routes and endpoints
    ├── deps/      # Dependency injection
    └── services/  # Business logic services
```

### Database Configuration
- **Engine**: PostgreSQL 17.4 with asyncpg driver
- **ORM**: SQLAlchemy 2.0 with async support
- **Migrations**: Alembic for schema management
- **Connection Pool**: Configurable pool size and timeouts

### Monitoring & Observability
- **Prometheus**: Metrics collection at `/metrics`
- **Health Checks**: Built-in health monitoring
- **Structured Logging**: JSON-formatted logs
- **Performance Tracking**: Request timing and database queries

## 🔐 Security

### Request Signing
All API requests must be signed using HMAC-SHA256:
1. Create payload: `{method}|{body}|{timestamp}`
2. Sign with secret key using HMAC-SHA256
3. Include signature and timestamp in headers

### Environment Security
- Environment variables prefixed with `APP_`
- Separate development and production configurations
- Docker secrets for sensitive data

## 📊 Performance

- **Async Database**: Non-blocking database operations
- **Connection Pooling**: Efficient database connection management
- **Request Validation**: Fast Pydantic model validation
- **Response Caching**: Configurable caching strategies

## 🚀 Development Workflow

### Pre-commit Hooks
```bash
# Install pre-commit hooks
uv run pre-commit install

# Run hooks manually
uv run pre-commit run --all-files
```

### Code Quality
- **Ruff**: Fast Python linter and formatter
- **Pyright**: Static type checking
- **Pre-commit**: Automated code quality checks
- **Conventional Commits**: Standardized commit messages

## 🔗 Frontend Integration

The backend communicates with the React frontend via:
- RESTful API endpoints
- JSON request/response format
- Signature-based authentication
- CORS-enabled requests

### API Documentation
- Interactive docs available at `/docs`
- OpenAPI 3.0 specification
- Example requests and responses
- Schema validation details
