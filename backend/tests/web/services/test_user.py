import pytest

from src.domain.models.user import UserPublic, UserUpdate
from src.domain.repositories.exceptions import NoUserFound
from src.web.services.user import UserService


@pytest.fixture()
def user_service(user_repository, user_permission_repository):
    return UserService(
        user_repository=user_repository, user_permission_repository=user_permission_repository
    )


@pytest.mark.asyncio(loop_scope="session")
async def test_create_user(user_service, user_create):
    user = await user_service.create_user(user_create)

    assert isinstance(user, UserPublic)
    assert user.email == user_create.email
    assert user.name == user_create.name
    assert user.google_id == user_create.google_id
    assert user.is_admin == user_create.is_admin
    assert user.is_active == user_create.is_active


@pytest.mark.asyncio(loop_scope="session")
async def test_get_user(user_service, user):
    found_user = await user_service.get_user(user.uuid)

    assert isinstance(found_user, UserPublic)
    assert found_user.email == user.email
    assert found_user.name == user.name
    assert found_user.google_id == user.google_id


@pytest.mark.asyncio(loop_scope="session")
async def test_get_user_with_permissions(
    user_service, user, permission, user_permission_repository
):
    # Assign permission to user
    from src.domain.models.user_permission import UserPermissionCreate

    await user_permission_repository.create(
        UserPermissionCreate(user_uuid=user.uuid, permission_uuid=permission.uuid),
        user,
        permission,
    )

    user_with_permissions = await user_service.get_user_with_permissions(user.uuid)

    assert isinstance(user_with_permissions, UserPublic)
    assert user_with_permissions.email == user.email
    assert len(user_with_permissions.permissions) == 1
    assert permission.name in user_with_permissions.permissions


@pytest.mark.asyncio(loop_scope="session")
async def test_get_user_by_google_id(user_service, user):
    found_user = await user_service.get_user_by_google_id(user.google_id)

    assert isinstance(found_user, UserPublic)
    assert found_user.google_id == user.google_id


@pytest.mark.asyncio(loop_scope="session")
async def test_get_user_by_google_id_not_found(user_service):
    found_user = await user_service.get_user_by_google_id("nonexistent_google_id")
    assert found_user is None


@pytest.mark.asyncio(loop_scope="session")
async def test_get_user_by_email(user_service, user):
    found_user = await user_service.get_user_by_email(user.email)

    assert isinstance(found_user, UserPublic)
    assert found_user.email == user.email


@pytest.mark.asyncio(loop_scope="session")
async def test_get_user_by_email_not_found(user_service):
    found_user = await user_service.get_user_by_email("nonexistent@example.com")
    assert found_user is None


@pytest.mark.asyncio(loop_scope="session")
async def test_update_user(user_service, user):
    update_data = UserUpdate(name="Updated Name", is_admin=True)
    updated_user = await user_service.update_user(user.uuid, update_data)

    assert isinstance(updated_user, UserPublic)
    assert updated_user.name == "Updated Name"
    assert updated_user.is_admin is True
    assert updated_user.email == user.email  # Should remain unchanged


@pytest.mark.asyncio(loop_scope="session")
async def test_delete_user(user_service, user):
    await user_service.delete_user(user.uuid)

    with pytest.raises(NoUserFound):
        await user_service.get_user(user.uuid)


@pytest.mark.asyncio(loop_scope="session")
async def test_list_users(user_service, user_repository, user_create):
    # Create additional users
    user2_create = user_create.model_copy()
    user2_create.email = "user2@example.com"
    user2_create.google_id = "google_id_2"

    user3_create = user_create.model_copy()
    user3_create.email = "user3@example.com"
    user3_create.google_id = "google_id_3"

    user2 = await user_repository.create(user2_create)
    user3 = await user_repository.create(user3_create)

    users = await user_service.list_users(skip=0, limit=10)
    assert len(users) >= 2  # At least the 2 we created in this test
    assert all(isinstance(user, UserPublic) for user in users)
    user_emails = [user.email for user in users]
    assert "user2@example.com" in user_emails
    assert "user3@example.com" in user_emails


@pytest.mark.asyncio(loop_scope="session")
async def test_get_admins(user_service, admin_user):
    admins = await user_service.get_admins()
    assert len(admins) >= 1
    assert all(isinstance(admin, UserPublic) for admin in admins)
    assert all(admin.is_admin for admin in admins)


@pytest.mark.asyncio(loop_scope="session")
async def test_check_user_has_permission_admin(user_service, admin_user, permission):
    # Admin users should have all permissions
    has_permission = await user_service.check_user_has_permission(admin_user.uuid, permission.name)
    assert has_permission is True

    # Even for non-existent permissions
    has_permission = await user_service.check_user_has_permission(
        admin_user.uuid, "nonexistent_permission"
    )
    assert has_permission is True


@pytest.mark.asyncio(loop_scope="session")
async def test_check_user_has_permission_regular_user(
    user_service, user, permission, user_permission_repository
):
    # Regular user without permission
    has_permission = await user_service.check_user_has_permission(user.uuid, permission.name)
    assert has_permission is False

    # Assign permission to user
    from src.domain.models.user_permission import UserPermissionCreate

    await user_permission_repository.create(
        UserPermissionCreate(user_uuid=user.uuid, permission_uuid=permission.uuid),
        user,
        permission,
    )

    # Now user should have permission
    has_permission = await user_service.check_user_has_permission(user.uuid, permission.name)
    assert has_permission is True


@pytest.mark.asyncio(loop_scope="session")
async def test_get_user_permissions(user_service, user, permission, user_permission_repository):
    # User without permissions
    permissions = await user_service.get_user_permissions(user.uuid)
    assert permissions == []

    # Assign permission to user
    from src.domain.models.user_permission import UserPermissionCreate

    await user_permission_repository.create(
        UserPermissionCreate(user_uuid=user.uuid, permission_uuid=permission.uuid),
        user,
        permission,
    )

    # Now user should have permission
    permissions = await user_service.get_user_permissions(user.uuid)
    assert len(permissions) == 1
    assert permission.name in permissions
