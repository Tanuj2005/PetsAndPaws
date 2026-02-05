from fastapi import APIRouter, HTTPException, Depends

from ..db.db_config import get_database
from .auth import get_current_user

router = APIRouter(prefix="/api/ngo", tags=["NGO"])

@router.get("/dashboard")
async def get_ngo_dashboard(current_user = Depends(get_current_user)):
    """Get NGO dashboard data (requires NGO user)"""
    # Verify user is an NGO
    if current_user["user_type"] != "NGO":
        raise HTTPException(status_code=403, detail="Access denied. NGO users only.")
    
    db = get_database()
    
    # Get NGO's pets count
    pets_count = db.pets.count_documents({"ngo_user_id": current_user["id"]})
    
    # Get NGO's pets
    pets = list(db.pets.find({"ngo_user_id": current_user["id"]}).limit(10))
    
    # Convert ObjectId to string for JSON serialization
    for pet in pets:
        pet["_id"] = str(pet["_id"])
    
    return {
        "user": current_user,
        "stats": {
            "total_pets": pets_count,
            "active_pets": pets_count,  # Can be updated later
        },
        "recent_pets": pets,
        "message": "Welcome to your NGO dashboard!"
    }