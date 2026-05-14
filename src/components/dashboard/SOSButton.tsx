import { useAnalysisStore } from '@/lib/store';
import { AlertTriangle } from 'lucide-react';

export function SOSButton() {
  const { setShowSOSModal, sosIncidents } = useAnalysisStore();
  const activeCount = sosIncidents.filter((i) => i.status === 'active').length;

  return (
    <button
      onClick={() => setShowSOSModal(true)}
      style={{
        position: 'fixed', bottom: '28px', right: '28px', zIndex: 9999,
        width: '64px', height: '64px', borderRadius: '50%',
        background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
        border: '3px solid rgba(255,255,255,0.3)',
        boxShadow: '0 0 0 0 rgba(220,38,38,0.5), 0 8px 32px rgba(220,38,38,0.4)',
        animation: 'sosPulse 2s ease-in-out infinite',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: '2px', color: 'white',
        transition: 'transform 0.2s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <AlertTriangle size={22} strokeWidth={2.5} />
      <span style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '0.1em', fontFamily: "'Rajdhani', sans-serif" }}>SOS</span>
      {activeCount > 0 && (
        <div style={{
          position: 'absolute', top: '-4px', right: '-4px',
          width: '22px', height: '22px', borderRadius: '50%',
          background: '#fbbf24', color: '#000', fontSize: '11px',
          fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '2px solid white', fontFamily: "'JetBrains Mono', monospace",
        }}>{activeCount}</div>
      )}
      <style>{`
        @keyframes sosPulse {
          0% { box-shadow: 0 0 0 0 rgba(220,38,38,0.5), 0 8px 32px rgba(220,38,38,0.4); }
          50% { box-shadow: 0 0 0 14px rgba(220,38,38,0), 0 8px 32px rgba(220,38,38,0.6); }
          100% { box-shadow: 0 0 0 0 rgba(220,38,38,0.5), 0 8px 32px rgba(220,38,38,0.4); }
        }
      `}</style>
    </button>
  );
}
