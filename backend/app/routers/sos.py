from fastapi import APIRouter, HTTPException
from typing import List, Optional
from datetime import datetime, timedelta
from bson import ObjectId
from app.schemas import SOSCreate, SOSResponse, ThreatLevel
from app.database import get_sos_collection, get_alerts_collection

router = APIRouter(prefix="/api/sos", tags=["emergency"])

@router.post("/emergency", response_model=SOSResponse)
async def create_emergency_sos(sos: SOSCreate):
    """Create an emergency SOS incident"""
    
    collection = await get_sos_collection()
    
    sos_doc = {
        **sos.model_dump(),
        "created_at": datetime.utcnow(),
        "status": "active",
        "responders_assigned": 0,
        "eta_minutes": 15,  # Default ETA
        "safe_routes": [],
        "alerts_sent": [],
        "updates": [
            {
                "timestamp": datetime.utcnow(),
                "message": "Emergency SOS received and logged",
                "status": "active"
            }
        ]
    }
    
    result = await collection.insert_one(sos_doc)
    
    # Automatically create critical alert
    alerts_collection = await get_alerts_collection()
    await alerts_collection.insert_one({
        "title": f"Emergency SOS: {sos.incident_type}",
        "description": sos.description,
        "severity": "critical",
        "location": sos.location.model_dump(),
        "related_sos_id": str(result.inserted_id),
        "created_at": datetime.utcnow(),
        "resolved": False
    })
    
    return {
        **sos_doc,
        "id": str(result.inserted_id)
    }

@router.get("/incidents", response_model=List[SOSResponse])
async def get_active_sos_incidents(skip: int = 0, limit: int = 100):
    """Get all active SOS incidents"""
    
    collection = await get_sos_collection()
    incidents = await collection.find(
        {"status": "active"}
    ).sort("created_at", -1).skip(skip).limit(limit).to_list(length=limit)
    
    return [
        {**incident, "id": str(incident["_id"])}
        for incident in incidents
    ]

@router.get("/incidents/{sos_id}", response_model=SOSResponse)
async def get_sos_incident(sos_id: str):
    """Get a specific SOS incident"""
    
    collection = await get_sos_collection()
    incident = await collection.find_one({"_id": ObjectId(sos_id)})
    
    if not incident:
        raise HTTPException(status_code=404, detail="SOS incident not found")
    
    return {**incident, "id": str(incident["_id"])}

@router.put("/incidents/{sos_id}/status")
async def update_sos_status(sos_id: str, status: str):
    """Update SOS incident status (active, responding, resolved, cancelled)"""
    
    collection = await get_sos_collection()
    
    result = await collection.update_one(
        {"_id": ObjectId(sos_id)},
        {
            "$set": {
                "status": status,
                "resolved_at": datetime.utcnow() if status == "resolved" else None
            },
            "$push": {
                "updates": {
                    "timestamp": datetime.utcnow(),
                    "message": f"Status updated to {status}",
                    "status": status
                }
            }
        }
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="SOS incident not found")
    
    return {"message": f"SOS status updated to {status}"}

@router.put("/incidents/{sos_id}/responders")
async def assign_responders(sos_id: str, responder_count: int, eta_minutes: int):
    """Assign responders and set ETA"""
    
    collection = await get_sos_collection()
    
    result = await collection.update_one(
        {"_id": ObjectId(sos_id)},
        {
            "$set": {
                "responders_assigned": responder_count,
                "eta_minutes": eta_minutes
            }
        }
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="SOS incident not found")
    
    return {"message": f"{responder_count} responders assigned with {eta_minutes} min ETA"}

@router.get("/safe-routes/{sos_id}")
async def get_safe_routes(sos_id: str):
    """Get safe evacuation routes for an SOS incident"""
    
    collection = await get_sos_collection()
    incident = await collection.find_one({"_id": ObjectId(sos_id)})
    
    if not incident:
        raise HTTPException(status_code=404, detail="SOS incident not found")
    
    location = incident["location"]
    
    # Calculate safe routes (mock implementation)
    safe_routes = [
        {
            "route_id": 1,
            "name": "Northern Escape Route",
            "distance_km": 3.5,
            "estimated_time_min": 12,
            "waypoints": [
                {"lat": location["latitude"] + 0.01, "lng": location["longitude"] + 0.01},
                {"lat": location["latitude"] + 0.02, "lng": location["longitude"] + 0.02},
                {"lat": location["latitude"] + 0.03, "lng": location["longitude"] + 0.03}
            ],
            "safety_score": 0.95,
            "obstacles": []
        },
        {
            "route_id": 2,
            "name": "Southern Escape Route",
            "distance_km": 4.2,
            "estimated_time_min": 15,
            "waypoints": [
                {"lat": location["latitude"] - 0.01, "lng": location["longitude"] - 0.01},
                {"lat": location["latitude"] - 0.02, "lng": location["longitude"] - 0.02},
                {"lat": location["latitude"] - 0.03, "lng": location["longitude"] - 0.03}
            ],
            "safety_score": 0.88,
            "obstacles": ["track_damage"]
        }
    ]
    
    return {
        "sos_id": sos_id,
        "location": location,
        "safe_routes": safe_routes
    }

@router.get("/heatmap/risk-zones")
async def get_risk_heatmap(days: int = 30):
    """Get risk heatmap data for the past N days"""
    
    collection = await get_sos_collection()
    start_date = datetime.utcnow() - timedelta(days=days)
    
    incidents = await collection.find(
        {"created_at": {"$gte": start_date}}
    ).to_list(length=None)
    
    # Group incidents by location
    risk_zones = {}
    for incident in incidents:
        loc_key = f"{incident['location']['latitude']:.2f},{incident['location']['longitude']:.2f}"
        if loc_key not in risk_zones:
            risk_zones[loc_key] = {
                "latitude": incident['location']['latitude'],
                "longitude": incident['location']['longitude'],
                "incident_count": 0,
                "severity_levels": []
            }
        risk_zones[loc_key]["incident_count"] += 1
        risk_zones[loc_key]["severity_levels"].append(incident["severity"])
    
    return {
        "period_days": days,
        "risk_zones": list(risk_zones.values())
    }

@router.get("/statistics")
async def get_sos_statistics():
    """Get SOS system statistics"""
    
    collection = await get_sos_collection()
    
    total_incidents = await collection.count_documents({})
    active_incidents = await collection.count_documents({"status": "active"})
    resolved_incidents = await collection.count_documents({"status": "resolved"})
    
    # Average response time
    resolved = await collection.find(
        {"status": "resolved", "resolved_at": {"$exists": True}}
    ).to_list(length=100)
    
    avg_response_time = 0
    if resolved:
        response_times = [
            (inc["resolved_at"] - inc["created_at"]).total_seconds() / 60
            for inc in resolved
        ]
        avg_response_time = sum(response_times) / len(response_times)
    
    return {
        "total_incidents": total_incidents,
        "active_incidents": active_incidents,
        "resolved_incidents": resolved_incidents,
        "average_response_time_minutes": avg_response_time
    }
