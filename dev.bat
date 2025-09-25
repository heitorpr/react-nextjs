@echo off
REM =============================================================================
REM Operations Backoffice - Development Script (Batch)
REM =============================================================================

if "%1"=="" goto :help

if "%1"=="help" goto :help
if "%1"=="dev" goto :dev
if "%1"=="dev-backend" goto :dev-backend
if "%1"=="dev-frontend" goto :dev-frontend
if "%1"=="stop" goto :stop
if "%1"=="setup" goto :setup
if "%1"=="setup-backend" goto :setup-backend
if "%1"=="setup-frontend" goto :setup-frontend
if "%1"=="test" goto :test
if "%1"=="test-backend" goto :test-backend
if "%1"=="test-frontend" goto :test-frontend
if "%1"=="docker-up" goto :docker-up
if "%1"=="docker-down" goto :docker-down
if "%1"=="docker-build" goto :docker-build
if "%1"=="lint" goto :lint
if "%1"=="format" goto :format
if "%1"=="clean" goto :clean

echo Unknown command: %1
goto :help

:help
echo Operations Backoffice - Monorepo Commands
echo.
echo Development Commands:
echo   dev              Start both backend and frontend in development mode
echo   dev-backend      Start only backend in development mode
echo   dev-frontend     Start only frontend in development mode
echo   stop             Stop all running services
echo.
echo Setup Commands:
echo   setup            Setup both backend and frontend
echo   setup-backend    Setup only backend
echo   setup-frontend   Setup only frontend
echo.
echo Testing Commands:
echo   test             Run tests for both backend and frontend
echo   test-backend     Run backend tests
echo   test-frontend    Run frontend tests
echo.
echo Docker Commands:
echo   docker-up        Start all services with Docker Compose
echo   docker-down      Stop all Docker services
echo   docker-build     Build all Docker images
echo.
echo Usage: dev.bat [command]
echo Example: dev.bat dev
goto :end

:dev
echo Starting Operations Backoffice in development mode...
echo Backend will be available at: http://localhost:8000
echo Frontend will be available at: http://localhost:3000
echo Press Ctrl+C to stop all services
echo.
cd backend
start "Backend" cmd /c "docker-compose up --build"
cd ..\frontend
start "Frontend" cmd /c "npm run dev"
echo.
echo Both services are starting...
echo Check the opened windows for logs
goto :end

:dev-backend
echo Starting backend...
cd backend
docker-compose up --build
goto :end

:dev-frontend
echo Starting frontend...
cd frontend
npm run dev
goto :end

:stop
echo Stopping all services...
cd backend
docker-compose down
cd ..
echo All services stopped
goto :end

:setup
echo Setting up both backend and frontend...
echo Setting up backend...
cd backend
if not exist .env copy .env.example .env
uv sync --dev
cd ..
echo Backend setup complete
echo Setting up frontend...
cd frontend
if not exist .env.local copy .env.example .env.local
npm install
cd ..
echo Frontend setup complete
echo Setup complete! You can now run 'dev.bat dev' to start development
goto :end

:setup-backend
echo Setting up backend...
cd backend
if not exist .env copy .env.example .env
uv sync --dev
cd ..
echo Backend setup complete
exit /b

:setup-frontend
echo Setting up frontend...
cd frontend
if not exist .env.local copy .env.example .env.local
npm install
cd ..
echo Frontend setup complete
exit /b

:test
echo Running tests for both backend and frontend...
echo Running backend tests...
cd backend
uv run pytest
cd ..
echo Running frontend tests...
cd frontend
npm test
cd ..
echo All tests completed
goto :end

:test-backend
echo Running backend tests...
cd backend
uv run pytest
cd ..
exit /b

:test-frontend
echo Running frontend tests...
cd frontend
npm test
cd ..
exit /b

:docker-up
echo Starting services with Docker Compose...
cd backend
docker-compose up -d --build
cd ..
echo Backend (Docker): http://localhost:8000
echo Frontend: Start with 'dev.bat dev-frontend' or 'cd frontend && npm run dev'
goto :end

:docker-down
echo Stopping Docker services...
cd backend
docker-compose down
cd ..
echo Docker services stopped
goto :end

:docker-build
echo Building Docker images...
cd backend
docker-compose build
cd ..
echo Docker images built
goto :end

:lint
echo Running linting for both backend and frontend...
cd backend
uv run ruff check .
cd ..\frontend
npm run lint
cd ..
echo Linting completed
goto :end

:format
echo Formatting code for both backend and frontend...
cd backend
uv run ruff format .
cd ..\frontend
npm run format
cd ..
echo Code formatting completed
goto :end

:clean
echo Cleaning all build artifacts and caches...
cd backend
if exist __pycache__ rmdir /s /q __pycache__
if exist .pytest_cache rmdir /s /q .pytest_cache
if exist .coverage del .coverage
if exist htmlcov rmdir /s /q htmlcov
if exist .ruff_cache rmdir /s /q .ruff_cache
cd ..\frontend
if exist .next rmdir /s /q .next
if exist out rmdir /s /q out
if exist build rmdir /s /q build
if exist .turbo rmdir /s /q .turbo
cd ..
echo All cleanup completed
goto :end

:end
