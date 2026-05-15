"""
RailVision AI — YOLOv8 Segmentation Inference Engine

Loads the pre-trained YOLOv8s-seg model and provides a unified prediction
interface.  Model classes:

    0: Building   1: Tree       2: Park
    3: WaterBody  4: Road       5: Drain

The engine returns structured detection results compatible with the
existing frontend display format.
"""

import os
import math
import logging
import uuid
from pathlib import Path
from typing import Any

import cv2
import numpy as np

logger = logging.getLogger("railvision.ml")

# ── Class metadata (matches frontend asset display) ────────────────────────

CLASS_META = {
    0: {"type": "building",    "icon": "🏠", "color": "#ef4444", "label_prefix": "Building"},
    1: {"type": "vegetation",  "icon": "🌳", "color": "#22c55e", "label_prefix": "Tree"},
    2: {"type": "open_space",  "icon": "🏜️", "color": "#f59e0b", "label_prefix": "Park"},
    3: {"type": "water_body",  "icon": "💧", "color": "#3b82f6", "label_prefix": "Water Body"},
    4: {"type": "road",        "icon": "🛤️", "color": "#6366f1", "label_prefix": "Road"},
    5: {"type": "drain",       "icon": "🔧", "color": "#a855f7", "label_prefix": "Drain"},
}

# Severity mapping based on asset type
SEVERITY_MAP = {
    "building":   lambda conf: "high"     if conf > 0.85 else "medium",
    "vegetation": lambda conf: None,
    "open_space": lambda conf: None,
    "water_body": lambda conf: None,
    "road":       lambda conf: None,
    "drain":      lambda conf: "warning"  if conf < 0.8 else None,
}


