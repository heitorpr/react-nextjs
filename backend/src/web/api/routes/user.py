from uuid import UUID

from fastapi import APIRouter, HTTPException, Query, status
from sqlalchemy.exc import IntegrityError

from src.domain.models.user import UserCreate, UserPublic, UserUpdate, UserWithPermissions
from src.domain.repositories.exceptions import NoUserFound
from src.web.deps import UserServiceDep

router = APIRouter()


@router.post(
    "/",
    summary="Create a user",
    description="Create a user with all the information",
    tags=["users"],
    response_model=UserPublic,
    status_code=status.HTTP_201_CREATED,
    responses={
        status.HTTP_400_BAD_REQUEST: {"description": "User already exists"},
    },
)
async def create_user(user_create: UserCreate, service: UserServiceDep):
    try:
        return await service.create_user(user_create)
    except IntegrityError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists"
        ) from error


@router.get(
    "/{uuid}",
    summary="Get a user",
    description="Get a user using the uuid",
    tags=["users"],
    response_model=UserPublic,
    status_code=status.HTTP_200_OK,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "User not found"},
    },
)
async def get_user(uuid: UUID, service: UserServiceDep):
    try:
        return await service.get_user(uuid)
    except NoUserFound as error:
        raise HTTPException(status_code=404, detail=str(error)) from error


@router.get(
    "/{uuid}/permissions",
    summary="Get user with permissions",
    description="Get a user with their permissions using the uuid",
    tags=["users"],
    response_model=UserWithPermissions,
    status_code=status.HTTP_200_OK,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "User not found"},
    },
)
async def get_user_with_permissions(uuid: UUID, service: UserServiceDep):
    try:
        return await service.get_user_with_permissions(uuid)
    except NoUserFound as error:
        raise HTTPException(status_code=404, detail=str(error)) from error


@router.get(
    "/google/{google_id}",
    summary="Get user by Google ID",
    description="Get a user by their Google OAuth ID",
    tags=["users"],
    response_model=UserPublic,
    status_code=status.HTTP_200_OK,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "User not found"},
    },
)
async def get_user_by_google_id(google_id: str, service: UserServiceDep):
    user = await service.get_user_by_google_id(google_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get(
    "/email/{email}",
    summary="Get user by email",
    description="Get a user by their email",
    tags=["users"],
    response_model=UserPublic,
    status_code=status.HTTP_200_OK,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "User not found"},
    },
)
async def get_user_by_email(email: str, service: UserServiceDep):
    user = await service.get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put(
    "/{uuid}",
    summary="Update a user",
    description="Update a user using the uuid",
    tags=["users"],
    response_model=UserPublic,
    status_code=status.HTTP_200_OK,
    responses={
        status.HTTP_400_BAD_REQUEST: {"description": "User already exists"},
        status.HTTP_404_NOT_FOUND: {"description": "User not found"},
    },
)
async def update_user(uuid: UUID, user_update: UserUpdate, service: UserServiceDep):
    try:
        return await service.update_user(uuid, user_update)
    except IntegrityError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists"
        ) from error
    except NoUserFound as error:
        raise HTTPException(status_code=404, detail=str(error)) from error


@router.delete(
    "/{uuid}",
    summary="Delete a user",
    description="Delete a user using the uuid",
    tags=["users"],
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "User not found"},
    },
)
async def delete_user(uuid: UUID, service: UserServiceDep):
    try:
        await service.delete_user(uuid)
    except NoUserFound as error:
        raise HTTPException(status_code=404, detail=str(error)) from error


@router.get(
    "/",
    summary="List users",
    description="List all users with pagination",
    tags=["users"],
    response_model=list[UserPublic],
    status_code=status.HTTP_200_OK,
)
async def list_users(
    skip: int = Query(0, ge=0, description="Number of users to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Number of users to return"),
    service: UserServiceDep = None,
):
    return await service.list_users(skip, limit)


@router.get(
    "/admins/all",
    summary="List admin users",
    description="List all admin users",
    tags=["users"],
    response_model=list[UserPublic],
    status_code=status.HTTP_200_OK,
)
async def list_admin_users(service: UserServiceDep):
    return await service.get_admins()


@router.get(
    "/{uuid}/has-permission/{permission_name}",
    summary="Check user permission",
    description="Check if a user has a specific permission",
    tags=["users"],
    status_code=status.HTTP_200_OK,
)
async def check_user_permission(
    uuid: UUID,
    permission_name: str,
    service: UserServiceDep
):
    try:
        has_permission = await service.check_user_has_permission(uuid, permission_name)
        return {"has_permission": has_permission}
    except NoUserFound as error:
        raise HTTPException(status_code=404, detail=str(error)) from error


@router.get(
    "/{uuid}/permissions",
    summary="Get user permissions list",
    description="Get list of permission names for a user",
    tags=["users"],
    status_code=status.HTTP_200_OK,
)
async def get_user_permissions(uuid: UUID, service: UserServiceDep):
    try:
        permissions = await service.get_user_permissions(uuid)
        return {"permissions": permissions}
    except NoUserFound as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
