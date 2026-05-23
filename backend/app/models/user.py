import uuid
from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    username = Column(
        String,
        nullable=False,
        unique=True
    )

    email = Column(
        String,
        nullable=False,
        unique=True
    )

    password_hash = Column(
        String,
        nullable=False
    )

    avatar_url = Column(
        String,
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    owned_rooms = relationship("Room", back_populates="owner")
    joined_rooms = relationship("RoomParticipant", back_populates="user")

    
    def __repr__(self):
        return f"<User {self.email}>"