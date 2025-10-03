import pytest
from fastapi import status
from uuid6 import uuid7

from src.domain.models.user import UserPublic, UserUpdate
from src.domain.repositories.exceptions import NoUserFound
from src.web.deps.services import get_user_service
from src.web.main import app
from src.web.services import UserService


@pytest.mark.asyncio(loop_scope="session")
async def test_create_user(client, user_create, auth_headers):
    body = user_create.model_dump(mode="json")
    response = await client.post("/api/users/", json=body, headers=auth_headers("POST", body))
    assert response.status_code == status.HTTP_201_CREATED

    user = UserPublic(**response.json())

    assert user.uuid
    assert user.email == user_create.email
    assert user.name == user_create.name
    assert user.google_id == user_create.google_id
    assert user.is_admin == user_create.is_admin
    assert user.is_active == user_create.is_active


@pytest.mark.asyncio(loop_scope="session")
async def test_get_user(client, user, auth_headers):
    response = await client.get(f"/api/users/{user.uuid}", headers=auth_headers("GET", {}))
    assert response.status_code == status.HTTP_200_OK

    user_from_response = UserPublic(**response.json())

    assert user_from_response.uuid == user.uuid
    assert user_from_response.email == user.email
    assert user_from_response.name == user.name
    assert user_from_response.google_id == user.google_id


@pytest.mark.asyncio(loop_scope="session")
async def test_get_user_with_permissions(
    client, user, permission, user_permission_repository, auth_headers
):
    # Assign permission to user
    from src.domain.models.user_permission import UserPermissionCreate

    await user_permission_repository.create(
        UserPermissionCreate(user_id=user.id, permission_id=permission.id)
    )

    response = await client.get(
        f"/api/users/{user.uuid}/permissions", headers=auth_headers("GET", {})
    )
    assert response.status_code == status.HTTP_200_OK

    user_data = response.json()
    assert user_data["uuid"] == str(user.uuid)
    assert user_data["email"] == user.email
    assert len(user_data["permissions"]) == 1
    assert permission.name in user_data["permissions"]


@pytest.mark.asyncio(loop_scope="session")
async def test_get_user_by_google_id(client, user, auth_headers):
    response = await client.get(
        f"/api/users/google/{user.google_id}", headers=auth_headers("GET", {})
    )
    assert response.status_code == status.HTTP_200_OK

    user_from_response = UserPublic(**response.json())
    assert user_from_response.google_id == user.google_id


@pytest.mark.asyncio(loop_scope="session")
async def test_get_user_by_google_id_not_found(client, auth_headers):
    response = await client.get(
        "/api/users/google/nonexistent_google_id", headers=auth_headers("GET", {})
    )
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json() == {"detail": "User not found"}


@pytest.mark.asyncio(loop_scope="session")
async def test_get_user_by_email(client, user, auth_headers):
    response = await client.get(f"/api/users/email/{user.email}", headers=auth_headers("GET", {}))
    assert response.status_code == status.HTTP_200_OK

    user_from_response = UserPublic(**response.json())
    assert user_from_response.email == user.email


@pytest.mark.asyncio(loop_scope="session")
async def test_get_user_by_email_not_found(client, auth_headers):
    response = await client.get(
        "/api/users/email/nonexistent@example.com", headers=auth_headers("GET", {})
    )
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json() == {"detail": "User not found"}


@pytest.mark.asyncio(loop_scope="session")
async def test_update_user(client, user, auth_headers):
    user_update = UserUpdate(name="Updated Name", is_admin=True)

    body = user_update.model_dump(mode="json", exclude_unset=True)
    response = await client.put(
        f"/api/users/{user.uuid}", json=body, headers=auth_headers("PUT", body)
    )
    assert response.status_code == status.HTTP_200_OK

    user_from_response = UserPublic(**response.json())

    assert user_from_response.name == "Updated Name"
    assert user_from_response.is_admin is True
    assert user_from_response.email == user.email  # Should remain unchanged


@pytest.mark.asyncio(loop_scope="session")
async def test_delete_user(client, user, auth_headers):
    response = await client.delete(f"/api/users/{user.uuid}", headers=auth_headers("DELETE", {}))
    assert response.status_code == status.HTTP_204_NO_CONTENT

    response = await client.get(f"/api/users/{user.uuid}", headers=auth_headers("GET", {}))
    assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.asyncio(loop_scope="session")
async def test_list_users(client, user_repository, user_create, auth_headers):
    # Create additional users
    user2_create = user_create.model_copy()
    user2_create.email = "user2@example.com"
    user2_create.google_id = "google_id_2"

    user3_create = user_create.model_copy()
    user3_create.email = "user3@example.com"
    user3_create.google_id = "google_id_3"

    await user_repository.create(user2_create)
    await user_repository.create(user3_create)

    response = await client.get("/api/users/", headers=auth_headers("GET", {}))
    assert response.status_code == status.HTTP_200_OK

    users = response.json()
    assert len(users) >= 2  # At least the 2 we created in this test
    assert all("uuid" in user for user in users)
    assert all("email" in user for user in users)
    user_emails = [user["email"] for user in users]
    assert "user2@example.com" in user_emails
    assert "user3@example.com" in user_emails


