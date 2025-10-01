"""
Define the models related to the domain of the project.

It specifies operations related to the object that defines an abstraction of the
real world, like user.

It concerns only in operating with the data, not how it is stored or presented.
"""

__all__ = ["UserRepository", "PermissionRepository", "UserPermissionRepository"]

from .user import UserRepository
from .permission import PermissionRepository
from .user_permission import UserPermissionRepository
