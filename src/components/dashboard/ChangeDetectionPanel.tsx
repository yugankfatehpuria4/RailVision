

import { X, AlertTriangle, TrendingDown, Construction } from 'lucide-react';
import { useAnalysisStore } from '@/lib/store';

export function ChangeDetectionPanel() {
  const { changeDetectionResults, showChangeDetection, setShowChangeDetection } = useAnalysisStore();

  if (!showChangeDetection || !changeDetectionResults) return null;

  const { changes, summary, threat_level, processing_time_seconds } = changeDetectionResults;
  const threatColors: Record<string, string> = { critical: '#ef4444', high: '#f59e0b', medium: '#0ea5e9', low: '#10d97a' };

  return (
    <div style={{
      position: 'absolute', top: 0, right: 0, bottom: 0, width: '380px', zIndex: 1100,
      background: 'rgba(8, 13, 26, 0.97)', backdropFilter: 'blur(20px)',
      borderLeft: '1px solid var(--bdr)', display: 'flex', flexDirection: 'column',
      animation: 'slideInRight 0.4s ease-out',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px', borderBottom: '1px solid var(--bdr)',
        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.08), rgba(239, 68, 68, 0.04))',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'var(--tm)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
              Change Detection
            </div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '20px', fontWeight: 700 }}>
              {summary.total_changes} Changes Found
            </div>
          </div>
          <button onClick={() => setShowChangeDetection(false)} style={{
            width: '30px', height: '30px', borderRadius: '6px', border: '1px solid var(--bdr)',
            background: 'var(--bgc)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--ts)',
          }}>
            <X size={14} />
          </button>
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
          <div style={{
            padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 700,
            fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase',
            background: `${threatColors[threat_level]}22`, color: threatColors[threat_level],
            border: `1px solid ${threatColors[threat_level]}44`,
          }}>
            {threat_level} RISK
          </div>
          <div style={{
            padding: '3px 10px', borderRadius: '20px', fontSize: '10px',
            fontFamily: "'JetBrains Mono', monospace", background: 'var(--bgc)', border: '1px solid var(--bdr)', color: 'var(--ts)',
          }}>
            {processing_time_seconds}s
          </div>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', padding: '10px', borderBottom: '1px solid var(--bdr)' }}>
        <div style={{ background: 'var(--bgc)', borderRadius: '8px', padding: '8px', textAlign: 'center', border: '1px solid var(--bdr)' }}>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '18px', fontWeight: 700, color: 'var(--ar)' }}>{summary.encroachment_alerts || 0}</div>
          <div style={{ fontSize: '9px', color: 'var(--tm)', textTransform: 'uppercase' }}>Encroachments</div>
        </div>
        <div style={{ background: 'var(--bgc)', borderRadius: '8px', padding: '8px', textAlign: 'center', border: '1px solid var(--bdr)' }}>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '18px', fontWeight: 700, color: 'var(--aa)' }}>{summary.overall_change_pct || 0}%</div>
          <div style={{ fontSize: '9px', color: 'var(--tm)', textTransform: 'uppercase' }}>Avg Change</div>
        </div>
      </div>

      {/* Changes List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '6px' }}>
        {changes.map((change: any) => (
          <div key={change.id} style={{
            background: 'var(--bgc)', border: `1px solid ${change.severity === 'critical' ? 'rgba(239,68,68,0.4)' : 'var(--bdr)'}`,
            borderRadius: '8px', marginBottom: '4px', padding: '10px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `${change.color}15`, border: `1px solid ${change.color}33`, color: change.color,
              }}>
                {change.type === 'encroachment' ? <AlertTriangle size={14} /> :
                 change.type === 'vegetation_loss' ? <TrendingDown size={14} /> :
                 <Construction size={14} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', fontWeight: 600 }}>{change.label}</div>
                <div style={{ fontSize: '10px', color: 'var(--tm)', fontFamily: "'JetBrains Mono', monospace" }}>
                  {(change.confidence * 100).toFixed(0)}% conf · {change.area_sqm}m²
                </div>
              </div>
              <div style={{
                padding: '2px 6px', borderRadius: '3px', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase',
                background: change.severity === 'critical' ? 'rgba(239,68,68,0.2)' : change.severity === 'high' ? 'rgba(245,158,11,0.2)' : 'rgba(14,165,233,0.15)',
                color: change.severity === 'critical' ? '#ef4444' : change.severity === 'high' ? '#f59e0b' : '#0ea5e9',
              }}>
                {change.severity}
              </div>
            </div>
            {/* Change percentage bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ flex: 1, height: '4px', background: 'var(--bgh)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${change.change_pct}%`, borderRadius: '2px',
                  background: change.color, transition: 'width 0.5s',
                }} />
              </div>
              <span style={{ fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", color: change.color }}>{change.change_pct}%</span>
            </div>
          </div>
        ))}
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
