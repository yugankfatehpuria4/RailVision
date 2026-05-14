from fastapi import APIRouter, HTTPException
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from app.schemas import DetectionCreate, DetectionResponse, ThreatLevel
from app.database import get_detections_collection

router = APIRouter(prefix="/api/detections", tags=["detections"])

@router.post("/", response_model=DetectionResponse)
async def create_detection(detection: DetectionCreate):
    """Create a new detection"""
    
    collection = await get_detections_collection()
    
    detection_doc = {
        **detection.model_dump(),
        "detected_at": datetime.utcnow(),
        "verified": False
    }
    
    result = await collection.insert_one(detection_doc)
    
    return {
        **detection_doc,
        "id": str(result.inserted_id)
    }

@router.get("/", response_model=List[DetectionResponse])
async def list_detections(
    image_id: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
):
    """List detections, optionally filtered by image"""
    
    collection = await get_detections_collection()
    
    query = {}
    if image_id:
        query["image_id"] = image_id
    
    detections = await collection.find(query).skip(skip).limit(limit).to_list(length=limit)
    
    return [
        {**detection, "id": str(detection["_id"])}
        for detection in detections
    ]

@router.get("/{detection_id}", response_model=DetectionResponse)
async def get_detection(detection_id: str):
    """Get a specific detection"""
    
    collection = await get_detections_collection()
    detection = await collection.find_one({"_id": ObjectId(detection_id)})
    
    if not detection:
        raise HTTPException(status_code=404, detail="Detection not found")
    
    return {**detection, "id": str(detection["_id"])}

@router.put("/{detection_id}/verify")
async def verify_detection(detection_id: str):
    """Verify a detection"""
    
    collection = await get_detections_collection()
    result = await collection.update_one(
        {"_id": ObjectId(detection_id)},
        {"$set": {"verified": True}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Detection not found")
    
    return {"message": "Detection verified"}

@router.get("/by-severity/{severity}")
async def get_detections_by_severity(severity: str, skip: int = 0, limit: int = 100):
    """Get detections by severity level"""
    
    collection = await get_detections_collection()
    detections = await collection.find(
        {"severity": severity}
    ).skip(skip).limit(limit).to_list(length=limit)
    
    return [
        {**detection, "id": str(detection["_id"])}
        for detection in detections
    ]

@router.get("/analytics/summary")
async def get_detections_summary():
    """Get detection analytics summary"""
    
    collection = await get_detections_collection()
    
    total = await collection.count_documents({})
    verified = await collection.count_documents({"verified": True})
    
    # Count by type
    by_type = await collection.aggregate([
        {"$group": {"_id": "$detection_type", "count": {"$sum": 1}}}
    ]).to_list(length=None)
    
    # Count by severity
    by_severity = await collection.aggregate([
        {"$group": {"_id": "$severity", "count": {"$sum": 1}}}
    ]).to_list(length=None)
    
    # Average confidence
    avg_confidence = await collection.aggregate([
        {"$group": {"_id": None, "avg": {"$avg": "$confidence"}}}
    ]).to_list(length=1)
    
    return {
        "total_detections": total,
        "verified_detections": verified,
        "detections_by_type": {item["_id"]: item["count"] for item in by_type},
        "detections_by_severity": {item["_id"]: item["count"] for item in by_severity},
        "average_confidence": avg_confidence[0]["avg"] if avg_confidence else 0
    }
