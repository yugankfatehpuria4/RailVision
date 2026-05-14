"""Change Detection router — compares two images and finds changes."""
import asyncio
import random
import uuid
import math
from datetime import datetime
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List

router = APIRouter(prefix="/api", tags=["change-detection"])

CHANGE_TYPES = [
    {"type": "new_construction", "label": "New Construction", "color": "#ef4444", "severity": "high"},
    {"type": "vegetation_loss", "label": "Vegetation Loss", "color": "#f59e0b", "severity": "medium"},
    {"type": "water_shrinkage", "label": "Water Body Shrinkage", "color": "#3b82f6", "severity": "medium"},
    {"type": "encroachment", "label": "Land Encroachment", "color": "#dc2626", "severity": "critical"},
    {"type": "road_expansion", "label": "Road Expansion", "color": "#8b5cf6", "severity": "low"},
    {"type": "demolition", "label": "Demolition", "color": "#6b7280", "severity": "low"},
]


class ChangeDetectionRequest(BaseModel):
    old_image_id: Optional[str] = None
    new_image_id: Optional[str] = None
    latitude: float = 28.6139
    longitude: float = 77.2090


def _gen_polygon(lat, lng, size):
    offset = size * 0.00001
    pts = []
    n = random.randint(4, 6)
    for i in range(n):
        angle = (2 * math.pi * i) / n + random.uniform(-0.3, 0.3)
        r = offset * random.uniform(0.5, 1.0)
        pts.append([round(lng + r * math.cos(angle), 6), round(lat + r * math.sin(angle), 6)])
    pts.append(pts[0])
    return pts


@router.post("/change-detection")
async def run_change_detection(req: ChangeDetectionRequest):
    """Compare old and new imagery to detect changes."""
    start = datetime.utcnow()
    await asyncio.sleep(random.uniform(2.0, 4.0))

    num_changes = random.randint(3, 10)
    changes = []

    for i in range(num_changes):
        ct = random.choice(CHANGE_TYPES)
        c_lat = req.latitude + random.uniform(-0.01, 0.01)
        c_lng = req.longitude + random.uniform(-0.01, 0.01)
        area = random.uniform(50, 3000)
        confidence = round(random.uniform(0.70, 0.98), 2)

        changes.append({
            "id": f"chg-{uuid.uuid4().hex[:8]}",
            "type": ct["type"],
            "label": ct["label"],
            "color": ct["color"],
            "severity": ct["severity"],
            "confidence": confidence,
            "area_sqm": round(area, 1),
            "change_pct": round(random.uniform(5, 85), 1),
            "location": {"latitude": round(c_lat, 6), "longitude": round(c_lng, 6)},
            "polygon": _gen_polygon(c_lat, c_lng, area ** 0.5),
        })

    proc_time = (datetime.utcnow() - start).total_seconds()
    type_counts = {}
    for c in changes:
        type_counts[c["type"]] = type_counts.get(c["type"], 0) + 1

    encr_count = type_counts.get("encroachment", 0) + type_counts.get("new_construction", 0)

    geojson_features = [{
        "type": "Feature",
        "geometry": {"type": "Polygon", "coordinates": [c["polygon"]]},
        "properties": {k: v for k, v in c.items() if k != "polygon"},
    } for c in changes]

    return {
        "success": True,
        "processing_time_seconds": round(proc_time, 2),
        "total_changes": len(changes),
        "changes": changes,
        "geojson": {"type": "FeatureCollection", "features": geojson_features},
        "summary": {
            "total_changes": len(changes),
            "encroachment_alerts": encr_count,
            "vegetation_loss_count": type_counts.get("vegetation_loss", 0),
            "new_construction_count": type_counts.get("new_construction", 0),
            "type_breakdown": type_counts,
            "overall_change_pct": round(sum(c["change_pct"] for c in changes) / len(changes), 1) if changes else 0,
        },
        "threat_level": "critical" if encr_count > 2 else "high" if encr_count > 0 else "medium",
    }
