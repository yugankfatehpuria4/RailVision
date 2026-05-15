

import { Upload, Layers, Download, GitCompare, Zap, BarChart3, Activity, AlertTriangle, TrendingUp, Shield, CheckCircle, RefreshCw } from 'lucide-react';
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

  const { isProcessing, processingStatus, processingProgress, uploadAndDetect, runChangeDetection, layerVisibility, toggleLayer, activeDetectionResults } = useAnalysisStore();
  const summary = activeDetectionResults?.summary;

  const stats = summary ? [
    { icon: <Layers size={18} />, label: 'Buildings', value: summary.building_count || 0, color: 'b' as const, percentage: Math.min((summary.building_count || 0) * 15, 100) },
    { icon: <Activity size={18} />, label: 'Green Cover', value: `${summary.green_cover_pct || 0}%`, color: 'g' as const, percentage: summary.green_cover_pct || 0 },
    { icon: <Zap size={18} />, label: 'Water Area', value: `${Math.round((summary.water_area_sqm || 0) / 100)}`, color: 'c' as const, percentage: Math.min((summary.water_area_sqm || 0) / 100, 100) },
    { icon: <AlertTriangle size={18} />, label: 'Encroach.', value: summary.encroachment_count || 0, color: 'r' as const, percentage: Math.min((summary.encroachment_count || 0) * 20, 100) },
  ] : [
    { icon: <TrendingUp size={18} />, label: 'Neural Accuracy', value: '99.8%', color: 'b' as const, percentage: 92 },
    { icon: <Layers size={18} />, label: 'Active Sectors', value: 34, color: 'c' as const, percentage: 88 },
    { icon: <Shield size={18} />, label: 'Security Node', value: 'Active', color: 'a' as const, percentage: 100 },
    { icon: <AlertTriangle size={18} />, label: 'System Load', value: '24%', color: 'r' as const, percentage: 24 },
  ];

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
            border: isDragging ? '2px solid var(--ab)' : selectedFile ? '2px solid var(--ag)' : '1px solid var(--bdr)',
            borderRadius: '16px', padding: '20px 16px', textAlign: 'center', cursor: 'pointer',
            transition: 'all 0.3s', background: isDragging ? 'rgba(6,182,212,0.1)' : selectedFile ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.02)',
            boxShadow: isDragging ? '0 0 20px rgba(6,182,212,0.1)' : 'none',
          }}>
          <label style={{ cursor: 'pointer', display: 'block' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>
              {selectedFile ? <CheckCircle className="inline" size={32} color="var(--ag)" /> : <Upload className="inline" size={32} color="var(--ab)" />}
            </div>
            {selectedFile ? (
              <div style={{ fontSize: '12px', color: 'var(--ag)' }}>
                <strong style={{ display: 'block', fontSize: '13px', marginBottom: '4px', fontFamily: "'Rajdhani', sans-serif" }}>{selectedFile.name}</strong>
                {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
              </div>
            ) : (
              <div style={{ fontSize: '12px', color: 'var(--ts)', lineHeight: '1.6', fontFamily: "'Rajdhani', sans-serif" }}>
                <strong style={{ color: 'var(--ab)', display: 'block', fontSize: '14px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Upload Mission Intel</strong>
                Drag and drop satellite imagery
              </div>
            )}
            <input type="file" accept="image/*,.tif,.tiff" onChange={handleFileInput} style={{ display: 'none' }} />
          </label>
        </div>

        {/* GPS Inputs */}
        <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--tm)', fontFamily: "'JetBrains Mono', monospace", display: 'block', marginBottom: '4px' }}>Latitude</label>
            <input type="text" value={lat} onChange={(e) => setLat(e.target.value)} style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--ab)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--bdr)')} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--tm)', fontFamily: "'JetBrains Mono', monospace", display: 'block', marginBottom: '4px' }}>Longitude</label>
            <input type="text" value={lng} onChange={(e) => setLng(e.target.value)} style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--ab)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--bdr)')} />
          </div>
        </div>

        {/* Progress bar */}
        {isProcessing && (
          <div style={{ marginTop: '12px' }}>
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: '2px', width: `${processingProgress}%`,
                background: 'linear-gradient(90deg, var(--ab), var(--ac))', transition: 'width 0.3s',
                boxShadow: '0 0 10px var(--ab)',
              }} />
            </div>
            <div style={{ fontSize: '10px', color: 'var(--ab)', marginTop: '6px', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              SCANNING: {processingStatus}
            </div>
          </div>
        )}

        {/* Analyze Button */}
        <button disabled={isProcessing || !selectedFile} onClick={handleAnalyze} style={{
          width: '100%', marginTop: '16px', padding: '12px',
          background: isProcessing ? 'rgba(255,255,255,0.05)' : !selectedFile ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, var(--ab), var(--ac))',
          border: 'none', borderRadius: '12px', color: isProcessing || !selectedFile ? 'var(--tm)' : 'black',
          fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: '14px', letterSpacing: '0.1em',
          cursor: isProcessing || !selectedFile ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          transition: 'all 0.3s', opacity: isProcessing || !selectedFile ? 0.5 : 1,
          animation: isProcessing ? 'spulse 1.5s ease-in-out infinite' : 'none',
          textTransform: 'uppercase',
        }}>
          {isProcessing ? (
            <><RefreshCw size={16} className="animate-spin" /> PROCESSING...</>
          ) : (
            <><Zap size={16} /> START AI ANALYSIS</>
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
            background: 'var(--bgc)', color: 'var(--ts)', cursor: 'pointer',
          }}>
            <Download size={10} /> CSV
          </button>
        </div>
      </div>
    </div>
  );
}