class YOLOEngine:
    """Singleton wrapper around ultralytics YOLO for inference."""

    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._model = None
            cls._instance._loaded = False
        return cls._instance

    # ── Loading ────────────────────────────────────────────────────────────

    def load(self, model_path: str | None = None):
        """Load the YOLO model from disk. Called once at startup."""
        if self._loaded:
            return

        if model_path is None:
            # Default: <project>/backend/models/best.pt
            model_path = str(
                Path(__file__).resolve().parent.parent / "models" / "best.pt"
            )

        if not os.path.isfile(model_path):
            logger.warning("Model file not found at %s — inference disabled", model_path)
            return

        try:
            from ultralytics import YOLO
            self._model = YOLO(model_path)
            self._loaded = True
            logger.info(
                "YOLOv8 model loaded (%s classes: %s)",
                len(self._model.names),
                self._model.names,
            )
        except Exception as exc:
            logger.error("Failed to load YOLO model: %s", exc)
            self._model = None

    @property
    def is_available(self) -> bool:
        return self._loaded and self._model is not None

    # ── Inference ──────────────────────────────────────────────────────────

    def predict(
        self,
        image_path: str,
        latitude: float = 0.0,
        longitude: float = 0.0,
        confidence_threshold: float = 0.25,
        iou_threshold: float = 0.45,
        image_size: int = 640,
    ) -> dict[str, Any]:
        """
        Run inference on a single image and return structured results.

        Returns a dict with keys:
            success, detections, geojson, summary, threat_level,
            processing_time_seconds, alerts_generated
        """
        if not self.is_available:
            return self._empty_result("Model not loaded")

        if not os.path.isfile(image_path):
            return self._empty_result("Image file not found")

        import time
        t0 = time.time()

        try:
            results = self._model.predict(
                source=image_path,
                imgsz=image_size,
                conf=confidence_threshold,
                iou=iou_threshold,
                verbose=False,
            )
        except Exception as exc:
            logger.error("YOLO inference failed: %s", exc)
            return self._empty_result(f"Inference error: {exc}")

        elapsed = time.time() - t0

        # Parse results
        detections = []
        r = results[0]
        img_h, img_w = r.orig_shape

        if r.boxes is not None and len(r.boxes) > 0:
            for i in range(len(r.boxes)):
                cls_id = int(r.boxes.cls[i])
                conf   = float(r.boxes.conf[i])
                xyxy   = r.boxes.xyxy[i].tolist()

                meta = CLASS_META.get(cls_id, {
                    "type": "unknown", "icon": "📍",
                    "color": "#6b7280", "label_prefix": "Object",
                })

                # Bounding box
                x1, y1, x2, y2 = xyxy
                bbox = {
                    "x": int(x1), "y": int(y1),
                    "width": int(x2 - x1), "height": int(y2 - y1),
                }

                # Area estimate (rough m² based on GSD assumption)
                pixel_area = (x2 - x1) * (y2 - y1)
                # Assume ~0.5 m/pixel GSD for satellite imagery
                area_sqm = round(pixel_area * 0.25, 1)

                # Severity
                severity_fn = SEVERITY_MAP.get(meta["type"], lambda c: None)
                severity = severity_fn(conf)

                # Polygon from segmentation mask (if available)
                polygon = self._mask_to_polygon(r, i, latitude, longitude, img_h, img_w)
                if not polygon:
                    polygon = self._bbox_to_geo_polygon(
                        xyxy, latitude, longitude, img_h, img_w
                    )

                # Geo-location for this detection
                cx = (x1 + x2) / 2.0
                cy = (y1 + y2) / 2.0
                det_lat, det_lng = self._pixel_to_geo(
                    cx, cy, latitude, longitude, img_h, img_w
                )

                detections.append({
                    "id": f"det-{uuid.uuid4().hex[:8]}",
                    "type": meta["type"],
                    "label": f"{meta['label_prefix']} #{i + 1}",
                    "confidence": round(conf, 2),
                    "area_sqm": area_sqm,
                    "bbox": bbox,
                    "polygon": polygon,
                    "location": {
                        "latitude": round(det_lat, 6),
                        "longitude": round(det_lng, 6),
                    },
                    "severity": severity,
                    "icon": meta["icon"],
                    "color": meta["color"],
                })

        return self._build_response(detections, elapsed)

    # ── Helpers ────────────────────────────────────────────────────────────

    def _mask_to_polygon(self, result, idx, lat, lng, img_h, img_w):
        """Extract GeoJSON polygon from the segmentation mask for detection `idx`."""
        try:
            if result.masks is None:
                return None
            mask_data = result.masks.data[idx].cpu().numpy()
            # Resize mask to original image size
            mask_resized = cv2.resize(
                mask_data.astype(np.uint8), (img_w, img_h),
                interpolation=cv2.INTER_NEAREST,
            )
            contours, _ = cv2.findContours(
                mask_resized, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
            )
            if not contours:
                return None
            # Take the largest contour
            contour = max(contours, key=cv2.contourArea)
            # Simplify
            epsilon = 0.02 * cv2.arcLength(contour, True)
            contour = cv2.approxPolyDP(contour, epsilon, True)

            if len(contour) < 3:
                return None

            points = []
            for pt in contour:
                px, py = pt[0]
                geo_lat, geo_lng = self._pixel_to_geo(
                    px, py, lat, lng, img_h, img_w
                )
                points.append([round(geo_lng, 6), round(geo_lat, 6)])
            points.append(points[0])  # close polygon
            return points
        except Exception:
            return None

    def _bbox_to_geo_polygon(self, xyxy, lat, lng, img_h, img_w):
        """Fallback: convert bounding box to a GeoJSON rectangle."""
        x1, y1, x2, y2 = xyxy
        corners = [(x1, y1), (x2, y1), (x2, y2), (x1, y2)]
        points = []
        for px, py in corners:
            g_lat, g_lng = self._pixel_to_geo(px, py, lat, lng, img_h, img_w)
            points.append([round(g_lng, 6), round(g_lat, 6)])
        points.append(points[0])
        return points

    @staticmethod
    def _pixel_to_geo(px, py, center_lat, center_lng, img_h, img_w):
        """
        Map a pixel coordinate to approximate geographic coordinates.
        Assumes the image center corresponds to (center_lat, center_lng)
        and uses ~0.5 m/pixel GSD.
        """
        GSD = 0.5  # meters per pixel
        dx_m = (px - img_w / 2.0) * GSD
        dy_m = (img_h / 2.0 - py) * GSD  # y-axis inverted

        # Approximate degrees per meter
        lat_per_m = 1.0 / 111_320.0
        lng_per_m = 1.0 / (111_320.0 * math.cos(math.radians(center_lat + 0.001)))

        return (
            center_lat + dy_m * lat_per_m,
            center_lng + dx_m * lng_per_m,
        )

    def _build_response(self, detections: list, elapsed: float) -> dict:
        """Assemble the final response dict."""
        # Type counts
        type_counts: dict[str, int] = {}
        for d in detections:
            type_counts[d["type"]] = type_counts.get(d["type"], 0) + 1

        total_area = sum(d["area_sqm"] for d in detections)
        avg_conf = (
            sum(d["confidence"] for d in detections) / len(detections)
            if detections
            else 0
        )
        green = sum(d["area_sqm"] for d in detections if d["type"] == "vegetation")
        water = sum(d["area_sqm"] for d in detections if d["type"] == "water_body")
        encr = type_counts.get("encroachment", 0)

        # GeoJSON feature collection
        features = []
        for d in detections:
            features.append({
                "type": "Feature",
                "geometry": {"type": "Polygon", "coordinates": [d["polygon"]]},
                "properties": {
                    "id": d["id"],
                    "type": d["type"],
                    "label": d["label"],
                    "confidence": d["confidence"],
                    "area_sqm": d["area_sqm"],
                    "severity": d["severity"],
                    "icon": d["icon"],
                    "color": d["color"],
                },
            })

        alerts_generated = sum(
            1 for d in detections if d["severity"] in ("critical", "high")
        )

        return {
            "success": True,
            "model_used": "yolov8s-seg",
            "total_detections": len(detections),
            "processing_time_seconds": round(elapsed, 2),
            "detections": detections,
            "geojson": {"type": "FeatureCollection", "features": features},
            "summary": {
                "total_detections": len(detections),
                "total_area_sqm": round(total_area, 1),
                "average_confidence": round(avg_conf, 2),
                "green_cover_sqm": round(green, 1),
                "green_cover_pct": round(
                    (green / total_area * 100) if total_area > 0 else 0, 1
                ),
                "water_area_sqm": round(water, 1),
                "encroachment_count": encr,
                "building_count": type_counts.get("building", 0),
                "type_breakdown": type_counts,
            },
            "threat_level": (
                "critical" if encr > 3
                else "high" if encr > 1
                else "medium" if encr > 0
                else "low"
            ),
            "alerts_generated": alerts_generated,
        }

    @staticmethod
    def _empty_result(reason: str) -> dict:
        return {
            "success": False,
            "model_used": None,
            "reason": reason,
            "total_detections": 0,
            "processing_time_seconds": 0,
            "detections": [],
            "geojson": {"type": "FeatureCollection", "features": []},
            "summary": {
                "total_detections": 0,
                "total_area_sqm": 0,
                "average_confidence": 0,
                "green_cover_sqm": 0,
                "green_cover_pct": 0,
                "water_area_sqm": 0,
                "encroachment_count": 0,
                "building_count": 0,
                "type_breakdown": {},
            },
            "threat_level": "low",
            "alerts_generated": 0,
        }


# ── Module-level singleton ─────────────────────────────────────────────────

engine = YOLOEngine()


def get_engine() -> YOLOEngine:
    """Return the singleton engine, loading the model if needed."""
    if not engine.is_available:
        engine.load()
    return engine
