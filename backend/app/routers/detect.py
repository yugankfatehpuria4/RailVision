"""AI Detection router — generates realistic dummy detections for uploaded images."""
import asyncio
import random
import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from app.database import get_detections_collection, get_images_collection, get_alerts_collection

router = APIRouter(prefix="/api", tags=["detection"])

# Asset types that our "AI" can detect
ASSET_TYPES = [
    {"type": "building", "icon": "🏠", "color": "#ef4444", "min_area": 80, "max_area": 2000},
    {"type": "road", "icon": "🛤️", "color": "#6366f1", "min_area": 200, "max_area": 5000},
    {"type": "water_body", "icon": "💧", "color": "#3b82f6", "min_area": 500, "max_area": 10000},
    {"type": "vegetation", "icon": "🌳", "color": "#22c55e", "min_area": 300, "max_area": 8000},
    {"type": "drain", "icon": "🔧", "color": "#a855f7", "min_area": 50, "max_area": 500},
    {"type": "open_space", "icon": "🏜️", "color": "#f59e0b", "min_area": 1000, "max_area": 15000},
    {"type": "railway_track", "icon": "🚂", "color": "#0ea5e9", "min_area": 100, "max_area": 3000},
    {"type": "encroachment", "icon": "🚨", "color": "#dc2626", "min_area": 50, "max_area": 800},
]


class DetectRequest(BaseModel):
    image_id: Optional[str] = None
    latitude: float = 28.6139
    longitude: float = 77.2090
    detection_mode: str = "full"  # full, quick, encroachment_only


class DetectionResult(BaseModel):
    id: str
    type: str
    label: str
    confidence: float
    area_sqm: float
    bbox: dict
    polygon: List[List[float]]
    location: dict
    severity: Optional[str] = None
    icon: str
    color: str


def _generate_polygon(center_lat: float, center_lng: float, size: float):
    """Generate a random polygon around a center point."""
    offset = size * 0.00001
    points = []
    num_points = random.randint(4, 8)
    import math
    for i in range(num_points):
        angle = (2 * math.pi * i) / num_points + random.uniform(-0.3, 0.3)
        r = offset * random.uniform(0.5, 1.0)
        points.append([
            round(center_lng + r * math.cos(angle), 6),
            round(center_lat + r * math.sin(angle), 6)
        ])
    points.append(points[0])  # Close polygon
    return points


def _generate_detections(lat: float, lng: float, mode: str):
    """Generate realistic dummy detections."""
    detections = []
    num_detections = random.randint(8, 18)

    if mode == "encroachment_only":
        asset_pool = [a for a in ASSET_TYPES if a["type"] == "encroachment"]
        num_detections = random.randint(2, 6)
    elif mode == "quick":
        asset_pool = ASSET_TYPES[:4]
        num_detections = random.randint(4, 8)
    else:
        asset_pool = ASSET_TYPES

    for i in range(num_detections):
        asset = random.choice(asset_pool)
        # Spread detections around the center
        det_lat = lat + random.uniform(-0.015, 0.015)
        det_lng = lng + random.uniform(-0.015, 0.015)
        area = random.uniform(asset["min_area"], asset["max_area"])
        confidence = round(random.uniform(0.72, 0.99), 2)

        severity = None
        if asset["type"] == "encroachment":
            severity = random.choice(["critical", "high", "medium"])
        elif asset["type"] == "drain" and confidence < 0.8:
            severity = "warning"

        bbox_w = random.randint(40, 200)
        bbox_h = random.randint(40, 200)

        detections.append(DetectionResult(
            id=f"det-{uuid.uuid4().hex[:8]}",
            type=asset["type"],
            label=f"{asset['type'].replace('_', ' ').title()} #{i+1}",
            confidence=confidence,
            area_sqm=round(area, 1),
            bbox={"x": random.randint(10, 400), "y": random.randint(10, 400), "width": bbox_w, "height": bbox_h},
            polygon=_generate_polygon(det_lat, det_lng, area ** 0.5),
            location={"latitude": round(det_lat, 6), "longitude": round(det_lng, 6)},
            severity=severity,
            icon=asset["icon"],
            color=asset["color"],
        ))

    return detections


@router.post("/detect")
async def run_detection(req: DetectRequest):
    """Run AI detection on an uploaded image. Returns realistic dummy results."""
    start_time = datetime.utcnow()

    # Simulate AI processing time (1.5-3 seconds)
    await asyncio.sleep(random.uniform(1.5, 3.0))

    detections = _generate_detections(req.latitude, req.longitude, req.detection_mode)

    processing_time = (datetime.utcnow() - start_time).total_seconds()

    # Store detections in DB
    det_collection = await get_detections_collection()
    for det in detections:
        await det_collection.insert_one({
            "image_id": req.image_id or "manual",
            "detection_type": det.type,
            "confidence": det.confidence,
            "bounding_box": det.bbox,
            "location": det.location,
            "severity": det.severity,
            "area_sqm": det.area_sqm,
            "polygon": det.polygon,
            "detected_at": datetime.utcnow(),
            "verified": False,
        })

    # Create alerts for encroachments
    alert_collection = await get_alerts_collection()
    encroachments = [d for d in detections if d.type == "encroachment"]
    for enc in encroachments:
        await alert_collection.insert_one({
            "title": f"🚨 Encroachment: {enc.label}",
            "description": f"Unauthorized structure detected. Area: {enc.area_sqm}m², Confidence: {enc.confidence*100:.0f}%",
            "severity": enc.severity or "warning",
            "location": enc.location,
            "created_at": datetime.utcnow(),
            "resolved": False,
            "resolved_at": None,
        })

    # Build GeoJSON FeatureCollection
    geojson_features = []
    for det in detections:
        geojson_features.append({
            "type": "Feature",
            "geometry": {"type": "Polygon", "coordinates": [det.polygon]},
            "properties": {
                "id": det.id,
                "type": det.type,
                "label": det.label,
                "confidence": det.confidence,
                "area_sqm": det.area_sqm,
                "severity": det.severity,
                "icon": det.icon,
                "color": det.color,
            },
        })

    # Summary stats
    type_counts = {}
    for d in detections:
        type_counts[d.type] = type_counts.get(d.type, 0) + 1

    total_area = sum(d.area_sqm for d in detections)
    avg_confidence = sum(d.confidence for d in detections) / len(detections) if detections else 0
    green_cover = sum(d.area_sqm for d in detections if d.type == "vegetation")
    water_area = sum(d.area_sqm for d in detections if d.type == "water_body")

    return {
        "success": True,
        "image_id": req.image_id,
        "processing_time_seconds": round(processing_time, 2),
        "total_detections": len(detections),
        "detections": [d.model_dump() for d in detections],
        "geojson": {"type": "FeatureCollection", "features": geojson_features},
        "summary": {
            "total_detections": len(detections),
            "total_area_sqm": round(total_area, 1),
            "average_confidence": round(avg_confidence, 2),
            "green_cover_sqm": round(green_cover, 1),
            "green_cover_pct": round((green_cover / total_area * 100) if total_area > 0 else 0, 1),
            "water_area_sqm": round(water_area, 1),
            "encroachment_count": type_counts.get("encroachment", 0),
            "building_count": type_counts.get("building", 0),
            "type_breakdown": type_counts,
        },
        "threat_level": "critical" if type_counts.get("encroachment", 0) > 3 else "high" if type_counts.get("encroachment", 0) > 1 else "medium" if type_counts.get("encroachment", 0) > 0 else "low",
        "alerts_generated": len(encroachments),
    }
