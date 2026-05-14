import os
import logging
from typing import Optional, Any, Dict, List
from datetime import datetime
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

logger = logging.getLogger("railvision.database")

# MongoDB connection
client = None
db = None
_using_fallback = False


# ── In-memory fallback store ────────────────────────────────────
class InMemoryCollection:
    """Minimal MongoDB-compatible in-memory collection for demo/fallback."""

    def __init__(self, name: str):
        self.name = name
        self._docs: Dict[str, dict] = {}

    async def insert_one(self, doc: dict):
        doc_id = str(ObjectId())
        doc["_id"] = ObjectId(doc_id)
        self._docs[doc_id] = doc

        class _Result:
            inserted_id = doc["_id"]
        return _Result()

    async def insert_many(self, docs: List[dict]):
        ids = []
        for doc in docs:
            result = await self.insert_one(doc)
            ids.append(result.inserted_id)

        class _Result:
            inserted_ids = ids
        return _Result()

    def find(self, query: dict = None):
        return InMemoryCursor(self._docs, query or {})

    async def find_one(self, query: dict = None):
        for doc in self._docs.values():
            if self._match(doc, query or {}):
                return doc
        return None

    async def count_documents(self, query: dict = None):
        if not query:
            return len(self._docs)
        return sum(1 for d in self._docs.values() if self._match(d, query))

    async def update_one(self, query: dict, update: dict):
        for doc_id, doc in self._docs.items():
            if self._match(doc, query):
                if "$set" in update:
                    doc.update(update["$set"])
                if "$push" in update:
                    for key, val in update["$push"].items():
                        if key not in doc:
                            doc[key] = []
                        doc[key].append(val)

                class _Result:
                    matched_count = 1
                    modified_count = 1
                return _Result()

        class _NoResult:
            matched_count = 0
            modified_count = 0
        return _NoResult()

    async def delete_one(self, query: dict):
        for doc_id, doc in list(self._docs.items()):
            if self._match(doc, query):
                del self._docs[doc_id]

                class _Result:
                    deleted_count = 1
                return _Result()

        class _NoResult:
            deleted_count = 0
        return _NoResult()

    async def create_index(self, *args, **kwargs):
        pass  # No-op for in-memory

    def aggregate(self, pipeline: list):
        return InMemoryAggCursor(self._docs, pipeline)

    @staticmethod
    def _match(doc: dict, query: dict) -> bool:
        for key, val in query.items():
            if key.startswith("$"):
                continue
            if isinstance(val, dict) and any(k.startswith("$") for k in val):
                continue  # Skip complex queries in fallback
            parts = key.split(".")
            current = doc
            for part in parts:
                if isinstance(current, dict):
                    current = current.get(part)
                else:
                    return False
            if isinstance(val, ObjectId):
                if current != val:
                    return False
            elif current != val:
                return False
        return True


class InMemoryCursor:
    def __init__(self, docs: dict, query: dict):
        self._docs = docs
        self._query = query
        self._skip_n = 0
        self._limit_n = None
        self._sort_key = None
        self._sort_dir = 1

    def skip(self, n: int):
        self._skip_n = n
        return self

    def limit(self, n: int):
        self._limit_n = n
        return self

    def sort(self, key, direction=1):
        self._sort_key = key
        self._sort_dir = direction
        return self

    async def to_list(self, length=None):
        results = [d for d in self._docs.values()
                    if InMemoryCollection._match(d, self._query)]

        if self._sort_key:
            results.sort(
                key=lambda x: x.get(self._sort_key, ""),
                reverse=(self._sort_dir == -1)
            )
        results = results[self._skip_n:]
        limit = length or self._limit_n
        if limit:
            results = results[:limit]
        return results


class InMemoryAggCursor:
    def __init__(self, docs: dict, pipeline: list):
        self._docs = docs
        self._pipeline = pipeline

    async def to_list(self, length=None):
        results = list(self._docs.values())
        for stage in self._pipeline:
            if "$group" in stage:
                group = stage["$group"]
                group_key = group["_id"]
                groups: Dict[Any, dict] = {}
                for doc in results:
                    if group_key and group_key.startswith("$"):
                        key_val = doc.get(group_key[1:], "unknown")
                    else:
                        key_val = None
                    if key_val not in groups:
                        groups[key_val] = {"_id": key_val}
                    for field, op in group.items():
                        if field == "_id":
                            continue
                        if isinstance(op, dict):
                            if "$sum" in op:
                                groups[key_val][field] = groups[key_val].get(field, 0) + 1
                            elif "$avg" in op:
                                field_name = op["$avg"][1:] if op["$avg"].startswith("$") else op["$avg"]
                                val = doc.get(field_name, 0)
                                if field + "_vals" not in groups[key_val]:
                                    groups[key_val][field + "_vals"] = []
                                groups[key_val][field + "_vals"].append(val)
                                vals = groups[key_val][field + "_vals"]
                                groups[key_val][field] = sum(vals) / len(vals) if vals else 0
                results = list(groups.values())
        if length:
            results = results[:length]
        return results


class InMemoryDB:
    def __init__(self):
        self._collections: Dict[str, InMemoryCollection] = {}

    def __getattr__(self, name: str):
        if name.startswith("_"):
            return super().__getattribute__(name)
        if name not in self._collections:
            self._collections[name] = InMemoryCollection(name)
        return self._collections[name]


