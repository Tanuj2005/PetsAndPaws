from pydantic import BaseModel, EmailStr
from typing import Optional, Literal

# Request Models
class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    name: str
    user_type: Literal['NGO', 'Adopter']

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# Response Models
class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    user_type: str

class AuthResponse(BaseModel):
    token: str
    user: UserResponse
    redirect_url: str  # URL to redirect user based on type

# Pet Models
class PetRequest(BaseModel):
    name: str
    type: Literal['Dog', 'Cat']
    age: int
    location: str
    image_url: str
    vaccinated: bool
    neutered: bool
    medical_notes: Optional[str] = None

class PetResponse(BaseModel):
    id: str
    ngo_user_id: str
    name: str
    type: str
    age: int
    location: str
    image_url: str
    vaccinated: bool
    neutered: bool
    medical_notes: Optional[str]
    created_at: str