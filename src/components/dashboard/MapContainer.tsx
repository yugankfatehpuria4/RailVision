
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

const hasFeatures = (geojson: any) => Array.isArray(geojson?.features) && geojson.features.length > 0;

const tagGeoJSON = (geojson: any, kind: 'detection' | 'change') => ({
  type: 'FeatureCollection',
  features: (geojson?.features || []).map((feature: any) => ({
    ...feature,
    properties: {
      kind,
      ...(feature.properties || {}),
    },
  })),
});

const collectionFromItems = (items: any[] | undefined, kind: 'detection' | 'change') => ({
  type: 'FeatureCollection',
  features: (items || [])
    .filter((item) => Array.isArray(item.polygon) && item.polygon.length >= 4)
    .map((item) => ({
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: [item.polygon] },
      properties: { kind, ...item },
    })),
});

export function MapContainer({ isProcessing = false, processingStatus = 'Analyzing satellite imagery...' }: MapContainerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const detectionLayerRef = useRef<L.LayerGroup | null>(null);
  const { activeDetectionResults, changeDetectionResults, layerVisibility, mapCenter } = useAnalysisStore();

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
      div.style.cssText = 'background:rgba(2,6,23,0.9);border:1px solid var(--bdr);border-radius:12px;padding:12px 16px;backdrop-filter:blur(20px);min-width:180px;box-shadow:0 10px 30px rgba(0,0,0,0.5);';
      div.innerHTML = `
        <div style="font-family:'Rajdhani',sans-serif;font-size:11px;color:var(--tm);letter-spacing:0.15em;text-transform:uppercase;margin-bottom:10px;font-weight:700;">Tactical Legend</div>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;"><div style="width:10px;height:10px;border-radius:2px;background:var(--ab);box-shadow:0 0 8px var(--ab);"></div><div style="font-family:'Rajdhani',sans-serif;font-size:12px;color:var(--ts);font-weight:600;">Stations / Tracks</div></div>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;"><div style="width:10px;height:10px;border-radius:2px;background:var(--ap);box-shadow:0 0 8px var(--ap);"></div><div style="font-family:'Rajdhani',sans-serif;font-size:12px;color:var(--ts);font-weight:600;">Bridges / Assets</div></div>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;"><div style="width:10px;height:10px;border-radius:2px;background:var(--ar);border:1px solid #450a0a;box-shadow:0 0 8px var(--ar);"></div><div style="font-family:'Rajdhani',sans-serif;font-size:12px;color:#ef4444;font-weight:800;">Encroachment Zones</div></div>
        <div style="display:flex;align-items:center;gap:10px;"><div style="width:10px;height:10px;border-radius:2px;background:var(--ag);box-shadow:0 0 8px var(--ag);"></div><div style="font-family:'Rajdhani',sans-serif;font-size:12px;color:var(--ag);font-weight:800;">AI Detections</div></div>
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

    if (!layerVisibility.detections) return;

    const detectionGeoJSON = hasFeatures(activeDetectionResults?.geojson)
      ? tagGeoJSON(activeDetectionResults?.geojson, 'detection')
      : collectionFromItems(activeDetectionResults?.detections, 'detection');
    const changeGeoJSON = hasFeatures(changeDetectionResults?.geojson)
      ? tagGeoJSON(changeDetectionResults?.geojson, 'change')
      : collectionFromItems(changeDetectionResults?.changes, 'change');
    const geojson = {
      type: 'FeatureCollection',
      features: [
        ...detectionGeoJSON.features,
        ...changeGeoJSON.features,
      ],
    };

    if (geojson.features.length === 0) return;

    L.geoJSON(geojson as any, {
      style: (feature?: Feature): PathOptions => {
        const props = (feature?.properties || {}) as Record<string, unknown>;
        const isChange = props.kind === 'change';
        const color = String(props.color || (isChange ? '#a855f7' : '#22c55e'));
        const severity = props.severity;
        const isProne = severity === 'critical' || props.type === 'encroachment';
        const finalColor = isProne ? '#991b1b' : color;
        
        return {
          color: isProne ? '#450a0a' : finalColor, // Darker stroke for prone areas
          weight: isProne ? 4 : isChange ? 3 : 2,
          opacity: 1,
          fillColor: finalColor,
          fillOpacity: isProne ? 0.7 : isChange ? 0.35 : 0.25,
          dashArray: isProne ? '' : isChange ? '8, 4' : '4, 4',
        };
      },
      onEachFeature: (feature: Feature, layer: Layer) => {
        const p = (feature.properties || {}) as Record<string, unknown>;
        const title = p.kind === 'change' ? 'Temporal Change' : 'Detection';
        layer.bindPopup(`
          <div style="font-family:'Rajdhani',sans-serif;min-width:200px;">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
              <span style="font-size:18px;">${p.icon || '📍'}</span>
              <span style="font-weight:700;font-size:14px;">${p.label || p.type || 'Detection'}</span>
            </div>
            <div style="font-size:12px;color:#666;line-height:1.6;">
              <div>Layer: <b>${title}</b></div>
              <div>Type: <b>${p.type || 'unknown'}</b></div>
              <div>Confidence: <b>${typeof p.confidence === 'number' ? (p.confidence * 100).toFixed(0) + '%' : 'N/A'}</b></div>
              <div>Area: <b>${p.area_sqm ? p.area_sqm + ' m²' : 'N/A'}</b></div>
              ${typeof p.change_pct === 'number' ? `<div>Change: <b>${p.change_pct}%</b></div>` : ''}
              ${p.severity ? `<div>Severity: <b style="color:${p.severity === 'critical' ? '#ef4444' : p.severity === 'high' ? '#f59e0b' : '#0ea5e9'}">${String(p.severity).toUpperCase()}</b></div>` : ''}
            </div>
          </div>
        `);
      },
    }).addTo(detectionLayerRef.current);

    // Fit bounds to show detections
    const bounds = L.geoJSON(geojson as any).getBounds();
    if (bounds.isValid()) {
      mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [activeDetectionResults, changeDetectionResults, layerVisibility.detections]);

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
        position: 'absolute', bottom: '24px', left: '20px', zIndex: 1000,
        background: 'rgba(2, 6, 23, 0.9)', border: '1px solid var(--bdr)',
        borderRadius: '12px', padding: '10px 16px', backdropFilter: 'blur(20px)',
        display: 'flex', gap: '20px', alignItems: 'center',
        fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--ts)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--ab)' }} />
          LAT: <span style={{ color: 'var(--tp)', fontWeight: 700 }}>{mapCenter.lat.toFixed(6)}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--ab)' }} />
          LNG: <span style={{ color: 'var(--tp)', fontWeight: 700 }}>{mapCenter.lng.toFixed(6)}</span>
        </div>
        <div style={{ width: '1px', height: '14px', background: 'var(--bdr)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: activeDetectionResults ? 'var(--ag)' : 'var(--tm)' }}>
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: activeDetectionResults ? 'var(--ag)' : 'var(--tm)', animation: activeDetectionResults ? 'pdot 1.5s infinite' : 'none' }} />
          {activeDetectionResults ? `${activeDetectionResults.summary.total_detections} ACTIVE SIGNALS` : 'NO TARGETS'}
        </div>
      </div>
    </div>
  );
}
