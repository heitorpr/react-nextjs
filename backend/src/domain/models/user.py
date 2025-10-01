from uuid import UUID

from sqlmodel import Field, SQLModel
from uuid6 import uuid7


class UserBase(SQLModel):
    email: str = Field(title="User email", unique=True, index=True)
    name: str = Field(title="User full name")
    google_id: str = Field(title="Google OAuth ID", unique=True, index=True)
    is_admin: bool = Field(default=False, title="Admin status")
    is_active: bool = Field(default=True, title="User active status")


class User(UserBase, table=True):
    id: int = Field(primary_key=True)
    uuid: UUID = Field(default_factory=uuid7, index=True, unique=True)


class UserCreate(UserBase):
    pass


class UserUpdate(SQLModel):
    email: str | None = Field(default=None, title="User email")
    name: str | None = Field(default=None, title="User full name")
    is_admin: bool | None = Field(default=None, title="Admin status")
    is_active: bool | None = Field(default=None, title="User active status")


class UserPublic(UserBase):
    uuid: UUID = Field()


class UserWithPermissions(UserPublic):
    permissions: list[str] = Field(default_factory=list, description="List of permission names")
