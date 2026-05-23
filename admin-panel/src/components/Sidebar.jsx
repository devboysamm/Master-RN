import { NavLink } from 'react-router-dom';
import { MRN } from '../theme/tokens';

const items = [
  { to: '/', label: 'Dashboard', icon: 'M3 11l9-8 9 8v9a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1v-9z', key: 'D', end: true },
  { to: '/modules', label: 'Modules', icon: 'M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 18l9 5 9-5', key: 'M' },
  { to: '/lessons', label: 'Lessons', icon: 'M9 8l-5 4 5 4M15 8l5 4-5 4M14 4l-4 16', key: 'L' },
  { to: '/media', label: 'Media', icon: 'M4 6h16v12H4zM4 14l4-4 5 5 3-3 4 4M9 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3z', key: 'I' },
  { to: '/categories', label: 'Categories', icon: 'M3 6h7v7H3zM14 6h7v4h-7zM14 13h7v8h-7zM3 16h7v5H3z', key: 'C' },
  { to: '/users', label: 'Users', icon: 'M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75', key: 'U' },
  { to: '/reports', label: 'Reports', icon: 'M12 9v4M12 17h.01M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z', key: 'R' },
  { to: '/notifications', label: 'Notifications', icon: 'M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0', key: 'N' },
  { to: '/legal', label: 'Legal', icon: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M9 13h6M9 17h6', key: 'T' },
  { to: '/settings', label: 'Settings', icon: 'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z', key: ',' },
];

function Icon({ d, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

export default function Sidebar({ onLogout }) {
  return (
    <aside style={{
      width: 264,
      background: MRN.ink,
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      padding: '22px 16px',
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      height: '100vh',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 10px 22px' }}>
        <svg width="36" height="36" viewBox="0 0 220 220">
          <path d="M110 6c52 0 78 0 92 14s14 40 14 92-0 78-14 92-40 14-92 14-78 0-92-14S4 174 4 122s-0-78 14-92S58 6 110 6Z" fill={MRN.coral}/>
          <g fill="none" stroke="#1A1410" strokeWidth="12">
            <ellipse cx="110" cy="110" rx="84" ry="32"/>
            <ellipse cx="110" cy="110" rx="84" ry="32" transform="rotate(60 110 110)"/>
            <ellipse cx="110" cy="110" rx="84" ry="32" transform="rotate(120 110 110)"/>
          </g>
          <circle cx="110" cy="110" r="16" fill="#1A1410"/>
        </svg>
        <div>
          <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: -0.2 }}>
            Master <span style={{ color: MRN.coral }}>RN</span>
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: 700, fontFamily: MRN.mono, letterSpacing: 0.6 }}>
            admin · v1.0
          </div>
        </div>
      </div>

      <div style={{
        fontSize: 11, fontWeight: 700, fontFamily: MRN.mono,
        color: 'rgba(255,255,255,0.4)', letterSpacing: 1,
        padding: '14px 12px 8px',
      }}>WORKSPACE</div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.end}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 13,
              padding: '12px 14px',
              borderRadius: 10,
              fontSize: 15,
              fontWeight: isActive ? 700 : 600,
              background: isActive ? 'rgba(242,106,74,0.16)' : 'transparent',
              color: isActive ? '#fff' : 'rgba(255,255,255,0.72)',
              position: 'relative',
              transition: 'background 0.15s',
            })}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div style={{
                    position: 'absolute', left: -16, top: 10, bottom: 10,
                    width: 3, borderRadius: 2, background: MRN.coral,
                  }}/>
                )}
                <span style={{ color: isActive ? MRN.coral : 'rgba(255,255,255,0.6)', display: 'flex' }}>
                  <Icon d={it.icon} />
                </span>
                <span style={{ flex: 1 }}>{it.label}</span>
                <span style={{
                  fontFamily: MRN.mono, fontSize: 10, opacity: 0.5,
                  padding: '2px 6px', borderRadius: 4,
                  border: '1px solid rgba(255,255,255,0.12)', fontWeight: 700,
                }}>G {it.key}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', padding: '14px 10px 0', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 18,
            background: `linear-gradient(135deg, ${MRN.coral}, ${MRN.yellow})`,
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 15,
          }}>A</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Admin</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>Signed in</div>
          </div>
        </div>
        <button
          onClick={onLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '10px 14px', borderRadius: 10, cursor: 'pointer',
            background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.85)',
            border: '1px solid rgba(255,255,255,0.12)', fontSize: 14, fontWeight: 700,
            fontFamily: MRN.font,
          }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          Log out
        </button>
      </div>
    </aside>
  );
}
