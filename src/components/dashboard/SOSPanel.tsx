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
      position: 'absolute', top: 0, right: 0, bottom: 0, width: '380px', zIndex: 1500,
      background: '#fff', borderLeft: '1px solid #e2e8f0',
      boxShadow: '-8px 0 32px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column',
      animation: 'slideInRight 0.3s ease-out',
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #dc2626, #b91c1c)', padding: '16px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'white',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertTriangle size={18} />
          <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '16px', letterSpacing: '0.1em' }}>
            ACTIVE EMERGENCIES
          </span>
          <div style={{
            background: 'rgba(255,255,255,0.25)', borderRadius: '10px', padding: '2px 8px',
            fontSize: '12px', fontWeight: 700,
          }}>{sosIncidents.length}</div>
        </div>
        <button onClick={() => setShowSOSPanel(false)} style={{
          background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '6px',
          width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'white',
        }}><X size={14} /></button>
      </div>

      {/* Incident List */}
      <div style={{ flex: 1, overflow: 'auto', padding: '12px' }}>
        {sosIncidents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
            <AlertTriangle size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
            <p style={{ fontWeight: 600, fontSize: '14px' }}>No Active Emergencies</p>
            <p style={{ fontSize: '12px' }}>All clear. Use the SOS button to report an incident.</p>
          </div>
        ) : (
          sosIncidents.map((incident) => {
            const sevColor = SEVERITY_COLORS[incident.severity] || '#6b7280';
            const icon = TYPE_ICONS[incident.incident_type] || '⚠️';
            const timeAgo = getTimeAgo(incident.created_at);
            return (
              <div key={incident.id} style={{
                background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px',
                padding: '16px', marginBottom: '10px', transition: 'all 0.2s',
                borderLeft: `4px solid ${sevColor}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '20px' }}>{icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a', textTransform: 'capitalize' }}>
                        {incident.incident_type.replace('_', ' ')}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{timeAgo}</div>
                    </div>
                  </div>
                  {/* Severity Badge */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                    background: `${sevColor}15`, color: sevColor, border: `1px solid ${sevColor}30`,
                  }}>
                    <div style={{
                      width: '6px', height: '6px', borderRadius: '50%', background: sevColor,
                      animation: incident.severity === 'critical' ? 'sosPulse 1.5s infinite' : 'none',
                    }} />
                    {incident.severity}
                  </div>
                </div>

                {incident.description && (
                  <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 10px', lineHeight: 1.5 }}>
                    {incident.description}
                  </p>
                )}

                <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: '#64748b', marginBottom: '12px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Users size={12} /> {incident.responders_assigned} responders
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> ETA {incident.eta_minutes}m
                  </span>
                </div>

                <button onClick={() => resolveSOSIncident(incident.id)} style={{
                  width: '100%', padding: '8px', borderRadius: '8px', border: '1.5px solid #22c55e',
                  background: '#f0fdf4', color: '#16a34a', fontSize: '12px', fontWeight: 700,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#22c55e'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#f0fdf4'; e.currentTarget.style.color = '#16a34a'; }}
                >
                  <CheckCircle size={14} /> Mark Resolved
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
