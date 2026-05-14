

import { Upload, Layers, Download, GitCompare, Zap, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAnalysisStore } from '@/lib/store';
import { exportGeoJSON, exportCSV } from '@/lib/api';

interface LeftSidebarProps {
  onImageUpload?: (file: File, lat: number, lng: number) => void;
  layers?: Array<{ id: string; name: string; enabled: boolean }>;
  onLayerToggle?: (layerId: string, enabled: boolean) => void;
}

export function LeftSidebar({ onImageUpload, layers, onLayerToggle }: LeftSidebarProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [lat, setLat] = useState('28.6139');
  const [lng, setLng] = useState('77.2090');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { isProcessing, processingStatus, processingProgress, uploadAndDetect, runChangeDetection, layerVisibility, toggleLayer, backendOnline } = useAnalysisStore();

  const defaultLayers = layers || [
    { id: 'tracks', name: 'Railway Tracks', enabled: layerVisibility.tracks },
    { id: 'stations', name: 'Stations', enabled: layerVisibility.stations },
    { id: 'bridges', name: 'Bridges', enabled: layerVisibility.bridges },
    { id: 'encroachments', name: 'Encroachments', enabled: layerVisibility.encroachments },
    { id: 'detections', name: 'AI Detections', enabled: layerVisibility.detections },
  ];

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files.length > 0) setSelectedFile(e.dataTransfer.files[0]);
  };
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
  };

  const handleAnalyze = async () => {
    const file = selectedFile;
    if (!file) return;
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    if (onImageUpload) onImageUpload(file, latNum, lngNum);
    await uploadAndDetect(file, latNum, lngNum);
    setSelectedFile(null);
  };

  const sectionHeader = (label: string) => (
    <div style={{
      fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.13em',
      textTransform: 'uppercase', color: 'var(--tm)', marginBottom: '9px',
      display: 'flex', alignItems: 'center', gap: '6px',
    }}>
      <div style={{ width: '3px', height: '10px', background: 'var(--ac)', borderRadius: '2px' }} />
      {label}
    </div>
  );

  const inputStyle = {
    width: '100%', background: 'var(--bgc)', border: '1px solid var(--bdr)',
    borderRadius: '6px', padding: '6px 8px', color: 'var(--tp)',
    fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', outline: 'none', transition: 'all 0.2s',
  };

  return (
    <div style={{
      width: '264px', background: 'var(--bgp)', borderRight: '1px solid var(--bdr)',
      display: 'flex', flexDirection: 'column', overflowY: 'auto', flexShrink: 0,
    }}>
      {/* Upload Section */}
      <div style={{ borderBottom: '1px solid var(--bdr)', padding: '11px' }}>
        {sectionHeader('Image Analysis')}

        {/* Upload Zone */}
        <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
          style={{
            border: isDragging ? '2px solid var(--ab)' : selectedFile ? '2px solid var(--ag)' : '2px dashed var(--bdg)',
            borderRadius: '10px', padding: '14px 12px', textAlign: 'center', cursor: 'pointer',
            transition: 'all 0.3s', background: isDragging ? 'rgba(14,165,233,0.15)' : selectedFile ? 'rgba(16,217,122,0.05)' : 'rgba(14,165,233,0.03)',
          }}>
          <label style={{ cursor: 'pointer', display: 'block' }}>
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>{selectedFile ? '✅' : '📸'}</div>
            {selectedFile ? (
              <div style={{ fontSize: '11px', color: 'var(--ag)' }}>
                <strong style={{ display: 'block', fontSize: '12px', marginBottom: '2px' }}>{selectedFile.name}</strong>
                {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
              </div>
            ) : (
              <div style={{ fontSize: '11px', color: 'var(--ts)', lineHeight: '1.5' }}>
                <strong style={{ color: 'var(--ab)', display: 'block', fontSize: '12px', marginBottom: '2px' }}>Click to upload</strong>
                or drag and drop
              </div>
            )}
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--tm)', marginTop: '4px' }}>
              PNG, JPG, TIFF up to 50MB
            </div>
            <input type="file" accept="image/*,.tif,.tiff" onChange={handleFileInput} style={{ display: 'none' }} />
          </label>
        </div>

        {/* GPS Inputs */}
        <div style={{ marginTop: '10px', display: 'flex', gap: '6px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--tm)', fontFamily: "'JetBrains Mono', monospace", display: 'block', marginBottom: '3px' }}>Lat</label>
            <input type="text" value={lat} onChange={(e) => setLat(e.target.value)} style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--ab)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--bdr)')} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--tm)', fontFamily: "'JetBrains Mono', monospace", display: 'block', marginBottom: '3px' }}>Lng</label>
            <input type="text" value={lng} onChange={(e) => setLng(e.target.value)} style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--ab)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--bdr)')} />
          </div>
        </div>

        {/* Progress bar */}
        {isProcessing && (
          <div style={{ marginTop: '8px' }}>
            <div style={{ height: '3px', background: 'var(--bgh)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: '2px', width: `${processingProgress}%`,
                background: 'linear-gradient(90deg, var(--ab), var(--ac))', transition: 'width 0.3s',
              }} />
            </div>
            <div style={{ fontSize: '10px', color: 'var(--tm)', marginTop: '3px', fontFamily: "'JetBrains Mono', monospace" }}>
              {processingStatus}
            </div>
          </div>
        )}

        {/* Analyze Button */}
        <button disabled={isProcessing || !selectedFile} onClick={handleAnalyze} style={{
          width: '100%', marginTop: '9px', padding: '9px',
          background: isProcessing ? 'linear-gradient(135deg, #1a2d52, #0d2040)' : !selectedFile ? 'linear-gradient(135deg, #1a2d52, #0d2040)' : 'linear-gradient(135deg, var(--ab), var(--ac))',
          border: 'none', borderRadius: '8px', color: '#fff',
          fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '13px', letterSpacing: '0.08em',
          cursor: isProcessing || !selectedFile ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
          transition: 'all 0.3s', opacity: isProcessing || !selectedFile ? 0.6 : 1,
          animation: isProcessing ? 'spulse 1.5s ease-in-out infinite' : 'none',
        }}>
          {isProcessing ? (
            <><div style={{ width: '12px', height: '12px', border: '2px solid rgba(255,255,255,0.2)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Analyzing...</>
          ) : (
            <><Zap size={14} /> Analyze Image</>
          )}
        </button>
      </div>

      {/* Layers Section */}
      <div style={{ borderBottom: '1px solid var(--bdr)', padding: '11px' }}>
        {sectionHeader('Map Layers')}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {defaultLayers.map((layer) => (
            <div key={layer.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '5px 4px', cursor: 'pointer', borderRadius: '6px', transition: 'all 0.2s',
            }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bgh)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: layer.enabled ? 'var(--ab)' : 'var(--bdr)', transition: 'all 0.2s' }} />
                <span style={{ fontSize: '11px' }}>{layer.name}</span>
              </div>
              <button onClick={() => { toggleLayer(layer.id); onLayerToggle?.(layer.id, !layer.enabled); }}
                style={{
                  width: '28px', height: '15px', borderRadius: '9px',
                  border: `1px solid ${layer.enabled ? 'var(--ab)' : 'var(--bdr)'}`,
                  position: 'relative', cursor: 'pointer', transition: 'all 0.3s',
                  background: layer.enabled ? 'var(--ab)' : 'var(--bgc)',
                }}>
                <div style={{
                  position: 'absolute', top: '1.5px', left: layer.enabled ? '13px' : '1.5px',
                  width: '10px', height: '10px', borderRadius: '50%', background: '#fff', transition: 'all 0.3s',
                }} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Change Detection */}
      <div style={{ borderBottom: '1px solid var(--bdr)', padding: '11px' }}>
        {sectionHeader('Change Detection')}
        <button onClick={() => runChangeDetection(parseFloat(lat), parseFloat(lng))} disabled={isProcessing}
          style={{
            width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--bdg)',
            background: 'rgba(168, 85, 247, 0.08)', color: 'var(--ap)', cursor: isProcessing ? 'not-allowed' : 'pointer',
            fontSize: '12px', fontFamily: "'Rajdhani', sans-serif", fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s',
          }}>
          <GitCompare size={13} /> Compare Imagery
        </button>
        <div style={{ fontSize: '9px', color: 'var(--tm)', marginTop: '4px', fontFamily: "'JetBrains Mono', monospace" }}>
          Detect illegal construction, tree cutting, encroachments
        </div>
      </div>

      {/* Analytics */}
      <div style={{ borderBottom: '1px solid var(--bdr)', padding: '11px' }}>
        {sectionHeader('Operations')}
        <Link to="/analytics" style={{ textDecoration: 'none' }}>
          <button style={{
            width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--ab)',
            background: 'rgba(14, 165, 233, 0.08)', color: 'var(--ab)', cursor: 'pointer',
            fontSize: '12px', fontFamily: "'Rajdhani', sans-serif", fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s',
          }}>
            <BarChart3 size={13} /> View Analytics Demo
          </button>
        </Link>
      </div>

      {/* Export */}
      <div style={{ padding: '11px' }}>
        {sectionHeader('Export Data')}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button onClick={() => exportGeoJSON()} style={{
            flex: 1, padding: '7px', borderRadius: '6px', border: '1px solid var(--bdr)',
            background: 'var(--bgc)', color: 'var(--ts)', cursor: 'pointer', fontSize: '10px',
            fontFamily: "'JetBrains Mono', monospace", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
          }}>
            <Download size={10} /> GeoJSON
          </button>
          <button onClick={() => exportCSV()} style={{
            flex: 1, padding: '7px', borderRadius: '6px', border: '1px solid var(--bdr)',
            background: 'var(--bgc)', color: 'var(--ts)', cursor: 'pointer', fontSize: '10px',
            fontFamily: "'JetBrains Mono', monospace", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
          }}>
            <Download size={10} /> CSV
          </button>
        </div>
      </div>
    </div>
  );
}
