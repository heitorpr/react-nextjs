from fastapi import APIRouter

from .routes import app_router, user_router, permission_router

api_router = APIRouter()
api_router.include_router(app_router, tags=["app"])
api_router.include_router(user_router, prefix="/users", tags=["users"])
api_router.include_router(permission_router, prefix="/permissions", tags=["permissions"])
