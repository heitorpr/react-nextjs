import pytest
from sqlalchemy.exc import IntegrityError

from src.domain.models.user import UserUpdate
from src.domain.repositories.exceptions import NoUserFound
from src.domain.repositories.user import UserRepository


@pytest.mark.asyncio(loop_scope="session")
async def test_create_user(db_session, user_create):
    repository = UserRepository(session=db_session)

    user = await repository.create(user_create)

    assert user.id is not None
    assert user.email == user_create.email
    assert user.name == user_create.name
    assert user.google_id == user_create.google_id
    assert user.is_admin == user_create.is_admin
    assert user.is_active == user_create.is_active


@pytest.mark.asyncio(loop_scope="session")
async def test_get_user(db_session, user):
    repository = UserRepository(session=db_session)
    user_from_db = await repository.get(user_id=user.id)
    assert user_from_db == user


@pytest.mark.asyncio(loop_scope="session")
async def test_get_user_by_uuid(db_session, user):
    repository = UserRepository(session=db_session)
    user_from_db = await repository.get(user_id=user.uuid)
    assert user_from_db == user


@pytest.mark.asyncio(loop_scope="session")
async def test_get_user_by_google_id(db_session, user):
    repository = UserRepository(session=db_session)
    user_from_db = await repository.get_by_google_id(user.google_id)
    assert user_from_db == user


@pytest.mark.asyncio(loop_scope="session")
async def test_get_user_by_email(db_session, user):
    repository = UserRepository(session=db_session)
    user_from_db = await repository.get_by_email(user.email)
    assert user_from_db == user


@pytest.mark.asyncio(loop_scope="session")
async def test_update_user(db_session, user):
    repository = UserRepository(session=db_session)
    user_update = UserUpdate(name="New Name", is_admin=True)

    updated_user = await repository.update(user, user_update=user_update)
    assert updated_user.name == "New Name"
    assert updated_user.is_admin is True


@pytest.mark.asyncio(loop_scope="session")
async def test_delete_user(db_session, user):
    repository = UserRepository(session=db_session)
    await repository.delete(user)

    with pytest.raises(NoUserFound):
        await repository.get(user_id=user.id)


@pytest.mark.asyncio(loop_scope="session")
async def test_create_user_unique_email(db_session, user_create):
    repository = UserRepository(session=db_session)

    await repository.create(user_create)

    with pytest.raises(IntegrityError):
        await repository.create(user_create)


@pytest.mark.asyncio(loop_scope="session")
async def test_create_user_unique_google_id(db_session, user_create):
    repository = UserRepository(session=db_session)

    await repository.create(user_create)

    # Create another user with same google_id but different email
    user_create_2 = user_create.model_copy()
    user_create_2.email = "different@example.com"

    with pytest.raises(IntegrityError):
        await repository.create(user_create_2)


@pytest.mark.asyncio(loop_scope="session")
async def test_list_all_users(db_session, user_repository, user_create):
    # Create multiple users
    user2_create = user_create.model_copy()
    user2_create.email = "user2@example.com"
    user2_create.google_id = "google_id_2"

    user3_create = user_create.model_copy()
    user3_create.email = "user3@example.com"
    user3_create.google_id = "google_id_3"

    await user_repository.create(user2_create)
    await user_repository.create(user3_create)

    users = await user_repository.list_all(skip=0, limit=10)
    assert len(users) >= 2  # At least the 2 we created in this test
    user_emails = [user.email for user in users]
    assert "user2@example.com" in user_emails
    assert "user3@example.com" in user_emails


@pytest.mark.asyncio(loop_scope="session")
async def test_get_admins(db_session, user_repository, admin_user):
    admins = await user_repository.get_admins()
    assert len(admins) >= 1
    assert any(admin.is_admin for admin in admins)
    assert admin_user in admins


@pytest.mark.asyncio(loop_scope="session")
async def test_get_user_not_found(db_session):
    repository = UserRepository(session=db_session)

    with pytest.raises(NoUserFound):
        await repository.get(user_id=99999)


@pytest.mark.asyncio(loop_scope="session")
async def test_get_user_by_google_id_not_found(db_session):
    repository = UserRepository(session=db_session)

    result = await repository.get_by_google_id("nonexistent_google_id")
    assert result is None


@pytest.mark.asyncio(loop_scope="session")
async def test_get_user_by_email_not_found(db_session):
    repository = UserRepository(session=db_session)

    result = await repository.get_by_email("nonexistent@example.com")
    assert result is None
