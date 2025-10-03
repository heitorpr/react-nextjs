import random

from faker import Faker
from locust import TaskSet, task

from scripts.locust.utils import (
    get_auth_headers,
    create_json_body,
    log_request_failure,
    generate_unique_user_data,
)

faker = Faker()


class AdminTasks(TaskSet):
    def __init__(self, parent):
        super().__init__(parent)
        self.created_users = []
        self.created_permissions = []
        self.admin_user_uuid = None

    def create_admin_user(self):
        """Create an admin user for testing admin workflows"""
        user_data = generate_unique_user_data(faker)
        user_data["is_admin"] = True

        body = create_json_body(user_data)
        headers = get_auth_headers("POST", body)
        response = self.client.post("/api/users/", data=body, headers=headers)

        if response.status_code != 201:
            log_request_failure("Create Admin User", response, user_data, headers)
            return None

        user_uuid = response.json().get("uuid")
        self.admin_user_uuid = user_uuid
        self.created_users.append(user_uuid)
        return user_uuid

    def create_regular_user(self):
        """Create a regular user for testing"""
        user_data = generate_unique_user_data(faker)

        body = create_json_body(user_data)
        headers = get_auth_headers("POST", body)
        response = self.client.post("/api/users/", data=body, headers=headers)

        if response.status_code != 201:
            log_request_failure("Create Regular User", response, user_data, headers)
            return None

        user_uuid = response.json().get("uuid")
        self.created_users.append(user_uuid)
        return user_uuid

    def create_permission(self):
        """Create a new permission"""
        permission_data = {
            "name": f"admin_test_permission_{faker.word()}_{random.randint(1000, 9999)}",
            "description": faker.sentence(),
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

    def get_admin_users(self):
        """Get all admin users"""
        headers = get_auth_headers("GET", "")
        response = self.client.get("/api/users/admins/all", headers=headers)

        if response.status_code != 200:
            log_request_failure("Get Admin Users", response, headers=headers)
            return None

        return response.json()

    def get_user_permissions(self, user_id: str):
        """Get user permissions"""
        headers = get_auth_headers("GET", "")
        response = self.client.get(
            f"/api/users/{user_id}/permissions",
            headers=headers,
            name="/api/users/{uuid}/permissions",
        )

        if response.status_code != 200:
            log_request_failure("Get User Permissions", response, {"user_id": user_id}, headers)
            return None

        return response.json()

    def check_user_has_permission(self, user_id: str, permission_name: str):
        """Check if user has specific permission"""
        headers = get_auth_headers("GET", "")
        response = self.client.get(
            f"/api/users/{user_id}/has-permission/{permission_name}",
            headers=headers,
            name="/api/users/{uuid}/has-permission/{permission_name}",
        )

        if response.status_code != 200:
            log_request_failure(
                "Check User Permission",
                response,
                {"user_id": user_id, "permission": permission_name},
                headers,
            )
            return None

        return response.json()

    def assign_permission_to_user(self, user_id: str, permission_id: str):
        """Assign permission to user"""
        headers = get_auth_headers("POST", "")
        response = self.client.post(
            f"/api/permissions/assign/{user_id}/{permission_id}",
            headers=headers,
            name="/api/permissions/assign/{user_uuid}/{permission_uuid}",
        )

        if response.status_code != 200:
            log_request_failure(
                "Assign Permission to User",
                response,
                {"user_id": user_id, "permission_id": permission_id},
                headers,
            )
            return False

        return True

    def revoke_permission_from_user(self, user_id: str, permission_id: str):
        """Revoke permission from user"""
        headers = get_auth_headers("DELETE", "")
        response = self.client.delete(
            f"/api/permissions/revoke/{user_id}/{permission_id}",
            headers=headers,
            name="/api/permissions/revoke/{user_uuid}/{permission_uuid}",
        )

        if response.status_code != 200:
            log_request_failure(
                "Revoke Permission from User",
                response,
                {"user_id": user_id, "permission_id": permission_id},
                headers,
            )
            return False

        return True

    def get_permission_users(self, permission_id: str):
        """Get users with specific permission"""
        headers = get_auth_headers("GET", "")
        response = self.client.get(
            f"/api/permissions/{permission_id}/users",
            headers=headers,
            name="/api/permissions/{permission_uuid}/users",
        )

        if response.status_code != 200:
            log_request_failure(
                "Get Permission Users", response, {"permission_id": permission_id}, headers
            )
            return None

        return response.json()

    def update_user_admin_status(self, user_id: str, is_admin: bool):
        """Update user admin status"""
        update_data = {"is_admin": is_admin}

        body = create_json_body(update_data)
        headers = get_auth_headers("PUT", body)
        response = self.client.put(
            f"/api/users/{user_id}", data=body, headers=headers, name="/api/users/{uuid}"
        )

        if response.status_code != 200:
            log_request_failure(
                "Update User Admin Status",
                response,
                {"user_id": user_id, "is_admin": is_admin},
                headers,
            )
            return None

        return response.json().get("uuid")

    @task(3)
    def admin_user_management_workflow(self):
        """Test admin user management workflow"""
        # Create an admin user
        admin_id = self.create_admin_user()
        if not admin_id:
            return

        # Create a regular user
        user_id = self.create_regular_user()
        if not user_id:
            return

        # Check admin users list
        self.get_admin_users()

        # Check user permissions
        self.get_user_permissions(user_id)
        self.get_user_permissions(admin_id)

        # Check if admin has manage_user_access permission (should be true due to is_admin=True)
        self.check_user_has_permission(admin_id, "manage_user_access")

        # Check if regular user has manage_user_access permission (should be false)
        self.check_user_has_permission(user_id, "manage_user_access")

    @task(2)
    def permission_management_workflow(self):
        """Test permission management workflow"""
        # Create a permission
        permission_id = self.create_permission()
        if not permission_id:
            return

        # Create a user
        user_id = self.create_regular_user()
        if not user_id:
            return

        # Assign permission to user
        if self.assign_permission_to_user(user_id, permission_id):
            # Check user now has permission
            self.check_user_has_permission(user_id, "manage_user_access")

            # Get users with this permission
            self.get_permission_users(permission_id)

            # Revoke permission
            self.revoke_permission_from_user(user_id, permission_id)

            # Check user no longer has permission
            self.check_user_has_permission(user_id, "manage_user_access")

    @task(2)
    def admin_promotion_workflow(self):
        """Test promoting regular user to admin"""
        # Create a regular user
        user_id = self.create_regular_user()
        if not user_id:
            return

        # Check initial permissions
        self.get_user_permissions(user_id)

        # Promote to admin
        user_id = self.update_user_admin_status(user_id, True)
        if not user_id:
            return

        # Check admin permissions (should have all permissions due to is_admin=True)
        self.check_user_has_permission(user_id, "manage_user_access")

        # Demote back to regular user
        user_id = self.update_user_admin_status(user_id, False)
        if user_id:
            # Check permissions after demotion
            self.check_user_has_permission(user_id, "manage_user_access")

    @task(1)
    def comprehensive_permission_test(self):
        """Test comprehensive permission scenarios"""
        # Create multiple users
        users = []
        for _ in range(3):
            user_id = self.create_regular_user()
            if user_id:
                users.append(user_id)

        # Create a permission
        permission_id = self.create_permission()
        if not permission_id:
            return

        # Assign permission to some users
        assigned_users = random.sample(users, min(2, len(users)))
        for user_id in assigned_users:
            self.assign_permission_to_user(user_id, permission_id)

        # Get users with permission
        self.get_permission_users(permission_id)

        # Check individual user permissions
        for user_id in users:
            self.check_user_has_permission(user_id, "manage_user_access")
            self.get_user_permissions(user_id)

    @task(1)
    def system_health_check(self):
        """Check system health and existing data"""
        # Get admin users
        admins = self.get_admin_users()

        # List users
        headers = get_auth_headers("GET", "")
        response = self.client.get(
            "/api/users/?skip=0&limit=10", headers=headers, name="/api/users/"
        )
        if response.status_code == 200:
            users = response.json()
            if users:
                # Check permissions for a random user
                user = random.choice(users)
                user_id = user.get("uuid")
                if user_id:
                    self.get_user_permissions(user_id)
                    self.check_user_has_permission(user_id, "manage_user_access")

        # List permissions
        headers = get_auth_headers("GET", "")
        response = self.client.get(
            "/api/permissions/?skip=0&limit=10", headers=headers, name="/api/permissions/"
        )
        if response.status_code == 200:
            permissions = response.json()
            if permissions:
                # Check users for a random permission
                permission = random.choice(permissions)
                permission_id = permission.get("uuid")
                if permission_id:
                    self.get_permission_users(permission_id)
