"""
Centralized utilities for Locust load testing.

This module contains all the shared functionality for making authenticated API requests,
ensuring consistency across all task sets.
"""

import json
from datetime import datetime, timezone
from typing import Dict, Any

from src.core.settings import settings
from src.web.api.signing import generate_signature


def get_auth_headers(method: str, body: str) -> Dict[str, str]:
    """
    Generate authentication headers for API requests.

    Args:
        method: HTTP method (GET, POST, PUT, DELETE, etc.)
        body: Request body as string (empty string for GET/DELETE requests)

    Returns:
        Dictionary containing x-signature, x-timestamp, and Content-Type headers
    """
    timestamp = str(int(datetime.now(timezone.utc).timestamp() * 1000))
    signature = generate_signature(method, body, timestamp, settings.secret_key)

    return {
        "x-signature": signature,
        "x-timestamp": timestamp,
        "Content-Type": "application/json",
    }


def create_json_body(data: Dict[str, Any]) -> str:
    """
    Create a compact JSON string from a dictionary.

    Args:
        data: Dictionary to convert to JSON

    Returns:
        Compact JSON string (no spaces after colons/commas)
    """
    return json.dumps(data, separators=(",", ":"))


def generate_unique_user_data(faker) -> Dict[str, Any]:
    """
    Generate unique user data to avoid database conflicts.

    Args:
        faker: Faker instance

    Returns:
        Dictionary with unique user data
    """
    import time

    timestamp = int(time.time() * 1000)

    return {
        "email": f"test_{timestamp}_{faker.random_int(1000, 9999)}@example.com",
        "name": faker.name(),
        "google_id": f"test-google-{timestamp}-{faker.random_int(1000, 9999)}",
        "is_admin": False,
        "is_active": True,
    }


def log_request_failure(
    action: str,
    response,
    extra_info: Dict[str, Any] | None = None,
    headers: Dict[str, str] | None = None,
) -> None:
    """
    Log request failures with consistent formatting.

    Args:
        action: Description of the action that failed
        response: HTTP response object
        extra_info: Additional information to log
        headers: Request headers that were sent
    """
    print(f"[{action}] - Status: {response.status_code}")
    print(f"Response: {response.text}")
    if headers:
        print(f"Request Headers: {json.dumps(headers, indent=2)}")
    if extra_info:
        print(f"Info: {json.dumps(extra_info, indent=2)}")
