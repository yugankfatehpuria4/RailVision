import { useAnalysisStore } from '@/lib/store';
import { X, AlertTriangle, Clock, Users, CheckCircle } from 'lucide-react';

const SEVERITY_COLORS: Record<string, string> = {
  critical: '#dc2626', high: '#f59e0b', medium: '#3b82f6', low: '#22c55e',
};

const TYPE_ICONS: Record<string, string> = {
  flood: '🌊', encroachment: '🚧', derailment: '🚂', fire: '🔥',
  landslide: '⛰️', track_damage: '🛤️', other: '⚠️',
};

export function SOSPanel() {
  const { showSOSPanel, setShowSOSPanel, sosIncidents, resolveSOSIncident } = useAnalysisStore();

  if (!showSOSPanel) return null;

  return (
    <div style={{
      position: 'absolute', top: 0, right: 0, bottom: 0, width: '420px', zIndex: 1500,
      background: 'var(--bgp)', borderLeft: '1px solid var(--bdr)',
      boxShadow: '-20px 0 50px rgba(0,0,0,0.8)', display: 'flex', flexDirection: 'column',
      animation: 'slideInRight 0.3s ease-out', backdropFilter: 'blur(30px)',
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #ef4444, #991b1b)', padding: '20px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'white',
        flexShrink: 0, borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AlertTriangle size={20} />
          <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: '18px', letterSpacing: '0.2em' }}>
            EMERGENCY OVERRIDE
          </span>
          <div style={{
            background: 'rgba(0,0,0,0.3)', borderRadius: '6px', padding: '2px 10px',
            fontSize: '14px', fontWeight: 900, border: '1px solid rgba(255,255,255,0.2)',
          }}>{sosIncidents.length}</div>
        </div>
        <button onClick={() => setShowSOSPanel(false)} style={{
          background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px',
          width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'white', transition: 'all 0.2s',
        }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
        ><X size={18} /></button>
      </div>

      {/* Incident List */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px', background: 'rgba(0,0,0,0.2)' }}>
        {sosIncidents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--tm)' }}>
            <div style={{ 
              width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.02)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
              border: '1px solid var(--bdr)'
            }}>
              <CheckCircle size={40} style={{ opacity: 0.2 }} />
            </div>
            <p style={{ fontWeight: 800, fontSize: '16px', fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.1em', color: 'var(--ts)' }}>ALL SYSTEMS NOMINAL</p>
            <p style={{ fontSize: '13px', marginTop: '8px' }}>No active emergencies detected in the network.</p>
          </div>
        ) : (
          sosIncidents.map((incident) => {
            const sevColor = SEVERITY_COLORS[incident.severity] || '#6b7280';
            const icon = TYPE_ICONS[incident.incident_type] || '⚠️';
            const timeAgo = getTimeAgo(incident.created_at);
            return (
              <div key={incident.id} style={{
                background: 'rgba(255,255,255,0.02)', border: '1px solid var(--bdr)', borderRadius: '16px',
                padding: '20px', marginBottom: '16px', transition: 'all 0.3s',
                borderLeft: `4px solid ${sevColor}`,
                boxShadow: incident.severity === 'critical' ? `0 0 20px ${sevColor}15` : 'none',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '24px', background: 'rgba(255,255,255,0.05)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '16px', color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: "'Rajdhani', sans-serif" }}>
                        {incident.incident_type.replace('_', ' ')}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--tm)', fontFamily: "'JetBrains Mono', monospace", marginTop: '2px' }}>{timeAgo}</div>
                    </div>
                  </div>
                  {/* Severity Badge */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '4px 12px', borderRadius: '8px', fontSize: '10px', fontWeight: 900,
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                    background: `${sevColor}20`, color: sevColor, border: `1px solid ${sevColor}40`,
                    fontFamily: "'Rajdhani', sans-serif",
                  }}>
                    <div style={{
                      width: '6px', height: '6px', borderRadius: '50%', background: sevColor,
                      animation: incident.severity === 'critical' ? 'sosPulse 1s infinite' : 'none',
                      boxShadow: `0 0 8px ${sevColor}`,
                    }} />
                    {incident.severity}
                  </div>
                </div>

                {incident.description && (
                  <p style={{ fontSize: '13px', color: 'var(--ts)', margin: '0 0 16px', lineHeight: 1.6, background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    {incident.description}
                  </p>
                )}

                <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--tm)', marginBottom: '16px', fontFamily: "'JetBrains Mono', monospace" }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users size={14} color="var(--ab)" /> {incident.responders_assigned} UNITS
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} color="var(--ac)" /> ETA {incident.eta_minutes}M
                  </span>
                </div>

                <button onClick={() => resolveSOSIncident(incident.id)} style={{
                  width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--ag)',
                  background: 'rgba(16, 185, 129, 0.1)', color: 'var(--ag)', fontSize: '13px', fontWeight: 800,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'all 0.2s', fontFamily: "'Rajdhani', sans-serif", textTransform: 'uppercase', letterSpacing: '0.1em'
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--ag)'; e.currentTarget.style.color = 'black'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)'; e.currentTarget.style.color = 'var(--ag)'; }}
                >
                  <CheckCircle size={16} /> RESOLVE INCIDENT
                </button>
              </div>
            );
          })
        )}
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

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
