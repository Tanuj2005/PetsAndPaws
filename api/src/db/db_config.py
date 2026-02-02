from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from pymongo.database import Database
import os

# MongoDB connection string - now reads from environment variable only
MONGDB_URI = os.getenv("MONGODB_URI")

if not MONGODB_URI:
    raise ValueError(
        "MONGODB_URI environment variable is not set. "
        "Please set it in your .env file or environment."
    )

# Database name
DATABASE_NAME = "pets_paws_db"

# Create MongoDB client
client = MongoClient(MONGODB_URI, server_api=ServerApi('1'))

def get_database() -> Database:
    """Get database instance"""
    return client[DATABASE_NAME]

def init_db():
    """Initialize database with indexes"""
    db = get_database()
    
    # Create indexes for users collection
    db.users.create_index("email", unique=True)
    
    # Create indexes for sessions collection
    db.sessions.create_index("token", unique=True)
    db.sessions.create_index("expires_at")
    
    # Create indexes for pets collection
    db.pets.create_index("ngo_user_id")
    
    print("✓ Database indexes initialized successfully!")

def test_connection():
    """Test MongoDB connection"""
    try:
        client.admin.command('ping')
        print("✓ Successfully connected to MongoDB!")
        return True
    except Exception as e:
        print(f"✗ Failed to connect to MongoDB: {e}")
        return False