"""
This module defines the services related to the domain of the project.

It specifies operations related to the business logic attached to an trigger
operation like an api endpoint. It concerns it related to the trigger, and uses
the repository to access the data.
"""

__all__ = ["UserService", "PermissionService"]

from .user import UserService
from .permission import PermissionService
