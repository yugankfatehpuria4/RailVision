

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
        height: '28px',
        background: 'linear-gradient(90deg, #020509, #060e1f, #020509)',
        borderBottom: '1px solid var(--bdr)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '11px',
        letterSpacing: '0.07em',
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: levelColor === 'g' ? 'var(--ag)' : 'var(--ar)',
            boxShadow:
              levelColor === 'g' ? '0 0 8px var(--ag)' : '0 0 8px var(--ar)',
            animation: 'pdot 1.5s ease-in-out infinite',
          }}
        />
        <span style={{ textTransform: 'uppercase' }}>
          {threatLevel} Threat
        </span>
      </div>

      <div style={{ display: 'flex', gap: '20px', color: 'var(--ts)' }}>
        <div>
          Detections: <span style={{ color: 'var(--tp)' }}>{detectionCount}</span>
        </div>
        <div>
          Encroachments:{' '}
          <span style={{ color: 'var(--tp)' }}>{encroachmentCount}</span>
        </div>
        <div>
          Damage: <span style={{ color: 'var(--tp)' }}>{damageCount}</span>
        </div>
        {sosCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#dc2626', fontWeight: 700 }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#dc2626', animation: 'pdot 1s ease-in-out infinite' }} />
            SOS: <span>{sosCount}</span>
          </div>
        )}
      </div>
    </div>
  );
}
