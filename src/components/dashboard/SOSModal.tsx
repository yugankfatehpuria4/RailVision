import { useState } from 'react';
import { useAnalysisStore } from '@/lib/store';
import { X, AlertTriangle, MapPin } from 'lucide-react';

const INCIDENT_TYPES = [
  { value: 'flood', label: '🌊 Flood', color: '#0ea5e9' },
  { value: 'encroachment', label: '🚧 Encroachment', color: '#f59e0b' },
  { value: 'derailment', label: '🚂 Derailment', color: '#ef4444' },
  { value: 'fire', label: '🔥 Fire', color: '#ef4444' },
  { value: 'landslide', label: '⛰️ Landslide', color: '#a855f7' },
  { value: 'track_damage', label: '🛤️ Track Damage', color: '#f97316' },
  { value: 'other', label: '⚠️ Other', color: '#94a3b8' },
];

export function SOSModal() {
  const { showSOSModal, setShowSOSModal, createSOSIncident } = useAnalysisStore();
  const [incidentType, setIncidentType] = useState('encroachment');
  const [severity, setSeverity] = useState('high');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  if (!showSOSModal) return null;

  const handleSubmit = async () => {
    setLoading(true);
    await createSOSIncident({
      incident_type: incidentType,
      severity,
      description: description || `Emergency ${incidentType} reported`,
      location: { latitude: 28.6139, longitude: 77.2090 },
      reporter_name: 'Field Officer',
    });
    setDescription('');
    setLoading(false);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--bdr)', borderRadius: '12px', color: 'white',
    fontSize: '14px', fontFamily: "'Rajdhani', sans-serif", outline: 'none',
    transition: 'all 0.3s', resize: 'none'
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={() => setShowSOSModal(false)}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: '520px', background: 'var(--bgp)', borderRadius: '24px',
        boxShadow: '0 40px 100px rgba(0,0,0,0.8)', overflow: 'hidden',
        border: '1px solid var(--bdr)', position: 'relative',
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #ef4444, #991b1b)',
          padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <AlertTriangle size={28} />
            <div>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: '24px', letterSpacing: '0.15em' }}>
                PRIORITY SOS SIGNAL
              </div>
              <div style={{ fontSize: '12px', opacity: 0.8, fontWeight: 500, letterSpacing: '0.05em' }}>EMERGENCY RESPONSE PROTOCOL INITIATED</div>
            </div>
          </div>
          <button onClick={() => setShowSOSModal(false)} style={{
            background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '10px',
            width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'white', transition: 'all 0.2s',
          }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
          ><X size={20} /></button>
        </div>

        {/* Form */}
        <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Incident Type */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 800, color: 'var(--tm)', display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'Rajdhani', sans-serif" }}>Incident Classification</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {INCIDENT_TYPES.map((t) => (
                <button key={t.value} onClick={() => setIncidentType(t.value)} style={{
                  padding: '12px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                  border: incidentType === t.value ? `2px solid ${t.color}` : '1px solid var(--bdr)',
                  background: incidentType === t.value ? `${t.color}15` : 'rgba(255,255,255,0.02)',
                  color: incidentType === t.value ? t.color : 'var(--ts)',
                  transition: 'all 0.2s', fontFamily: "'Rajdhani', sans-serif", textTransform: 'uppercase',
                }}>{t.label}</button>
              ))}
            </div>
          </div>

          {/* Severity */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 800, color: 'var(--tm)', display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'Rajdhani', sans-serif" }}>Severity Level</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {[
                { val: 'critical', label: 'CRITICAL', color: '#ef4444' },
                { val: 'high', label: 'HIGH', color: '#f59e0b' },
                { val: 'medium', label: 'MEDIUM', color: '#0ea5e9' },
              ].map((s) => (
                <button key={s.val} onClick={() => setSeverity(s.val)} style={{
                  flex: 1, padding: '12px', borderRadius: '12px', fontWeight: 800, fontSize: '13px',
                  cursor: 'pointer', transition: 'all 0.2s',
                  border: severity === s.val ? `2px solid ${s.color}` : '1px solid var(--bdr)',
                  background: severity === s.val ? `${s.color}20` : 'rgba(255,255,255,0.02)',
                  color: severity === s.val ? s.color : 'var(--ts)',
                  fontFamily: "'Rajdhani', sans-serif",
                }}>{s.label}</button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px',
            background: 'rgba(255,255,255,0.02)', borderRadius: '12px', fontSize: '13px', color: 'var(--ts)',
            border: '1px solid var(--bdr)',
          }}>
            <MapPin size={18} color="var(--ab)" />
            <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>LOCATION ACQUIRED: <strong style={{ color: 'var(--ab)' }}>28.6139°N, 77.2090°E</strong></span>
          </div>

          {/* Description */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 800, color: 'var(--tm)', display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'Rajdhani', sans-serif" }}>Mission Notes</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide tactical details..."
              rows={3} style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#ef4444')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--bdr)')} />
          </div>

          {/* Submit */}
          <button onClick={handleSubmit} disabled={loading} style={{
            width: '100%', padding: '18px', borderRadius: '16px', border: 'none',
            background: 'linear-gradient(135deg, #ef4444, #991b1b)', color: '#fff',
            fontFamily: "'Rajdhani', sans-serif", fontWeight: 900, fontSize: '18px',
            letterSpacing: '0.2em', cursor: loading ? 'wait' : 'pointer',
            opacity: loading ? 0.7 : 1, transition: 'all 0.3s',
            boxShadow: '0 10px 30px rgba(239, 68, 68, 0.4)',
            textTransform: 'uppercase',
          }}>
            {loading ? 'TRANSMITTING...' : 'TRANSMIT EMERGENCY SOS'}
          </button>
        </div>
      </div>
    </div>
  );
}

