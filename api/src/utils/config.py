import os
from typing import Optional

class Settings:
    """Application settings"""
    
    # MongoDB
    MONGODB_URI: str = os.getenv("MONGODB_URI", "")
    
    if not MONGODB_URI:
        raise ValueError(
            "MONGODB_URI environment variable is not set. "
            "Please set it in your .env file."
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
    
    # Cloudinary
    CLOUDINARY_CLOUD_NAME: str = os.getenv("CLOUDINARY_CLOUD_NAME", "")
    CLOUDINARY_API_KEY: str = os.getenv("CLOUDINARY_API_KEY", "")
    CLOUDINARY_API_SECRET: str = os.getenv("CLOUDINARY_API_SECRET", "")

settings = Settings()