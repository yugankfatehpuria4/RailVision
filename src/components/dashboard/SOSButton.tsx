import { useAnalysisStore } from '@/lib/store';
import { AlertTriangle } from 'lucide-react';

export function SOSButton() {
  const { setShowSOSModal, sosIncidents } = useAnalysisStore();
  const activeCount = sosIncidents.filter((i) => i.status === 'active').length;

  return (
    <button
      onClick={() => setShowSOSModal(true)}
      style={{
        position: 'fixed', bottom: '32px', right: '32px', zIndex: 9999,
        width: '72px', height: '72px', borderRadius: '50%',
        background: 'linear-gradient(135deg, #ef4444, #991b1b)',
        border: '3px solid rgba(255,255,255,0.2)',
        boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)',
        animation: 'sosPulse 2s ease-in-out infinite',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: '2px', color: 'white',
        transition: 'all 0.3s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(239, 68, 68, 0.6)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.4)'; }}
    >
      <AlertTriangle size={26} strokeWidth={2.5} />
      <span style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '0.15em', fontFamily: "'Rajdhani', sans-serif" }}>SOS</span>
      {activeCount > 0 && (
        <div style={{
          position: 'absolute', top: '-4px', right: '-4px',
          width: '26px', height: '26px', borderRadius: '8px',
          background: 'var(--ar)', color: 'white', fontSize: '12px',
          fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '2px solid var(--bgp)', fontFamily: "'JetBrains Mono', monospace",
          animation: 'pdot 1s infinite',
        }}>{activeCount}</div>
      )}
      <style>{`
        @keyframes sosPulse {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.6), 0 10px 30px rgba(239, 68, 68, 0.4); }
          50% { box-shadow: 0 0 0 20px rgba(239, 68, 68, 0), 0 10px 30px rgba(239, 68, 68, 0.6); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.6), 0 10px 30px rgba(239, 68, 68, 0.4); }
        }
      `}</style>
    </button>
  );
}
