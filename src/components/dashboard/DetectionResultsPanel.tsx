

import { X, MapPin, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useAnalysisStore } from '@/lib/store';
import { exportGeoJSON, exportCSV } from '@/lib/api';

export function DetectionResultsPanel() {
  const { activeDetectionResults, showDetectionPanel, setShowDetectionPanel } = useAnalysisStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  if (!showDetectionPanel || !activeDetectionResults) return null;

  const { detections, summary, threat_level, processing_time_seconds, alerts_generated } = activeDetectionResults;
  const displayDetections = showAll ? detections : detections.slice(0, 8);

  const threatColors: Record<string, string> = {
    critical: '#ef4444', high: '#f59e0b', medium: '#0ea5e9', low: '#10d97a',
  };

  return (
    <div style={{
      position: 'absolute', top: 0, right: 0, bottom: 0, width: '380px', zIndex: 1100,
      background: 'rgba(8, 13, 26, 0.97)', backdropFilter: 'blur(20px)',
      borderLeft: '1px solid var(--bdr)', display: 'flex', flexDirection: 'column',
      animation: 'slideInRight 0.4s ease-out',
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 24px', borderBottom: '1px solid var(--bdr)',
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(6, 182, 212, 0.02))',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '12px', color: 'var(--ab)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '4px', fontWeight: 800 }}>
              AI SATELLITE SCAN
            </div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '24px', fontWeight: 800, color: 'white' }}>
              {summary.total_detections} SIGNALS ACQUIRED
            </div>
          </div>
          <button onClick={() => setShowDetectionPanel(false)} style={{
            width: '36px', height: '36px', borderRadius: '10px', border: '1px solid var(--bdr)',
            background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--ts)', transition: 'all 0.2s',
          }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
          >
            <X size={20} />
          </button>
        </div>

        {/* Threat Level Badge */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
          <div style={{
            padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 700,
            fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.08em',
            background: `${threatColors[threat_level]}22`, color: threatColors[threat_level],
            border: `1px solid ${threatColors[threat_level]}44`,
          }}>
            {threat_level} THREAT
          </div>
          <div style={{
            padding: '3px 10px', borderRadius: '20px', fontSize: '10px',
            fontFamily: "'JetBrains Mono', monospace", background: 'var(--bgc)', border: '1px solid var(--bdr)',
            color: 'var(--ts)',
          }}>
            {processing_time_seconds}s
          </div>
          {alerts_generated > 0 && (
            <div style={{
              padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 700,
              fontFamily: "'JetBrains Mono', monospace", background: 'rgba(239, 68, 68, 0.15)',
              color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)',
            }}>
              🚨 {alerts_generated} ALERTS
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px', padding: '10px', borderBottom: '1px solid var(--bdr)' }}>
        {[
          { label: 'Avg Confidence', value: `${(summary.average_confidence * 100).toFixed(0)}%`, color: 'var(--ac)' },
          { label: 'Green Cover', value: `${summary.green_cover_pct}%`, color: 'var(--ag)' },
          { label: 'Encroach.', value: summary.encroachment_count, color: 'var(--ar)' },
        ].map((stat, i) => (
          <div key={i} style={{
            background: 'var(--bgc)', borderRadius: '8px', padding: '8px', textAlign: 'center',
            border: '1px solid var(--bdr)',
          }}>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '18px', fontWeight: 700, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '9px', color: 'var(--tm)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Type Breakdown Bar */}
      <div style={{ padding: '10px', borderBottom: '1px solid var(--bdr)' }}>
        <div style={{ fontSize: '10px', color: 'var(--tm)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px', fontFamily: "'JetBrains Mono', monospace" }}>
          Asset Breakdown
        </div>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {Object.entries(summary.type_breakdown || {}).map(([type, count]) => (
            <div key={type} style={{
              padding: '3px 8px', borderRadius: '4px', fontSize: '10px',
              background: 'var(--bgc)', border: '1px solid var(--bdr)',
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              {type.replace('_', ' ')}: <span style={{ color: 'var(--ab)', fontWeight: 700 }}>{count as number}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Detection List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '6px' }}>
        {displayDetections.map((det: any) => (
          <div key={det.id} style={{
            background: expandedId === det.id ? 'var(--bgh)' : 'var(--bgc)',
            border: `1px solid ${det.severity === 'critical' ? 'rgba(239,68,68,0.4)' : 'var(--bdr)'}`,
            borderRadius: '8px', marginBottom: '4px', overflow: 'hidden', transition: 'all 0.2s', cursor: 'pointer',
          }}
            onClick={() => setExpandedId(expandedId === det.id ? null : det.id)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px', background: `${det.color || 'var(--ab)'}15`, border: `1px solid ${det.color || 'var(--ab)'}33`,
              }}>
                {det.icon || '📍'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {det.label}
                </div>
                <div style={{ display: 'flex', gap: '8px', fontSize: '10px', color: 'var(--tm)', fontFamily: "'JetBrains Mono', monospace" }}>
                  <span>{(det.confidence * 100).toFixed(0)}%</span>
                  {det.area_sqm && <span>{det.area_sqm}m²</span>}
                </div>
              </div>
              {det.severity && (
                <div style={{
                  padding: '2px 6px', borderRadius: '3px', fontSize: '9px', fontWeight: 700,
                  textTransform: 'uppercase',
                  background: det.severity === 'critical' ? 'rgba(239,68,68,0.2)' : det.severity === 'high' ? 'rgba(245,158,11,0.2)' : 'rgba(14,165,233,0.2)',
                  color: det.severity === 'critical' ? '#ef4444' : det.severity === 'high' ? '#f59e0b' : '#0ea5e9',
                }}>
                  {det.severity}
                </div>
              )}
              {expandedId === det.id ? <ChevronUp size={14} style={{ color: 'var(--ts)' }} /> : <ChevronDown size={14} style={{ color: 'var(--ts)' }} />}
            </div>
            {expandedId === det.id && (
              <div style={{ padding: '0 10px 10px', borderTop: '1px solid var(--bdr)', marginTop: '0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', paddingTop: '8px', fontSize: '10px' }}>
                  <div><span style={{ color: 'var(--tm)' }}>Type:</span> <span>{det.type}</span></div>
                  <div><span style={{ color: 'var(--tm)' }}>Area:</span> <span>{det.area_sqm || 'N/A'}m²</span></div>
                  <div><span style={{ color: 'var(--tm)' }}>Conf:</span> <span>{(det.confidence * 100).toFixed(1)}%</span></div>
                  <div><span style={{ color: 'var(--tm)' }}>Severity:</span> <span>{det.severity || 'N/A'}</span></div>
                </div>
                {det.location && (
                  <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--ab)' }}>
                    <MapPin size={10} /> {det.location.latitude?.toFixed(4)}, {det.location.longitude?.toFixed(4)}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {detections.length > 8 && (
          <button onClick={(e) => { e.stopPropagation(); setShowAll(!showAll); }} style={{
            width: '100%', padding: '8px', border: '1px dashed var(--bdr)', borderRadius: '6px',
            background: 'transparent', color: 'var(--ab)', cursor: 'pointer', fontSize: '11px',
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            {showAll ? 'Show Less' : `Show All ${detections.length} Detections`}
          </button>
        )}
      </div>

      {/* Export Buttons */}
      <div style={{ padding: '10px', borderTop: '1px solid var(--bdr)', display: 'flex', gap: '6px' }}>
        <button onClick={() => exportGeoJSON()} style={{
          flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid var(--bdr)',
          background: 'var(--bgc)', color: 'var(--tp)', cursor: 'pointer', fontSize: '11px',
          fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: '4px',
        }}>
          <Download size={12} /> GeoJSON
        </button>
        <button onClick={() => exportCSV()} style={{
          flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid var(--bdr)',
          background: 'var(--bgc)', color: 'var(--tp)', cursor: 'pointer', fontSize: '11px',
          fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: '4px',
        }}>
          <Download size={12} /> CSV
        </button>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
