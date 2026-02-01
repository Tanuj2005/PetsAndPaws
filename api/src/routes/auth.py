from fastapi import APIRouter, HTTPException, Depends, Header
from typing import Optional
from datetime import datetime
from bson import ObjectId

from db.db_config import get_database
from db.models import SignupRequest, LoginRequest, AuthResponse, UserResponse
from utils.security import hash_password, create_session

router = APIRouter(prefix="/api", tags=["Authentication"])

def get_current_user(authorization: Optional[str] = Header(None)):
    """Dependency to get current user from token"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.split(" ")[1]
    db = get_database()
    
    # Find session
    session = db.sessions.find_one({
        "token": token,
        "expires_at": {"$gt": datetime.utcnow()}
    })
    
    if not session:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    # Find user - Convert user_id string back to ObjectId
    try:
        user = db.users.find_one({"_id": ObjectId(session["user_id"])})
    except:
        user = db.users.find_one({"_id": session["user_id"]})
    
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "name": user["name"],
        "user_type": user["user_type"]
    }

@router.post("/signup", response_model=AuthResponse)
async def signup(request: SignupRequest):
    """Register a new user (NGO or Adopter)"""
    db = get_database()
    
    # Check if user exists
    existing = db.users.find_one({"email": request.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    password_hash = hash_password(request.password)
    user_doc = {
        "email": request.email,
        "password_hash": password_hash,
        "name": request.name,
        "user_type": request.user_type,
        "created_at": datetime.utcnow()
    }
    
    result = db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)
    
    # Create session
    token = create_session(user_id)
    
    # Determine redirect URL based on user type
    redirect_url = "/ngo/dashboard" if request.user_type == "NGO" else "/"
    
    return AuthResponse(
        token=token,
        user=UserResponse(
            id=user_id,
            email=request.email,
            name=request.name,
            user_type=request.user_type
        ),
        redirect_url=redirect_url
    )

@router.post("/login", response_model=AuthResponse)
async def login(request: LoginRequest):
    """Login existing user"""
    db = get_database()
    
    password_hash = hash_password(request.password)
    user = db.users.find_one({
        "email": request.email,
        "password_hash": password_hash
    })
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user_id = str(user["_id"])
    
    # Create session
    token = create_session(user_id)
    
    # Determine redirect URL based on user type
    redirect_url = "/ngo/dashboard" if user["user_type"] == "NGO" else "/"
    
    return AuthResponse(
        token=token,
        user=UserResponse(
            id=user_id,
            email=user["email"],
            name=user["name"],
            user_type=user["user_type"]
        ),
        redirect_url=redirect_url
    )

@router.get("/me", response_model=UserResponse)
async def get_me(current_user = Depends(get_current_user)):
    """Get current user info"""
    return current_user

@router.post("/logout")
async def logout(authorization: Optional[str] = Header(None)):
    """Logout user (delete session)"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.split(" ")[1]
    db = get_database()
    
    db.sessions.delete_one({"token": token})
    
    return {"message": "Logged out successfully"}