from pydantic import BaseModel


class CreateRoomRequest(BaseModel):
    title: str
    is_public: bool = True


class JoinRoomRequest(BaseModel):
    room_key: str


class RoomResponse(BaseModel):
    id: str
    title: str
    room_key: str
    owner_id: str
    is_public: bool