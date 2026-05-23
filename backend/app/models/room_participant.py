import uuid

from sqlalchemy import (
    Column,
    ForeignKey,
    DateTime,
    UniqueConstraint
)
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from app.db.base import Base


class RoomParticipant(Base):
    __tablename__ = "room_participants"

    __table_args__ = (
        UniqueConstraint(
            "room_id",
            "user_id",
            name="uq_room_user"
        ),
    )

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    room_id = Column(
        UUID(as_uuid=True),
        ForeignKey("rooms.id"),
        nullable=False
    )

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False
    )

    joined_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
    room = relationship("Room", back_populates="participants")
    user = relationship("User", back_populates="joined_rooms")