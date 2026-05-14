
import { useEffect, useRef } from 'react';
import type { Feature } from 'geojson';
import type { LatLng, Layer, PathOptions } from 'leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DUMMY_RAILWAY_FEATURES } from '@/lib/dummy-data';
import { useAnalysisStore } from '@/lib/store';

interface MapContainerProps {
  isProcessing?: boolean;
  processingStatus?: string;
}

export function MapContainer({ isProcessing = false, processingStatus = 'Analyzing satellite imagery...' }: MapContainerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const detectionLayerRef = useRef<L.LayerGroup | null>(null);
  const { activeDetectionResults, layerVisibility, mapCenter } = useAnalysisStore();

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    mapRef.current = L.map(mapContainer.current, { zoomControl: false }).setView([mapCenter.lat, mapCenter.lng], mapCenter.zoom);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors © CARTO',
    }).addTo(mapRef.current);

    // Railway features layer
    L.geoJSON(DUMMY_RAILWAY_FEATURES as any, {
      pointToLayer: (feature: Feature, latlng: LatLng) => {
        const ft = feature.properties?.type;
        let color = '#0ea5e9';
        let radius = 7;
        let borderWeight = 2;
        if (ft === 'station') { color = '#0ea5e9'; radius = 9; }
        else if (ft === 'bridge') { color = '#a855f7'; radius = 8; }
        else if (ft === 'encroachment') { color = '#991b1b'; radius = 12; borderWeight = 4; } // Darker red, much larger

        return L.circleMarker(latlng, {
          radius, fillColor: color, color: ft === 'encroachment' ? '#450a0a' : color, weight: borderWeight, opacity: 0.9, fillOpacity: ft === 'encroachment' ? 0.8 : 0.6,
        }).bindPopup(`
          <div style="font-family: 'Rajdhani', sans-serif; min-width: 180px;">
            <div style="font-weight: 700; font-size: 14px; margin-bottom: 4px;">${feature.properties?.name || 'Unknown'}</div>
            <div style="font-size: 12px; color: #666;">Type: ${ft}</div>
            ${feature.properties?.status ? `<div style="font-size: 12px; color: #666;">Status: ${feature.properties.status}</div>` : ''}
            ${feature.properties?.detectionConfidence ? `<div style="font-size: 12px; color: #666;">Confidence: ${(feature.properties.detectionConfidence * 100).toFixed(0)}%</div>` : ''}
          </div>
        `);
      },
      style: () => ({
        color: '#0ea5e9', weight: 3, opacity: 0.7, dashArray: '8, 6',
      }),
    }).addTo(mapRef.current);

    // Zoom controls
    L.control.zoom({ position: 'topleft' }).addTo(mapRef.current);

    // Detection layer group
    detectionLayerRef.current = L.layerGroup().addTo(mapRef.current);

    // Legend
    const legend = new L.Control({ position: 'bottomright' });
    legend.onAdd = () => {
      const div = L.DomUtil.create('div');
      div.style.cssText = 'background:rgba(15,23,42,0.92);border:1px solid #1e293b;border-radius:8px;padding:10px 12px;backdrop-filter:blur(10px);min-width:140px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.5);';
      div.innerHTML = `
        <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#94a3b8;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:6px;">Legend</div>
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:3px;"><div style="width:8px;height:8px;border-radius:2px;background:#0ea5e9;"></div><div style="font-size:10px;color:#7a9bc4;">Stations / Tracks</div></div>
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:3px;"><div style="width:8px;height:8px;border-radius:2px;background:#a855f7;"></div><div style="font-size:10px;color:#7a9bc4;">Bridges</div></div>
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:3px;"><div style="width:8px;height:8px;border-radius:2px;background:#991b1b;border:1px solid #450a0a"></div><div style="font-size:10px;color:#ef4444;font-weight:bold;">Prone Areas (Encroachments)</div></div>
        <div style="display:flex;align-items:center;gap:6px;"><div style="width:8px;height:8px;border-radius:2px;background:#22c55e;"></div><div style="font-size:10px;color:#7a9bc4;">Active Detections</div></div>
      `;
      return div;
    };
    legend.addTo(mapRef.current);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Update detection overlays when results change
  useEffect(() => {
    if (!detectionLayerRef.current || !mapRef.current) return;

    detectionLayerRef.current.clearLayers();

    if (!activeDetectionResults?.geojson?.features) return;

    const geojson = activeDetectionResults.geojson;

    L.geoJSON(geojson, {
      style: (feature?: Feature): PathOptions => {
        const color = feature?.properties?.color || '#22c55e';
        const severity = feature?.properties?.severity;
        const isProne = severity === 'critical' || feature?.properties?.type === 'encroachment';
        const finalColor = isProne ? '#991b1b' : color;
        
        return {
          color: isProne ? '#450a0a' : finalColor, // Darker stroke for prone areas
          weight: isProne ? 4 : 2,
          opacity: 1,
          fillColor: finalColor,
          fillOpacity: isProne ? 0.7 : 0.25,
          dashArray: isProne ? '' : '4, 4',
        };
      },
      onEachFeature: (feature: Feature, layer: Layer) => {
        const p = (feature.properties || {}) as Record<string, unknown>;
        layer.bindPopup(`
          <div style="font-family:'Rajdhani',sans-serif;min-width:200px;">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
              <span style="font-size:18px;">${p.icon || '📍'}</span>
              <span style="font-weight:700;font-size:14px;">${p.label || p.type || 'Detection'}</span>
            </div>
            <div style="font-size:12px;color:#666;line-height:1.6;">
              <div>Type: <b>${p.type || 'unknown'}</b></div>
              <div>Confidence: <b>${typeof p.confidence === 'number' ? (p.confidence * 100).toFixed(0) + '%' : 'N/A'}</b></div>
              <div>Area: <b>${p.area_sqm ? p.area_sqm + ' m²' : 'N/A'}</b></div>
              ${p.severity ? `<div>Severity: <b style="color:${p.severity === 'critical' ? '#ef4444' : p.severity === 'high' ? '#f59e0b' : '#0ea5e9'}">${String(p.severity).toUpperCase()}</b></div>` : ''}
            </div>
          </div>
        `);
      },
    }).addTo(detectionLayerRef.current);

    // Fit bounds to show detections
    const bounds = L.geoJSON(geojson).getBounds();
    if (bounds.isValid()) {
      mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [activeDetectionResults]);

  // Update map center when store changes
  useEffect(() => {
    if (mapRef.current && mapCenter) {
      mapRef.current.flyTo([mapCenter.lat, mapCenter.lng], mapCenter.zoom, {
        duration: 1.5,
      });
    }
  }, [mapCenter]);

  return (
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />

      {/* Scan line animation */}
      {isProcessing && (
        <div style={{
          position: 'absolute', left: 0, right: 0, height: '2px',
          background: 'linear-gradient(90deg, transparent, #06d6e0, transparent)',
          animation: 'scandn 2s linear infinite', boxShadow: '0 0 15px #06d6e0',
          zIndex: 800, pointerEvents: 'none',
        }} />
      )}

      {/* Processing overlay */}
      {isProcessing && (
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(11, 15, 25, 0.85)',
          backdropFilter: 'blur(4px)', zIndex: 900, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '14px',
        }}>
          <div style={{
            width: '48px', height: '48px', border: '3px solid rgba(6, 214, 224, 0.2)',
            borderTopColor: '#06d6e0', borderRadius: '50%', animation: 'spin 0.9s linear infinite',
          }} />
          <div style={{
            fontFamily: "'Rajdhani', sans-serif", fontSize: '20px', fontWeight: 700,
            letterSpacing: '0.1em', color: '#06d6e0',
          }}>ANALYZING</div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#94a3b8',
            animation: 'blink 1s step-end infinite',
          }}>{processingStatus}</div>
        </div>
      )}

      {/* Coordinates display */}
      <div style={{
        position: 'absolute', bottom: '18px', left: '12px', zIndex: 1000,
        background: 'rgba(15, 23, 42, 0.92)', border: '1px solid #1e293b',
        borderRadius: '8px', padding: '7px 12px', backdropFilter: 'blur(10px)',
        display: 'flex', gap: '14px', alignItems: 'center',
        fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#94a3b8',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.5)',
      }}>
        <div>Lat: <span style={{ color: '#0ea5e9' }}>{mapCenter.lat.toFixed(4)}</span></div>
        <div>Lng: <span style={{ color: '#0ea5e9' }}>{mapCenter.lng.toFixed(4)}</span></div>
        <div style={{ width: '1px', height: '12px', background: '#1e293b' }} />
        <div style={{ color: activeDetectionResults ? '#22c55e' : '#94a3b8' }}>
          {activeDetectionResults ? `${activeDetectionResults.summary.total_detections} detections` : 'No analysis'}
        </div>
      </div>
    </div>
  );
}
