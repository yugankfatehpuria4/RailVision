import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('railvision_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ── Auth ────────────────────────────────────────────────────────

export async function login(email: string, password: string) {
  const { data } = await api.post('/api/auth/login', { email, password });
  if (data.access_token) {
    localStorage.setItem('railvision_token', data.access_token);
    localStorage.setItem('railvision_user', JSON.stringify(data.user));
  }
  return data;
}

export async function register(email: string, fullName: string, password: string, role = 'user') {
  const { data } = await api.post('/api/auth/register', { email, full_name: fullName, password, role });
  if (data.access_token) {
    localStorage.setItem('railvision_token', data.access_token);
    localStorage.setItem('railvision_user', JSON.stringify(data.user));
  }
  return data;
}

export async function demoLogin() {
  const { data } = await api.post('/api/auth/demo-login');
  if (data.access_token) {
    localStorage.setItem('railvision_token', data.access_token);
    localStorage.setItem('railvision_user', JSON.stringify(data.user));
  }
  return data;
}

export function logout() {
  localStorage.removeItem('railvision_token');
  localStorage.removeItem('railvision_user');
}

export function getStoredUser() {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('railvision_user');
  return raw ? JSON.parse(raw) : null;
}

// ── Upload ──────────────────────────────────────────────────────

export async function uploadImage(file: File, latitude: number, longitude: number) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('latitude', String(latitude));
  formData.append('longitude', String(longitude));
  const { data } = await api.post('/api/images/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000,
  });
  return data;
}

// ── Detection ───────────────────────────────────────────────────

export interface DetectParams {
  image_id?: string;
  latitude: number;
  longitude: number;
  detection_mode?: 'full' | 'quick' | 'encroachment_only';
}

export async function runDetection(params: DetectParams) {
  const { data } = await api.post('/api/detect', params);
  return data;
}

// ── Change Detection ────────────────────────────────────────────

export async function runChangeDetection(params: {
  old_image_id?: string;
  new_image_id?: string;
  latitude: number;
  longitude: number;
}) {
  const { data } = await api.post('/api/change-detection', params);
  return data;
}

// ── Features / Assets ───────────────────────────────────────────

export async function getFeatures(type?: string) {
  const url = type ? `/api/features/by-type/${type}` : '/api/features/';
  const { data } = await api.get(url);
  return data;
}

// ── Detections ──────────────────────────────────────────────────

export async function getDetections(imageId?: string) {
  const params: Record<string, string> = {};
  if (imageId) params.image_id = imageId;
  const { data } = await api.get('/api/detections/', { params });
  return data;
}

// ── Alerts ──────────────────────────────────────────────────────

export async function getAlerts(resolved?: boolean) {
  const params: Record<string, string> = {};
  if (resolved !== undefined) params.resolved = String(resolved);
  const { data } = await api.get('/api/alerts/', { params });
  return data;
}

// ── Export ───────────────────────────────────────────────────────

export async function exportGeoJSON() {
  const response = await api.get('/api/export/geojson', { responseType: 'blob' });
  const url = window.URL.createObjectURL(response.data);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'railvision_export.geojson';
  a.click();
  window.URL.revokeObjectURL(url);
}

export async function exportCSV() {
  const response = await api.get('/api/export/csv', { responseType: 'blob' });
  const url = window.URL.createObjectURL(response.data);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'railvision_detections.csv';
  a.click();
  window.URL.revokeObjectURL(url);
}

export async function getReport() {
  const { data } = await api.get('/api/export/report');
  return data;
}

// ── Health ───────────────────────────────────────────────────────

export async function checkBackendHealth() {
  try {
    const { data } = await api.get('/health', { timeout: 3000 });
    return { online: true, ...data };
  } catch {
    return { online: false, status: 'offline' };
  }
}

// ── SOS Emergency ───────────────────────────────────────────────

export interface SOSCreateParams {
  incident_type: string;
  severity: string;
  description: string;
  location: { latitude: number; longitude: number };
  reporter_name?: string;
}

export async function createSOS(params: SOSCreateParams) {
  const { data } = await api.post('/api/sos/emergency', params);
  return data;
}

export async function getActiveIncidents() {
  const { data } = await api.get('/api/sos/incidents');
  return data;
}

export async function resolveSOS(sosId: string) {
  const { data } = await api.put(`/api/sos/incidents/${sosId}/status`, null, {
    params: { status: 'resolved' },
  });
  return data;
}

export async function getSOSStats() {
  const { data } = await api.get('/api/sos/statistics');
  return data;
}

export default api;

