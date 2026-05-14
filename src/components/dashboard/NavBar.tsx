import { Bell, Menu, LogOut, ChevronDown, Search, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalysisStore } from '@/lib/store';

interface NavBarProps {
  onMenuClick?: () => void;
  userName?: string;
  userRole?: string;
}

const RAILWAY_ZONES = [
  'Western Railway', 'Central Railway', 'Northern Railway', 'Southern Railway',
  'Eastern Railway', 'South Eastern Railway', 'North Eastern Railway',
  'Northeast Frontier Railway', 'South Central Railway', 'South Western Railway',
];

const ZONE_COORDINATES: Record<string, { lat: number, lng: number }> = {
  'Western Railway': { lat: 18.9322, lng: 72.8264 },
  'Central Railway': { lat: 18.9400, lng: 72.8353 },
  'Northern Railway': { lat: 28.6139, lng: 77.2090 },
  'Southern Railway': { lat: 13.0827, lng: 80.2707 },
  'Eastern Railway': { lat: 22.5726, lng: 88.3639 },
  'South Eastern Railway': { lat: 22.5510, lng: 88.3444 },
  'North Eastern Railway': { lat: 26.7606, lng: 83.3732 },
  'Northeast Frontier Railway': { lat: 26.1445, lng: 91.7362 },
  'South Central Railway': { lat: 17.4330, lng: 78.5042 },
  'South Western Railway': { lat: 15.3647, lng: 75.1370 },
};

