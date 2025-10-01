__all__ = ["app_router", "user_router", "permission_router"]

from .app import router as app_router
from .user import router as user_router
from .permission import router as permission_router
