import pytest

from src.domain.models.permission import PermissionPublic, PermissionUpdate
from src.domain.repositories.exceptions import NoPermissionFound, NoUserFound
from src.web.services.permission import PermissionService


@pytest.fixture()
def permission_service(permission_repository, user_repository, user_permission_repository):
    return PermissionService(
        permission_repository=permission_repository,
        user_repository=user_repository,
        user_permission_repository=user_permission_repository,
    )


@pytest.mark.asyncio(loop_scope="session")
async def test_create_permission(permission_service, permission_create):
    permission = await permission_service.create_permission(permission_create)

    assert isinstance(permission, PermissionPublic)
    assert permission.name == permission_create.name
    assert permission.description == permission_create.description


@pytest.mark.asyncio(loop_scope="session")
async def test_get_permission(permission_service, permission):
    found_permission = await permission_service.get_permission(permission.uuid)

    assert isinstance(found_permission, PermissionPublic)
    assert found_permission.name == permission.name
    assert found_permission.description == permission.description


@pytest.mark.asyncio(loop_scope="session")
async def test_get_permission_by_name(permission_service, permission):
    found_permission = await permission_service.get_permission_by_name(permission.name)

    assert isinstance(found_permission, PermissionPublic)
    assert found_permission.name == permission.name


@pytest.mark.asyncio(loop_scope="session")
async def test_get_permission_by_name_not_found(permission_service):
    found_permission = await permission_service.get_permission_by_name("nonexistent_permission")
    assert found_permission is None


@pytest.mark.asyncio(loop_scope="session")
async def test_update_permission(permission_service, permission):
    update_data = PermissionUpdate(name="updated_permission", description="Updated description")
    updated_permission = await permission_service.update_permission(permission.uuid, update_data)

    assert isinstance(updated_permission, PermissionPublic)
    assert updated_permission.name == "updated_permission"
    assert updated_permission.description == "Updated description"


@pytest.mark.asyncio(loop_scope="session")
async def test_delete_permission(permission_service, permission):
    await permission_service.delete_permission(permission.uuid)

    with pytest.raises(NoPermissionFound):
        await permission_service.get_permission(permission.uuid)


@pytest.mark.asyncio(loop_scope="session")
async def test_list_permissions(permission_service, permission_repository, permission_create):
    # Create additional permissions
    permission2_create = permission_create.model_copy()
    permission2_create.name = "permission_2"

    permission3_create = permission_create.model_copy()
    permission3_create.name = "permission_3"

    permission2 = await permission_repository.create(permission2_create)
    permission3 = await permission_repository.create(permission3_create)

    permissions = await permission_service.list_permissions(skip=0, limit=10)
    assert len(permissions) >= 2  # At least the 2 we created in this test
    assert all(isinstance(permission, PermissionPublic) for permission in permissions)
    permission_names = [p.name for p in permissions]
    assert "permission_2" in permission_names
    assert "permission_3" in permission_names


@pytest.mark.asyncio(loop_scope="session")
async def test_assign_permission_to_user(permission_service, user, permission):
    # Assign permission to user
    assigned = await permission_service.assign_permission_to_user(user.uuid, permission.uuid)
    assert assigned is True

    # Try to assign again - should return False (already exists)
    assigned = await permission_service.assign_permission_to_user(user.uuid, permission.uuid)
    assert assigned is False


@pytest.mark.asyncio(loop_scope="session")
async def test_revoke_permission_from_user(permission_service, user, permission):
    # First assign permission
    await permission_service.assign_permission_to_user(user.uuid, permission.uuid)

    # Now revoke it
    revoked = await permission_service.revoke_permission_from_user(user.uuid, permission.uuid)
    assert revoked is True

    # Try to revoke again - should return False (not found)
    revoked = await permission_service.revoke_permission_from_user(user.uuid, permission.uuid)
    assert revoked is False


@pytest.mark.asyncio(loop_scope="session")
async def test_get_permission_users(permission_service, user, permission):
    # Assign permission to user
    await permission_service.assign_permission_to_user(user.uuid, permission.uuid)

    # Get users with this permission
    user_uuids = await permission_service.get_permission_users(permission.uuid)
    assert len(user_uuids) == 1
    assert str(user.uuid) in user_uuids


@pytest.mark.asyncio(loop_scope="session")
async def test_assign_permission_to_nonexistent_user(permission_service, permission):
    from uuid6 import uuid7

    with pytest.raises(NoUserFound):
        await permission_service.assign_permission_to_user(uuid7(), permission.uuid)


@pytest.mark.asyncio(loop_scope="session")
async def test_assign_nonexistent_permission_to_user(permission_service, user):
    from uuid6 import uuid7

    with pytest.raises(NoPermissionFound):
        await permission_service.assign_permission_to_user(user.uuid, uuid7())


@pytest.mark.asyncio(loop_scope="session")
async def test_revoke_permission_from_nonexistent_user(permission_service, permission):
    from uuid6 import uuid7

    with pytest.raises(NoUserFound):
        await permission_service.revoke_permission_from_user(uuid7(), permission.uuid)


@pytest.mark.asyncio(loop_scope="session")
async def test_revoke_nonexistent_permission_from_user(permission_service, user):
    from uuid6 import uuid7

    with pytest.raises(NoPermissionFound):
        await permission_service.revoke_permission_from_user(user.uuid, uuid7())


@pytest.mark.asyncio(loop_scope="session")
async def test_get_permission_users_nonexistent_permission(permission_service):
    from uuid6 import uuid7

    with pytest.raises(NoPermissionFound):
        await permission_service.get_permission_users(uuid7())


@pytest.mark.asyncio(loop_scope="session")
async def test_multiple_users_with_same_permission(
    permission_service, user_repository, permission, user_create, user
):
    # Create additional user
    user2_create = user_create.model_copy()
    user2_create.email = "user2@example.com"
    user2_create.google_id = "google_id_2"
    user2 = await user_repository.create(user2_create)

    # Assign permission to both users
    await permission_service.assign_permission_to_user(user.uuid, permission.uuid)
    await permission_service.assign_permission_to_user(user2.uuid, permission.uuid)

    # Get users with this permission
    user_uuids = await permission_service.get_permission_users(permission.uuid)
    assert len(user_uuids) == 2
    assert str(user.uuid) in user_uuids
    assert str(user2.uuid) in user_uuids