export function NavBar({ onMenuClick, userName = 'Admin', userRole = 'Western Railway' }: NavBarProps) {
  const navigate = useNavigate();
  const [zoneOpen, setZoneOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState(userRole);
  const { backendOnline, user, logout, sosIncidents, setShowSOSPanel, showSOSPanel, setMapCenter } = useAnalysisStore();

  const displayName = user?.full_name || userName;
  const displayRole = user?.role || 'operator';
  const activeSOSCount = sosIncidents.filter((i) => i.status === 'active').length;

  const handleLogout = () => {
    logout();
    navigate('/landing');
  };

  return (
    <div style={{
      height: '56px', background: 'var(--bgp)',
      borderBottom: '1px solid var(--bdr)', display: 'flex', alignItems: 'center',
      padding: '0 16px', gap: '14px', flexShrink: 0, position: 'relative',
    }}>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, var(--ab), var(--ac), transparent)', opacity: 0.4 }} />

      {/* Menu */}
      <button onClick={onMenuClick} style={{
        width: '34px', height: '34px', background: 'var(--bgc)', border: '1px solid var(--bdr)',
        borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', color: 'var(--ts)', transition: 'all 0.2s',
      }}>
        <Menu size={16} />
      </button>

      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '20px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
        <div style={{
          width: '36px', height: '36px', background: 'linear-gradient(135deg, var(--ab), var(--ac))',
          borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '17px', boxShadow: '0 0 16px rgba(14, 165, 233, 0.35)',
        }}>🛤️</div>
        <span>RailVision</span>
        <span style={{ fontSize: '10px', color: 'var(--ac)', fontWeight: 500, letterSpacing: '0.05em' }}>AI</span>
      </div>

      {/* Zone Selector */}
      <div style={{ position: 'relative', marginLeft: '12px' }}>
        <button onClick={() => setZoneOpen(!zoneOpen)} style={{
          display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 12px',
          background: 'var(--bgc)', border: '1px solid var(--bdr)', borderRadius: '6px',
          cursor: 'pointer', color: 'var(--tp)', fontSize: '12px',
          fontFamily: "'Rajdhani', sans-serif", fontWeight: 600,
        }}>
          {selectedZone} <ChevronDown size={12} />
        </button>
        {zoneOpen && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, marginTop: '4px', zIndex: 2000,
            background: 'var(--bgp)', border: '1px solid var(--bdr)', borderRadius: '8px',
            padding: '4px', minWidth: '200px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          }}>
            {RAILWAY_ZONES.map((zone) => (
              <div key={zone} onClick={() => {
                setSelectedZone(zone);
                setZoneOpen(false);
                if (ZONE_COORDINATES[zone]) {
                  setMapCenter(ZONE_COORDINATES[zone].lat, ZONE_COORDINATES[zone].lng, 12);
                }
              }}
                style={{
                  padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px',
                  color: zone === selectedZone ? 'var(--ab)' : 'var(--ts)',
                  background: zone === selectedZone ? 'rgba(14,165,233,0.1)' : 'transparent',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bgh)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = zone === selectedZone ? 'rgba(14,165,233,0.1)' : 'transparent')}
              >{zone}</div>
            ))}
          </div>
        )}
      </div>

      <div style={{ flex: 1 }} />

      {/* Search */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 10px',
        background: 'var(--bgc)', border: '1px solid var(--bdr)', borderRadius: '6px', width: '200px',
      }}>
        <Search size={13} style={{ color: 'var(--tm)' }} />
        <input placeholder="Search assets..." style={{
          background: 'transparent', border: 'none', outline: 'none', color: 'var(--tp)',
          fontSize: '12px', width: '100%', fontFamily: "'Exo 2', sans-serif",
        }} />
      </div>

      {/* SOS Toggle */}
      <button onClick={() => setShowSOSPanel(!showSOSPanel)} style={{
        height: '34px', padding: '0 12px', background: activeSOSCount > 0 ? 'rgba(220,38,38,0.1)' : 'var(--bgc)',
        border: activeSOSCount > 0 ? '1px solid rgba(220,38,38,0.3)' : '1px solid var(--bdr)',
        borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '6px',
        cursor: 'pointer', color: activeSOSCount > 0 ? '#dc2626' : 'var(--ts)',
        fontSize: '11px', fontWeight: 700, fontFamily: "'Rajdhani', sans-serif",
        letterSpacing: '0.05em', transition: 'all 0.2s',
      }}>
        <AlertTriangle size={14} />
        SOS
        {activeSOSCount > 0 && (
          <span style={{
            background: '#dc2626', color: '#fff', borderRadius: '10px', padding: '1px 6px',
            fontSize: '10px', fontFamily: "'JetBrains Mono', monospace",
            animation: 'pdot 2s ease-in-out infinite',
          }}>{activeSOSCount}</span>
        )}
      </button>

      {/* Notifications */}
      <button style={{
        width: '34px', height: '34px', background: 'var(--bgc)', border: '1px solid var(--bdr)',
        borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', color: 'var(--ts)', position: 'relative',
      }}>
        <Bell size={16} />
        <div style={{
          position: 'absolute', top: '-4px', right: '-4px', width: '14px', height: '14px',
          background: 'var(--ar)', borderRadius: '50%', fontSize: '9px', display: 'flex',
          alignItems: 'center', justifyContent: 'center', fontFamily: "'JetBrains Mono', monospace",
          color: 'white', fontWeight: 700, animation: 'pdot 2s ease-in-out infinite',
        }}>3</div>
      </button>

      {/* User Menu */}
      <div style={{ position: 'relative' }}>
        <div onClick={() => setUserMenuOpen(!userMenuOpen)} style={{
          display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bgc)',
          border: '1px solid var(--bdr)', borderRadius: '8px', padding: '4px 12px 4px 6px', cursor: 'pointer',
        }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '6px',
            background: 'linear-gradient(135deg, var(--ab), var(--ap))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px', color: 'white',
          }}>{displayName.charAt(0)}</div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600 }}>{displayName}</div>
            <div style={{ fontSize: '10px', color: 'var(--ts)', fontFamily: "'JetBrains Mono', monospace", textTransform: 'capitalize' }}>{displayRole}</div>
          </div>
          <ChevronDown size={12} style={{ color: 'var(--tm)' }} />
        </div>

        {userMenuOpen && (
          <div style={{
            position: 'absolute', top: '100%', right: 0, marginTop: '4px', zIndex: 2000,
            background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px',
            padding: '4px', minWidth: '180px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          }}>
            <div style={{
              padding: '8px 12px', borderBottom: '1px solid #f1f5f9', marginBottom: '4px',
            }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{displayName}</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>{user?.email || 'admin@railvision.ai'}</div>
            </div>
            <div onClick={handleLogout} style={{
              padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px',
              color: '#dc2626', display: 'flex', alignItems: 'center', gap: '8px',
              transition: 'all 0.15s',
            }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#fef2f2')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <LogOut size={14} /> Sign Out
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
