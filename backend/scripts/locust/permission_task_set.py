import json
import random
import uuid

from faker import Faker
from locust import TaskSet, task

from scripts.locust.utils import get_auth_headers, create_json_body, log_request_failure, generate_unique_user_data

faker = Faker()


class PermissionTasks(TaskSet):
    def __init__(self, parent):
        super().__init__(parent)
        self.created_permissions = []
        self.created_users = []

    def create_permission(self):
        permission_data = {
            "name": f"test_permission_{faker.word()}_{random.randint(1000, 9999)}",
            "description": faker.sentence()
        }

        body = create_json_body(permission_data)
        headers = get_auth_headers("POST", body)
        response = self.client.post("/api/permissions/", data=body, headers=headers)

        if response.status_code != 201:
            log_request_failure("Create Permission", response, permission_data, headers)
            return None

        permission_uuid = response.json().get("uuid")
        self.created_permissions.append(permission_uuid)
        return permission_uuid

    def get_permission(self, permission_id: str):
        headers = get_auth_headers("GET", "")
        response = self.client.get(
            f"/api/permissions/{permission_id}", headers=headers, name="/api/permissions/{uuid}"
        )

        if response.status_code != 200:
            log_request_failure("Get Permission", response, {"permission_id": permission_id}, headers)
            return None

        return response.json().get("uuid")

    def get_permission_by_name(self, permission_name: str):
        headers = get_auth_headers("GET", "")
        response = self.client.get(
            f"/api/permissions/name/{permission_name}",
            headers=headers,
            name="/api/permissions/name/{name}"
        )

        if response.status_code != 200:
            log_request_failure("Get Permission by Name", response, {"permission_name": permission_name}, headers)
            return None

        return response.json().get("uuid")

    def update_permission(self, permission_id: str):
        update_data = {
            "description": faker.sentence()
        }

        body = create_json_body(update_data)
        headers = get_auth_headers("PUT", body)
        response = self.client.put(
            f"/api/permissions/{permission_id}", data=body, headers=headers, name="/api/permissions/{uuid}"
        )

        if response.status_code != 200:
            log_request_failure("Update Permission", response, {"permission_id": permission_id, "data": update_data}, headers)
            return None

        return response.json().get("uuid")

    def list_permissions(self):
        skip = random.randint(0, 5)
        limit = random.randint(1, 10)

        headers = get_auth_headers("GET", "")
        response = self.client.get(
            f"/api/permissions/?skip={skip}&limit={limit}",
            headers=headers,
            name="/api/permissions/"
        )

        if response.status_code != 200:
            log_request_failure("List Permissions", response, {"skip": skip, "limit": limit}, headers)
            return None

        return response.json()

    def create_user_for_permission_test(self):
        """Helper method to create a user for permission assignment tests"""
        user_data = generate_unique_user_data(faker)

        body = create_json_body(user_data)
        headers = get_auth_headers("POST", body)
        response = self.client.post("/api/users/", data=body, headers=headers)

        if response.status_code != 201:
            log_request_failure("Create User for Permission Test", response, user_data, headers)
            return None

        user_uuid = response.json().get("uuid")
        self.created_users.append(user_uuid)
        return user_uuid

    def assign_permission_to_user(self, user_id: str, permission_id: str):
        headers = get_auth_headers("POST", "")
        response = self.client.post(
            f"/api/permissions/assign/{user_id}/{permission_id}",
            headers=headers,
            name="/api/permissions/assign/{user_uuid}/{permission_uuid}"
        )

        if response.status_code != 200:
            log_request_failure("Assign Permission to User", response, {"user_id": user_id, "permission_id": permission_id}, headers)
            return False

        return True

    def revoke_permission_from_user(self, user_id: str, permission_id: str):
        headers = get_auth_headers("DELETE", "")
        response = self.client.delete(
            f"/api/permissions/revoke/{user_id}/{permission_id}",
            headers=headers,
            name="/api/permissions/revoke/{user_uuid}/{permission_uuid}"
        )

        if response.status_code != 200:
            log_request_failure("Revoke Permission from User", response, {"user_id": user_id, "permission_id": permission_id}, headers)
            return False

        return True

    def get_permission_users(self, permission_id: str):
        headers = get_auth_headers("GET", "")
        response = self.client.get(
            f"/api/permissions/{permission_id}/users",
            headers=headers,
            name="/api/permissions/{permission_uuid}/users"
        )

        if response.status_code != 200:
            log_request_failure("Get Permission Users", response, {"permission_id": permission_id}, headers)
            return None

        return response.json()

    def delete_permission(self, permission_id: str):
        headers = get_auth_headers("DELETE", "")
        response = self.client.delete(
            f"/api/permissions/{permission_id}", headers=headers, name="/api/permissions/{uuid}"
        )

        if response.status_code != 204:
            log_request_failure("Delete Permission", response, {"permission_id": permission_id}, headers)

    @task(3)
    def create_and_manage_permission(self):
        """Create a permission and perform various operations"""
        permission_id = self.create_permission()
        if not permission_id:
            return

        # Get permission details
        permission_id = self.get_permission(permission_id)
        if not permission_id:
            return

        # Update permission
        permission_id = self.update_permission(permission_id)
        if not permission_id:
            return

    @task(2)
    def list_and_search_permissions(self):
        """List permissions and search by name"""
        # List permissions
        permissions = self.list_permissions()
        if not permissions or len(permissions) == 0:
            return

        # Search by name (try the seeded permission)
        self.get_permission_by_name("manage_user_access")

    @task(2)
    def permission_assignment_workflow(self):
        """Test permission assignment and revocation workflow"""
        # Create a user
        user_id = self.create_user_for_permission_test()
        if not user_id:
            return

        # Create a permission
        permission_id = self.create_permission()
        if not permission_id:
            return

        # Assign permission to user
        if self.assign_permission_to_user(user_id, permission_id):
            # Get users with this permission
            self.get_permission_users(permission_id)

            # Revoke permission from user
            self.revoke_permission_from_user(user_id, permission_id)

            # Check again
            self.get_permission_users(permission_id)

    @task(1)
    def test_existing_permission_workflow(self):
        """Test workflow with existing seeded permission"""
        # Create a user
        user_id = self.create_user_for_permission_test()
        if not user_id:
            return

        # Try to find the seeded permission by name
        headers = get_auth_headers("GET", "")
        response = self.client.get(
            "/api/permissions/name/manage_user_access",
            headers=headers,
            name="/api/permissions/name/manage_user_access"
        )

        if response.status_code == 200:
            permission_data = response.json()
            permission_id = permission_data.get("uuid")

            # Assign the seeded permission to user
            self.assign_permission_to_user(user_id, permission_id)

            # Get users with this permission
            self.get_permission_users(permission_id)

    @task(1)
    def cleanup_permission(self):
        """Delete a randomly selected permission"""
        if self.created_permissions:
            permission_id = random.choice(self.created_permissions)
            self.delete_permission(permission_id)
            self.created_permissions.remove(permission_id)
