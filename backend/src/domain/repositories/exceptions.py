class NoUserFound(Exception):
    """Exception raised when a user is not found in the repository."""

    pass


class NoPermissionFound(Exception):
    """Exception raised when a permission is not found in the repository."""

    pass


class NoUserPermissionFound(Exception):
    """Exception raised when a user permission is not found in the repository."""

    pass
