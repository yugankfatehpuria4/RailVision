"""Export router — GeoJSON, CSV, and report exports."""
import csv
import io
import json
from datetime import datetime
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.database import get_detections_collection, get_features_collection, get_alerts_collection

router = APIRouter(prefix="/api/export", tags=["export"])


@router.get("/geojson")
async def export_geojson():
    """Export all detections and features as GeoJSON."""
    features_coll = await get_features_collection()
    det_coll = await get_detections_collection()

    features_data = await features_coll.find().to_list(length=500)
    detections_data = await det_coll.find().to_list(length=500)

    geojson_features = []

    for f in features_data:
        geojson_features.append({
            "type": "Feature",
            "geometry": f.get("geometry", {}),
            "properties": {**(f.get("properties", {})), "source": "feature"},
        })

    for d in detections_data:
        if "polygon" in d:
            geojson_features.append({
                "type": "Feature",
                "geometry": {"type": "Polygon", "coordinates": [d["polygon"]]},
                "properties": {
                    "type": d.get("detection_type", "unknown"),
                    "confidence": d.get("confidence", 0),
                    "severity": d.get("severity"),
                    "area_sqm": d.get("area_sqm", 0),
                    "detected_at": str(d.get("detected_at", "")),
                    "source": "detection",
                },
            })

    collection = {
        "type": "FeatureCollection",
        "features": geojson_features,
        "metadata": {
            "exported_at": datetime.utcnow().isoformat(),
            "total_features": len(geojson_features),
            "platform": "RailVision AI",
        },
    }

    content = json.dumps(collection, indent=2, default=str)
    return StreamingResponse(
        io.BytesIO(content.encode()),
        media_type="application/geo+json",
        headers={"Content-Disposition": "attachment; filename=railvision_export.geojson"},
    )


@router.get("/csv")
async def export_csv():
    """Export detections as CSV."""
    det_coll = await get_detections_collection()
    detections = await det_coll.find().to_list(length=1000)

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Type", "Confidence", "Severity", "Area (m²)", "Latitude", "Longitude", "Detected At", "Verified"])

    for d in detections:
        loc = d.get("location", {})
        writer.writerow([
            str(d.get("_id", "")),
            d.get("detection_type", ""),
            d.get("confidence", ""),
            d.get("severity", ""),
            d.get("area_sqm", ""),
            loc.get("latitude", ""),
            loc.get("longitude", ""),
            str(d.get("detected_at", "")),
            d.get("verified", False),
        ])

    content = output.getvalue()
    return StreamingResponse(
        io.BytesIO(content.encode()),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=railvision_detections.csv"},
    )


@router.get("/report")
async def export_report():
    """Generate a summary report."""
    det_coll = await get_detections_collection()
    alert_coll = await get_alerts_collection()
    feat_coll = await get_features_collection()

    total_detections = await det_coll.count_documents({})
    total_alerts = await alert_coll.count_documents({})
    unresolved_alerts = await alert_coll.count_documents({"resolved": False})
    total_features = await feat_coll.count_documents({})

    detections = await det_coll.find().to_list(length=500)
    type_counts = {}
    total_area = 0
    confidences = []
    for d in detections:
        dt = d.get("detection_type", "unknown")
        type_counts[dt] = type_counts.get(dt, 0) + 1
        total_area += d.get("area_sqm", 0)
        confidences.append(d.get("confidence", 0))

    avg_conf = sum(confidences) / len(confidences) if confidences else 0

    return {
        "report": {
            "title": "RailVision AI — Spatial Intelligence Report",
            "generated_at": datetime.utcnow().isoformat(),
            "platform": "RailVision AI v1.0",
            "summary": {
                "total_detections": total_detections,
                "total_features": total_features,
                "total_alerts": total_alerts,
                "unresolved_alerts": unresolved_alerts,
                "total_area_analyzed_sqm": round(total_area, 1),
                "average_confidence": round(avg_conf, 2),
            },
            "detection_breakdown": type_counts,
            "risk_assessment": {
                "encroachments": type_counts.get("encroachment", 0),
                "threat_level": "critical" if type_counts.get("encroachment", 0) > 3 else "high" if type_counts.get("encroachment", 0) > 1 else "low",
            },
        }
    }
