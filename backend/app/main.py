"""
Operations Backoffice BFF - FastAPI Backend for Frontend
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List
import os
from dotenv import load_dotenv

from app.models.auth import User, Permission, UserPermissionUpdate, HealthResponse

load_dotenv()

app = FastAPI(
    title="Operations Backoffice BFF",
    description="Backend for Frontend API for Operations Backoffice",
    version="1.0.0",
)

# CORS configuration for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Local development
        "https://*.amplifyapp.com",  # AWS Amplify
        os.getenv("FRONTEND_URL", "https://your-app.amplifyapp.com"),
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

security = HTTPBearer()

# Mock data (replace with actual database/service calls)
MOCK_USERS = [
    {
        "id": "1",
        "email": "heitorprodrigues@gmail.com",
        "name": "Heitor Rodrigues",
        "roles": ["admin"],
        "permissions": ["read", "write", "delete", "manage_users"]
    },
    {
        "id": "2",
        "email": "operator@company.com",
        "name": "Operator User",
        "roles": ["operator"],
        "permissions": ["read", "write"]
    },
    {
        "id": "3",
        "email": "viewer@company.com",
        "name": "Viewer User",
        "roles": ["viewer"],
        "permissions": ["read"]
    }
]

MOCK_PERMISSIONS = [
    {"id": "read", "name": "Read Access", "resource": "*", "action": "read"},
    {"id": "write", "name": "Write Access", "resource": "*", "action": "write"},
    {"id": "delete", "name": "Delete Access", "resource": "*", "action": "delete"},
    {"id": "manage_users", "name": "Manage Users", "resource": "users", "action": "manage"},
]

# Authentication dependency
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    """Extract and validate user from JWT token"""
    # In a real implementation, decode and validate the JWT token
    # For now, extract user info from token claims

    # Mock token validation - replace with actual JWT validation
    token = credentials.credentials

    # Extract email from token (in real app, decode JWT)
    # This is a simplified mock - implement proper JWT validation
    email = "heitorprodrigues@gmail.com"  # Mock for now

    user_data = next((u for u in MOCK_USERS if u["email"] == email), None)
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )

    return User(**user_data)

# API Routes
@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(status="healthy", service="operations-backoffice-bff")

@app.get("/api/users", response_model=List[User])
async def get_users(current_user: User = Depends(get_current_user)):
    """Get all users - Admin only"""
    if "admin" not in current_user.roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )

    return [User(**user) for user in MOCK_USERS]

@app.get("/api/permissions", response_model=List[Permission])
async def get_permissions(current_user: User = Depends(get_current_user)):
    """Get all available permissions - Admin only"""
    if "admin" not in current_user.roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )

    return [Permission(**perm) for perm in MOCK_PERMISSIONS]

@app.get("/api/users/{user_id}/permissions", response_model=List[Permission])
async def get_user_permissions(
    user_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get user permissions - Admin only"""
    if "admin" not in current_user.roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )

    user_data = next((u for u in MOCK_USERS if u["id"] == user_id), None)
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    user_permissions = [p for p in MOCK_PERMISSIONS if p["id"] in user_data["permissions"]]
    return [Permission(**perm) for perm in user_permissions]

@app.put("/api/users/{user_id}/permissions")
async def update_user_permissions(
    user_id: str,
    update: UserPermissionUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update user permissions - Admin only"""
    if "admin" not in current_user.roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )

    # Find user
    user_data = next((u for u in MOCK_USERS if u["id"] == user_id), None)
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Update permissions (in real app, save to database)
    user_data["permissions"] = update.permission_ids

    # Return updated user
    return User(**user_data)

@app.get("/api/me", response_model=User)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return current_user

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
