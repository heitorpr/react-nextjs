# =============================================================================
# Operations Backoffice - Development Script (PowerShell)
# =============================================================================

param(
    [string]$Command = "help"
)

$Blue = "`e[0;34m"
$Green = "`e[0;32m"
$Yellow = "`e[0;33m"
$Red = "`e[0;31m"
$NC = "`e[0m"

function Show-Help {
    Write-Host "$Blue Operations Backoffice - Monorepo Commands $NC"
    Write-Host ""
    Write-Host "$Green Development Commands:$NC"
    Write-Host "  dev              Start both backend and frontend in development mode"
    Write-Host "  dev-backend      Start only backend in development mode"
    Write-Host "  dev-frontend     Start only frontend in development mode"
    Write-Host "  stop             Stop all running services"
    Write-Host ""
    Write-Host "$Green Setup Commands:$NC"
    Write-Host "  setup            Setup both backend and frontend"
    Write-Host "  setup-backend    Setup only backend"
    Write-Host "  setup-frontend   Setup only frontend"
    Write-Host ""
    Write-Host "$Green Testing Commands:$NC"
    Write-Host "  test             Run tests for both backend and frontend"
    Write-Host "  test-backend     Run backend tests"
    Write-Host "  test-frontend    Run frontend tests"
    Write-Host ""
    Write-Host "$Green Docker Commands:$NC"
    Write-Host "  docker-up        Start all services with Docker Compose"
    Write-Host "  docker-down      Stop all Docker services"
    Write-Host "  docker-build     Build all Docker images"
    Write-Host ""
    Write-Host "$Green Code Quality Commands:$NC"
    Write-Host "  lint             Run linting for both backend and frontend"
    Write-Host "  format           Format code for both backend and frontend"
    Write-Host "  check            Run all checks (lint, format, test)"
    Write-Host ""
    Write-Host "$Green Cleanup Commands:$NC"
    Write-Host "  clean            Clean all build artifacts and caches"
    Write-Host "  clean-backend    Clean backend artifacts"
    Write-Host "  clean-frontend   Clean frontend artifacts"
}

function Start-Dev {
    Write-Host "$Green Starting Operations Backoffice in development mode...$NC"
    Write-Host "$Blue Backend will be available at: http://localhost:8000$NC"
    Write-Host "$Blue Frontend will be available at: http://localhost:3000$NC"
    Write-Host "$Yellow Press Ctrl+C to stop all services$NC"
    Write-Host ""

    # Start backend and frontend in parallel
    $backendJob = Start-Job -ScriptBlock {
        Set-Location $using:PWD\backend
        & docker-compose up --build
    }

    $frontendJob = Start-Job -ScriptBlock {
        Set-Location $using:PWD\frontend
        & npm run dev
    }

    try {
        Wait-Job $backendJob, $frontendJob
    }
    finally {
        Stop-Job $backendJob, $frontendJob
        Remove-Job $backendJob, $frontendJob
    }
}

function Start-DevBackend {
    Write-Host "$Green Starting backend...$NC"
    Set-Location backend
    docker-compose up --build
}

function Start-DevFrontend {
    Write-Host "$Green Starting frontend...$NC"
    Set-Location frontend
    npm run dev
}

function Stop-Services {
    Write-Host "$Yellow Stopping all services...$NC"
    Set-Location backend
    docker-compose down
    Set-Location ..
    Write-Host "$Green All services stopped$NC"
}

function Setup-Project {
    Setup-Backend
    Setup-Frontend
    Write-Host "$Green Setup complete! You can now run '.\scripts\dev.ps1 dev' to start development$NC"
}

function Setup-Backend {
    Write-Host "$Green Setting up backend...$NC"
    Set-Location backend
    Copy-Item .env.example .env -ErrorAction SilentlyContinue
    uv sync --dev
    Set-Location ..
    Write-Host "$Green Backend setup complete$NC"
}

function Setup-Frontend {
    Write-Host "$Green Setting up frontend...$NC"
    Set-Location frontend
    Copy-Item .env.example .env.local -ErrorAction SilentlyContinue
    npm install
    Set-Location ..
    Write-Host "$Green Frontend setup complete$NC"
}

function Test-Project {
    Test-Backend
    Test-Frontend
    Write-Host "$Green All tests completed$NC"
}

