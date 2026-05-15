

import { AlertCircle, CheckCircle, AlertTriangle, TrendingUp, RefreshCw, Layers, Activity, Zap, Shield } from 'lucide-react';
import { useAnalysisStore } from '@/lib/store';
import { useEffect } from 'react';

export function RightPanel() {
  const { activeDetectionResults, alerts, loadAlerts, backendOnline, checkBackend } = useAnalysisStore();

  useEffect(() => {
    checkBackend();
    loadAlerts();
  }, []);

  // Dynamic stats from detection results
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

  const displayAlerts = alerts.length > 0 ? alerts : [
    { id: '1', type: 'critical' as const, title: 'Critical Encroachment', message: 'Unauthorized structure detected near junction', time: '5 min ago' },
    { id: '2', type: 'warning' as const, title: 'Track Damage Detected', message: 'Corrosion identified on western sector', time: '23 min ago' },
    { id: '3', type: 'info' as const, title: 'System Stable', message: 'All sectors operational — no active incidents', time: '1 hour ago' },
  ];

  const colorMap = { b: 'linear-gradient(90deg, var(--ab), var(--ac))', g: 'var(--ag)', a: 'var(--aa)', r: 'var(--ar)', p: 'var(--ap)', c: 'var(--ac)' };

  return (
    <div style={{
      width: '288px', background: 'var(--bgp)', borderLeft: '1px solid var(--bdr)',
      display: 'flex', flexDirection: 'column', overflowY: 'auto', flexShrink: 0,
    }}>
      {/* Backend Status */}
      <div style={{
        padding: '6px 10px', borderBottom: '1px solid var(--bdr)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontSize: '10px', fontFamily: "'JetBrains Mono', monospace",
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: backendOnline ? 'var(--ag)' : 'var(--ar)',
            boxShadow: backendOnline ? '0 0 6px var(--ag)' : '0 0 6px var(--ar)',
            animation: 'pdot 1.5s ease-in-out infinite',
          }} />
          <span style={{ color: 'var(--tm)' }}>{backendOnline ? 'API Online' : 'Demo Mode'}</span>
        </div>
        <button onClick={() => { checkBackend(); loadAlerts(); }} style={{
          background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ts)', padding: '2px',
        }}>
          <RefreshCw size={10} />
        </button>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', padding: '10px', borderBottom: '1px solid var(--bdr)' }}>
        {stats.map((stat, i) => (
          <div key={i} style={{
            background: 'var(--bgc)', border: '1px solid var(--bdr)', borderRadius: '8px',
            padding: '9px', position: 'relative', overflow: 'hidden', transition: 'all 0.2s',
          }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--bdg)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--bdr)')}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: colorMap[stat.color] }} />
            <div style={{ fontSize: '16px', marginBottom: '3px' }}>{stat.icon}</div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '21px', fontWeight: 700, lineHeight: 1 }}>{stat.value}</div>
            <div style={{ fontSize: '10px', color: 'var(--tm)', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
            <div style={{ height: '3px', background: 'var(--bgh)', borderRadius: '2px', marginTop: '7px', overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: '2px', width: `${stat.percentage}%`, background: colorMap[stat.color], transition: 'width 0.5s' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Detection Summary (when active) */}
      {summary && (
        <div style={{ padding: '10px', borderBottom: '1px solid var(--bdr)' }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.1em',
            color: 'var(--tm)', textTransform: 'uppercase', marginBottom: '6px',
          }}>Detection Summary</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {Object.entries(summary.type_breakdown || {}).map(([type, count]) => (
              <div key={type} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '4px 6px', borderRadius: '4px', fontSize: '11px',
                background: type === 'encroachment' ? 'rgba(239,68,68,0.08)' : 'transparent',
              }}>
                <span style={{ color: 'var(--ts)', textTransform: 'capitalize' }}>{type.replace('_', ' ')}</span>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700,
                  color: type === 'encroachment' ? 'var(--ar)' : 'var(--tp)',
                }}>{count as number}</span>
              </div>
            ))}
            <div style={{
              display: 'flex', justifyContent: 'space-between', padding: '6px', borderTop: '1px solid var(--bdr)',
              marginTop: '4px', fontSize: '11px',
            }}>
              <span style={{ color: 'var(--tm)' }}>Total Area</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--ab)' }}>{summary.total_area_sqm?.toLocaleString()} m²</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 6px 4px', fontSize: '11px' }}>
              <span style={{ color: 'var(--tm)' }}>Avg Confidence</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--ag)' }}>{(summary.average_confidence * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Alerts */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.1em',
          color: 'var(--tm)', textTransform: 'uppercase', padding: '10px', borderBottom: '1px solid var(--bdr)',
        }}>Recent Alerts</div>
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {displayAlerts.map((alert) => (
            <div key={alert.id} style={{
              display: 'flex', gap: '9px', padding: '9px 10px', borderBottom: '1px solid var(--bdr)',
              cursor: 'pointer', transition: 'all 0.2s',
            }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bgh)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{
                width: '30px', height: '30px', borderRadius: '7px', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: '13px', flexShrink: 0,
                background: alert.type === 'critical' ? 'rgba(239,68,68,0.15)' : alert.type === 'warning' ? 'rgba(245,158,11,0.15)' : 'rgba(14,165,233,0.15)',
                border: `1px solid ${alert.type === 'critical' ? 'rgba(239,68,68,0.3)' : alert.type === 'warning' ? 'rgba(245,158,11,0.3)' : 'rgba(14,165,233,0.3)'}`,
                color: alert.type === 'critical' ? '#ef4444' : alert.type === 'warning' ? '#f59e0b' : '#0ea5e9',
              }}>
                {alert.type === 'critical' ? <AlertCircle size={14} /> : alert.type === 'warning' ? <AlertTriangle size={14} /> : <CheckCircle size={14} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '11px', lineHeight: '1.4', marginBottom: '2px', fontWeight: 500 }}>{alert.title}</div>
                <div style={{ fontSize: '10px', color: 'var(--tm)', fontFamily: "'JetBrains Mono', monospace" }}>{alert.message}</div>
                <div style={{ fontSize: '9px', color: 'var(--ts)', marginTop: '3px' }}>{alert.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
