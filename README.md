# RailVision AI - Railway Infrastructure Detection System

A comprehensive AI-powered platform for detecting, monitoring, and analyzing railway infrastructure using satellite and drone imagery. Built with Next.js 16, React Leaflet, and Recharts.

## 🚀 Features

### Interactive Map Visualization
- **Leaflet.js Integration**: Real-time visualization of railway networks with OpenStreetMap tiles
- **GeoJSON Rendering**: Dynamically render railway infrastructure, stations, bridges, and encroachments
- **Geometric Layers**: Support for LineString (tracks) and Point (stations, bridges) features
- **Feature Popups**: Click on features to see detailed information with confidence scores

### Image Upload & AI Detection
- **Batch Image Upload**: Upload satellite/drone images with GPS coordinates
- **Automatic Processing**: Simulated AI detection with realistic confidence scores
- **Detection Visualization**: Bounding boxes and detection results for uploaded images
- **Location Georeferencing**: Precise GPS coordinate input for image location tracking

### AI-Powered Detection
- **Object Detection**: Identifies railway tracks, sleepers, bridges, and damage
- **Encroachment Detection**: Detects vegetation overgrowth and illegal constructions
- **Damage Classification**: Identifies cracks, rust, settlements, and other track damage
- **Confidence Scoring**: Machine learning-based confidence metrics (currently 85-98%)

### Analytics Dashboard
- **Track Quality Analysis**: Pie chart showing good/fair/poor track condition distribution
- **Encroachment Severity**: Bar chart of critical, high, medium, and low priority issues
- **Damage Type Breakdown**: Horizontal bar chart of damage types detected
- **Key Metrics**: Total inspections, encroachments found, average confidence score

### Data Management
- **GeoJSON Export**: Export analyzed features as GeoJSON (via API)
- **Detection History**: Track all detections with timestamps and metadata
- **Batch Analytics**: Aggregate statistics across multiple inspections

## 📊 Tech Stack

### Frontend
- **Next.js 16**: Modern React framework with App Router
- **React 19**: Latest React with enhanced features
- **React Leaflet 5**: Interactive maps and GIS visualization
- **Zustand**: Lightweight state management
- **Recharts**: Data visualization and charting library
- **ShadCN UI**: Component library (shadcn/ui)
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon library
- **Axios**: HTTP client for API requests

### Backend (Placeholder Structure)
- **Next.js API Routes**: RESTful endpoints for data management
- `/api/upload` - Image upload and processing
- `/api/detections` - Query AI detections
- `/api/features` - Access GeoJSON features
- `/api/analysis` - Retrieve analytics data

### Data
- **Dummy Data**: Sample railway infrastructure and detection results
- **GeoJSON Format**: Standard geospatial data representation
- **Mock AI Results**: Realistic detection confidence scores

## 📁 Project Structure

```
/vercel/share/v0-project/
├── app/
│   ├── api/                          # Next.js API routes
│   │   ├── upload/route.ts          # Image upload endpoint
│   │   ├── detections/route.ts      # Detection data endpoint
│   │   └── features/route.ts        # GeoJSON features endpoint
│   ├── layout.tsx                    # Root layout with metadata
│   ├── page.tsx                      # Main dashboard page
│   └── globals.css                   # Global styles
├── components/
│   ├── RailwayMap.tsx               # Leaflet map component
│   ├── ImageUploadForm.tsx          # Upload form with location input
│   ├── AnalyticsDashboard.tsx       # Recharts analytics
│   ├── DetectionDetails.tsx         # Detection results panel
│   └── ui/                          # ShadCN UI components
├── lib/
│   ├── dummy-data.ts                # Sample data
│   ├── store.ts                     # Zustand state management
│   └── utils.ts                     # Utility functions
├── public/                          # Static assets
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
├── tailwind.config.ts               # Tailwind configuration
├── next.config.mjs                  # Next.js configuration
└── README.md                        # This file
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ (v20 recommended)
- pnpm, npm, or yarn package manager

### Quick Start

1. **Clone or download the project**
   ```bash
   cd /vercel/share/v0-project
   ```

2. **Install dependencies** (if not already installed)
   ```bash
   pnpm install
   # or: npm install / yarn install
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:3000`
   - The app will auto-refresh on file changes

### Build for Production
```bash
pnpm build
pnpm start
```

## 🎯 Usage Guide

### Map View
1. Navigate to the **Map View** tab
2. Interact with the railway network visualization
3. Click on features (tracks, stations, bridges) to see details
4. Detections are displayed in the right panel
5. Confidence scores indicate AI model certainty

### Upload Images
1. Go to the **Upload & Analyze** tab
2. Select a railway image file
3. Enter the GPS coordinates (latitude/longitude)
4. Click "Upload & Analyze"
5. System simulates AI processing and displays detected objects
6. View results in the Detection Details panel

### View Analytics
1. Navigate to the **Analytics** tab
2. Review track quality distribution
3. Analyze encroachment severity levels
4. See damage type breakdown
5. View overall statistics and summary metrics

## 🗺️ Dummy Data Overview

### Railway Features (GeoJSON)
- **Main Line A**: 25.5 km primary track (confidence: 96%)
- **Branch Line B**: 18.3 km secondary track (confidence: 92%)
- **Central Station**: 6-platform main station (confidence: 98%)
- **East Terminal**: 4-platform terminal (confidence: 95%)
- **River Bridge Crossing**: Strategic bridge crossing (confidence: 94%)
- **Encroachments (2)**: High and medium severity illegal constructions

### Sample Detections
- Track detection with 96% confidence
- Sleeper detection with 92% confidence
- Vegetation encroachment with 87% confidence
- Track damage detection with 91% confidence

### Analytics Data
- Total Inspections: 3
- Track Quality: 45% good, 30% fair, 25% poor
- Encroachments: 8 total (2 critical, 3 high, 2 medium, 1 low)
- Damage Types: Cracks (12), Rust (8), Vegetation (15), Settlements (5)
- Average Confidence: 91%

## 🔌 API Endpoints

### Upload Image
```bash
POST /api/upload
Content-Type: multipart/form-data

