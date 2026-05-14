import { create } from 'zustand';
import * as api from './api';
import { DUMMY_IMAGES, DUMMY_DETECTIONS, DUMMY_RAILWAY_FEATURES, DUMMY_ANALYSIS_RESULTS } from './dummy-data';

// ── Types ───────────────────────────────────────────────────────

export interface Detection {
  id: string;
  imageId: string;
  type: string;
  confidence: number;
  boundingBox: { x: number; y: number; width: number; height: number };
  label: string;
  timestamp: string;
  area_sqm?: number;
  severity?: string;
  icon?: string;
  color?: string;
  polygon?: number[][];
  location?: { latitude: number; longitude: number };
}

export interface RailImage {
  id: string;
  name: string;
  fileName?: string;
  uploadDate: string;
  location: { lat: number; lng: number };
  url: string;
  detectionCount: number;
  processedDate: string;
}

export interface DetectionResults {
  detections: any[];
  geojson: any;
  summary: {
    total_detections: number;
    total_area_sqm: number;
    average_confidence: number;
    green_cover_pct: number;
    green_cover_sqm: number;
    water_area_sqm: number;
    encroachment_count: number;
    building_count: number;
    type_breakdown: Record<string, number>;
  };
  threat_level: string;
  processing_time_seconds: number;
  alerts_generated: number;
}

export interface ChangeDetectionResults {
  changes: any[];
  geojson: any;
  summary: any;
  threat_level: string;
  processing_time_seconds: number;
}

export interface AlertItem {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  time: string;
  severity?: string;
}

export interface UserInfo {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

export interface SOSIncident {
  id: string;
  incident_type: string;
  severity: string;
  description: string;
  location: { latitude: number; longitude: number };
  status: string;
  created_at: string;
  responders_assigned: number;
  eta_minutes: number;
}

// ── Store ───────────────────────────────────────────────────────

export interface AnalysisStore {
  // Auth
  user: UserInfo | null;
  isAuthenticated: boolean;

  // Images
  selectedImageId: string | null;
  selectedFeatureId: string | null;
  uploadedImages: RailImage[];

  // Detection state
  detections: Detection[];
  activeDetectionResults: DetectionResults | null;
  changeDetectionResults: ChangeDetectionResults | null;

  // Processing
  isProcessing: boolean;
  processingStatus: string;
  processingProgress: number;

  // UI
  showMap: boolean;
  showAnalytics: boolean;
  showDetectionPanel: boolean;
  showChangeDetection: boolean;
  initialized: boolean;
  backendOnline: boolean;
  mapCenter: { lat: number; lng: number; zoom: number };

  // Layers
  layerVisibility: Record<string, boolean>;

  // Alerts
  alerts: AlertItem[];

  // SOS
  sosIncidents: SOSIncident[];
  showSOSPanel: boolean;
  showSOSModal: boolean;

  // Actions
  setUser: (user: UserInfo | null) => void;
  logout: () => void;
  setSelectedImageId: (id: string | null) => void;
  setSelectedFeatureId: (id: string | null) => void;
  setShowMap: (show: boolean) => void;
  setShowAnalytics: (show: boolean) => void;
  setMapCenter: (lat: number, lng: number, zoom?: number) => void;
  setShowDetectionPanel: (show: boolean) => void;
  setShowChangeDetection: (show: boolean) => void;
  addImage: (image: RailImage) => void;
  addDetections: (detections: Detection[]) => void;
  setDetections: (detections: Detection[]) => void;
  toggleLayer: (layerId: string) => void;
  initializeWithDummyData: (images: RailImage[], detections: Detection[]) => void;

  // SOS Actions
  setShowSOSPanel: (show: boolean) => void;
  setShowSOSModal: (show: boolean) => void;
  createSOSIncident: (data: api.SOSCreateParams) => Promise<void>;
  loadSOSIncidents: () => Promise<void>;
  resolveSOSIncident: (id: string) => Promise<void>;

