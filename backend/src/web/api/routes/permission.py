from uuid import UUID

from fastapi import APIRouter, HTTPException, Query, status
from sqlalchemy.exc import IntegrityError

from src.domain.models.permission import PermissionCreate, PermissionPublic, PermissionUpdate
from src.domain.repositories.exceptions import NoPermissionFound, NoUserFound
from src.web.deps import PermissionServiceDep

router = APIRouter()


@router.post(
    "/",
    summary="Create a permission",
    description="Create a permission with all the information",
    tags=["permissions"],
    response_model=PermissionPublic,
    status_code=status.HTTP_201_CREATED,
    responses={
        status.HTTP_400_BAD_REQUEST: {"description": "Permission already exists"},
    },
)
async def create_permission(permission_create: PermissionCreate, service: PermissionServiceDep):
    try:
        return await service.create_permission(permission_create)
    except IntegrityError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Permission already exists"
        ) from error


@router.get(
    "/{uuid}",
    summary="Get a permission",
    description="Get a permission using the uuid",
    tags=["permissions"],
    response_model=PermissionPublic,
    status_code=status.HTTP_200_OK,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "Permission not found"},
    },
)
async def get_permission(uuid: UUID, service: PermissionServiceDep):
    try:
        return await service.get_permission(uuid)
    except NoPermissionFound as error:
        raise HTTPException(status_code=404, detail=str(error)) from error


@router.get(
    "/name/{name}",
    summary="Get permission by name",
    description="Get a permission by its name",
    tags=["permissions"],
    response_model=PermissionPublic,
    status_code=status.HTTP_200_OK,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "Permission not found"},
    },
)
async def get_permission_by_name(name: str, service: PermissionServiceDep):
    permission = await service.get_permission_by_name(name)
    if not permission:
        raise HTTPException(status_code=404, detail="Permission not found")
    return permission


@router.put(
    "/{uuid}",
    summary="Update a permission",
    description="Update a permission using the uuid",
    tags=["permissions"],
    response_model=PermissionPublic,
    status_code=status.HTTP_200_OK,
    responses={
        status.HTTP_400_BAD_REQUEST: {"description": "Permission already exists"},
        status.HTTP_404_NOT_FOUND: {"description": "Permission not found"},
    },
)
async def update_permission(uuid: UUID, permission_update: PermissionUpdate, service: PermissionServiceDep):
    try:
        return await service.update_permission(uuid, permission_update)
    except IntegrityError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Permission already exists"
        ) from error
    except NoPermissionFound as error:
        raise HTTPException(status_code=404, detail=str(error)) from error


@router.delete(
    "/{uuid}",
    summary="Delete a permission",
    description="Delete a permission using the uuid",
    tags=["permissions"],
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "Permission not found"},
    },
)
async def delete_permission(uuid: UUID, service: PermissionServiceDep):
    try:
        await service.delete_permission(uuid)
    except NoPermissionFound as error:
        raise HTTPException(status_code=404, detail=str(error)) from error


@router.get(
    "/",
    summary="List permissions",
    description="List all permissions with pagination",
    tags=["permissions"],
    response_model=list[PermissionPublic],
    status_code=status.HTTP_200_OK,
)
async def list_permissions(
    skip: int = Query(0, ge=0, description="Number of permissions to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Number of permissions to return"),
    service: PermissionServiceDep = None,
):
    return await service.list_permissions(skip, limit)


@router.post(
    "/assign/{user_uuid}/{permission_uuid}",
    summary="Assign permission to user",
    description="Assign a permission to a user",
    tags=["permissions"],
    status_code=status.HTTP_200_OK,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "User or permission not found"},
    },
)
async def assign_permission_to_user(
    user_uuid: UUID,
    permission_uuid: UUID,
    service: PermissionServiceDep
):
    try:
        assigned = await service.assign_permission_to_user(user_uuid, permission_uuid)
        if assigned:
            return {"message": "Permission assigned successfully"}
        else:
            return {"message": "Permission already assigned to user"}
    except (NoUserFound, NoPermissionFound) as error:
        raise HTTPException(status_code=404, detail=str(error)) from error


@router.delete(
    "/revoke/{user_uuid}/{permission_uuid}",
    summary="Revoke permission from user",
    description="Revoke a permission from a user",
    tags=["permissions"],
    status_code=status.HTTP_200_OK,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "User or permission not found"},
    },
)
async def revoke_permission_from_user(
    user_uuid: UUID,
    permission_uuid: UUID,
    service: PermissionServiceDep
):
    try:
        revoked = await service.revoke_permission_from_user(user_uuid, permission_uuid)
        if revoked:
            return {"message": "Permission revoked successfully"}
        else:
            return {"message": "Permission was not assigned to user"}
    except (NoUserFound, NoPermissionFound) as error:
        raise HTTPException(status_code=404, detail=str(error)) from error


@router.get(
    "/{permission_uuid}/users",
    summary="Get permission users",
    description="Get list of user UUIDs that have this permission",
    tags=["permissions"],
    status_code=status.HTTP_200_OK,
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "Permission not found"},
    },
)
async def get_permission_users(permission_uuid: UUID, service: PermissionServiceDep):
    try:
        user_uuids = await service.get_permission_users(permission_uuid)
        return {"users": user_uuids}
    except NoPermissionFound as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
