import os
from dotenv import load_dotenv

# Load env before anything else
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from app.database import connect_db, disconnect_db
from app.routers import images, detections, features, sos, alerts, auth, detect, change_detection, export

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("railvision")

# Lifespan events
@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await disconnect_db()

# Create FastAPI app
app = FastAPI(
    title="RailVision AI Backend",
    description="AI-Powered Spatial Asset Management Platform for Indian Railways",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:3001,*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers
app.include_router(auth.router)
app.include_router(images.router)
app.include_router(detect.router)
app.include_router(detections.router)
app.include_router(change_detection.router)
app.include_router(features.router)
app.include_router(export.router)
app.include_router(sos.router)
app.include_router(alerts.router)

# Serve uploaded files
upload_dir = os.getenv("UPLOAD_DIR", "uploads")
os.makedirs(upload_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=upload_dir), name="uploads")

# Health check
@app.get("/health")
async def health_check():
    from app.database import is_fallback_mode
    return {
        "status": "healthy",
        "service": "RailVision AI Backend",
        "version": "1.0.0",
        "database": "in-memory (demo)" if is_fallback_mode() else "mongodb",
    }

# Root
@app.get("/")
async def root():
    return {
        "message": "Welcome to RailVision AI Backend",
        "docs": "/docs",
        "health": "/health",
        "endpoints": {
            "auth": "/api/auth/login | /api/auth/register | /api/auth/demo-login",
            "detect": "/api/detect",
            "change_detection": "/api/change-detection",
            "export": "/api/export/geojson | /api/export/csv | /api/export/report",
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
