from uuid import UUID

from sqlmodel import Field, SQLModel
from uuid6 import uuid7


class PermissionBase(SQLModel):
    name: str = Field(title="Permission name", unique=True, index=True)
    description: str = Field(title="Permission description")


class Permission(PermissionBase, table=True):
    id: int = Field(primary_key=True)
    uuid: UUID = Field(default_factory=uuid7, index=True, unique=True)


class PermissionCreate(PermissionBase):
    pass


class PermissionUpdate(SQLModel):
    name: str | None = Field(default=None, title="Permission name")
    description: str | None = Field(default=None, title="Permission description")


class PermissionPublic(PermissionBase):
    uuid: UUID = Field()
