import pytest
from fastapi import status
from uuid6 import uuid7

from src.domain.models.permission import PermissionPublic, PermissionUpdate
from src.domain.repositories.exceptions import NoPermissionFound, NoUserFound
from src.web.deps import PermissionServiceDep
from src.web.main import app
from src.web.services import PermissionService


@pytest.mark.asyncio(loop_scope="session")
async def test_create_permission(client, permission_create, auth_headers):
    body = permission_create.model_dump(mode="json")
    response = await client.post(
        "/api/permissions/", json=body, headers=auth_headers("POST", body)
    )
    assert response.status_code == status.HTTP_201_CREATED

    permission = PermissionPublic(**response.json())

    assert permission.uuid
    assert permission.name == permission_create.name
    assert permission.description == permission_create.description


@pytest.mark.asyncio(loop_scope="session")
async def test_get_permission(client, permission, auth_headers):
    response = await client.get(
        f"/api/permissions/{permission.uuid}", headers=auth_headers("GET", {})
    )
    assert response.status_code == status.HTTP_200_OK

    permission_from_response = PermissionPublic(**response.json())

    assert permission_from_response.uuid == permission.uuid
    assert permission_from_response.name == permission.name
    assert permission_from_response.description == permission.description


@pytest.mark.asyncio(loop_scope="session")
async def test_get_permission_by_name(client, permission, auth_headers):
    response = await client.get(
        f"/api/permissions/name/{permission.name}", headers=auth_headers("GET", {})
    )
    assert response.status_code == status.HTTP_200_OK

    permission_from_response = PermissionPublic(**response.json())
    assert permission_from_response.name == permission.name


@pytest.mark.asyncio(loop_scope="session")
async def test_get_permission_by_name_not_found(client, auth_headers):
    response = await client.get(
        "/api/permissions/name/nonexistent_permission", headers=auth_headers("GET", {})
    )
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json() == {"detail": "Permission not found"}


@pytest.mark.asyncio(loop_scope="session")
async def test_update_permission(client, permission, auth_headers):
    permission_update = PermissionUpdate(
        name="updated_permission", description="Updated description"
    )

    body = permission_update.model_dump(mode="json", exclude_unset=True)
    response = await client.put(
        f"/api/permissions/{permission.uuid}", json=body, headers=auth_headers("PUT", body)
    )
    assert response.status_code == status.HTTP_200_OK

    permission_from_response = PermissionPublic(**response.json())

    assert permission_from_response.name == "updated_permission"
    assert permission_from_response.description == "Updated description"


@pytest.mark.asyncio(loop_scope="session")
async def test_delete_permission(client, permission, auth_headers):
    response = await client.delete(
        f"/api/permissions/{permission.uuid}", headers=auth_headers("DELETE", {})
    )
    assert response.status_code == status.HTTP_204_NO_CONTENT

    response = await client.get(
        f"/api/permissions/{permission.uuid}", headers=auth_headers("GET", {})
    )
    assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.asyncio(loop_scope="session")
async def test_list_permissions(client, permission_repository, permission_create, auth_headers):
    # Create additional permissions
    permission2_create = permission_create.model_copy()
    permission2_create.name = "permission_2"

    permission3_create = permission_create.model_copy()
    permission3_create.name = "permission_3"

    permission2 = await permission_repository.create(permission2_create)
    permission3 = await permission_repository.create(permission3_create)

    response = await client.get("/api/permissions/", headers=auth_headers("GET", {}))
    assert response.status_code == status.HTTP_200_OK

    permissions = response.json()
    assert len(permissions) >= 2  # At least the 2 we created in this test
    assert all("uuid" in permission for permission in permissions)
    assert all("name" in permission for permission in permissions)
    permission_names = [p["name"] for p in permissions]
    assert "permission_2" in permission_names
    assert "permission_3" in permission_names


@pytest.mark.asyncio(loop_scope="session")
async def test_assign_permission_to_user(client, user, permission, auth_headers):
    response = await client.post(
        f"/api/permissions/assign/{user.uuid}/{permission.uuid}", headers=auth_headers("POST", {})
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"message": "Permission assigned successfully"}

    # Try to assign again - should return already assigned message
    response = await client.post(
        f"/api/permissions/assign/{user.uuid}/{permission.uuid}", headers=auth_headers("POST", {})
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"message": "Permission already assigned to user"}


@pytest.mark.asyncio(loop_scope="session")
async def test_revoke_permission_from_user(client, user, permission, auth_headers):
    # First assign permission
    await client.post(
        f"/api/permissions/assign/{user.uuid}/{permission.uuid}", headers=auth_headers("POST", {})
    )

    # Now revoke it
    response = await client.delete(
        f"/api/permissions/revoke/{user.uuid}/{permission.uuid}",
        headers=auth_headers("DELETE", {}),
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"message": "Permission revoked successfully"}

    # Try to revoke again - should return not assigned message
    response = await client.delete(
        f"/api/permissions/revoke/{user.uuid}/{permission.uuid}",
        headers=auth_headers("DELETE", {}),
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"message": "Permission was not assigned to user"}


