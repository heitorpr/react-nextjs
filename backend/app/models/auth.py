"""
Authentication and authorization models
"""

from pydantic import BaseModel
from typing import List


class User(BaseModel):
    """User model"""
    id: str
    email: str
    name: str
    roles: List[str]
    permissions: List[str]


class Permission(BaseModel):
    """Permission model"""
    id: str
    name: str
    resource: str
    action: str


class UserPermissionUpdate(BaseModel):
    """User permission update model"""
    user_id: str
    permission_ids: List[str]


class HealthResponse(BaseModel):
    """Health check response model"""
    status: str
    service: str
