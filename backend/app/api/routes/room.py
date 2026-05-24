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
)

router = APIRouter()


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
        data.is_public,
    )

    return {
        "id": str(room.id),
        "title": room.title,
        "room_key": room.room_key,
        "owner_id": str(room.owner_id),
        "is_public": room.is_public,
    }


@router.post("/rooms/join", response_model=RoomResponse)
def join_existing_room(
    data: JoinRoomRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    try:
        room = join_room(db, user, data.room_key)

        return {
            "id": str(room.id),
            "title": room.title,
            "room_key": room.room_key,
            "owner_id": str(room.owner_id),
            "is_public": room.is_public,
        }

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
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

    return {
        "id": str(room.id),
        "title": room.title,
        "room_key": room.room_key,
        "owner_id": str(room.owner_id),
        "is_public": room.is_public,
    }