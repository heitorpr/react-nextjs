import pytest
from sqlalchemy.exc import IntegrityError

from src.domain.models.permission import PermissionUpdate
from src.domain.repositories.exceptions import NoPermissionFound
from src.domain.repositories.permission import PermissionRepository


@pytest.mark.asyncio(loop_scope="session")
async def test_create_permission(db_session, permission_create):
    repository = PermissionRepository(session=db_session)

    permission = await repository.create(permission_create)

    assert permission.id is not None
    assert permission.name == permission_create.name
    assert permission.description == permission_create.description


@pytest.mark.asyncio(loop_scope="session")
async def test_get_permission(db_session, permission):
    repository = PermissionRepository(session=db_session)
    permission_from_db = await repository.get(permission_id=permission.id)
    assert permission_from_db == permission


@pytest.mark.asyncio(loop_scope="session")
async def test_get_permission_by_uuid(db_session, permission):
    repository = PermissionRepository(session=db_session)
    permission_from_db = await repository.get(permission_id=permission.uuid)
    assert permission_from_db == permission


@pytest.mark.asyncio(loop_scope="session")
async def test_get_permission_by_name(db_session, permission):
    repository = PermissionRepository(session=db_session)
    permission_from_db = await repository.get_by_name(permission.name)
    assert permission_from_db == permission


@pytest.mark.asyncio(loop_scope="session")
async def test_update_permission(db_session, permission):
    repository = PermissionRepository(session=db_session)
    permission_update = PermissionUpdate(name="new_permission", description="New description")

    updated_permission = await repository.update(permission, permission_update=permission_update)
    assert updated_permission.name == "new_permission"
    assert updated_permission.description == "New description"


@pytest.mark.asyncio(loop_scope="session")
async def test_delete_permission(db_session, permission):
    repository = PermissionRepository(session=db_session)
    await repository.delete(permission)

    with pytest.raises(NoPermissionFound):
        await repository.get(permission_id=permission.id)


@pytest.mark.asyncio(loop_scope="session")
async def test_create_permission_unique_name(db_session, permission_create):
    repository = PermissionRepository(session=db_session)

    await repository.create(permission_create)

    with pytest.raises(IntegrityError):
        await repository.create(permission_create)


@pytest.mark.asyncio(loop_scope="session")
async def test_list_all_permissions(db_session, permission_repository, permission_create):
    # Create multiple permissions
    permission2_create = permission_create.model_copy()
    permission2_create.name = "permission_2"

    permission3_create = permission_create.model_copy()
    permission3_create.name = "permission_3"

    await permission_repository.create(permission2_create)
    await permission_repository.create(permission3_create)

    permissions = await permission_repository.list_all(skip=0, limit=10)
    assert len(permissions) >= 2  # At least the 2 we created in this test
    permission_names = [p.name for p in permissions]
    assert "permission_2" in permission_names
    assert "permission_3" in permission_names


@pytest.mark.asyncio(loop_scope="session")
async def test_get_permission_not_found(db_session):
    repository = PermissionRepository(session=db_session)

    with pytest.raises(NoPermissionFound):
        await repository.get(permission_id=99999)


@pytest.mark.asyncio(loop_scope="session")
async def test_get_permission_by_name_not_found(db_session):
    repository = PermissionRepository(session=db_session)

    result = await repository.get_by_name("nonexistent_permission")
    assert result is None


@pytest.mark.asyncio(loop_scope="session")
async def test_update_permission_partial(db_session, permission):
    repository = PermissionRepository(session=db_session)
    permission_update = PermissionUpdate(name="updated_name")

    updated_permission = await repository.update(permission, permission_update=permission_update)
    assert updated_permission.name == "updated_name"
    assert updated_permission.description == permission.description  # Should remain unchanged
