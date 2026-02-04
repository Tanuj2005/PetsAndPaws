from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .db.db_config import init_db, test_connection
from .routes import auth, ngo, pets

app = FastAPI(title="Pets & Paws API")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup Event
@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    if test_connection():
        init_db()
    else:
        print("Warning: Could not connect to MongoDB!")

# Health Check
@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "ok", "message": "Pets & Paws API is running"}

# Include Routers
app.include_router(auth.router)
app.include_router(ngo.router)
app.include_router(pets.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)