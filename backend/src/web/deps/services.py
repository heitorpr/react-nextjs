from fastapi import Depends

from src.domain.repositories import UserRepository, PermissionRepository, UserPermissionRepository
from src.web.deps.repositories import (
    get_user_repository,
    get_permission_repository,
    get_user_permission_repository,
)
from src.web.services import UserService, PermissionService


def get_user_service(
    user_repository: UserRepository = Depends(get_user_repository),
    user_permission_repository: UserPermissionRepository = Depends(get_user_permission_repository),
) -> UserService:
    return UserService(
        user_repository=user_repository, user_permission_repository=user_permission_repository
    )


def get_permission_service(
    permission_repository: PermissionRepository = Depends(get_permission_repository),
    user_repository: UserRepository = Depends(get_user_repository),
    user_permission_repository: UserPermissionRepository = Depends(get_user_permission_repository),
) -> PermissionService:
    return PermissionService(
        permission_repository=permission_repository,
        user_repository=user_repository,
        user_permission_repository=user_permission_repository,
    )
