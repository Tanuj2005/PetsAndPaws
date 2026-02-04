from fastapi import APIRouter, HTTPException, Depends
from typing import Optional
from datetime import datetime
from bson import ObjectId

from ..db.db_config import get_database
from ..db.models import PetRequest, PetResponse
from .auth import get_current_user

router = APIRouter(prefix="/api/pets", tags=["Pets"])

@router.post("", response_model=PetResponse)
async def create_pet(
    pet: PetRequest,
    current_user = Depends(get_current_user)
):
    """Create a new pet listing (NGO only)"""
    # Verify user is an NGO
    if current_user["user_type"] != "NGO":
        raise HTTPException(status_code=403, detail="Only NGOs can add pets")
    
    db = get_database()
    
    # Create pet document
    pet_doc = {
        "ngo_user_id": current_user["id"],
        "name": pet.name,
        "type": pet.type,
        "age": pet.age,
        "location": pet.location,
        "image_url": pet.image_url,
        "vaccinated": pet.vaccinated,
        "neutered": pet.neutered,
        "medical_notes": pet.medical_notes,
        "created_at": datetime.utcnow()
    }
    
    result = db.pets.insert_one(pet_doc)
    
    return PetResponse(
        id=str(result.inserted_id),
        ngo_user_id=current_user["id"],
        name=pet.name,
        type=pet.type,
        age=pet.age,
        location=pet.location,
        image_url=pet.image_url,
        vaccinated=pet.vaccinated,
        neutered=pet.neutered,
        medical_notes=pet.medical_notes,
        created_at=pet_doc["created_at"].isoformat()
    )

@router.get("")
async def get_pets(
    type: Optional[str] = None,
    location: Optional[str] = None,
    limit: int = 20,
    skip: int = 0
):
    """Get list of available pets for adoption (public endpoint)"""
    db = get_database()
    
    # Build query filter
    query = {}
    if type:
        query["type"] = type
    if location:
        query["location"] = {"$regex": location, "$options": "i"}  # Case-insensitive search
    
    # Get pets with pagination
    pets = list(db.pets.find(query).skip(skip).limit(limit))
    total = db.pets.count_documents(query)
    
    # Convert ObjectId to string
    for pet in pets:
        pet["_id"] = str(pet["_id"])
    
    return {
        "pets": pets,
        "total": total,
        "page": skip // limit + 1 if limit > 0 else 1,
        "limit": limit
    }

@router.get("/{pet_id}")
async def get_pet_details(pet_id: str):
    """Get details of a specific pet"""
    db = get_database()
    
    try:
        pet = db.pets.find_one({"_id": ObjectId(pet_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid pet ID")
    
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")
    
    # Convert ObjectId to string
    pet["_id"] = str(pet["_id"])
    
    # Get NGO details
    try:
        ngo = db.users.find_one({"_id": ObjectId(pet["ngo_user_id"])})
    except:
        ngo = None
    
    if ngo:
        pet["ngo_name"] = ngo.get("name", "Unknown NGO")
        pet["ngo_email"] = ngo.get("email", "")
    
    return pet