from uuid import UUID

from sqlalchemy.exc import NoResultFound
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from src.domain.models import User
from src.domain.models.user import UserCreate, UserUpdate
from src.domain.repositories.exceptions import NoUserFound


class UserRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, user_create: UserCreate) -> User:
        user = User(**user_create.model_dump(exclude_unset=True))

        self.session.add(user)
        await self.session.flush()

        return user

    async def get(self, user_id: int | UUID) -> User:
        statement = select(User)

        if isinstance(user_id, int):
            statement = statement.where(User.id == user_id)
        else:
            statement = statement.where(User.uuid == user_id)

        try:
            result = await self.session.execute(statement)
            return result.scalar_one()
        except NoResultFound as error:
            raise NoUserFound("User not found") from error

    async def get_by_google_id(self, google_id: str) -> User | None:
        statement = select(User).where(User.google_id == google_id)

        result = await self.session.execute(statement)
        return result.scalar_one_or_none()

    async def get_by_email(self, email: str) -> User | None:
        statement = select(User).where(User.email == email)

        result = await self.session.execute(statement)
        return result.scalar_one_or_none()

    async def update(self, user: User, user_update: UserUpdate) -> User:
        for key, value in user_update.model_dump(exclude_unset=True).items():
            setattr(user, key, value)

        self.session.add(user)
        await self.session.flush()
        return user

    async def delete(self, user: User) -> None:
        await self.session.delete(user)
        await self.session.flush()

    async def list_all(self, skip: int = 0, limit: int = 100) -> list[User]:
        statement = select(User).offset(skip).limit(limit)

        result = await self.session.execute(statement)
        return list(result.scalars().all())

    async def get_admins(self) -> list[User]:
        statement = select(User).where(User.is_admin == True)  # noqa: E712

        result = await self.session.execute(statement)
        return list(result.scalars().all())