# ── Connection Logic ────────────────────────────────────────────

async def connect_db():
    """Connect to MongoDB, or fall back to in-memory storage."""
    global client, db, _using_fallback

    mongo_url = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    db_name = os.getenv("DB_NAME", "railvision_db")
    fallback_mode = os.getenv("FALLBACK_MODE", "true").lower() == "true"

    try:
        import motor.motor_asyncio
        client = motor.motor_asyncio.AsyncIOMotorClient(
            mongo_url, serverSelectionTimeoutMS=3000
        )
        # Test connection
        await client.admin.command("ping")
        db = client[db_name]
        _using_fallback = False
        await create_indexes()
        logger.info("✅ Connected to MongoDB at %s", mongo_url)
    except Exception as e:
        if fallback_mode:
            logger.warning(
                "⚠️  MongoDB unavailable (%s). Using in-memory fallback.", str(e)
            )
            db = InMemoryDB()
            _using_fallback = True
            await seed_dummy_data()
        else:
            raise


async def disconnect_db():
    """Disconnect from MongoDB."""
    global client
    if client and not _using_fallback:
        client.close()
        logger.info("Disconnected from MongoDB")


async def create_indexes():
    """Create database indexes for better performance."""
    if db is None or _using_fallback:
        return

    await db.images.create_index("uploaded_at")
    await db.detections.create_index("image_id")
    await db.detections.create_index("detected_at")
    await db.detections.create_index("severity")
    await db.alerts.create_index("created_at")
    await db.alerts.create_index("severity")
    await db.alerts.create_index("resolved")
    await db.sos_incidents.create_index("created_at")
    await db.sos_incidents.create_index("status")


async def seed_dummy_data():
    """Seed in-memory DB with demo data for hackathon."""
    from datetime import timedelta

    # Seed demo user
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    await db.users.insert_one({
        "email": "admin@railvision.ai",
        "full_name": "Admin User",
        "hashed_password": pwd_context.hash("admin123"),
        "role": "admin",
        "created_at": datetime.utcnow(),
    })
    await db.users.insert_one({
        "email": "demo@railvision.ai",
        "full_name": "Demo User",
        "hashed_password": pwd_context.hash("demo123"),
        "role": "user",
        "created_at": datetime.utcnow(),
    })

    # Seed features
    features = [
        {
            "type": "Feature",
            "geometry": {"type": "LineString", "coordinates": [[77.2090, 28.6139], [77.2140, 28.6189], [77.2190, 28.6239], [77.2240, 28.6289]]},
            "properties": {"name": "Main Line A", "type": "rail_track", "status": "active", "length": 25.5, "condition": "good", "lastInspection": "2024-05-10", "detectionConfidence": 0.96},
            "created_at": datetime.utcnow(),
        },
        {
            "type": "Feature",
            "geometry": {"type": "Point", "coordinates": [77.2090, 28.6139]},
            "properties": {"name": "Central Station", "type": "station", "platforms": 6, "status": "operational", "detectionConfidence": 0.98},
            "created_at": datetime.utcnow(),
        },
        {
            "type": "Feature",
            "geometry": {"type": "Point", "coordinates": [77.2190, 28.6239]},
            "properties": {"name": "River Bridge Crossing", "type": "bridge", "status": "active", "material": "steel", "yearBuilt": 1995, "detectionConfidence": 0.94},
            "created_at": datetime.utcnow(),
        },
        {
            "type": "Feature",
            "geometry": {"type": "Point", "coordinates": [77.2140, 28.6189]},
            "properties": {"name": "Illegal Construction Site A", "type": "encroachment", "severity": "high", "detectionDate": "2024-05-14", "detectionConfidence": 0.89, "area": 450},
            "created_at": datetime.utcnow(),
        },
    ]
    for f in features:
        await db.features.insert_one(f)

    # Seed alerts
    alerts = [
        {"title": "Critical Encroachment Detected", "description": "Unauthorized structure within 10m of track", "severity": "critical", "location": {"latitude": 28.6189, "longitude": 77.2140}, "created_at": datetime.utcnow(), "resolved": False, "resolved_at": None},
        {"title": "Track Damage Detected", "description": "Corrosion on western sector rail segment", "severity": "warning", "location": {"latitude": 28.6239, "longitude": 77.2190}, "created_at": datetime.utcnow() - timedelta(hours=1), "resolved": False, "resolved_at": None},
        {"title": "Vegetation Overgrowth", "description": "Dense vegetation within railway boundary zone", "severity": "info", "location": {"latitude": 28.6000, "longitude": 77.2000}, "created_at": datetime.utcnow() - timedelta(hours=3), "resolved": False, "resolved_at": None},
    ]
    for a in alerts:
        await db.alerts.insert_one(a)

    logger.info("✅ Seeded in-memory database with demo data")


def get_db():
    """Get database instance."""
    return db


def is_fallback_mode() -> bool:
    return _using_fallback


async def get_images_collection():
    return db.images


async def get_detections_collection():
    return db.detections


async def get_alerts_collection():
    return db.alerts


async def get_features_collection():
    return db.features


async def get_sos_collection():
    return db.sos_incidents


async def get_users_collection():
    return db.users


async def get_statistics_collection():
    return db.statistics
