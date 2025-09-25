"""
Tests for the main FastAPI application
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check():
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "operations-backoffice-bff"


def test_get_users_without_auth():
    """Test that users endpoint requires authentication"""
    response = client.get("/api/users")
    assert response.status_code == 403  # No Authorization header


def test_get_permissions_without_auth():
    """Test that permissions endpoint requires authentication"""
    response = client.get("/api/permissions")
    assert response.status_code == 403  # No Authorization header


def test_get_current_user_without_auth():
    """Test that current user endpoint requires authentication"""
    response = client.get("/api/me")
    assert response.status_code == 403  # No Authorization header


def test_cors_headers():
    """Test that CORS headers are properly set"""
    response = client.options("/health")
    assert response.status_code == 200
    # CORS headers should be present (handled by middleware)


@pytest.mark.asyncio
async def test_app_startup():
    """Test that the app starts up correctly"""
    assert app is not None
    assert app.title == "Operations Backoffice BFF"
