from fastapi import APIRouter, HTTPException
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from app.schemas import GeoJSONFeature, GeoJSONCollection
from app.database import get_features_collection

router = APIRouter(prefix="/api/features", tags=["features"])

@router.get("/", response_model=GeoJSONCollection)
async def get_all_features():
    """Get all railway features as GeoJSON FeatureCollection"""
    
    collection = await get_features_collection()
    features_data = await collection.find().to_list(length=None)
    
    features = [
        {
            "type": "Feature",
            "geometry": feature.get("geometry", {}),
            "properties": feature.get("properties", {})
        }
        for feature in features_data
    ]
    
    return {
        "type": "FeatureCollection",
        "features": features
    }

@router.post("/", response_model=dict)
async def create_feature(feature: GeoJSONFeature):
    """Create a new railway feature"""
    
    collection = await get_features_collection()
    
    feature_doc = {
        **feature.model_dump(),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = await collection.insert_one(feature_doc)
    
    return {
        "id": str(result.inserted_id),
        "message": "Feature created successfully"
    }

@router.get("/{feature_id}")
async def get_feature(feature_id: str):
    """Get a specific feature"""
    
    collection = await get_features_collection()
    feature = await collection.find_one({"_id": ObjectId(feature_id)})
    
    if not feature:
        raise HTTPException(status_code=404, detail="Feature not found")
    
    return {
        "id": str(feature["_id"]),
        "type": "Feature",
        "geometry": feature.get("geometry", {}),
        "properties": feature.get("properties", {})
    }

@router.get("/by-type/{feature_type}")
async def get_features_by_type(feature_type: str):
    """Get features by type (track, station, bridge, encroachment)"""
    
    collection = await get_features_collection()
    features_data = await collection.find(
        {"properties.type": feature_type}
    ).to_list(length=None)
    
    features = [
        {
            "id": str(f["_id"]),
            "type": "Feature",
            "geometry": f.get("geometry", {}),
            "properties": f.get("properties", {})
        }
        for f in features_data
    ]
    
    return {
        "type": "FeatureCollection",
        "features": features
    }

@router.put("/{feature_id}")
async def update_feature(feature_id: str, feature: GeoJSONFeature):
    """Update a feature"""
    
    collection = await get_features_collection()
    
    update_data = {
        **feature.model_dump(),
        "updated_at": datetime.utcnow()
    }
    
    result = await collection.update_one(
        {"_id": ObjectId(feature_id)},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Feature not found")
    
    return {"message": "Feature updated successfully"}

@router.delete("/{feature_id}")
async def delete_feature(feature_id: str):
    """Delete a feature"""
    
    collection = await get_features_collection()
    result = await collection.delete_one({"_id": ObjectId(feature_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Feature not found")
    
    return {"message": "Feature deleted successfully"}

@router.post("/bulk-load")
async def bulk_load_features(features: List[GeoJSONFeature]):
    """Bulk load multiple features"""
    
    collection = await get_features_collection()
    
    docs = [
        {
            **feature.model_dump(),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        for feature in features
    ]
    
    result = await collection.insert_many(docs)
    
    return {
        "inserted_count": len(result.inserted_ids),
        "message": f"{len(result.inserted_ids)} features loaded successfully"
    }
