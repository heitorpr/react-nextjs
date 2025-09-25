import pytest
from pydantic import PostgresDsn
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlmodel import SQLModel
from testcontainers.postgres import PostgresContainer

# ruff: noqa: F403
# sonarignore: python:S2208
from src.domain.models import *
from src.domain.models.hero import HeroCreate
from src.domain.models.team import TeamCreate
from src.domain.repositories import HeroRepository, TeamRepository

"""
This file contains fixtures that are shared across all tests.
"""

postgres = PostgresContainer("postgres:17.4-bookworm")


# --- Database fixtures ---


@pytest.fixture(scope="session", autouse=True)
def pg_container(request):
    postgres.start()

    def remove_container():
        postgres.stop()

    """
    Use finalizer to remove the container, yield fails if the test raises exception
    """
    request.addfinalizer(remove_container)

    return postgres


@pytest.fixture(scope="session")
def db_url(pg_container: PostgresContainer):
    return str(
        PostgresDsn.build(
            scheme="postgresql+asyncpg",
            username=pg_container.username,
            password=pg_container.password,
            host=pg_container.get_container_host_ip(),
            port=int(pg_container.get_exposed_port(pg_container.port)),
            path=pg_container.dbname,
        )
    )


@pytest.fixture(scope="session")
async def db_engine(db_url):
    engine = create_async_engine(str(db_url), echo=True)
    yield engine
    await engine.dispose()


@pytest.fixture(scope="session")
def session_local(db_engine):
    return async_sessionmaker(bind=db_engine, expire_on_commit=False)


@pytest.fixture(scope="function", autouse=True)
def override_db_dependency(session_local, mocker):
    mocker.patch("src.core.deps.db.AsyncSessionLocal", session_local)
    return mocker


@pytest.fixture(scope="session", autouse=True)
async def setup_database(db_engine):
    async with db_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    yield
    async with db_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.drop_all)


@pytest.fixture(scope="function")
async def db_session(session_local):
    async with session_local() as session:
        try:
            yield session
        finally:
            await session.rollback()
            await session.close()


# --- End database fixtures ---


# --- Domain fixtures ---


@pytest.fixture()
def hero_repository(db_session):
    return HeroRepository(session=db_session)


@pytest.fixture()
def team_repository(db_session):
    return TeamRepository(session=db_session)


@pytest.fixture()
def hero_create():
    return HeroCreate(
        name="Test Hero",
        secret_name="Test Secret Name",
        age=30,
    )


@pytest.fixture()
def team_create():
    return TeamCreate(
        name="Test Team",
        headquarters="Test Headquarters",
    )


@pytest.fixture()
async def hero(hero_repository, hero_create):
    return await hero_repository.create(hero_create)


@pytest.fixture()
async def team(team_repository, team_create):
    return await team_repository.create(team_create)


# --- End domain fixtures ---
