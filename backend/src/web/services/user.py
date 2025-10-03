from uuid import UUID

from src.domain.models import User
from src.domain.models.user import UserCreate, UserPublic, UserUpdate, UserWithPermissions
from src.domain.repositories import UserRepository, UserPermissionRepository


class UserService:
    def __init__(
        self, user_repository: UserRepository, user_permission_repository: UserPermissionRepository
    ):
        self.user_repository = user_repository
        self.user_permission_repository = user_permission_repository

    async def _parse_to_public(self, user: User) -> UserPublic:
        return UserPublic(**user.model_dump())

    async def _parse_to_public_with_permissions(self, user: User) -> UserWithPermissions:
        permissions = await self.user_permission_repository.get_user_permissions(user)
        permission_names = [p.name for p in permissions]

        return UserWithPermissions(**user.model_dump(), permissions=permission_names)

    async def create_user(self, user_create: UserCreate) -> UserPublic:
        user = await self.user_repository.create(user_create)
        return await self._parse_to_public(user)

    async def get_user(self, uuid: UUID) -> UserPublic:
        user = await self.user_repository.get(uuid)
        return await self._parse_to_public(user)

    async def get_user_with_permissions(self, uuid: UUID) -> UserWithPermissions:
        user = await self.user_repository.get(uuid)
        return await self._parse_to_public_with_permissions(user)

    async def get_user_by_google_id(self, google_id: str) -> UserPublic | None:
        user = await self.user_repository.get_by_google_id(google_id)
        if user:
            return await self._parse_to_public(user)
        return None

    async def get_user_by_email(self, email: str) -> UserPublic | None:
        user = await self.user_repository.get_by_email(email)
        if user:
            return await self._parse_to_public(user)
        return None

    async def update_user(self, uuid: UUID, user_update: UserUpdate) -> UserPublic:
        user = await self.user_repository.get(uuid)
        user = await self.user_repository.update(user, user_update)
        return await self._parse_to_public(user)

    async def delete_user(self, uuid: UUID) -> None:
        user = await self.user_repository.get(uuid)
        await self.user_repository.delete(user)

    async def list_users(self, skip: int = 0, limit: int = 100) -> list[UserPublic]:
        users = await self.user_repository.list_all(skip, limit)
        return [await self._parse_to_public(user) for user in users]

    async def get_admins(self) -> list[UserPublic]:
        admins = await self.user_repository.get_admins()
        return [await self._parse_to_public(admin) for admin in admins]

    async def check_user_has_permission(self, user_uuid: UUID, permission_name: str) -> bool:
        user = await self.user_repository.get(user_uuid)

        # Admin users have all permissions
        if user.is_admin:
            return True

        permissions = await self.user_permission_repository.get_user_permissions(user)
        return any(p.name == permission_name for p in permissions)

    async def get_user_permissions(self, user_uuid: UUID) -> list[str]:
        user = await self.user_repository.get(user_uuid)
        permissions = await self.user_permission_repository.get_user_permissions(user)
        return [p.name for p in permissions]
