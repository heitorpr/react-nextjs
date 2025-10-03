import pytest

from src.domain.models.user_permission import UserPermissionCreate
from src.domain.repositories.exceptions import NoUserPermissionFound
from src.domain.repositories.user_permission import UserPermissionRepository


@pytest.mark.asyncio(loop_scope="session")
async def test_create_user_permission(db_session, user, permission):
    repository = UserPermissionRepository(session=db_session)
    user_permission_create = UserPermissionCreate(user_id=user.id, permission_id=permission.id)

    user_permission = await repository.create(user_permission_create)

    assert user_permission.id is not None
    assert user_permission.user_id == user.id
    assert user_permission.permission_id == permission.id


@pytest.mark.asyncio(loop_scope="session")
async def test_get_user_permission(db_session, user, permission):
    repository = UserPermissionRepository(session=db_session)
    user_permission_create = UserPermissionCreate(user_id=user.id, permission_id=permission.id)
    user_permission = await repository.create(user_permission_create)

    user_permission_from_db = await repository.get(user_permission_id=user_permission.id)
    assert user_permission_from_db == user_permission


@pytest.mark.asyncio(loop_scope="session")
async def test_get_user_permission_by_uuid(db_session, user, permission):
    repository = UserPermissionRepository(session=db_session)
    user_permission_create = UserPermissionCreate(user_id=user.id, permission_id=permission.id)
    user_permission = await repository.create(user_permission_create)

    user_permission_from_db = await repository.get(user_permission_id=user_permission.uuid)
    assert user_permission_from_db == user_permission


@pytest.mark.asyncio(loop_scope="session")
async def test_get_by_user_and_permission(db_session, user, permission):
    repository = UserPermissionRepository(session=db_session)
    user_permission_create = UserPermissionCreate(user_id=user.id, permission_id=permission.id)
    await repository.create(user_permission_create)

    user_permission = await repository.get_by_user_and_permission(user, permission)
    assert user_permission is not None
    assert user_permission.user_id == user.id
    assert user_permission.permission_id == permission.id


@pytest.mark.asyncio(loop_scope="session")
async def test_get_by_user_and_permission_not_found(db_session, user, permission):
    repository = UserPermissionRepository(session=db_session)

    user_permission = await repository.get_by_user_and_permission(user, permission)
    assert user_permission is None


@pytest.mark.asyncio(loop_scope="session")
async def test_delete_user_permission(db_session, user, permission):
    repository = UserPermissionRepository(session=db_session)
    user_permission_create = UserPermissionCreate(user_id=user.id, permission_id=permission.id)
    user_permission = await repository.create(user_permission_create)

    await repository.delete(user_permission)

    with pytest.raises(NoUserPermissionFound):
        await repository.get(user_permission_id=user_permission.id)


@pytest.mark.asyncio(loop_scope="session")
async def test_get_user_permissions(db_session, user, permission):
    repository = UserPermissionRepository(session=db_session)
    user_permission_create = UserPermissionCreate(user_id=user.id, permission_id=permission.id)
    await repository.create(user_permission_create)

    permissions = await repository.get_user_permissions(user)
    assert len(permissions) == 1
    assert permissions[0] == permission


@pytest.mark.asyncio(loop_scope="session")
async def test_get_permission_users(db_session, user, permission):
    repository = UserPermissionRepository(session=db_session)
    user_permission_create = UserPermissionCreate(user_id=user.id, permission_id=permission.id)
    await repository.create(user_permission_create)

    users = await repository.get_permission_users(permission)
    assert len(users) == 1
    assert users[0] == user


@pytest.mark.asyncio(loop_scope="session")
async def test_delete_user_permission_by_user_and_permission(db_session, user, permission):
    repository = UserPermissionRepository(session=db_session)
    user_permission_create = UserPermissionCreate(user_id=user.id, permission_id=permission.id)
    await repository.create(user_permission_create)

    # Verify it exists
    user_permission = await repository.get_by_user_and_permission(user, permission)
    assert user_permission is not None

    # Delete it
    await repository.delete_user_permission(user, permission)

    # Verify it's gone
    user_permission = await repository.get_by_user_and_permission(user, permission)
    assert user_permission is None


@pytest.mark.asyncio(loop_scope="session")
async def test_get_user_permission_not_found(db_session):
    repository = UserPermissionRepository(session=db_session)

    with pytest.raises(NoUserPermissionFound):
        await repository.get(user_permission_id=99999)


@pytest.mark.asyncio(loop_scope="session")
async def test_multiple_permissions_for_user(
    db_session, user, permission_repository, permission_create, permission
):
    repository = UserPermissionRepository(session=db_session)

    # Create additional permissions
    permission2_create = permission_create.model_copy()
    permission2_create.name = "permission_2"
    permission2 = await permission_repository.create(permission2_create)

    permission3_create = permission_create.model_copy()
    permission3_create.name = "permission_3"
    permission3 = await permission_repository.create(permission3_create)

    # Assign all permissions to user
    user_permission1_create = UserPermissionCreate(user_id=user.id, permission_id=permission.id)
    user_permission2_create = UserPermissionCreate(user_id=user.id, permission_id=permission2.id)
    user_permission3_create = UserPermissionCreate(user_id=user.id, permission_id=permission3.id)

    await repository.create(user_permission1_create)
    await repository.create(user_permission2_create)
    await repository.create(user_permission3_create)

    # Get all permissions for user
    permissions = await repository.get_user_permissions(user)
    assert len(permissions) == 3
    permission_names = [p.name for p in permissions]
    assert "test_permission" in permission_names
    assert "permission_2" in permission_names
    assert "permission_3" in permission_names
