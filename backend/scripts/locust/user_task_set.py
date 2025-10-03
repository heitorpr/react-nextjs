import json
import random
import uuid

from faker import Faker
from locust import TaskSet, task

from scripts.locust.utils import get_auth_headers, create_json_body, log_request_failure, generate_unique_user_data

faker = Faker()


class UserTasks(TaskSet):
    def __init__(self, parent):
        super().__init__(parent)
        self.created_users = []
        self.current_user_uuid = None

    def create_user(self):
        user_data = generate_unique_user_data(faker)

        body = create_json_body(user_data)
        headers = get_auth_headers("POST", body)
        response = self.client.post("/api/users/", data=body, headers=headers)

        if response.status_code != 201:
            log_request_failure("Create User", response, user_data, headers)
            return None

        user_uuid = response.json().get("uuid")
        self.created_users.append(user_uuid)
        return user_uuid

    def get_user(self, user_id: str):
        headers = get_auth_headers("GET", "")
        response = self.client.get(
            f"/api/users/{user_id}", headers=headers, name="/api/users/{uuid}"
        )

        if response.status_code != 200:
            log_request_failure("Get User", response, {"user_id": user_id}, headers)
            return None

        return response.json().get("uuid")

    def get_user_with_permissions(self, user_id: str):
        headers = get_auth_headers("GET", "")
        response = self.client.get(
            f"/api/users/{user_id}/permissions", headers=headers, name="/api/users/{uuid}/permissions"
        )

        if response.status_code != 200:
            log_request_failure("Get User with Permissions", response, {"user_id": user_id}, headers)
            return None

        return response.json()

    def get_user_by_google_id(self, google_id: str):
        headers = get_auth_headers("GET", "")
        response = self.client.get(
            f"/api/users/google/{google_id}", headers=headers, name="/api/users/google/{google_id}"
        )

        if response.status_code != 200:
            log_request_failure("Get User by Google ID", response, {"google_id": google_id}, headers)
            return None

        return response.json().get("uuid")

    def get_user_by_email(self, email: str):
        headers = get_auth_headers("GET", "")
        response = self.client.get(
            f"/api/users/email/{email}", headers=headers, name="/api/users/email/{email}"
        )

        if response.status_code != 200:
            log_request_failure("Get User by Email", response, {"email": email}, headers)
            return None

        return response.json().get("uuid")

    def update_user(self, user_id: str):
        update_data = {
            "name": faker.name(),
            "is_active": random.choice([True, False])
        }

        body = create_json_body(update_data)
        headers = get_auth_headers("PUT", body)
        response = self.client.put(
            f"/api/users/{user_id}", data=body, headers=headers, name="/api/users/{uuid}"
        )

        if response.status_code != 200:
            log_request_failure("Update User", response, {"user_id": user_id, "data": update_data}, headers)
            return None

        return response.json().get("uuid")

    def list_users(self):
        skip = random.randint(0, 10)
        limit = random.randint(1, 20)

        headers = get_auth_headers("GET", "")
        response = self.client.get(
            f"/api/users/?skip={skip}&limit={limit}",
            headers=headers,
            name="/api/users/"
        )

        if response.status_code != 200:
            log_request_failure("List Users", response, {"skip": skip, "limit": limit}, headers)
            return None

        return response.json()

    def get_admin_users(self):
        headers = get_auth_headers("GET", "")
        response = self.client.get("/api/users/admins/all", headers=headers)

        if response.status_code != 200:
            log_request_failure("Get Admin Users", response, headers=headers)
            return None

        return response.json()

    def check_user_permission(self, user_id: str, permission_name: str):
        headers = get_auth_headers("GET", "")
        response = self.client.get(
            f"/api/users/{user_id}/has-permission/{permission_name}",
            headers=headers,
            name="/api/users/{uuid}/has-permission/{permission_name}"
        )

        if response.status_code != 200:
            log_request_failure("Check User Permission", response, {"user_id": user_id, "permission": permission_name}, headers)
            return None

        return response.json()

    def get_user_permissions(self, user_id: str):
        headers = get_auth_headers("GET", "")
        response = self.client.get(
            f"/api/users/{user_id}/permissions",
            headers=headers,
            name="/api/users/{uuid}/permissions"
        )

        if response.status_code != 200:
            log_request_failure("Get User Permissions", response, {"user_id": user_id}, headers)
            return None

        return response.json()

    def delete_user(self, user_id: str):
        headers = get_auth_headers("DELETE", "")
        response = self.client.delete(
            f"/api/users/{user_id}", headers=headers, name="/api/users/{uuid}"
        )

        if response.status_code != 204:
            log_request_failure("Delete User", response, {"user_id": user_id}, headers)

    @task(3)
    def create_and_manage_user(self):
        """Create a user and perform various operations"""
        user_id = self.create_user()
        if not user_id:
            return

        # Get user details
        user_id = self.get_user(user_id)
        if not user_id:
            return

        # Get user with permissions
        self.get_user_with_permissions(user_id)

        # Update user
        user_id = self.update_user(user_id)
        if not user_id:
            return

        # Check permissions
        self.check_user_permission(user_id, "manage_user_access")
        self.get_user_permissions(user_id)

    @task(2)
    def list_and_search_users(self):
        """List users and search by different criteria"""
        # List users
        users = self.list_users()
        if not users or len(users) == 0:
            return

        # Get admin users
        self.get_admin_users()

        # Search by email (if we have users)
        if users:
            user = random.choice(users)
            email = user.get("email")
            if email:
                self.get_user_by_email(email)

    @task(1)
    def cleanup_user(self):
        """Delete a randomly selected user"""
        if self.created_users:
            user_id = random.choice(self.created_users)
            self.delete_user(user_id)
            self.created_users.remove(user_id)

    @task(1)
    def permission_check_workflow(self):
        """Test permission checking workflow"""
        user_id = self.create_user()
        if not user_id:
            return

        # Check various permissions
        permissions_to_check = ["manage_user_access", "non_existent_permission"]
        for permission in permissions_to_check:
            self.check_user_permission(user_id, permission)

        # Get all user permissions
        self.get_user_permissions(user_id)
