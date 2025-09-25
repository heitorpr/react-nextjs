# =============================================================================
# Operations Backoffice - Monorepo Makefile
# =============================================================================

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

# Default target
.PHONY: help
help: ## Show this help message
	@echo "$(BLUE)Operations Backoffice - Monorepo Commands$(NC)"
	@echo ""
	@echo "$(GREEN)Development Commands:$(NC)"
	@echo "  dev              Start both backend and frontend in development mode"
	@echo "  dev-backend      Start only backend in development mode"
	@echo "  dev-frontend     Start only frontend in development mode"
	@echo "  stop             Stop all running services"
	@echo ""
	@echo "$(GREEN)Setup Commands:$(NC)"
	@echo "  setup            Setup both backend and frontend"
	@echo "  setup-backend    Setup only backend"
	@echo "  setup-frontend   Setup only frontend"
	@echo ""
	@echo "$(GREEN)Testing Commands:$(NC)"
	@echo "  test             Run tests for both backend and frontend"
	@echo "  test-backend     Run backend tests"
	@echo "  test-frontend    Run frontend tests"
	@echo ""
	@echo "$(GREEN)Docker Commands:$(NC)"
	@echo "  docker-up        Start all services with Docker Compose"
	@echo "  docker-down      Stop all Docker services"
	@echo "  docker-build     Build all Docker images"
	@echo ""
	@echo "$(GREEN)Code Quality Commands:$(NC)"
	@echo "  lint             Run linting for both backend and frontend"
	@echo "  format           Format code for both backend and frontend"
	@echo "  check            Run all checks (lint, format, test)"
	@echo ""
	@echo "$(GREEN)Cleanup Commands:$(NC)"
	@echo "  clean            Clean all build artifacts and caches"
	@echo "  clean-backend    Clean backend artifacts"
	@echo "  clean-frontend   Clean frontend artifacts"

# =============================================================================
# Development Commands
# =============================================================================

.PHONY: dev
dev: ## Start both backend and frontend in development mode
	@echo "$(GREEN)Starting Operations Backoffice in development mode...$(NC)"
	@echo "$(BLUE)Backend will be available at: http://localhost:8000$(NC)"
	@echo "$(BLUE)Frontend will be available at: http://localhost:3000$(NC)"
	@echo "$(YELLOW)Press Ctrl+C to stop all services$(NC)"
	@echo ""
	@$(MAKE) -j2 dev-backend dev-frontend

.PHONY: dev-backend
dev-backend: ## Start only backend in development mode
	@echo "$(GREEN)Starting backend...$(NC)"
	@cd backend && $(MAKE) dev

.PHONY: dev-frontend
dev-frontend: ## Start only frontend in development mode
	@echo "$(GREEN)Starting frontend...$(NC)"
	@cd frontend && npm run dev

.PHONY: stop
stop: ## Stop all running services
	@echo "$(YELLOW)Stopping all services...$(NC)"
	@cd backend && docker-compose down 2>/dev/null || true
	@pkill -f "uvicorn.*src.web.main:app" 2>/dev/null || true
	@pkill -f "next.*dev" 2>/dev/null || true
	@echo "$(GREEN)All services stopped$(NC)"

# =============================================================================
# Setup Commands
# =============================================================================

.PHONY: setup
setup: setup-backend setup-frontend ## Setup both backend and frontend
	@echo "$(GREEN)Setup complete! You can now run 'make dev' to start development$(NC)"

.PHONY: setup-backend
setup-backend: ## Setup only backend
	@echo "$(GREEN)Setting up backend...$(NC)"
	@cd backend && cp .env.example .env
	@cd backend && uv sync --dev
	@echo "$(GREEN)Backend setup complete$(NC)"

.PHONY: setup-frontend
setup-frontend: ## Setup only frontend
	@echo "$(GREEN)Setting up frontend...$(NC)"
	@cd frontend && cp .env.example .env.local
	@cd frontend && npm install
	@echo "$(GREEN)Frontend setup complete$(NC)"

# =============================================================================
# Testing Commands
# =============================================================================

