# Backend Setup Guide

This guide will help you set up the Operations Backoffice backend using `uv` for a streamlined development experience.

## Prerequisites

### Install uv

`uv` is a fast Python package installer and resolver that can automatically manage Python versions.

#### Windows
```powershell
# Using PowerShell
irm https://astral.sh/uv/install.ps1 | iex
```

#### macOS/Linux
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

#### Alternative: Using pip
```bash
pip install uv
```

**Note**: uv will automatically download and manage the correct Python version (3.13) for this project.

## Project Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Dependencies with uv
```bash
# Install all dependencies (production + development)
uv sync --dev

# This will automatically:
# - Download and install Python 3.13 if needed
# - Create a virtual environment
# - Install all dependencies from pyproject.toml
# - Generate/update uv.lock file
```

### 3. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
# Required variables:
# - APP_DB_USER=postgres
# - APP_DB_PASSWORD=password
# - APP_SECRET_KEY=your-secret-key
```

### 4. Run Development Server
```bash
# Using uv (recommended)
uv run uvicorn src.web.main:app --reload --host 0.0.0.0 --port 8000

# Or using Docker Compose
docker-compose up -d --build
```

The API will be available at `http://localhost:8000`

## Development Commands

### Using uv (Recommended)
```bash
# Package management
uv sync --dev                    # Install all dependencies
uv add <package>                 # Add new dependency
uv remove <package>              # Remove dependency

# Development server
uv run uvicorn src.web.main:app --reload --host 0.0.0.0 --port 8000

# Testing
uv run pytest                    # Run tests
uv run pytest --cov=src          # Run tests with coverage

# Code quality
uv run ruff check .               # Lint code
uv run ruff check . --fix         # Fix linting issues
uv run ruff format .              # Format code
uv run pyright                    # Type checking

# Pre-commit hooks
uv run pre-commit install         # Install pre-commit hooks
uv run pre-commit run --all-files # Run hooks manually
```

### Using Make (Alternative)
```bash
make help          # Show all available commands
make install       # Install dependencies
make dev           # Run development server
make test          # Run tests
make test-cov      # Run tests with coverage
make lint          # Run linting
make format        # Format code
make type-check    # Run type checking
make check         # Run all checks
make clean         # Clean cache files
```

## Project Structure

```
backend/
├── src/                     # Source code
│   ├── core/               # Core functionality
│   │   ├── settings.py     # Application settings
│   │   ├── db.py           # Database configuration
│   │   └── alembic/        # Database migrations
│   ├── domain/             # Domain layer
│   │   ├── models/         # Domain models
│   │   └── repositories/   # Data access layer
│   └── web/                # Web layer
│       ├── api/            # API routes
│       ├── deps/           # Dependency injection
│       └── services/       # Business logic
├── tests/                  # Test cases
├── scripts/                # Utility scripts
├── pyproject.toml          # Project configuration
├── uv.lock                 # Locked dependencies
├── docker-compose.yaml     # Docker services
├── Dockerfile              # Container configuration
├── Makefile                # Development commands
├── .env.example            # Environment template
├── .pre-commit-config.yaml # Pre-commit hooks
└── README.md
```

## API Documentation

Once the server is running, visit:
- **Interactive API Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## Testing

### Run Tests
```bash
# Using uv (recommended)
uv run pytest

# Using make
make test
```

### Run Tests with Coverage
```bash
# Using uv (recommended)
uv run pytest --cov=src --cov-report=html

# Using make
make test-cov
```

Coverage report will be generated in `htmlcov/index.html`

## Code Quality

### Pre-commit Hooks
```bash
# Install pre-commit hooks
uv run pre-commit install

# Run hooks manually
uv run pre-commit run --all-files
```

### Linting and Formatting
```bash
# Using uv (recommended)
uv run ruff check .               # Lint code
uv run ruff check . --fix         # Fix linting issues
uv run ruff format .              # Format code
uv run pyright                    # Type checking

# Using make (alternative)
make format                       # Format code
make lint                         # Run linting
make type-check                   # Type checking
make check                        # Run all checks
```

## Docker Development

### Using Docker Compose (Recommended)
```bash
# Start all services (app + database)
docker-compose up -d --build

# Start with monitoring (Prometheus, Grafana, pgAdmin)
docker-compose --profile debug up -d --build

# Stop all services
docker-compose down

# View logs
docker-compose logs -f app
```

### Manual Docker Commands
```bash
# Build image
docker build --target=production . -t operations-backoffice-bff

# Run container
docker run -p 8000:8000 operations-backoffice-bff

# Development with volume mount
docker run -p 8000:8000 -v $(PWD)/src:/app/src operations-backoffice-bff
```

## Troubleshooting

### Common Issues

1. **uv command not found**
   - Install uv using the instructions above
   - Restart your terminal after installation
   - On Windows, make sure PowerShell execution policy allows scripts

2. **Permission errors**
   - On Windows, run PowerShell as Administrator
   - On Linux/macOS, check file permissions

3. **Port already in use**
   - Kill the process using port 8000: `lsof -ti:8000 | xargs kill -9`
   - Or change the port in the uvicorn command

4. **Database connection issues**
   - Make sure Docker Compose is running: `docker-compose ps`
   - Check database logs: `docker-compose logs db`
   - Verify environment variables in `.env` file

### Environment Issues

1. **Import errors**
   - Make sure you're in the backend directory
   - Run `uv sync --dev` to install dependencies
   - Check that `src/` directory structure is correct

2. **Module not found**
   - Verify the project structure matches the expected layout
   - Make sure all `__init__.py` files are present
   - Run `uv run python -c "import sys; print(sys.path)"` to check Python path

## Next Steps

1. **Configure Environment**: Update `.env` with your specific settings
2. **Database Setup**: PostgreSQL is already configured with Docker Compose
3. **Authentication**: Configure signature-based authentication for production
4. **Monitoring**: Access Prometheus at http://localhost:9090 and Grafana at http://localhost:3001
5. **Deployment**: Configure for your deployment environment

## Getting Help

- Check the [FastAPI documentation](https://fastapi.tiangolo.com/)
- Review [uv documentation](https://docs.astral.sh/uv/)
- Look at the API docs at http://localhost:8000/docs
- Check the [PostgreSQL documentation](https://www.postgresql.org/docs/)
- Review [Docker Compose documentation](https://docs.docker.com/compose/)