file: <image_file>
latitude: 19.076
longitude: 72.8479
```

Response:
```json
{
  "success": true,
  "imageId": "img-1234567890",
  "message": "Image uploaded successfully",
  "location": {
    "latitude": 19.076,
    "longitude": 72.8479
  }
}
```

### Get Detections
```bash
GET /api/detections?imageId=img-001
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "det-001",
      "imageId": "img-001",
      "type": "rail_track",
      "confidence": 0.96,
      "label": "Main rail track"
    }
  ],
  "count": 1
}
```

### Get Features
```bash
GET /api/features?type=encroachment
```

Response:
```json
{
  "success": true,
  "type": "FeatureCollection",
  "features": [...],
  "count": 2
}
```

## 🎨 Customization

### Color Scheme
Edit colors in component files:
- Map markers: `RailwayMap.tsx` - `createCustomIcon()` function
- UI components: Tailwind classes (blue-600, slate-900, etc.)
- Charts: Recharts `COLORS` array in `AnalyticsDashboard.tsx`

### Map Styling
- **Tile Provider**: Change OpenStreetMap to Mapbox, Esri, etc. in `RailwayMap.tsx`
- **Feature Styles**: Modify GeoJSON styles in `style()` function
- **Zoom Level**: Default is 14; adjust in `MapContainer` center prop

### Dummy Data
- Edit `/lib/dummy-data.ts` to modify coordinates, properties, confidence scores
- Add new features following GeoJSON FeatureCollection format
- Update analysis results in `DUMMY_ANALYSIS_RESULTS`

## 🚀 Deployment

### Deploy to Vercel
```bash
vercel deploy
```

### Deploy to Other Platforms
- **Netlify**: Works with Next.js 16
- **Docker**: Create Dockerfile for containerization
- **Self-hosted**: Use `pnpm build && pnpm start`

### Environment Variables
Currently running in demo mode. For production:
1. Create `.env.local` file
2. Add required API keys and URLs
3. Configure database connections (MongoDB, PostgreSQL, etc.)

## 🔒 Security Considerations

### Production Recommendations
1. **Authentication**: Implement user authentication (Auth0, NextAuth.js, etc.)
2. **Authorization**: Add role-based access control (RBAC)
3. **File Uploads**: Validate file types, sizes, and scan for malware
4. **API Security**: Implement rate limiting, CORS policies, API key validation
5. **Data Encryption**: Use HTTPS, encrypt sensitive data at rest
6. **Database**: Use parameterized queries, implement SQL injection protection

## 📈 Scalability

### Current State
- Single-server demo with dummy data
- In-memory state management

### Production Scaling
1. **Database**: MongoDB or PostgreSQL for persistent storage
2. **Cache**: Redis for session management and caching
3. **File Storage**: S3, GCS, or Vercel Blob for images
4. **Task Queue**: Bull, RabbitMQ, or Celery for async processing
5. **AI Backend**: FastAPI/Python microservice for YOLOv8 & SegFormer
6. **CDN**: Cloudflare or AWS CloudFront for static assets

## 🤖 AI Integration Points

### Planned Backend Features
1. **Object Detection**: YOLOv8 for railway infrastructure
2. **Semantic Segmentation**: SegFormer for damage detection
3. **GIS Processing**: GDAL/Rasterio for coordinate transformation
4. **Change Detection**: Temporal analysis of railway conditions

### Current Status
- Frontend UI ready for AI integration
- API stubs in place for backend connection
- Dummy data simulates real detection results

## 📚 References

- [Leaflet.js Documentation](https://leafletjs.com/)
- [React Leaflet](https://react-leaflet.js.org/)
- [GeoJSON Specification](https://geojson.org/)
- [Recharts Documentation](https://recharts.org/)
- [Next.js 16 Docs](https://nextjs.org/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

## 📝 License

This project is provided as-is for demonstration purposes.

## 👥 Support

For issues, questions, or feature requests, please refer to the documentation or contact the development team.

---

**RailVision AI v1.0.0** - Railway Infrastructure Detection System
Built with ❤️ for railway network monitoring and analysis
