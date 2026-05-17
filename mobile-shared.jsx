// Shared tokens, icons, and chrome for Master React Native mobile screens.

const MRN = {
  coral: '#F26A4A',
  coralDeep: '#D9532F',
  coralSoft: '#FBD7C8',
  cream: '#F5EFE6',
  card: '#FBF6EE',
  cardAlt: '#F1E9DC',
  ink: '#161311',
  inkSoft: '#3B342F',
  mute: '#8C8378',
  rule: 'rgba(22,19,17,0.08)',
  yellow: '#F5C24B',
  yellowSoft: '#FCEAB5',
  mint: '#9EC9A8',
  blush: '#F2C5B5',
  ok: '#3F8A57',
  font: '"Manrope", -apple-system, system-ui, sans-serif',
};

// ── Icons (24x24 default, stroked, currentColor) ────────────────
function Icon({ d, size = 22, sw = 1.8, fill = 'none', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} style={style}>
      <path d={d} stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
const I = {
  home:     'M3 11l9-8 9 8v9a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1v-9z',
  compass:  'M12 21a9 9 0 100-18 9 9 0 000 18zM15.5 8.5L13 13l-4.5 2.5L11 11l4.5-2.5z',
  pie:      'M12 3v9h9a9 9 0 11-9-9z M21 12a9 9 0 00-9-9v9h9z',
  chat:     'M21 12a8 8 0 01-11.6 7.1L4 21l1.9-5.4A8 8 0 1121 12z',
  user:     'M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0',
  bell:     'M6 16V11a6 6 0 1112 0v5l1.5 2.5h-15L6 16zM10 21a2 2 0 004 0',
  search:   'M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.3-4.3',
  bookmark: 'M6 4h12v17l-6-4-6 4V4z',
  heart:    'M12 20s-7-4.6-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.4-7 10-7 10z',
  arrowR:   'M5 12h14M13 6l6 6-6 6',
  arrowL:   'M19 12H5M11 18l-6-6 6-6',
  arrowUp:  'M5 12l7-7 7 7M12 5v15',
  check:    'M5 12l5 5L20 7',
  plus:     'M12 5v14M5 12h14',
  close:    'M6 6l12 12M18 6L6 18',
  more:     'M5 12h.01M12 12h.01M19 12h.01',
  clock:    'M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2',
  flame:    'M12 22c4 0 7-3 7-7 0-4-3-5-3-9 0 0-3 2-3 6 0-3-2-4-2-4s-6 4-6 9c0 3 3 5 7 5z',
  send:     'M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z',
  layers:   'M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 18l9 5 9-5',
  sparkle:  'M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z',
  filter:   'M3 5h18l-7 9v6l-4-2v-4L3 5z',
  edit:     'M4 20h4l11-11-4-4L4 16v4zM14 6l4 4',
  moon:     'M21 13A9 9 0 0111 3a7 7 0 1010 10z',
  download: 'M12 4v12m0 0l-5-5m5 5l5-5M4 20h16',
  shield:   'M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6l8-3z',
  trash:    'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6',
  refresh:  'M3 12a9 9 0 0115-6.7L21 8M21 3v5h-5M21 12a9 9 0 01-15 6.7L3 16M3 21v-5h5',
  globe:    'M12 21a9 9 0 100-18 9 9 0 000 18zM3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18',
  star:     'M12 3l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6z',
  copy:     'M9 9h11v11H9zM5 5h11v3M5 5v11h3',
  gear:     'M12 15a3 3 0 100-6 3 3 0 000 6zM19 12l2-1-1-3-2 0-1-2 1-2-3-1-2 1-2-1-1-2-3 1 1 2-1 2-2 0-1 3 2 1-0 2-2 1 1 3 2 0 1 2-1 2 3 1 2-1 2 1 1 2 3-1-1-2 1-2 2 0 1-3-2-1 0-2 2-1z',
  play:     'M6 4l14 8-14 8V4z',
  code:     'M9 8l-5 4 5 4M15 8l5 4-5 4M14 4l-4 16',
};

// ── Phone wrapper: clean phone shell (no real iOS status bar) ─────
function Phone({ children, w = 320, h = 670, label }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: 44, overflow: 'hidden',
      position: 'relative', background: MRN.cream,
      boxShadow: '0 30px 60px rgba(0,0,0,0.30), 0 0 0 9px #16110d, 0 0 0 10px #2a2520',
      fontFamily: MRN.font, color: MRN.ink, WebkitFontSmoothing: 'antialiased',
    }}>
      {/* status bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 44, zIndex: 30,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 26px 0', fontSize: 13, fontWeight: 700, color: MRN.ink,
      }}>
        <span>9:41</span>
        <div style={{
          position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)',
          width: 96, height: 28, borderRadius: 20, background: '#16110d',
        }} />
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          <svg width="16" height="10" viewBox="0 0 16 10"><rect x="0" y="6" width="2.5" height="4" rx="0.5" fill="#16110d"/><rect x="4" y="4" width="2.5" height="6" rx="0.5" fill="#16110d"/><rect x="8" y="2" width="2.5" height="8" rx="0.5" fill="#16110d"/><rect x="12" y="0" width="2.5" height="10" rx="0.5" fill="#16110d"/></svg>
          <svg width="22" height="11" viewBox="0 0 22 11"><rect x="0.5" y="0.5" width="18" height="10" rx="2.5" stroke="#16110d" fill="none"/><rect x="2" y="2" width="14.5" height="7" rx="1.2" fill="#16110d"/><rect x="19.5" y="3.5" width="1.5" height="4" rx="0.5" fill="#16110d"/></svg>
        </div>
      </div>
      <div style={{ position: 'absolute', inset: 0, paddingTop: 44, display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
      {/* home indicator */}
      <div style={{
        position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
        width: 110, height: 4, borderRadius: 4, background: 'rgba(22,19,17,0.85)', zIndex: 40,
      }} />
    </div>
  );
}

