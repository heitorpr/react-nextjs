.PHONY: help install dev test lint format type-check clean run build docker-build docker-run

help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	uv sync --dev

dev: ## Run development server
	uv run python scripts/dev.py

test: ## Run tests
	uv run pytest

test-cov: ## Run tests with coverage
	uv run pytest --cov=app --cov-report=html --cov-report=term

lint: ## Run linting
	uv run flake8 app/
	uv run black --check app/
	uv run isort --check-only app/

format: ## Format code
	uv run black app/
	uv run isort app/

type-check: ## Run type checking
	uv run mypy app/

check: lint type-check test ## Run all checks

clean: ## Clean up cache and temporary files
	find . -type f -name "*.pyc" -delete
	find . -type d -name "__pycache__" -delete
	find . -type d -name "*.egg-info" -exec rm -rf {} +
	rm -rf .pytest_cache
	rm -rf .coverage
	rm -rf htmlcov
	rm -rf .mypy_cache

run: ## Run the application
	uv run uvicorn app.main:app --host 0.0.0.0 --port 8000

build: ## Build the package
	uv build

docker-build: ## Build Docker image
	docker build -t operations-backoffice-bff .

docker-run: ## Run Docker container
	docker run -p 8000:8000 operations-backoffice-bff

docker-dev: ## Run Docker container in development mode
	docker run -p 8000:8000 -v $(PWD)/app:/app/app operations-backoffice-bff
