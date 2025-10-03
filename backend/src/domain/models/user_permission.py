from uuid import UUID

from sqlmodel import Field, SQLModel
from uuid6 import uuid7


class UserPermissionBase(SQLModel):
    user_id: int = Field(foreign_key="user.id", title="User ID")
    permission_id: int = Field(foreign_key="permission.id", title="Permission ID")


class UserPermission(UserPermissionBase, table=True):
    id: int = Field(primary_key=True)
    uuid: UUID = Field(default_factory=uuid7, index=True, unique=True)
    user_id: int = Field(foreign_key="user.id", title="User ID")
    permission_id: int = Field(foreign_key="permission.id", title="Permission ID")


class UserPermissionCreate(UserPermissionBase):
    pass


class UserPermissionPublic(SQLModel):
    uuid: UUID = Field()
    user_uuid: UUID = Field(title="User UUID")
    permission_uuid: UUID = Field(title="Permission UUID")
