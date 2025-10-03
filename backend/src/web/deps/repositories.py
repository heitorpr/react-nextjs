from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.deps.db import get_db_session
from src.domain.repositories import UserRepository, PermissionRepository, UserPermissionRepository


def get_user_repository(db: AsyncSession = Depends(get_db_session)) -> UserRepository:
    return UserRepository(db)


def get_permission_repository(db: AsyncSession = Depends(get_db_session)) -> PermissionRepository:
    return PermissionRepository(db)


def get_user_permission_repository(
    db: AsyncSession = Depends(get_db_session),
) -> UserPermissionRepository:
    return UserPermissionRepository(db)
