from uuid import UUID

from sqlalchemy.exc import NoResultFound
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from src.domain.models import UserPermission, User, Permission
from src.domain.models.user_permission import UserPermissionCreate
from src.domain.repositories.exceptions import NoUserPermissionFound


class UserPermissionRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, user_permission_create: UserPermissionCreate, user: User, permission: Permission) -> UserPermission:
        user_permission = UserPermission(
            user_id=user.id,
            permission_id=permission.id
        )

        self.session.add(user_permission)
        await self.session.flush()

        return user_permission

    async def get(self, user_permission_id: int | UUID) -> UserPermission:
        statement = select(UserPermission)

        if isinstance(user_permission_id, int):
            statement = statement.where(UserPermission.id == user_permission_id)
        else:
            statement = statement.where(UserPermission.uuid == user_permission_id)

        try:
            result = await self.session.execute(statement)
            return result.scalar_one()
        except NoResultFound as error:
            raise NoUserPermissionFound("UserPermission not found") from error

    async def get_by_user_and_permission(self, user: User, permission: Permission) -> UserPermission | None:
        statement = select(UserPermission).where(
            UserPermission.user_id == user.id,
            UserPermission.permission_id == permission.id
        )

        result = await self.session.execute(statement)
        return result.scalar_one_or_none()

    async def delete(self, user_permission: UserPermission) -> None:
        await self.session.delete(user_permission)
        await self.session.flush()

    async def get_user_permissions(self, user: User) -> list[Permission]:
        statement = (
            select(Permission)
            .join(UserPermission, Permission.id == UserPermission.permission_id)
            .where(UserPermission.user_id == user.id)
        )

        result = await self.session.execute(statement)
        return list(result.scalars().all())

    async def get_permission_users(self, permission: Permission) -> list[User]:
        statement = (
            select(User)
            .join(UserPermission, User.id == UserPermission.user_id)
            .where(UserPermission.permission_id == permission.id)
        )

        result = await self.session.execute(statement)
        return list(result.scalars().all())

    async def delete_user_permission(self, user: User, permission: Permission) -> None:
        user_permission = await self.get_by_user_and_permission(user, permission)
        if user_permission:
            await self.delete(user_permission)