// ── Top header (avatar + progress + bell) ─────────────────────────
function TopHeader({ name = 'John', pct = 31 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 20px 8px' }}>
      <div style={{
        width: 44, height: 44, borderRadius: 22, flexShrink: 0,
        background: `linear-gradient(135deg, ${MRN.coral}, ${MRN.yellow})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontWeight: 800, fontSize: 17,
      }}>{name[0]}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: MRN.inkSoft, lineHeight: 1.1 }}>
          Welcome back, <span style={{ color: MRN.ink, fontWeight: 800 }}>{name}</span>
        </div>
        <div style={{ marginTop: 8, position: 'relative', height: 6, borderRadius: 6, background: MRN.cardAlt }}>
          <div style={{ position: 'absolute', inset: 0, width: `${pct}%`, borderRadius: 6, background: MRN.coral }} />
          <div style={{
            position: 'absolute', top: -6, left: `calc(${pct}% - 18px)`,
            background: MRN.ink, color: '#fff', fontSize: 10, fontWeight: 800,
            padding: '2px 6px', borderRadius: 10, lineHeight: 1.2,
          }}>{pct}%</div>
        </div>
      </div>
      <div style={{
        width: 42, height: 42, borderRadius: 21, background: MRN.card,
        display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
        color: MRN.ink,
      }}>
        <Icon d={I.bell} size={20}/>
        <div style={{ position: 'absolute', top: 9, right: 11, width: 7, height: 7, borderRadius: 4, background: MRN.coral, boxShadow: '0 0 0 2px ' + MRN.card }} />
      </div>
    </div>
  );
}

// ── Bottom tab bar (5 tabs, floating black pill) ──────────────────
function TabBar({ active = 'home' }) {
  const tabs = [
    { id: 'home', icon: I.home },
    { id: 'explore', icon: I.compass },
    { id: 'progress', icon: I.pie },
    { id: 'chat', icon: I.chat },
    { id: 'profile', icon: I.user },
  ];
  return (
    <div style={{
      position: 'absolute', left: 14, right: 14, bottom: 18, height: 64,
      background: MRN.ink, borderRadius: 32, zIndex: 35,
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      padding: '0 14px',
      boxShadow: '0 12px 30px rgba(22,19,17,0.30)',
    }}>
      {tabs.map(t => {
        const isActive = t.id === active;
        return (
          <div key={t.id} style={{
            width: 44, height: 44, borderRadius: 22,
            background: isActive ? MRN.coral : 'transparent',
            color: isActive ? '#fff' : 'rgba(255,255,255,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon d={t.icon} size={22}/>
          </div>
        );
      })}
    </div>
  );
}

// ── Abstract geometric "illustration" placeholders ────────────────
function GeoArt({ variant = 'a', style }) {
  // Variant A: layered concentric arcs + dots, coral
  if (variant === 'a') return (
    <svg viewBox="0 0 200 120" style={style}>
      <rect width="200" height="120" fill={MRN.coral}/>
      <path d="M-20 110 Q 60 30 200 80" stroke="#fff" strokeOpacity="0.18" strokeWidth="1.5" fill="none"/>
      <path d="M-20 90 Q 80 -10 220 60" stroke="#fff" strokeOpacity="0.18" strokeWidth="1.5" fill="none"/>
      <circle cx="40" cy="40" r="22" fill={MRN.ink}/>
      <circle cx="40" cy="40" r="8" fill={MRN.yellow}/>
      <rect x="120" y="60" width="48" height="48" rx="10" fill={MRN.ink}/>
      <rect x="132" y="72" width="24" height="3" fill={MRN.yellow}/>
      <rect x="132" y="80" width="18" height="3" fill={MRN.coralSoft}/>
      <rect x="132" y="88" width="22" height="3" fill={MRN.coralSoft}/>
    </svg>
  );
  if (variant === 'b') return (
    <svg viewBox="0 0 200 120" style={style}>
      <rect width="200" height="120" fill={MRN.yellow}/>
      <polygon points="40,90 80,30 120,90" fill={MRN.ink}/>
      <polygon points="100,90 140,40 170,90" fill={MRN.coral}/>
      <circle cx="160" cy="30" r="14" fill={MRN.ink}/>
      <circle cx="20" cy="30" r="8" fill={MRN.coral}/>
    </svg>
  );
  if (variant === 'c') return (
    <svg viewBox="0 0 200 120" style={style}>
      <rect width="200" height="120" fill={MRN.mint}/>
      <circle cx="60" cy="60" r="44" fill={MRN.ink}/>
      <circle cx="60" cy="60" r="10" fill={MRN.coral}/>
      <rect x="120" y="20" width="60" height="80" rx="14" fill={MRN.cream}/>
      <rect x="130" y="34" width="40" height="4" rx="2" fill={MRN.ink}/>
      <rect x="130" y="44" width="28" height="4" rx="2" fill={MRN.mute} opacity="0.5"/>
      <rect x="130" y="54" width="34" height="4" rx="2" fill={MRN.mute} opacity="0.5"/>
    </svg>
  );
  if (variant === 'd') return (
    <svg viewBox="0 0 200 120" style={style}>
      <rect width="200" height="120" fill={MRN.blush}/>
      <path d="M 0 100 Q 50 60 100 100 T 200 100 L 200 120 L 0 120 Z" fill={MRN.coral}/>
      <circle cx="150" cy="40" r="22" fill={MRN.ink}/>
      <rect x="30" y="30" width="40" height="40" rx="20" fill={MRN.ink}/>
      <rect x="42" y="42" width="16" height="16" rx="8" fill={MRN.yellow}/>
    </svg>
  );
  if (variant === 'e') return (
    <svg viewBox="0 0 200 120" style={style}>
      <rect width="200" height="120" fill={MRN.ink}/>
      <circle cx="100" cy="60" r="44" fill={MRN.coral}/>
      <circle cx="100" cy="60" r="16" fill={MRN.ink}/>
      <circle cx="100" cy="60" r="4" fill={MRN.cream}/>
      <path d="M30 100 L60 70 M170 100 L140 70" stroke={MRN.coral} strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}

// ── Re-usable bits ────────────────────────────────────────────────
function Chip({ children, color = MRN.card, fg = MRN.ink, style }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '6px 12px', borderRadius: 999, background: color, color: fg,
      fontSize: 11, fontWeight: 700, letterSpacing: 0.1,
      ...style,
    }}>{children}</span>
  );
}

function PillButton({ children, dark = false, style }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '12px 18px', borderRadius: 999,
      background: dark ? MRN.ink : MRN.coral,
      color: '#fff', fontWeight: 800, fontSize: 13, letterSpacing: 0.2,
      ...style,
    }}>{children}</div>
  );
}

function CodeBlock({ lines }) {
  return (
    <div style={{
      background: '#16110d', borderRadius: 16, padding: '14px 16px',
      fontFamily: '"JetBrains Mono", "SF Mono", ui-monospace, monospace',
      fontSize: 11, lineHeight: 1.7, color: '#F5EFE6', overflow: 'hidden',
    }}>
      {lines.map((l, i) => (
        <div key={i} style={{ display: 'flex', gap: 12 }}>
          <span style={{ color: 'rgba(245,239,230,0.35)', width: 14, textAlign: 'right', flexShrink: 0 }}>{i + 1}</span>
          <span style={{ whiteSpace: 'pre' }} dangerouslySetInnerHTML={{ __html: l }}/>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { MRN, Icon, I, Phone, TopHeader, TabBar, GeoArt, Chip, PillButton, CodeBlock });
