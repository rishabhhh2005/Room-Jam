from sqlalchemy.orm import Session

from app.models.room import Room
from app.models.room_participant import RoomParticipant
from app.utils.room_key import generate_room_key


def get_room_by_key(db: Session, room_key: str):
    return db.query(Room).filter(Room.room_key == room_key).first()


def create_room(db: Session, user, title: str, is_public: bool):
    room_key = generate_room_key()

    while get_room_by_key(db, room_key):
        room_key = generate_room_key()

    room = Room(
        title=title,
        room_key=room_key,
        owner_id=user.id,
        is_public=is_public,
    )

    db.add(room)
    db.commit()
    db.refresh(room)

    participant = RoomParticipant(
        room_id=room.id,
        user_id=user.id,
    )

    db.add(participant)
    db.commit()

    return room


def join_room(db: Session, user, room_key: str):
    room = get_room_by_key(db, room_key)

    if not room:
        raise ValueError("Room not found")

    existing = db.query(RoomParticipant).filter(
        RoomParticipant.room_id == room.id,
        RoomParticipant.user_id == user.id,
    ).first()

    if not existing:
        participant = RoomParticipant(
            room_id=room.id,
            user_id=user.id,
        )
        db.add(participant)
        db.commit()

    return room