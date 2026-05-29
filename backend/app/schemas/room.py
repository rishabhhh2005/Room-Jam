from datetime import datetime
from pydantic import BaseModel
from typing import List, Optional
import uuid


class CreateRoomRequest(BaseModel):
    title: str
    problem_statement: str
    context: Optional[str] = None
    tags: Optional[List[str]] = None
    is_public: bool = True


class JoinRoomRequest(BaseModel):
    room_key: str


class RoomResponse(BaseModel):
    id: uuid.UUID
    title: str
    problem_statement: str
    context: Optional[str]
    tags: Optional[List[str]]
    room_key: str
    owner_id: uuid.UUID
    is_public: bool
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
    