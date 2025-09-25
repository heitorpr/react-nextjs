#!/bin/bash

# =============================================================================
# Operations Backoffice - Development Script (Bash)
# =============================================================================

# Colors
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Default command
COMMAND=${1:-help}

show_help() {
    echo -e "${BLUE}Operations Backoffice - Monorepo Commands${NC}"
    echo ""
    echo -e "${GREEN}Development Commands:${NC}"
    echo "  dev              Start both backend and frontend in development mode"
    echo "  dev-backend      Start only backend in development mode"
    echo "  dev-frontend     Start only frontend in development mode"
    echo "  stop             Stop all running services"
    echo ""
    echo -e "${GREEN}Setup Commands:${NC}"
    echo "  setup            Setup both backend and frontend"
    echo "  setup-backend    Setup only backend"
    echo "  setup-frontend   Setup only frontend"
    echo ""
    echo -e "${GREEN}Testing Commands:${NC}"
    echo "  test             Run tests for both backend and frontend"
    echo "  test-backend     Run backend tests"
    echo "  test-frontend    Run frontend tests"
    echo ""
    echo -e "${GREEN}Docker Commands:${NC}"
    echo "  docker-up        Start all services with Docker Compose"
    echo "  docker-down      Stop all Docker services"
    echo "  docker-build     Build all Docker images"
    echo ""
    echo -e "${GREEN}Code Quality Commands:${NC}"
    echo "  lint             Run linting for both backend and frontend"
    echo "  format           Format code for both backend and frontend"
    echo "  check            Run all checks (lint, format, test)"
    echo ""
    echo -e "${GREEN}Cleanup Commands:${NC}"
    echo "  clean            Clean all build artifacts and caches"
    echo "  clean-backend    Clean backend artifacts"
    echo "  clean-frontend   Clean frontend artifacts"
    echo ""
    echo "Usage: ./scripts/dev.sh [command]"
    echo "Example: ./scripts/dev.sh dev"
}

start_dev() {
    echo -e "${GREEN}Starting Operations Backoffice in development mode...${NC}"
    echo -e "${BLUE}Backend will be available at: http://localhost:8000${NC}"
    echo -e "${BLUE}Frontend will be available at: http://localhost:3000${NC}"
    echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
    echo ""

    # Start backend in background
    cd backend && docker-compose up --build &
    BACKEND_PID=$!

    # Start frontend in background
    cd ../frontend && npm run dev &
    FRONTEND_PID=$!

    # Wait for both processes
    wait $BACKEND_PID $FRONTEND_PID
}

start_dev_backend() {
    echo -e "${GREEN}Starting backend...${NC}"
    cd backend
    docker-compose up --build
}

start_dev_frontend() {
    echo -e "${GREEN}Starting frontend...${NC}"
    cd frontend
    npm run dev
}

stop_services() {
    echo -e "${YELLOW}Stopping all services...${NC}"
    cd backend
    docker-compose down
    cd ..
    pkill -f "uvicorn.*src.web.main:app" 2>/dev/null || true
    pkill -f "next.*dev" 2>/dev/null || true
    echo -e "${GREEN}All services stopped${NC}"
}

setup_project() {
    setup_backend
    setup_frontend
    echo -e "${GREEN}Setup complete! You can now run './scripts/dev.sh dev' to start development${NC}"
}

setup_backend() {
    echo -e "${GREEN}Setting up backend...${NC}"
    cd backend
    cp .env.example .env 2>/dev/null || true
    uv sync --dev
    cd ..
    echo -e "${GREEN}Backend setup complete${NC}"
}

setup_frontend() {
    echo -e "${GREEN}Setting up frontend...${NC}"
    cd frontend
    cp .env.example .env.local 2>/dev/null || true
    npm install
    cd ..
    echo -e "${GREEN}Frontend setup complete${NC}"
}

test_project() {
    test_backend
    test_frontend
    echo -e "${GREEN}All tests completed${NC}"
}

