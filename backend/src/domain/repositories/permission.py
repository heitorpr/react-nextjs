from uuid import UUID

from sqlalchemy.exc import NoResultFound
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from src.domain.models import Permission
from src.domain.models.permission import PermissionCreate, PermissionUpdate
from src.domain.repositories.exceptions import NoPermissionFound


class PermissionRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, permission_create: PermissionCreate) -> Permission:
        permission = Permission(**permission_create.model_dump(exclude_unset=True))

        self.session.add(permission)
        await self.session.flush()

        return permission

    async def get(self, permission_id: int | UUID) -> Permission:
        statement = select(Permission)

        if isinstance(permission_id, int):
            statement = statement.where(Permission.id == permission_id)
        else:
            statement = statement.where(Permission.uuid == permission_id)

        try:
            result = await self.session.execute(statement)
            return result.scalar_one()
        except NoResultFound as error:
            raise NoPermissionFound("Permission not found") from error

    async def get_by_name(self, name: str) -> Permission | None:
        statement = select(Permission).where(Permission.name == name)

        result = await self.session.execute(statement)
        return result.scalar_one_or_none()

    async def update(self, permission: Permission, permission_update: PermissionUpdate) -> Permission:
        for key, value in permission_update.model_dump(exclude_unset=True).items():
            setattr(permission, key, value)

        self.session.add(permission)
        await self.session.flush()
        return permission

    async def delete(self, permission: Permission) -> None:
        await self.session.delete(permission)
        await self.session.flush()

    async def list_all(self, skip: int = 0, limit: int = 100) -> list[Permission]:
        statement = select(Permission).offset(skip).limit(limit)

        result = await self.session.execute(statement)
        return list(result.scalars().all())
