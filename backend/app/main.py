from fastapi import FastAPI

from app.api.routes.health import router as health_router
from app.api.routes.auth import router as auth_router
from app.core.config import settings
from app.api.routes.room import router as room_router

app = FastAPI(title=settings.APP_NAME)

app.include_router(health_router, prefix="/api")
app.include_router(auth_router, prefix="/api")
app.include_router(room_router, prefix="/api")