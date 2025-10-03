from uuid import UUID

from src.domain.models import Permission
from src.domain.models.permission import PermissionCreate, PermissionPublic, PermissionUpdate
from src.domain.models.user_permission import UserPermissionCreate
from src.domain.repositories import PermissionRepository, UserRepository, UserPermissionRepository


class PermissionService:
    def __init__(
        self,
        permission_repository: PermissionRepository,
        user_repository: UserRepository,
        user_permission_repository: UserPermissionRepository,
    ):
        self.permission_repository = permission_repository
        self.user_repository = user_repository
        self.user_permission_repository = user_permission_repository

    async def _parse_to_public(self, permission: Permission) -> PermissionPublic:
        return PermissionPublic(**permission.model_dump())

    async def create_permission(self, permission_create: PermissionCreate) -> PermissionPublic:
        permission = await self.permission_repository.create(permission_create)
        return await self._parse_to_public(permission)

    async def get_permission(self, uuid: UUID) -> PermissionPublic:
        permission = await self.permission_repository.get(uuid)
        return await self._parse_to_public(permission)

    async def get_permission_by_name(self, name: str) -> PermissionPublic | None:
        permission = await self.permission_repository.get_by_name(name)
        if permission:
            return await self._parse_to_public(permission)
        return None

    async def update_permission(
        self, uuid: UUID, permission_update: PermissionUpdate
    ) -> PermissionPublic:
        permission = await self.permission_repository.get(uuid)
        permission = await self.permission_repository.update(permission, permission_update)
        return await self._parse_to_public(permission)

    async def delete_permission(self, uuid: UUID) -> None:
        permission = await self.permission_repository.get(uuid)
        await self.permission_repository.delete(permission)

    async def list_permissions(self, skip: int = 0, limit: int = 100) -> list[PermissionPublic]:
        permissions = await self.permission_repository.list_all(skip, limit)
        return [await self._parse_to_public(permission) for permission in permissions]

    async def assign_permission_to_user(self, user_uuid: UUID, permission_uuid: UUID) -> bool:
        """Assign a permission to a user. Returns True if assigned, False if already exists."""
        user = await self.user_repository.get(user_uuid)
        permission = await self.permission_repository.get(permission_uuid)

        # Check if already assigned
        existing = await self.user_permission_repository.get_by_user_and_permission(
            user, permission
        )
        if existing:
            return False

        await self.user_permission_repository.create(
            UserPermissionCreate(user_uuid=user_uuid, permission_uuid=permission_uuid),
            user,
            permission,
        )
        return True

    async def revoke_permission_from_user(self, user_uuid: UUID, permission_uuid: UUID) -> bool:
        """Revoke a permission from a user. Returns True if revoked, False if not found."""
        user = await self.user_repository.get(user_uuid)
        permission = await self.permission_repository.get(permission_uuid)

        existing = await self.user_permission_repository.get_by_user_and_permission(
            user, permission
        )
        if not existing:
            return False

        await self.user_permission_repository.delete_user_permission(user, permission)
        return True

    async def get_permission_users(self, permission_uuid: UUID) -> list[str]:
        """Get list of user UUIDs that have this permission."""
        permission = await self.permission_repository.get(permission_uuid)
        users = await self.user_permission_repository.get_permission_users(permission)
        return [str(user.uuid) for user in users]
