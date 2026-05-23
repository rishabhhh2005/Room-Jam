import os
from  dotenv import load_dotenv

load_dotenv()

class Settings:
    app_name = "RoomJam"
    ENV = os.get("ENV", "development")

settings = Settings()