@pytest.mark.asyncio(loop_scope="session")
async def test_list_admin_users(client, admin_user, auth_headers):
    response = await client.get("/api/users/admins/all", headers=auth_headers("GET", {}))
    assert response.status_code == status.HTTP_200_OK

    admins = response.json()
    assert len(admins) >= 1
    assert all(admin["is_admin"] for admin in admins)


@pytest.mark.asyncio(loop_scope="session")
async def test_check_user_permission(
    client, user, permission, user_permission_repository, auth_headers
):
    # User without permission
    response = await client.get(
        f"/api/users/{user.uuid}/has-permission/{permission.name}", headers=auth_headers("GET", {})
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"has_permission": False}

    # Assign permission to user
    from src.domain.models.user_permission import UserPermissionCreate

    await user_permission_repository.create(
        UserPermissionCreate(user_id=user.id, permission_id=permission.id)
    )

    # Now user should have permission
    response = await client.get(
        f"/api/users/{user.uuid}/has-permission/{permission.name}", headers=auth_headers("GET", {})
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"has_permission": True}


@pytest.mark.asyncio(loop_scope="session")
async def test_check_admin_user_permission(client, admin_user, auth_headers):
    # Admin users should have all permissions
    response = await client.get(
        f"/api/users/{admin_user.uuid}/has-permission/nonexistent_permission",
        headers=auth_headers("GET", {}),
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"has_permission": True}


@pytest.mark.asyncio(loop_scope="session")
async def test_get_user_permissions_list(
    client, user, permission, user_permission_repository, auth_headers
):
    # User without permissions - this endpoint returns user with permissions,
    # not just permissions list
    response = await client.get(
        f"/api/users/{user.uuid}/permissions", headers=auth_headers("GET", {})
    )
    assert response.status_code == status.HTTP_200_OK
    user_data = response.json()
    assert user_data["uuid"] == str(user.uuid)
    assert user_data["permissions"] == []

    # Assign permission to user
    from src.domain.models.user_permission import UserPermissionCreate

    await user_permission_repository.create(
        UserPermissionCreate(user_id=user.id, permission_id=permission.id)
    )

    # Now user should have permission
    response = await client.get(
        f"/api/users/{user.uuid}/permissions", headers=auth_headers("GET", {})
    )
    assert response.status_code == status.HTTP_200_OK
    user_data = response.json()
    assert user_data["uuid"] == str(user.uuid)
    assert user_data["permissions"] == [permission.name]


# Error handling tests


@pytest.mark.asyncio(loop_scope="session")
async def test_get_user_not_found(client, auth_headers, mocker):
    service_mock = mocker.MagicMock(UserService)
    service_mock.get_user.side_effect = NoUserFound("User not found")

    def _override():
        return service_mock

    app.dependency_overrides[get_user_service] = _override

    response = await client.get(f"/api/users/{uuid7()}", headers=auth_headers("GET", {}))
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json() == {"detail": "User not found"}

    app.dependency_overrides.clear()


@pytest.mark.asyncio(loop_scope="session")
async def test_create_user_integrity_error(client, user_create, auth_headers):
    # First create a user
    body = user_create.model_dump(mode="json")
    response = await client.post("/api/users/", json=body, headers=auth_headers("POST", body))
    assert response.status_code == status.HTTP_201_CREATED

    # Try to create the same user again (same email)
    response = await client.post("/api/users/", json=body, headers=auth_headers("POST", body))
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json() == {"detail": "User already exists"}


@pytest.mark.asyncio(loop_scope="session")
async def test_update_user_not_found(client, auth_headers, mocker):
    service_mock = mocker.MagicMock(UserService)
    service_mock.update_user.side_effect = NoUserFound("User not found")

    def _override():
        return service_mock

    app.dependency_overrides[get_user_service] = _override

    user_update = UserUpdate(name="Updated Name")
    body = user_update.model_dump(mode="json", exclude_unset=True)

    response = await client.put(
        f"/api/users/{uuid7()}", json=body, headers=auth_headers("PUT", body)
    )
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json() == {"detail": "User not found"}

    app.dependency_overrides.clear()


@pytest.mark.asyncio(loop_scope="session")
async def test_delete_user_not_found(client, auth_headers, mocker):
    service_mock = mocker.MagicMock(UserService)
    service_mock.delete_user.side_effect = NoUserFound("User not found")

    def _override():
        return service_mock

    app.dependency_overrides[get_user_service] = _override

    response = await client.delete(f"/api/users/{uuid7()}", headers=auth_headers("DELETE", {}))
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json() == {"detail": "User not found"}

    app.dependency_overrides.clear()


@pytest.mark.asyncio(loop_scope="session")
async def test_check_user_permission_not_found(client, auth_headers, mocker):
    service_mock = mocker.MagicMock(UserService)
    service_mock.check_user_has_permission.side_effect = NoUserFound("User not found")

    def _override():
        return service_mock

    app.dependency_overrides[get_user_service] = _override

    response = await client.get(
        f"/api/users/{uuid7()}/has-permission/test_permission", headers=auth_headers("GET", {})
    )
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json() == {"detail": "User not found"}

    app.dependency_overrides.clear()
