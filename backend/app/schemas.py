from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum

# Enums
class ThreatLevel(str, Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    SAFE = "safe"

class DetectionType(str, Enum):
    TRACK = "track"
    SLEEPER = "sleeper"
    ENCROACHMENT = "encroachment"
    DAMAGE = "damage"
    VEGETATION = "vegetation"

class AlertSeverity(str, Enum):
    CRITICAL = "critical"
    WARNING = "warning"
    INFO = "info"

# Base Models
class LocationModel(BaseModel):
    latitude: float
    longitude: float
    altitude: Optional[float] = None

class BoundingBoxModel(BaseModel):
    x: float
    y: float
    width: float
    height: float

# Image Models
class ImageCreate(BaseModel):
    filename: str
    path: str
    location: LocationModel
    file_size: int
    mime_type: str = "image/jpeg"
    metadata: Optional[dict] = None

class ImageResponse(ImageCreate):
    id: str = Field(alias="_id")
    uploaded_at: datetime
    status: str = "processing"
    processing_time: Optional[float] = None

    class Config:
        populate_by_name = True

# Detection Models
class DetectionCreate(BaseModel):
    image_id: str
    detection_type: DetectionType
    confidence: float
    bounding_box: BoundingBoxModel
    location: LocationModel
    severity: Optional[str] = None

class DetectionResponse(DetectionCreate):
    id: str = Field(alias="_id")
    detected_at: datetime
    verified: bool = False

    class Config:
        populate_by_name = True

# GeoJSON Feature Models
class GeoJSONProperties(BaseModel):
    name: str
    type: str
    description: Optional[str] = None
    status: Optional[str] = None
    last_inspected: Optional[datetime] = None
    risk_level: Optional[str] = None

class GeoJSONGeometry(BaseModel):
    type: str
    coordinates: List

class GeoJSONFeature(BaseModel):
    type: str = "Feature"
    geometry: GeoJSONGeometry
    properties: GeoJSONProperties

class GeoJSONCollection(BaseModel):
    type: str = "FeatureCollection"
    features: List[GeoJSONFeature]

# Alert Models
class AlertCreate(BaseModel):
    title: str
    description: str
    severity: AlertSeverity
    location: LocationModel
    related_detection_id: Optional[str] = None
    related_image_id: Optional[str] = None

class AlertResponse(AlertCreate):
    id: str = Field(alias="_id")
    created_at: datetime
    resolved: bool = False
    resolved_at: Optional[datetime] = None

    class Config:
        populate_by_name = True

# SOS/Emergency Models
class SOSCreate(BaseModel):
    user_id: str
    location: LocationModel
    description: str
    incident_type: str
    severity: ThreatLevel
    images: Optional[List[str]] = None
    contact_info: Optional[str] = None

class SOSResponse(SOSCreate):
    id: str = Field(alias="_id")
    created_at: datetime
    status: str = "active"
    responders_assigned: int = 0
    eta_minutes: Optional[int] = None
    safe_routes: Optional[List] = None

    class Config:
        populate_by_name = True

# Dashboard Statistics Models
class StatisticsResponse(BaseModel):
    total_images: int
    total_detections: int
    total_tracks: int
    total_stations: int
    total_bridges: int
    total_encroachments: int
    critical_alerts: int
    processing_time_avg: float
    threat_level: ThreatLevel
    detections_by_type: dict
    alerts_by_severity: dict
    recent_alerts: List[AlertResponse]

# User Models
class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str
    role: str = "user"

class UserResponse(BaseModel):
    id: str = Field(alias="_id")
    email: str
    full_name: str
    role: str
    created_at: datetime

    class Config:
        populate_by_name = True

# Analysis Results
class AnalysisResult(BaseModel):
    image_id: str
    detections: List[DetectionResponse]
    threat_level: ThreatLevel
    confidence_score: float
    processing_time_ms: float
    timestamp: datetime

class RiskHeatmapData(BaseModel):
    location: LocationModel
    risk_level: ThreatLevel
    incident_count: int
    last_incident: Optional[datetime] = None
