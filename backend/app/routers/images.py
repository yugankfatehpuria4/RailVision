from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from app.schemas import ImageCreate, ImageResponse, LocationModel
from app.database import get_images_collection

router = APIRouter(prefix="/api/images", tags=["images"])

@router.post("/upload", response_model=ImageResponse)
async def upload_image(
    file: UploadFile = File(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    altitude: Optional[float] = Form(None)
):
    """Upload an image with location data"""
    
    # Read file content
    contents = await file.read()
    file_size = len(contents)
    
    # Create image document
    image_doc = {
        "filename": file.filename,
        "path": f"uploads/{file.filename}",
        "location": {
            "latitude": latitude,
            "longitude": longitude,
            "altitude": altitude
        },
        "file_size": file_size,
        "mime_type": file.content_type,
        "uploaded_at": datetime.utcnow(),
        "status": "processing",
        "processing_time": None,
        "metadata": {
            "device": "mobile",
            "user_agent": ""
        }
    }
    
    # Insert into database
    collection = await get_images_collection()
    result = await collection.insert_one(image_doc)
    
    return {
        **image_doc,
        "id": str(result.inserted_id)
    }

@router.get("/", response_model=List[ImageResponse])
async def list_images(skip: int = 0, limit: int = 100):
    """List all uploaded images"""
    
    collection = await get_images_collection()
    images = await collection.find().skip(skip).limit(limit).to_list(length=limit)
    
    return [
        {**image, "id": str(image["_id"])}
        for image in images
    ]

@router.get("/{image_id}", response_model=ImageResponse)
async def get_image(image_id: str):
    """Get a specific image by ID"""
    
    collection = await get_images_collection()
    image = await collection.find_one({"_id": ObjectId(image_id)})
    
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    
    return {**image, "id": str(image["_id"])}

@router.delete("/{image_id}")
async def delete_image(image_id: str):
    """Delete an image"""
    
    collection = await get_images_collection()
    result = await collection.delete_one({"_id": ObjectId(image_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Image not found")
    
    return {"message": "Image deleted successfully"}

@router.put("/{image_id}/status")
async def update_image_status(image_id: str, status: str, processing_time: Optional[float] = None):
    """Update image processing status"""
    
    collection = await get_images_collection()
    update_data = {"status": status}
    if processing_time:
        update_data["processing_time"] = processing_time
    
    result = await collection.update_one(
        {"_id": ObjectId(image_id)},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Image not found")
    
    return {"message": "Image status updated"}

@router.get("/location/nearby")
async def get_nearby_images(latitude: float, longitude: float, radius_km: float = 5):
    """Get images within a certain radius of a location"""
    
    collection = await get_images_collection()
    radius_meters = radius_km * 1000
    
    images = await collection.find({
        "location": {
            "$nearSphere": {
                "$geometry": {
                    "type": "Point",
                    "coordinates": [longitude, latitude]
                },
                "$maxDistance": radius_meters
            }
        }
    }).to_list(length=100)
    
    return [
        {**image, "id": str(image["_id"])}
        for image in images
    ]
