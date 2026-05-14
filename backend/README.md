# RailVision AI - Python Backend

Professional FastAPI backend for railway infrastructure detection and analysis.

## Features

- **Image Management**: Upload, process, and manage railway images with GPS coordinates
- **AI Detection**: Analyze images for railway infrastructure damage and anomalies
- **GeoJSON Features**: Store and query railway network features (tracks, stations, bridges)
- **Emergency SOS**: Full emergency response system with safe route calculation
- **Real-time Alerts**: Critical alert generation and management
- **Risk Heatmaps**: Spatial analysis of infrastructure risks
- **Statistics & Analytics**: Comprehensive system analytics

## Tech Stack

- **Framework**: FastAPI 0.104.1
- **Server**: Uvicorn 0.24.0
- **Database**: MongoDB with Motor (async driver)
- **Validation**: Pydantic v2
- **Authentication**: JWT with python-jose
- **File Handling**: Pillow, aiofiles

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application
│   ├── database.py             # MongoDB connection & setup
│   ├── schemas.py              # Pydantic models
│   └── routers/
│       ├── __init__.py
│       ├── images.py           # Image upload & management
│       ├── detections.py       # AI detection results
│       ├── features.py         # GeoJSON features
│       ├── sos.py              # Emergency SOS system
│       └── alerts.py           # Alert management
├── config/
│   └── settings.py             # Configuration (optional)
├── requirements.txt            # Python dependencies
├── .env.example                # Environment template
└── README.md                   # This file
```

## Installation

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. MongoDB Setup

#### Local Development

```bash
# Install MongoDB Community Edition
# macOS: brew install mongodb-community
# Ubuntu: sudo apt-get install -y mongodb-org

# Start MongoDB
mongod
```

#### MongoDB Atlas (Cloud)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update `.env` file with MongoDB URL

### 3. Environment Configuration

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=railvision_db
FASTAPI_ENV=development
API_PORT=8000
FRONTEND_URL=http://localhost:3000
```

## Running the Server

```bash
python -m uvicorn app.main:app --reload --port 8000
```

Or simply:

```bash
python app/main.py
```

Server will run at `http://localhost:8000`

## API Endpoints

### Health & Status

- `GET /` - Root endpoint
- `GET /health` - Health check

### Images

- `POST /api/images/upload` - Upload image with GPS
- `GET /api/images/` - List all images
- `GET /api/images/{image_id}` - Get specific image
- `GET /api/images/location/nearby` - Get nearby images
- `PUT /api/images/{image_id}/status` - Update processing status
- `DELETE /api/images/{image_id}` - Delete image

### Detections

- `POST /api/detections/` - Create detection
- `GET /api/detections/` - List detections (with optional image_id filter)
- `GET /api/detections/{detection_id}` - Get specific detection
- `PUT /api/detections/{detection_id}/verify` - Verify detection
- `GET /api/detections/by-severity/{severity}` - Filter by severity
- `GET /api/detections/analytics/summary` - Analytics summary

### Features (GeoJSON)

- `GET /api/features/` - Get all features as GeoJSON
- `POST /api/features/` - Create new feature
- `GET /api/features/{feature_id}` - Get specific feature
- `GET /api/features/by-type/{type}` - Get features by type
- `PUT /api/features/{feature_id}` - Update feature
- `DELETE /api/features/{feature_id}` - Delete feature
- `POST /api/features/bulk-load` - Bulk load features

### Alerts

- `POST /api/alerts/` - Create alert
- `GET /api/alerts/` - List alerts
- `GET /api/alerts/{alert_id}` - Get specific alert
- `GET /api/alerts/by-severity/{severity}` - Filter by severity
- `PUT /api/alerts/{alert_id}/resolve` - Resolve alert
- `DELETE /api/alerts/{alert_id}` - Delete alert
- `GET /api/alerts/analytics/summary` - Analytics summary

### SOS/Emergency

- `POST /api/sos/emergency` - Create emergency SOS
- `GET /api/sos/incidents` - Get active SOS incidents
- `GET /api/sos/incidents/{sos_id}` - Get specific incident
- `PUT /api/sos/incidents/{sos_id}/status` - Update incident status
- `PUT /api/sos/incidents/{sos_id}/responders` - Assign responders
- `GET /api/sos/safe-routes/{sos_id}` - Get safe evacuation routes
- `GET /api/sos/heatmap/risk-zones` - Get risk heatmap
- `GET /api/sos/statistics` - SOS statistics

## Interactive API Documentation

Swagger UI: `http://localhost:8000/docs`
ReDoc: `http://localhost:8000/redoc`

## Database Models

### Collections

1. **images** - User uploaded images with GPS metadata
2. **detections** - AI detection results (boxes, confidence, type)
3. **features** - GeoJSON railway features (tracks, stations, bridges)
4. **alerts** - System alerts (critical, warning, info)
5. **sos_incidents** - Emergency SOS incidents and responses
6. **statistics** - Aggregated statistics and metrics
7. **users** - User accounts (future)

## Integration with Frontend

The frontend (Next.js) proxies requests to the backend:

- `POST /api/upload` → `POST http://localhost:8000/api/images/upload`
- `GET /api/detections` → `GET http://localhost:8000/api/detections`
- `GET /api/features` → `GET http://localhost:8000/api/features`
- `POST /api/sos` → `POST http://localhost:8000/api/sos/emergency`
- `GET /api/alerts` → `GET http://localhost:8000/api/alerts`

## Development

### Async/Await Pattern

All database operations are async using Motor:

```python
collection = await get_images_collection()
result = await collection.insert_one(document)
```

### Error Handling

```python
try:
    # Operation
except Exception as error:
    raise HTTPException(status_code=400, detail=str(error))
```

### Pydantic Models

- Define in `schemas.py`
- Use for request/response validation
- Automatic OpenAPI schema generation

## Deployment

### Docker

```bash
docker build -t railvision-backend .
docker run -p 8000:8000 railvision-backend
```

### Vercel Functions

```bash
vercel deploy
```

### Heroku

```bash
heroku create railvision-backend
git push heroku main
```

## Performance

- Async/await for concurrent operations
- MongoDB indexes on frequently queried fields
- Connection pooling via Motor
- Proper pagination (skip/limit)
- Geospatial queries for location-based searches

## Security

- CORS configured for frontend
- Input validation via Pydantic
- Type hints throughout
- Error handling without exposing internals
- Ready for authentication middleware

## Monitoring & Logging

```python
import logging

logger = logging.getLogger(__name__)
logger.info("Message")
logger.error("Error", exc_info=True)
```

## Testing

Run tests (when added):

```bash
pytest tests/
```

## Troubleshooting

### MongoDB Connection Failed

- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- Verify network access if using Atlas

### Port Already in Use

```bash
# macOS/Linux
lsof -i :8000
kill -9 <PID>

# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Import Errors

- Verify all files in `app/routers/` are created
- Check Python path: `export PYTHONPATH="${PYTHONPATH}:$(pwd)"`
- Reinstall dependencies: `pip install -r requirements.txt`

## Contributing

1. Create feature branch
2. Make changes
3. Test with Swagger UI
4. Commit with clear messages
5. Push to repository

## License

MIT License - See LICENSE file
