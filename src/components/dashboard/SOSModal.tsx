import { useState } from 'react';
import { useAnalysisStore } from '@/lib/store';
import { X, AlertTriangle, MapPin } from 'lucide-react';

const INCIDENT_TYPES = [
  { value: 'flood', label: '🌊 Flood', color: '#3b82f6' },
  { value: 'encroachment', label: '🚧 Encroachment', color: '#f59e0b' },
  { value: 'derailment', label: '🚂 Derailment', color: '#dc2626' },
  { value: 'fire', label: '🔥 Fire', color: '#ef4444' },
  { value: 'landslide', label: '⛰️ Landslide', color: '#a855f7' },
  { value: 'track_damage', label: '🛤️ Track Damage', color: '#f97316' },
  { value: 'other', label: '⚠️ Other', color: '#6b7280' },
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
    width: '100%', padding: '10px 12px', background: '#fff',
    border: '1.5px solid #e2e8f0', borderRadius: '10px', color: '#0f172a',
    fontSize: '14px', fontFamily: "'Exo 2', sans-serif", outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={() => setShowSOSModal(false)}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: '480px', background: '#fff', borderRadius: '20px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.25)', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
          padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          color: 'white',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={22} />
            <div>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '20px', letterSpacing: '0.08em' }}>
                EMERGENCY SOS
              </div>
              <div style={{ fontSize: '11px', opacity: 0.8 }}>Create an emergency incident report</div>
            </div>
          </div>
          <button onClick={() => setShowSOSModal(false)} style={{
            background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '8px',
            width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'white',
          }}><X size={16} /></button>
        </div>

        {/* Form */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Incident Type */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>Incident Type</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {INCIDENT_TYPES.map((t) => (
                <button key={t.value} onClick={() => setIncidentType(t.value)} style={{
                  padding: '10px 8px', borderRadius: '10px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                  border: incidentType === t.value ? `2px solid ${t.color}` : '2px solid #e2e8f0',
                  background: incidentType === t.value ? `${t.color}12` : '#f8fafc',
                  color: incidentType === t.value ? t.color : '#64748b',
                  transition: 'all 0.2s',
                }}>{t.label}</button>
              ))}
            </div>
          </div>

          {/* Severity */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>Severity Level</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { val: 'critical', label: 'Critical', color: '#dc2626' },
                { val: 'high', label: 'High', color: '#f59e0b' },
                { val: 'medium', label: 'Medium', color: '#3b82f6' },
              ].map((s) => (
                <button key={s.val} onClick={() => setSeverity(s.val)} style={{
                  flex: 1, padding: '10px', borderRadius: '10px', fontWeight: 700, fontSize: '13px',
                  cursor: 'pointer', transition: 'all 0.2s',
                  border: severity === s.val ? `2px solid ${s.color}` : '2px solid #e2e8f0',
                  background: severity === s.val ? `${s.color}15` : '#f8fafc',
                  color: severity === s.val ? s.color : '#94a3b8',
                }}>{s.label}</button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px',
            background: '#f1f5f9', borderRadius: '10px', fontSize: '12px', color: '#475569',
          }}>
            <MapPin size={14} />
            <span>Auto-detected: <strong style={{ color: '#0f172a' }}>28.6139°N, 77.2090°E</strong> (New Delhi Zone)</span>
          </div>

          {/* Description */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the emergency situation..."
              rows={3} style={{ ...inputStyle, resize: 'vertical' }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#dc2626')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')} />
          </div>

          {/* Submit */}
          <button onClick={handleSubmit} disabled={loading} style={{
            width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
            background: 'linear-gradient(135deg, #dc2626, #b91c1c)', color: '#fff',
            fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '16px',
            letterSpacing: '0.08em', cursor: loading ? 'wait' : 'pointer',
            opacity: loading ? 0.7 : 1, transition: 'all 0.3s',
            boxShadow: '0 4px 14px rgba(220,38,38,0.4)',
          }}>
            {loading ? 'TRANSMITTING...' : '🚨 TRANSMIT EMERGENCY SOS'}
          </button>
        </div>
      </div>
    </div>
  );
}
