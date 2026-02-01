import os
from typing import Optional

class Settings:
    """Application settings"""
    
    # MongoDB
    MONGODB_URI: str = os.getenv(
        "MONGODB_URI",
        "mongodb+srv://siddharth8shukla8_db_user:yfoCPLgF1YcVV6zW@petsandpaws.0jus2qw.mongodb.net/?appName=PetsAndPaws"
    )
    DATABASE_NAME: str = "pets_paws_db"
    
    # API
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    
    # CORS
    ALLOWED_ORIGINS: list = [
        "http://localhost:3000",
        "https://your-domain.com"
    ]
    
    # Security
    SESSION_EXPIRE_DAYS: int = 7

settings = Settings()