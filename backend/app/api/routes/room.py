from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.schemas.room import (
    CreateRoomRequest,
    JoinRoomRequest,
    RoomResponse,
)
from app.services.room_service import (
    create_room,
    join_room,
    get_room_by_key,
    get_user_rooms,
    delete_room,
)

router = APIRouter()


@router.delete("/rooms/{room_key}")
def remove_room(
    room_key: str,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    try:
        delete_room(db, user, room_key)
        return {"detail": "Room deleted successfully"}
    except ValueError as e:
        raise HTTPException(
            status_code=403,
            detail=str(e),
        )


@router.get("/rooms", response_model=list[RoomResponse])
def list_rooms(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    return get_user_rooms(db, user)


@router.post("/rooms", response_model=RoomResponse)
def create_new_room(
    data: CreateRoomRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    room = create_room(
        db,
        user,
        data.title,
        data.problem_statement,
        data.is_public,
        data.context,
        data.tags,
    )

    return room


@router.post("/rooms/join", response_model=RoomResponse)
def join_existing_room(
    data: JoinRoomRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    try:
        room = join_room(db, user, data.room_key)
        return room

    except ValueError as e:
        detail_msg = str(e)
        if "private" in detail_msg:
            raise HTTPException(
                status_code=403,
                detail=detail_msg,
            )
        raise HTTPException(
            status_code=404,
            detail=detail_msg,
        )


@router.get("/rooms/{room_key}", response_model=RoomResponse)
def get_room(
    room_key: str,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    room = get_room_by_key(db, room_key)

    if not room:
        raise HTTPException(
            status_code=404,
            detail="Room not found",
        )

    # Privacy logic: if not public, only owner can view
    if not room.is_public and room.owner_id != user.id:
        raise HTTPException(
            status_code=403,
            detail="This room is private and can only be accessed by the owner.",
        )

    return room