.PHONY: test
test: test-backend test-frontend ## Run tests for both backend and frontend
	@echo "$(GREEN)All tests completed$(NC)"

.PHONY: test-backend
test-backend: ## Run backend tests
	@echo "$(GREEN)Running backend tests...$(NC)"
	@cd backend && uv run pytest

.PHONY: test-frontend
test-frontend: ## Run frontend tests
	@echo "$(GREEN)Running frontend tests...$(NC)"
	@cd frontend && npm test

# =============================================================================
# Docker Commands
# =============================================================================

.PHONY: docker-up
docker-up: ## Start all services with Docker Compose
	@echo "$(GREEN)Starting services with Docker Compose...$(NC)"
	@cd backend && docker-compose up -d --build
	@echo "$(BLUE)Backend (Docker): http://localhost:8000$(NC)"
	@echo "$(BLUE)Frontend: Start with 'make dev-frontend' or 'cd frontend && npm run dev'$(NC)"

.PHONY: docker-down
docker-down: ## Stop all Docker services
	@echo "$(YELLOW)Stopping Docker services...$(NC)"
	@cd backend && docker-compose down
	@echo "$(GREEN)Docker services stopped$(NC)"

.PHONY: docker-build
docker-build: ## Build all Docker images
	@echo "$(GREEN)Building Docker images...$(NC)"
	@cd backend && docker-compose build
	@echo "$(GREEN)Docker images built$(NC)"

# =============================================================================
# Code Quality Commands
# =============================================================================

.PHONY: lint
lint: lint-backend lint-frontend ## Run linting for both backend and frontend
	@echo "$(GREEN)Linting completed$(NC)"

.PHONY: lint-backend
lint-backend: ## Run backend linting
	@echo "$(GREEN)Running backend linting...$(NC)"
	@cd backend && uv run ruff check .

.PHONY: lint-frontend
lint-frontend: ## Run frontend linting
	@echo "$(GREEN)Running frontend linting...$(NC)"
	@cd frontend && npm run lint

.PHONY: format
format: format-backend format-frontend ## Format code for both backend and frontend
	@echo "$(GREEN)Code formatting completed$(NC)"

.PHONY: format-backend
format-backend: ## Format backend code
	@echo "$(GREEN)Formatting backend code...$(NC)"
	@cd backend && uv run ruff format .

.PHONY: format-frontend
format-frontend: ## Format frontend code
	@echo "$(GREEN)Formatting frontend code...$(NC)"
	@cd frontend && npm run format

.PHONY: check
check: lint test ## Run all checks (lint, format, test)
	@echo "$(GREEN)All checks completed$(NC)"

# =============================================================================
# Cleanup Commands
# =============================================================================

.PHONY: clean
clean: clean-backend clean-frontend ## Clean all build artifacts and caches
	@echo "$(GREEN)All cleanup completed$(NC)"

.PHONY: clean-backend
clean-backend: ## Clean backend artifacts
	@echo "$(YELLOW)Cleaning backend artifacts...$(NC)"
	@cd backend && rm -rf __pycache__ .pytest_cache .coverage htmlcov .ruff_cache .mypy_cache
	@cd backend && rm -rf build dist *.egg-info
	@echo "$(GREEN)Backend cleanup completed$(NC)"

.PHONY: clean-frontend
clean-frontend: ## Clean frontend artifacts
	@echo "$(YELLOW)Cleaning frontend artifacts...$(NC)"
	@cd frontend && rm -rf .next out build .turbo
	@cd frontend && rm -rf node_modules/.cache
	@echo "$(GREEN)Frontend cleanup completed$(NC)"

# =============================================================================
# Quick Start Commands
# =============================================================================

.PHONY: quick-start
quick-start: setup docker-up ## Quick start: setup and run with Docker
	@echo "$(GREEN)Quick start complete!$(NC)"
	@echo "$(BLUE)Backend: http://localhost:8000$(NC)"
	@echo "$(BLUE)Frontend: cd frontend && npm run dev$(NC)"

.PHONY: dev-full
dev-full: setup dev ## Full development setup and start
	@echo "$(GREEN)Full development environment ready!$(NC)"
