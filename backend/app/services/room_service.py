from sqlalchemy.orm import Session

from app.models.room import Room
from app.models.room_participant import RoomParticipant
from app.utils.room_key import generate_room_key


def get_room_by_key(db: Session, room_key: str):
    return db.query(Room).filter(Room.room_key == room_key).first()


def create_room(
    db: Session,
    user,
    title: str,
    problem_statement: str,
    is_public: bool,
    context: str = None,
    tags: list[str] = None,
):
    room_key = generate_room_key()

    while get_room_by_key(db, room_key):
        room_key = generate_room_key()

    room = Room(
        title=title,
        problem_statement=problem_statement,
        context=context,
        tags=tags,
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

    # Privacy logic: if not public, only owner can join
    if not room.is_public and room.owner_id != user.id:
        raise ValueError("This room is private and can only be accessed by the owner.")

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


def get_user_rooms(db: Session, user):
    return (
        db.query(Room)
        .join(RoomParticipant)
        .filter(RoomParticipant.user_id == user.id)
        .all()
    )


def delete_room(db: Session, user, room_key: str):
    room = get_room_by_key(db, room_key)

    if not room:
        raise ValueError("Room not found")

    if room.owner_id != user.id:
        raise ValueError("Only the owner can delete this room.")

    # Delete all participants first (cascading could be handled by model, but being explicit here)
    db.query(RoomParticipant).filter(RoomParticipant.room_id == room.id).delete()
    db.delete(room)
    db.commit()

    return True