import uuid

from sqlalchemy import (
    Column,
    String,
    Boolean,
    DateTime,
    ForeignKey,
    Text,
)

from sqlalchemy.dialects.postgresql import (
    UUID,
    ARRAY,
)

from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.base import Base


class Room(Base):
    __tablename__ = "rooms"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    title = Column(
        String,
        nullable=False,
    )

    problem_statement = Column(
        Text,
        nullable=False,
    )

    context = Column(
        Text,
        nullable=True,
    )

    tags = Column(
        ARRAY(String),
        nullable=True,
    )

    room_key = Column(
        String,
        unique=True,
        nullable=False,
    )

    owner_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
    )

    is_public = Column(
        Boolean,
        default=True,
    )

    is_active = Column(
        Boolean,
        default=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    owner = relationship(
        "User",
        back_populates="owned_rooms",
    )

    participants = relationship(
        "RoomParticipant",
        back_populates="room",
    )