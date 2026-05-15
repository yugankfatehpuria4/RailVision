

interface ThreatStripProps {
  threatLevel: 'critical' | 'high' | 'medium' | 'low';
  detectionCount: number;
  encroachmentCount: number;
  damageCount: number;
  sosCount?: number;
}

export function ThreatStrip({
  threatLevel,
  detectionCount,
  encroachmentCount,
  damageCount,
  sosCount = 0,
}: ThreatStripProps) {
  const levelColor =
    threatLevel === 'critical'
      ? 'g'
      : threatLevel === 'high'
        ? 'a'
        : threatLevel === 'medium'
          ? 'aa'
          : 'ag';

  return (
    <div
      style={{
        height: '32px',
        background: 'rgba(2, 6, 23, 0.9)',
        borderBottom: '1px solid var(--bdr)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        fontFamily: "'Rajdhani', sans-serif",
        fontSize: '12px',
        letterSpacing: '0.1em',
        flexShrink: 0,
        backdropFilter: 'blur(10px)',
        zIndex: 1000,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '2px',
            background: levelColor === 'g' ? 'var(--ag)' : 'var(--ar)',
            boxShadow:
              levelColor === 'g' ? '0 0 10px var(--ag)' : '0 0 10px var(--ar)',
            animation: 'pdot 1.5s ease-in-out infinite',
          }}
        />
        <span style={{ textTransform: 'uppercase', fontWeight: 800, color: levelColor === 'g' ? 'var(--ag)' : 'var(--ar)' }}>
          MISSION THREAT LEVEL: {threatLevel}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '24px', color: 'var(--ts)', fontWeight: 600 }}>
        <div>
          INTEL DETECTED: <span style={{ color: 'var(--tp)', fontWeight: 800 }}>{detectionCount}</span>
        </div>
        <div>
          ENCROACHMENTS:{' '}
          <span style={{ color: 'var(--tp)', fontWeight: 800 }}>{encroachmentCount}</span>
        </div>
        <div>
          STRUCTURAL DAMAGE: <span style={{ color: 'var(--tp)', fontWeight: 800 }}>{damageCount}</span>
        </div>
        {sosCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontWeight: 900 }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', animation: 'pdot 1s ease-in-out infinite', boxShadow: '0 0 15px #ef4444' }} />
            ACTIVE SOS: <span>{sosCount}</span>
          </div>
        )}
      </div>
    </div>
  );
}
