import sys
import os
from pathlib import Path

# Add the backend root directory to Python path
backend_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(backend_root))

# Set the working directory to backend root so .env file can be found
os.chdir(backend_root)

from faker import Faker
from locust import HttpUser, between

from scripts.locust.user_task_set import UserTasks
from scripts.locust.permission_task_set import PermissionTasks
from scripts.locust.admin_task_set import AdminTasks

faker = Faker()


class UserLoadTest(HttpUser):
    """Load test focused on user management operations"""
    tasks = [UserTasks]
    host = "http://localhost:8000"
    wait_time = between(1, 3)
    weight = 3


class PermissionLoadTest(HttpUser):
    """Load test focused on permission management operations"""
    tasks = [PermissionTasks]
    host = "http://localhost:8000"
    wait_time = between(1, 3)
    weight = 2


class AdminLoadTest(HttpUser):
    """Load test focused on admin operations and complex workflows"""
    tasks = [AdminTasks]
    host = "http://localhost:8000"
    wait_time = between(1, 3)
    weight = 1


class ComprehensiveLoadTest(HttpUser):
    """Comprehensive load test combining all operations"""
    tasks = [UserTasks, PermissionTasks, AdminTasks]
    host = "http://localhost:8000"
    wait_time = between(1, 5)
    weight = 1