function Test-Backend {
    Write-Host "$Green Running backend tests...$NC"
    Set-Location backend
    uv run pytest
    Set-Location ..
}

function Test-Frontend {
    Write-Host "$Green Running frontend tests...$NC"
    Set-Location frontend
    npm test
    Set-Location ..
}

function Start-DockerUp {
    Write-Host "$Green Starting services with Docker Compose...$NC"
    Set-Location backend
    docker-compose up -d --build
    Set-Location ..
    Write-Host "$Blue Backend (Docker): http://localhost:8000$NC"
    Write-Host "$Blue Frontend: Start with '.\scripts\dev.ps1 dev-frontend' or 'cd frontend && npm run dev'$NC"
}

function Stop-DockerDown {
    Write-Host "$Yellow Stopping Docker services...$NC"
    Set-Location backend
    docker-compose down
    Set-Location ..
    Write-Host "$Green Docker services stopped$NC"
}

function Build-Docker {
    Write-Host "$Green Building Docker images...$NC"
    Set-Location backend
    docker-compose build
    Set-Location ..
    Write-Host "$Green Docker images built$NC"
}

function Invoke-Lint {
    Lint-Backend
    Lint-Frontend
    Write-Host "$Green Linting completed$NC"
}

function Lint-Backend {
    Write-Host "$Green Running backend linting...$NC"
    Set-Location backend
    uv run ruff check .
    Set-Location ..
}

function Lint-Frontend {
    Write-Host "$Green Running frontend linting...$NC"
    Set-Location frontend
    npm run lint
    Set-Location ..
}

function Format-Code {
    Format-Backend
    Format-Frontend
    Write-Host "$Green Code formatting completed$NC"
}

function Format-Backend {
    Write-Host "$Green Formatting backend code...$NC"
    Set-Location backend
    uv run ruff format .
    Set-Location ..
}

function Format-Frontend {
    Write-Host "$Green Formatting frontend code...$NC"
    Set-Location frontend
    npm run format
    Set-Location ..
}

function Invoke-Check {
    Invoke-Lint
    Test-Project
    Write-Host "$Green All checks completed$NC"
}

function Clean-Project {
    Clean-Backend
    Clean-Frontend
    Write-Host "$Green All cleanup completed$NC"
}

function Clean-Backend {
    Write-Host "$Yellow Cleaning backend artifacts...$NC"
    Set-Location backend
    Remove-Item -Recurse -Force __pycache__, .pytest_cache, .coverage, htmlcov, .ruff_cache, .mypy_cache -ErrorAction SilentlyContinue
    Remove-Item -Recurse -Force build, dist, *.egg-info -ErrorAction SilentlyContinue
    Set-Location ..
    Write-Host "$Green Backend cleanup completed$NC"
}

function Clean-Frontend {
    Write-Host "$Yellow Cleaning frontend artifacts...$NC"
    Set-Location frontend
    Remove-Item -Recurse -Force .next, out, build, .turbo -ErrorAction SilentlyContinue
    Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
    Set-Location ..
    Write-Host "$Green Frontend cleanup completed$NC"
}

# Main command routing
switch ($Command.ToLower()) {
    "help" { Show-Help }
    "dev" { Start-Dev }
    "dev-backend" { Start-DevBackend }
    "dev-frontend" { Start-DevFrontend }
    "stop" { Stop-Services }
    "setup" { Setup-Project }
    "setup-backend" { Setup-Backend }
    "setup-frontend" { Setup-Frontend }
    "test" { Test-Project }
    "test-backend" { Test-Backend }
    "test-frontend" { Test-Frontend }
    "docker-up" { Start-DockerUp }
    "docker-down" { Stop-DockerDown }
    "docker-build" { Build-Docker }
    "lint" { Invoke-Lint }
    "lint-backend" { Lint-Backend }
    "lint-frontend" { Lint-Frontend }
    "format" { Format-Code }
    "format-backend" { Format-Backend }
    "format-frontend" { Format-Frontend }
    "check" { Invoke-Check }
    "clean" { Clean-Project }
    "clean-backend" { Clean-Backend }
    "clean-frontend" { Clean-Frontend }
    default {
        Write-Host "$Red Unknown command: $Command$NC"
        Show-Help
    }
}
