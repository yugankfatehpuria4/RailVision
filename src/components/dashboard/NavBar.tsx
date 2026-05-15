import { Bell, Menu, LogOut, ChevronDown, Search, AlertTriangle, Satellite, MapPin } from 'lucide-react';
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
      height: '64px', background: 'var(--bgp)',
      borderBottom: '1px solid var(--bdr)', display: 'flex', alignItems: 'center',
      padding: '0 20px', gap: '20px', flexShrink: 0, position: 'relative',
      backdropFilter: 'blur(20px)', zIndex: 100,
    }}>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, var(--ab), var(--ac), transparent)', opacity: 0.6 }} />

      {/* Menu */}
      <button onClick={onMenuClick} style={{
        width: '40px', height: '40px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--bdr)',
        borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', color: 'var(--ts)', transition: 'all 0.2s',
      }}>
        <Menu size={20} />
      </button>

      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: '24px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
        <div style={{
          width: '42px', height: '42px', background: 'linear-gradient(135deg, var(--ab), var(--ac))',
          borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '20px', boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)', border: '1px solid rgba(255,255,255,0.2)',
        }}>
          <Satellite size={22} color="black" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{ color: 'white' }}>RAIL<span style={{ color: 'var(--ab)' }}>VISION</span></span>
          <span style={{ fontSize: '10px', color: 'var(--tm)', fontWeight: 500, letterSpacing: '0.3em', marginTop: '2px' }}>NEURAL COMMAND</span>
        </div>
      </div>

      {/* Zone Selector */}
      <div style={{ position: 'relative', marginLeft: '20px' }}>
        <button onClick={() => setZoneOpen(!zoneOpen)} style={{
          display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px',
          background: 'rgba(255,255,255,0.03)', border: '1px solid var(--bdr)', borderRadius: '10px',
          cursor: 'pointer', color: 'var(--tp)', fontSize: '13px',
          fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
        }}>
          <MapPin size={14} style={{ color: 'var(--ab)' }} />
          {selectedZone} <ChevronDown size={14} style={{ opacity: 0.5 }} />
        </button>
        {zoneOpen && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, marginTop: '10px', zIndex: 2000,
            background: 'var(--bgp)', border: '1px solid var(--bdr)', borderRadius: '12px',
            padding: '6px', minWidth: '240px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(20px)',
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
                  padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px',
                  fontFamily: "'Rajdhani', sans-serif", fontWeight: 600,
                  color: zone === selectedZone ? 'var(--ab)' : 'var(--ts)',
                  background: zone === selectedZone ? 'rgba(6,182,212,0.1)' : 'transparent',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = zone === selectedZone ? 'rgba(6,182,212,0.1)' : 'transparent')}
              >{zone}</div>
            ))}
          </div>
        )}
      </div>

      <div style={{ flex: 1 }} />

      {/* Search */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 16px',
        background: 'rgba(255,255,255,0.02)', border: '1px solid var(--bdr)', borderRadius: '10px', width: '280px',
        transition: 'all 0.3s',
      }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(6,182,212,0.3)')}
      >
        <Search size={16} style={{ color: 'var(--tm)' }} />
        <input placeholder="Search mission assets..." style={{
          background: 'transparent', border: 'none', outline: 'none', color: 'var(--tp)',
          fontSize: '13px', width: '100%', fontFamily: "'Rajdhani', sans-serif", fontWeight: 500,
        }} />
      </div>

      {/* SOS Toggle */}
      <button onClick={() => setShowSOSPanel(!showSOSPanel)} style={{
        height: '40px', padding: '0 16px', background: activeSOSCount > 0 ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.03)',
        border: activeSOSCount > 0 ? '1px solid rgba(239,68,68,0.4)' : '1px solid var(--bdr)',
        borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px',
        cursor: 'pointer', color: activeSOSCount > 0 ? '#ef4444' : 'var(--ts)',
        fontSize: '13px', fontWeight: 800, fontFamily: "'Rajdhani', sans-serif",
        letterSpacing: '0.1em', transition: 'all 0.2s',
      }}>
        <AlertTriangle size={18} />
        SOS
        {activeSOSCount > 0 && (
          <span style={{
            background: '#ef4444', color: '#fff', borderRadius: '6px', padding: '2px 8px',
            fontSize: '12px', fontWeight: 900,
            animation: 'pdot 1s ease-in-out infinite',
          }}>{activeSOSCount}</span>
        )}
      </button>

      {/* Notifications */}
      <button style={{
        width: '40px', height: '40px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--bdr)',
        borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', color: 'var(--ts)', position: 'relative',
      }}>
        <Bell size={20} />
        <div style={{
          position: 'absolute', top: '-4px', right: '-4px', width: '18px', height: '18px',
          background: 'var(--ar)', borderRadius: '6px', fontSize: '10px', display: 'flex',
          alignItems: 'center', justifyContent: 'center', fontFamily: "'Rajdhani', sans-serif",
          color: 'white', fontWeight: 900, animation: 'pdot 2s ease-in-out infinite',
          border: '2px solid var(--bgp)',
        }}>3</div>
      </button>

      {/* User Menu */}
      <div style={{ position: 'relative' }}>
        <div onClick={() => setUserMenuOpen(!userMenuOpen)} style={{
          display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--bdr)', borderRadius: '12px', padding: '6px 16px 6px 8px', cursor: 'pointer',
        }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'linear-gradient(135deg, var(--ab), var(--ap))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '14px', color: 'black',
          }}>{displayName.charAt(0)}</div>
          <div style={{ display: 'block' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'white', fontFamily: "'Rajdhani', sans-serif" }}>{displayName}</div>
            <div style={{ fontSize: '10px', color: 'var(--tm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{displayRole}</div>
          </div>
          <ChevronDown size={14} style={{ color: 'var(--tm)' }} />
        </div>

        {userMenuOpen && (
          <div style={{
            position: 'absolute', top: '100%', right: 0, marginTop: '10px', zIndex: 2000,
            background: 'var(--bgp)', border: '1px solid var(--bdr)', borderRadius: '12px',
            padding: '8px', minWidth: '220px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(20px)',
          }}>
            <div style={{
              padding: '12px', borderBottom: '1px solid var(--bdr)', marginBottom: '8px',
            }}>
              <div style={{ fontSize: '14px', fontWeight: 800, color: 'white', fontFamily: "'Rajdhani', sans-serif" }}>{displayName}</div>
              <div style={{ fontSize: '12px', color: 'var(--tm)', marginTop: '2px' }}>{user?.email || 'admin@railvision.ai'}</div>
            </div>
            <div onClick={handleLogout} style={{
              padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px',
              color: '#ef4444', display: 'flex', alignItems: 'center', gap: '10px',
              transition: 'all 0.15s', fontWeight: 700, fontFamily: "'Rajdhani', sans-serif",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239,68,68,0.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <LogOut size={16} /> SIGN OUT MISSION
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
