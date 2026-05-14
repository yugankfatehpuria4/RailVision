// Dummy data for RailVision AI
export const DUMMY_RAILWAY_FEATURES = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: "track-001",
      properties: {
        name: "Main Line A",
        type: "rail_track",
        status: "active",
        length: 25.5,
        condition: "good",
        lastInspection: "2024-05-10",
        detectionConfidence: 0.96,
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [72.8479, 19.076],
          [72.8485, 19.081],
          [72.8492, 19.087],
          [72.8498, 19.093],
          [72.8505, 19.099],
        ],
      },
    },
    {
      type: "Feature",
      id: "track-002",
      properties: {
        name: "Branch Line B",
        type: "rail_track",
        status: "active",
        length: 18.3,
        condition: "fair",
        lastInspection: "2024-05-08",
        detectionConfidence: 0.92,
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [72.8479, 19.076],
          [72.8470, 19.070],
          [72.8461, 19.064],
          [72.8452, 19.058],
        ],
      },
    },
    {
      type: "Feature",
      id: "station-001",
      properties: {
        name: "Central Station",
        type: "station",
        platforms: 6,
        status: "operational",
        detectionConfidence: 0.98,
      },
      geometry: {
        type: "Point",
        coordinates: [72.8479, 19.076],
      },
    },
    {
      type: "Feature",
      id: "station-002",
      properties: {
        name: "East Terminal",
        type: "station",
        platforms: 4,
        status: "operational",
        detectionConfidence: 0.95,
      },
      geometry: {
        type: "Point",
        coordinates: [72.8505, 19.099],
      },
    },
    {
      type: "Feature",
      id: "bridge-001",
      properties: {
        name: "River Bridge - Crossing",
        type: "bridge",
        status: "active",
        material: "steel",
        yearBuilt: 1995,
        detectionConfidence: 0.94,
      },
      geometry: {
        type: "Point",
        coordinates: [72.8492, 19.087],
      },
    },
    {
      type: "Feature",
      id: "encroachment-001",
      properties: {
        name: "Illegal Construction Site A",
        type: "encroachment",
        severity: "high",
        detectionDate: "2024-05-14",
        detectionConfidence: 0.89,
        area: 450,
      },
      geometry: {
        type: "Point",
        coordinates: [72.8485, 19.081],
      },
    },
    {
      type: "Feature",
      id: "encroachment-002",
      properties: {
        name: "Vegetation Overgrowth B",
        type: "encroachment",
        severity: "medium",
        detectionDate: "2024-05-12",
        detectionConfidence: 0.85,
        area: 200,
      },
      geometry: {
        type: "Point",
        coordinates: [72.8470, 19.070],
      },
    },
  ],
};

export const DUMMY_DETECTIONS = [
  {
    id: "det-001",
    imageId: "img-001",
    type: "rail_track",
    confidence: 0.96,
    boundingBox: { x: 45, y: 120, width: 380, height: 200 },
    label: "Main rail track",
    timestamp: "2024-05-14T10:30:00Z",
  },
  {
    id: "det-002",
    imageId: "img-001",
    type: "sleeper",
    confidence: 0.92,
    boundingBox: { x: 50, y: 300, width: 350, height: 80 },
    label: "Railway sleepers",
    timestamp: "2024-05-14T10:30:00Z",
  },
  {
    id: "det-003",
    imageId: "img-001",
    type: "encroachment",
    confidence: 0.87,
    boundingBox: { x: 200, y: 450, width: 180, height: 140 },
    label: "Vegetation encroachment",
    timestamp: "2024-05-14T10:30:00Z",
  },
  {
    id: "det-004",
    imageId: "img-002",
    type: "damage",
    confidence: 0.91,
    boundingBox: { x: 120, y: 200, width: 150, height: 100 },
    label: "Track damage/crack",
    timestamp: "2024-05-14T11:15:00Z",
  },
];

export const DUMMY_IMAGES = [
  {
    id: "img-001",
    name: "Railway Segment A - 2024-05-14",
    uploadDate: "2024-05-14T10:30:00Z",
    location: { lat: 19.076, lng: 72.8479 },
    url: "https://via.placeholder.com/640x480?text=Railway+Segment+A",
    detectionCount: 3,
    processedDate: "2024-05-14T10:35:00Z",
  },
  {
    id: "img-002",
    name: "Railway Segment B - 2024-05-14",
    uploadDate: "2024-05-14T11:15:00Z",
    location: { lat: 19.087, lng: 72.8492 },
    url: "https://via.placeholder.com/640x480?text=Railway+Segment+B",
    detectionCount: 1,
    processedDate: "2024-05-14T11:20:00Z",
  },
  {
    id: "img-003",
    name: "Railway Segment C - 2024-05-14",
    uploadDate: "2024-05-14T12:00:00Z",
    location: { lat: 19.070, lng: 72.8470 },
    url: "https://via.placeholder.com/640x480?text=Railway+Segment+C",
    detectionCount: 0,
    processedDate: "2024-05-14T12:05:00Z",
  },
];

export const DUMMY_ANALYSIS_RESULTS = {
  totalInspected: 3,
  trackQuality: {
    good: 45,
    fair: 30,
    poor: 25,
  },
  encroachments: {
    total: 8,
    critical: 2,
    high: 3,
    medium: 2,
    low: 1,
  },
  damageTypes: {
    cracks: 12,
    rust: 8,
    vegetation: 15,
    settlements: 5,
  },
  averageConfidence: 0.91,
  latestUpdate: "2024-05-14T12:05:00Z",
};

export const DUMMY_TRENDS = [
  { month: 'Jan', encroachments: 45, vegetation: 120, health: 95 },
  { month: 'Feb', encroachments: 52, vegetation: 110, health: 94 },
  { month: 'Mar', encroachments: 48, vegetation: 135, health: 92 },
  { month: 'Apr', encroachments: 61, vegetation: 150, health: 89 },
  { month: 'May', encroachments: 55, vegetation: 140, health: 91 },
  { month: 'Jun', encroachments: 67, vegetation: 165, health: 88 },
];

export const DUMMY_ZONE_PERFORMANCE = [
  { zone: 'Western', risk: 42, efficiency: 88, response: 12 },
  { zone: 'Central', risk: 58, efficiency: 82, response: 15 },
  { zone: 'Northern', risk: 75, efficiency: 78, response: 22 },
  { zone: 'Southern', risk: 31, efficiency: 92, response: 10 },
  { zone: 'Eastern', risk: 64, efficiency: 80, response: 18 },
];

export const DUMMY_AI_METRICS = [
  { model: 'YOLOv8', precision: 0.94, recall: 0.91, f1: 0.92 },
  { model: 'SegFormer', precision: 0.88, recall: 0.85, f1: 0.86 },
  { model: 'Temporal', precision: 0.91, recall: 0.89, f1: 0.90 },
];