test_backend() {
    echo -e "${GREEN}Running backend tests...${NC}"
    cd backend
    uv run pytest
    cd ..
}

test_frontend() {
    echo -e "${GREEN}Running frontend tests...${NC}"
    cd frontend
    npm test
    cd ..
}

start_docker_up() {
    echo -e "${GREEN}Starting services with Docker Compose...${NC}"
    cd backend
    docker-compose up -d --build
    cd ..
    echo -e "${BLUE}Backend (Docker): http://localhost:8000${NC}"
    echo -e "${BLUE}Frontend: Start with './scripts/dev.sh dev-frontend' or 'cd frontend && npm run dev'${NC}"
}

stop_docker_down() {
    echo -e "${YELLOW}Stopping Docker services...${NC}"
    cd backend
    docker-compose down
    cd ..
    echo -e "${GREEN}Docker services stopped${NC}"
}

build_docker() {
    echo -e "${GREEN}Building Docker images...${NC}"
    cd backend
    docker-compose build
    cd ..
    echo -e "${GREEN}Docker images built${NC}"
}

run_lint() {
    lint_backend
    lint_frontend
    echo -e "${GREEN}Linting completed${NC}"
}

lint_backend() {
    echo -e "${GREEN}Running backend linting...${NC}"
    cd backend
    uv run ruff check .
    cd ..
}

lint_frontend() {
    echo -e "${GREEN}Running frontend linting...${NC}"
    cd frontend
    npm run lint
    cd ..
}

format_code() {
    format_backend
    format_frontend
    echo -e "${GREEN}Code formatting completed${NC}"
}

format_backend() {
    echo -e "${GREEN}Formatting backend code...${NC}"
    cd backend
    uv run ruff format .
    cd ..
}

format_frontend() {
    echo -e "${GREEN}Formatting frontend code...${NC}"
    cd frontend
    npm run format
    cd ..
}

run_check() {
    run_lint
    test_project
    echo -e "${GREEN}All checks completed${NC}"
}

clean_project() {
    clean_backend
    clean_frontend
    echo -e "${GREEN}All cleanup completed${NC}"
}

clean_backend() {
    echo -e "${YELLOW}Cleaning backend artifacts...${NC}"
    cd backend
    rm -rf __pycache__ .pytest_cache .coverage htmlcov .ruff_cache .mypy_cache
    rm -rf build dist *.egg-info
    cd ..
    echo -e "${GREEN}Backend cleanup completed${NC}"
}

clean_frontend() {
    echo -e "${YELLOW}Cleaning frontend artifacts...${NC}"
    cd frontend
    rm -rf .next out build .turbo
    rm -rf node_modules/.cache
    cd ..
    echo -e "${GREEN}Frontend cleanup completed${NC}"
}

# Main command routing
case $COMMAND in
    help)
        show_help
        ;;
    dev)
        start_dev
        ;;
    dev-backend)
        start_dev_backend
        ;;
    dev-frontend)
        start_dev_frontend
        ;;
    stop)
        stop_services
        ;;
    setup)
        setup_project
        ;;
    setup-backend)
        setup_backend
        ;;
    setup-frontend)
        setup_frontend
        ;;
    test)
        test_project
        ;;
    test-backend)
        test_backend
        ;;
    test-frontend)
        test_frontend
        ;;
    docker-up)
        start_docker_up
        ;;
    docker-down)
        stop_docker_down
        ;;
    docker-build)
        build_docker
        ;;
    lint)
        run_lint
        ;;
    lint-backend)
        lint_backend
        ;;
    lint-frontend)
        lint_frontend
        ;;
    format)
        format_code
        ;;
    format-backend)
        format_backend
        ;;
    format-frontend)
        format_frontend
        ;;
    check)
        run_check
        ;;
    clean)
        clean_project
        ;;
    clean-backend)
        clean_backend
        ;;
    clean-frontend)
        clean_frontend
        ;;
    *)
        echo -e "${RED}Unknown command: $COMMAND${NC}"
        show_help
        ;;
esac
