import hashlib
import secrets
from datetime import datetime, timedelta
from db.db_config import get_database

def hash_password(password: str) -> str:
    """Hash password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

def create_session(user_id: str) -> str:
    """Create a new session token"""
    db = get_database()
    token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(days=7)
    
    db.sessions.insert_one({
        "user_id": user_id,
        "token": token,
        "expires_at": expires_at,
        "created_at": datetime.utcnow()
    })
    
    return token