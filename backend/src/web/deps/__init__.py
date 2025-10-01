from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.deps.db import get_db_session
from src.web.deps.services import get_user_service, get_permission_service
from src.web.services import UserService, PermissionService

SessionDep = Annotated[AsyncSession, Depends(get_db_session)]
UserServiceDep = Annotated[UserService, Depends(get_user_service)]
PermissionServiceDep = Annotated[PermissionService, Depends(get_permission_service)]