@pytest.mark.asyncio(loop_scope="session")
async def test_get_permission_users(client, user, permission, auth_headers):
    # Assign permission to user
    await client.post(
        f"/api/permissions/assign/{user.uuid}/{permission.uuid}", headers=auth_headers("POST", {})
    )

    # Get users with this permission
    response = await client.get(
        f"/api/permissions/{permission.uuid}/users", headers=auth_headers("GET", {})
    )
    assert response.status_code == status.HTTP_200_OK

    users_data = response.json()
    assert len(users_data["users"]) == 1
    assert str(user.uuid) in users_data["users"]


# Error handling tests


@pytest.mark.asyncio(loop_scope="session")
async def test_get_permission_not_found(client, auth_headers, mocker):
    service_mock = mocker.MagicMock(PermissionService)
    service_mock.get_permission.side_effect = NoPermissionFound("Permission not found")

    def _override():
        return service_mock

    app.dependency_overrides[PermissionServiceDep] = _override

    response = await client.get(f"/api/permissions/{uuid7()}", headers=auth_headers("GET", {}))
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json() == {"detail": "Permission not found"}

    app.dependency_overrides.clear()


@pytest.mark.asyncio(loop_scope="session")
async def test_create_permission_integrity_error(client, permission_create, auth_headers):
    # First create a permission
    body = permission_create.model_dump(mode="json")
    response = await client.post(
        "/api/permissions/", json=body, headers=auth_headers("POST", body)
    )
    assert response.status_code == status.HTTP_201_CREATED

    # Try to create the same permission again (same name)
    response = await client.post(
        "/api/permissions/", json=body, headers=auth_headers("POST", body)
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json() == {"detail": "Permission already exists"}


@pytest.mark.asyncio(loop_scope="session")
async def test_update_permission_not_found(client, auth_headers, mocker):
    service_mock = mocker.MagicMock(PermissionService)
    service_mock.update_permission.side_effect = NoPermissionFound("Permission not found")

    def _override():
        return service_mock

    app.dependency_overrides[PermissionServiceDep] = _override

    permission_update = PermissionUpdate(name="Updated Name")
    body = permission_update.model_dump(mode="json", exclude_unset=True)

    response = await client.put(
        f"/api/permissions/{uuid7()}", json=body, headers=auth_headers("PUT", body)
    )
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json() == {"detail": "Permission not found"}

    app.dependency_overrides.clear()


@pytest.mark.asyncio(loop_scope="session")
async def test_delete_permission_not_found(client, auth_headers, mocker):
    service_mock = mocker.MagicMock(PermissionService)
    service_mock.delete_permission.side_effect = NoPermissionFound("Permission not found")

    def _override():
        return service_mock

    app.dependency_overrides[PermissionServiceDep] = _override

    response = await client.delete(
        f"/api/permissions/{uuid7()}", headers=auth_headers("DELETE", {})
    )
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json() == {"detail": "Permission not found"}

    app.dependency_overrides.clear()


@pytest.mark.asyncio(loop_scope="session")
async def test_assign_permission_user_not_found(client, permission, auth_headers, mocker):
    service_mock = mocker.MagicMock(PermissionService)
    service_mock.assign_permission_to_user.side_effect = NoUserFound("User not found")

    def _override():
        return service_mock

    app.dependency_overrides[PermissionServiceDep] = _override

    response = await client.post(
        f"/api/permissions/assign/{uuid7()}/{permission.uuid}", headers=auth_headers("POST", {})
    )
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json() == {"detail": "User not found"}

    app.dependency_overrides.clear()


@pytest.mark.asyncio(loop_scope="session")
async def test_assign_permission_permission_not_found(client, user, auth_headers, mocker):
    service_mock = mocker.MagicMock(PermissionService)
    service_mock.assign_permission_to_user.side_effect = NoPermissionFound("Permission not found")

    def _override():
        return service_mock

    app.dependency_overrides[PermissionServiceDep] = _override

    response = await client.post(
        f"/api/permissions/assign/{user.uuid}/{uuid7()}", headers=auth_headers("POST", {})
    )
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json() == {"detail": "Permission not found"}

    app.dependency_overrides.clear()


@pytest.mark.asyncio(loop_scope="session")
async def test_get_permission_users_not_found(client, auth_headers, mocker):
    service_mock = mocker.MagicMock(PermissionService)
    service_mock.get_permission_users.side_effect = NoPermissionFound("Permission not found")

    def _override():
        return service_mock

    app.dependency_overrides[PermissionServiceDep] = _override

    response = await client.get(
        f"/api/permissions/{uuid7()}/users", headers=auth_headers("GET", {})
    )
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json() == {"detail": "Permission not found"}

    app.dependency_overrides.clear()
