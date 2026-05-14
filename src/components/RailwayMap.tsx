
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { useRef } from 'react';
import type { Feature } from 'geojson';
import type { Layer, PathOptions, LatLngExpression } from 'leaflet';
import L from 'leaflet';
import { useAnalysisStore } from '@/lib/store';
import { DUMMY_RAILWAY_FEATURES } from '@/lib/dummy-data';
import 'leaflet/dist/leaflet.css';

export default function RailwayMap() {
  const geoJsonRef = useRef<L.GeoJSON | null>(null);
  const { setSelectedFeatureId, selectedFeatureId } = useAnalysisStore();

  // Custom icon for points
  const createCustomIcon = (type: string) => {
    const colors: Record<string, string> = {
      station: '#2563eb',
      bridge: '#dc2626',
      encroachment: '#f59e0b',
      default: '#1f2937',
    };
    const color = colors[type] || colors.default;

    return L.divIcon({
      html: `
        <div style="
          background-color: ${color};
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-items: center;
        "></div>
      `,
      iconSize: [24, 24],
      className: 'custom-icon',
    });
  };

  const onEachFeature = (feature: Feature, layer: Layer) => {
    const props = feature.properties as Record<string, unknown> | null | undefined;
    let content = `<div class="p-2">
      <h3 class="font-bold text-sm">${String(props?.name ?? 'Unknown')}</h3>
      <p class="text-xs text-gray-600">Type: ${String(props?.type ?? '')}</p>`;

    if (typeof props?.detectionConfidence === 'number') {
      content += `<p class="text-xs">Confidence: ${(props.detectionConfidence * 100).toFixed(1)}%</p>`;
    }
    if (props?.status) {
      content += `<p class="text-xs">Status: ${String(props.status)}</p>`;
    }
    if (props?.condition) {
      content += `<p class="text-xs">Condition: ${String(props.condition)}</p>`;
    }
    if (props?.severity) {
      content += `<p class="text-xs text-red-600">Severity: ${String(props.severity)}</p>`;
    }

    content += '</div>';

    layer.bindPopup(content);
    layer.on('click', () => {
      const id = feature.id != null ? String(feature.id) : String(props?.id ?? '');
      setSelectedFeatureId(id);
    });
  };

  const style = (feature?: Feature): PathOptions => {
    const type = (feature?.properties as Record<string, unknown> | undefined)?.type;
    let color = '#374151';
    let weight = 3;
    let opacity = 0.8;

    if (type === 'rail_track') {
      color = '#1f2937';
      weight = 4;
    } else if (type === 'encroachment') {
      color = '#f59e0b';
    }

    return {
      color,
      weight,
      opacity,
    };
  };

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={[19.076, 72.8479]}
        zoom={14}
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <GeoJSON
          ref={geoJsonRef}
          data={DUMMY_RAILWAY_FEATURES as any}
          onEachFeature={onEachFeature}
          style={style}
          pointToLayer={(feature: Feature, latlng: LatLngExpression) => {
            const type = (feature.properties as Record<string, unknown> | undefined)?.type;
            const marker = L.marker(latlng, {
              icon: createCustomIcon(typeof type === 'string' ? type : 'default'),
            });
            return marker;
          }}
        />

        {/* Highlight selected feature */}
        {selectedFeatureId && (
          <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 z-10 max-w-xs">
            <p className="text-sm font-semibold text-slate-900">Selected Feature</p>
            <p className="text-xs text-slate-600">{selectedFeatureId}</p>
          </div>
        )}
      </MapContainer>
    </div>
  );
}
