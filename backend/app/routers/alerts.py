from fastapi import APIRouter, HTTPException
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from app.schemas import AlertCreate, AlertResponse
from app.database import get_alerts_collection

router = APIRouter(prefix="/api/alerts", tags=["alerts"])

@router.post("/", response_model=AlertResponse)
async def create_alert(alert: AlertCreate):
    """Create a new alert"""
    
    collection = await get_alerts_collection()
    
    alert_doc = {
        **alert.model_dump(),
        "created_at": datetime.utcnow(),
        "resolved": False,
        "resolved_at": None
    }
    
    result = await collection.insert_one(alert_doc)
    
    return {
        **alert_doc,
        "id": str(result.inserted_id)
    }

@router.get("/", response_model=List[AlertResponse])
async def list_alerts(
    resolved: Optional[bool] = None,
    skip: int = 0,
    limit: int = 100
):
    """List alerts, optionally filtered by resolved status"""
    
    collection = await get_alerts_collection()
    
    query = {}
    if resolved is not None:
        query["resolved"] = resolved
    
    alerts = await collection.find(query).sort("created_at", -1).skip(skip).limit(limit).to_list(length=limit)
    
    return [
        {**alert, "id": str(alert["_id"])}
        for alert in alerts
    ]

@router.get("/by-severity/{severity}")
async def get_alerts_by_severity(severity: str, skip: int = 0, limit: int = 100):
    """Get alerts by severity level"""
    
    collection = await get_alerts_collection()
    alerts = await collection.find(
        {"severity": severity}
    ).sort("created_at", -1).skip(skip).limit(limit).to_list(length=limit)
    
    return [
        {**alert, "id": str(alert["_id"])}
        for alert in alerts
    ]

@router.get("/{alert_id}", response_model=AlertResponse)
async def get_alert(alert_id: str):
    """Get a specific alert"""
    
    collection = await get_alerts_collection()
    alert = await collection.find_one({"_id": ObjectId(alert_id)})
    
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    return {**alert, "id": str(alert["_id"])}

@router.put("/{alert_id}/resolve")
async def resolve_alert(alert_id: str):
    """Mark an alert as resolved"""
    
    collection = await get_alerts_collection()
    result = await collection.update_one(
        {"_id": ObjectId(alert_id)},
        {
            "$set": {
                "resolved": True,
                "resolved_at": datetime.utcnow()
            }
        }
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    return {"message": "Alert resolved"}

@router.delete("/{alert_id}")
async def delete_alert(alert_id: str):
    """Delete an alert"""
    
    collection = await get_alerts_collection()
    result = await collection.delete_one({"_id": ObjectId(alert_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    return {"message": "Alert deleted"}

@router.get("/analytics/summary")
async def get_alerts_summary():
    """Get alert analytics summary"""
    
    collection = await get_alerts_collection()
    
    total = await collection.count_documents({})
    unresolved = await collection.count_documents({"resolved": False})
    
    # Count by severity
    by_severity = await collection.aggregate([
        {"$group": {"_id": "$severity", "count": {"$sum": 1}}}
    ]).to_list(length=None)
    
    return {
        "total_alerts": total,
        "unresolved_alerts": unresolved,
        "alerts_by_severity": {item["_id"]: item["count"] for item in by_severity}
    }