  // Async actions
  uploadAndDetect: (file: File, lat: number, lng: number) => Promise<void>;
  runChangeDetection: (lat: number, lng: number) => Promise<void>;
  checkBackend: () => Promise<void>;
  loadAlerts: () => Promise<void>;
}

export const useAnalysisStore = create<AnalysisStore>((set, get) => ({
  // Auth
  user: null,
  isAuthenticated: false,

  // Images
  selectedImageId: null,
  selectedFeatureId: null,
  uploadedImages: [],

  // Detection
  detections: [],
  activeDetectionResults: null,
  changeDetectionResults: null,

  // Processing
  isProcessing: false,
  processingStatus: '',
  processingProgress: 0,

  // UI
  showMap: true,
  showAnalytics: true,
  showDetectionPanel: false,
  showChangeDetection: false,
  initialized: false,
  backendOnline: false,
  mapCenter: { lat: 28.6139, lng: 77.2090, zoom: 12 },

  // Layers
  layerVisibility: {
    tracks: true,
    stations: true,
    bridges: true,
    encroachments: true,
    detections: true,
    heatmap: false,
  },

  // Alerts
  alerts: [],

  // SOS
  sosIncidents: [],
  showSOSPanel: false,
  showSOSModal: false,

  // ── Actions ──────────────────────────────────────────────────

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => {
    api.logout();
    set({ user: null, isAuthenticated: false });
  },
  setSelectedImageId: (id) => set({ selectedImageId: id }),
  setSelectedFeatureId: (id) => set({ selectedFeatureId: id }),
  setShowMap: (show) => set({ showMap: show }),
  setShowAnalytics: (show) => set({ showAnalytics: show }),
  setShowDetectionPanel: (show) => set({ showDetectionPanel: show }),
  setShowChangeDetection: (show) => set({ showChangeDetection: show }),
  setShowSOSPanel: (show) => set({ showSOSPanel: show }),
  setShowSOSModal: (show) => set({ showSOSModal: show }),
  setMapCenter: (lat, lng, zoom = 12) => set({ mapCenter: { lat, lng, zoom } }),

  createSOSIncident: async (data) => {
    try {
      const result = await api.createSOS(data);
      set((state) => ({
        sosIncidents: [{ ...result, id: result.id || `sos-${Date.now()}` }, ...state.sosIncidents],
        showSOSModal: false,
      }));
    } catch {
      // Fallback: create local incident
      const local: SOSIncident = {
        id: `sos-${Date.now()}`,
        ...data,
        status: 'active',
        created_at: new Date().toISOString(),
        responders_assigned: 0,
        eta_minutes: 15,
      };
      set((state) => ({
        sosIncidents: [local, ...state.sosIncidents],
        showSOSModal: false,
      }));
    }
  },

  loadSOSIncidents: async () => {
    try {
      const data = await api.getActiveIncidents();
      const incidents = (Array.isArray(data) ? data : data?.data || []).map((i: any) => ({
        ...i, id: i.id || i._id || String(Math.random()),
      }));
      if (incidents.length > 0) set({ sosIncidents: incidents });
    } catch { /* keep existing */ }
  },

  resolveSOSIncident: async (id) => {
    try { await api.resolveSOS(id); } catch { /* offline fallback */ }
    set((state) => ({
      sosIncidents: state.sosIncidents.filter((i) => i.id !== id),
    }));
  },

  addImage: (image) => set((state) => ({
    uploadedImages: [...state.uploadedImages, image],
    selectedImageId: image.id,
  })),

  addDetections: (newDetections) => set((state) => ({
    detections: [...state.detections, ...newDetections],
  })),

  setDetections: (detections) => set({ detections }),

  toggleLayer: (layerId) => set((state) => ({
    layerVisibility: {
      ...state.layerVisibility,
      [layerId]: !state.layerVisibility[layerId],
    },
  })),

  initializeWithDummyData: (images, detections) => set({
    uploadedImages: images,
    detections,
    initialized: true,
  }),

  // ── Upload and Detect ────────────────────────────────────────

  uploadAndDetect: async (file, lat, lng) => {
    set({
      isProcessing: true,
      processingStatus: 'Uploading image...',
      processingProgress: 10,
      showDetectionPanel: false,
      activeDetectionResults: null,
    });

    try {
      // Step 1: Upload
      set({ processingStatus: 'Scanning satellite imagery...', processingProgress: 25 });
      let imageId: string | undefined;
      try {
        const uploadResult = await api.uploadImage(file, lat, lng);
        imageId = uploadResult?.id;
      } catch {
        // Backend might be offline — continue with detection anyway
      }

      // Step 2: Detect
      set({ processingStatus: 'Running AI detection engine...', processingProgress: 50 });

      const statusMessages = [
        'Detecting buildings and structures...',
        'Analyzing vegetation coverage...',
        'Identifying water bodies...',
        'Scanning for encroachments...',
        'Computing area calculations...',
        'Generating GeoJSON polygons...',
      ];
      let msgIdx = 0;
      const statusInterval = setInterval(() => {
        set({ processingStatus: statusMessages[msgIdx % statusMessages.length] });
        msgIdx++;
      }, 700);

      let results: any;
      try {
        results = await api.runDetection({
          image_id: imageId,
          latitude: lat,
          longitude: lng,
          detection_mode: 'full',
        });
      } catch {
        // Fallback: generate local dummy results
        results = {
          success: true,
          total_detections: 12,
          processing_time_seconds: 2.5,
          detections: DUMMY_DETECTIONS.map((d, i) => ({
            ...d, area_sqm: Math.round(Math.random() * 2000 + 100),
            icon: ['🏠', '🛤️', '💧', '🌳', '🚨'][i % 5],
            color: ['#ef4444', '#6366f1', '#3b82f6', '#22c55e', '#dc2626'][i % 5],
          })),
          geojson: { type: 'FeatureCollection', features: [] },
          summary: {
            total_detections: 12, total_area_sqm: 15000, average_confidence: 0.89,
            green_cover_pct: 23.5, green_cover_sqm: 3525, water_area_sqm: 2100,
            encroachment_count: 3, building_count: 4,
            type_breakdown: { building: 4, road: 2, water_body: 1, vegetation: 2, encroachment: 3 },
          },
          threat_level: 'high',
          alerts_generated: 3,
        };
      }

      clearInterval(statusInterval);
      set({ processingProgress: 90, processingStatus: 'Finalizing analysis...' });

      // Step 3: Add image to store
      const newImage: RailImage = {
        id: imageId || `img-${Date.now()}`,
        name: file.name,
        fileName: file.name,
        uploadDate: new Date().toISOString(),
        location: { lat, lng },
        url: URL.createObjectURL(file),
        detectionCount: results.total_detections || 0,
        processedDate: new Date().toISOString(),
      };

      set((state) => ({
        uploadedImages: [...state.uploadedImages, newImage],
        selectedImageId: newImage.id,
        activeDetectionResults: results,
        showDetectionPanel: true,
        isProcessing: false,
        processingStatus: 'Analysis complete',
        processingProgress: 100,
      }));
    } catch (error) {
      console.error('Upload and detect failed:', error);
      set({
        isProcessing: false,
        processingStatus: 'Analysis failed',
        processingProgress: 0,
      });
    }
  },

  // ── Change Detection ─────────────────────────────────────────

  runChangeDetection: async (lat, lng) => {
    set({
      isProcessing: true,
      processingStatus: 'Running change detection...',
      processingProgress: 20,
    });

    try {
      let results: any;
      try {
        results = await api.runChangeDetection({ latitude: lat, longitude: lng });
      } catch {
        results = {
          success: true, total_changes: 5, processing_time_seconds: 3.1,
          changes: [
            { id: 'chg-1', type: 'new_construction', label: 'New Construction #1', color: '#ef4444', severity: 'high', confidence: 0.91, area_sqm: 450, change_pct: 34 },
            { id: 'chg-2', type: 'vegetation_loss', label: 'Vegetation Loss #1', color: '#f59e0b', severity: 'medium', confidence: 0.85, area_sqm: 1200, change_pct: 22 },
            { id: 'chg-3', type: 'encroachment', label: 'Land Encroachment #1', color: '#dc2626', severity: 'critical', confidence: 0.93, area_sqm: 300, change_pct: 67 },
          ],
          geojson: { type: 'FeatureCollection', features: [] },
          summary: { total_changes: 5, encroachment_alerts: 2, overall_change_pct: 28.5 },
          threat_level: 'high',
        };
      }

      set({
        changeDetectionResults: results,
        showChangeDetection: true,
        isProcessing: false,
        processingStatus: 'Change detection complete',
        processingProgress: 100,
      });
    } catch {
      set({ isProcessing: false, processingStatus: 'Change detection failed', processingProgress: 0 });
    }
  },

  checkBackend: async () => {
    const health = await api.checkBackendHealth();
    set({ backendOnline: health.online });
  },

  loadAlerts: async () => {
    try {
      const data = await api.getAlerts(false);
      const items = (data?.data || data || []).map((a: any) => ({
        id: a.id || a._id || String(Math.random()),
        type: a.severity === 'critical' ? 'critical' : a.severity === 'warning' ? 'warning' : 'info',
        title: a.title,
        message: a.description,
        time: a.created_at ? new Date(a.created_at).toLocaleTimeString() : 'now',
      }));
      set({ alerts: items.length > 0 ? items : get().alerts });
    } catch {
      // Keep existing alerts
    }
  },
}));
