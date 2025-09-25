# Backend Setup Guide

This guide will help you set up the Operations Backoffice BFF backend using `uv` and Python 3.13.

## Prerequisites

### 1. Install Python 3.13

#### Windows
1. Download Python 3.13 from [python.org](https://www.python.org/downloads/)
2. Run the installer and make sure to check "Add Python to PATH"
3. Verify installation: `python --version`

#### macOS
```bash
# Using Homebrew
brew install python@3.13

# Or download from python.org
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install python3.13 python3.13-venv python3.13-dev
```

### 2. Install uv

`uv` is a fast Python package installer and resolver.

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

## Project Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Dependencies
```bash
# Install all dependencies (production + development)
uv sync --dev

# This will:
# - Create a virtual environment
# - Install all dependencies from pyproject.toml
# - Generate uv.lock file
```

### 3. Environment Configuration
```bash
# Copy environment template
cp env.example .env

# Edit .env with your configuration
# Required variables:
# - FRONTEND_URL=http://localhost:3000
# - JWT_SECRET=your-secret-key
```

### 4. Run Development Server
```bash
# Using uv (recommended)
uv run python scripts/dev.py

# Or using make
make dev

# Or directly with uvicorn
uv run uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

## Development Commands

### Using Make (Recommended)
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

### Using uv directly
```bash
uv run pytest                    # Run tests
uv run black app/                # Format code
uv run isort app/                # Sort imports
uv run flake8 app/               # Lint code
uv run mypy app/                 # Type checking
uv run uvicorn app.main:app --reload  # Run server
```

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   └── models/
│       ├── __init__.py
│       └── auth.py          # Pydantic models
├── tests/
│   ├── __init__.py
│   └── test_main.py         # Test cases
├── scripts/
│   ├── __init__.py
│   └── dev.py               # Development server script
├── k8s/                     # Kubernetes manifests
├── pyproject.toml           # Project configuration
├── uv.lock                  # Locked dependencies
├── Dockerfile               # Container configuration
├── Makefile                 # Development commands
├── .pre-commit-config.yaml  # Pre-commit hooks
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
make test
# or
uv run pytest
```

### Run Tests with Coverage
```bash
make test-cov
# or
uv run pytest --cov=app --cov-report=html
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
# Format code
make format

# Run linting
make lint

# Type checking
make type-check

# Run all checks
make check
```

## Docker Development

### Build Image
```bash
make docker-build
# or
docker build -t operations-backoffice-bff .
```

### Run Container
```bash
make docker-run
# or
docker run -p 8000:8000 operations-backoffice-bff
```

### Development with Volume Mount
```bash
make docker-dev
# or
docker run -p 8000:8000 -v $(PWD)/app:/app/app operations-backoffice-bff
```

## Troubleshooting

### Common Issues

1. **Python not found**
   - Make sure Python 3.13 is installed and in PATH
   - Try `python3.13` instead of `python`

2. **uv command not found**
   - Install uv using the instructions above
   - Restart your terminal after installation

3. **Permission errors**
   - On Windows, run PowerShell as Administrator
   - On Linux/macOS, check file permissions

4. **Port already in use**
   - Change the port in `scripts/dev.py`
   - Or kill the process using port 8000

### Environment Issues

1. **Import errors**
   - Make sure you're in the backend directory
   - Run `uv sync --dev` to install dependencies

2. **Module not found**
   - Check that `app/` directory has `__init__.py` files
   - Verify Python path includes the project root

## Next Steps

1. **Configure Authentication**: Set up JWT secret and Google OAuth
2. **Database Setup**: Add PostgreSQL for production
3. **Deployment**: Configure Kubernetes and ArgoCD
4. **Monitoring**: Add logging and metrics collection

## Getting Help

- Check the [FastAPI documentation](https://fastapi.tiangolo.com/)
- Review [uv documentation](https://docs.astral.sh/uv/)
- Look at the API docs at http://localhost:8000/docs
