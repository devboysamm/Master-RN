// Admin panel — Linear/Notion-style. Compact, keyboard-first, matches mobile coral/cream/ink theme.

// ── Shell ─────────────────────────────────────────────────────────
function AdminShell({ active = 'dash', children, title, sub, breadcrumbs, headerActions }) {
  return (
    <div style={{
      width: 1400, height: 880, background: MRN.cream, color: MRN.ink,
      fontFamily: MRN.font, display: 'flex', overflow: 'hidden',
      WebkitFontSmoothing: 'antialiased',
    }}>
      <AdminSidebar active={active}/>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: '#FCFAF5' }}>
        <AdminHeader title={title} sub={sub} breadcrumbs={breadcrumbs} actions={headerActions}/>
        <div style={{ flex: 1, overflow: 'hidden' }}>{children}</div>
      </div>
    </div>
  );
}

function AdminSidebar({ active }) {
  const sections = [
    { label: 'Workspace', items: [
      { id: 'dash', t: 'Dashboard', d: I.home, k: 'D' },
      { id: 'inbox', t: 'Activity', d: I.bell, k: 'A', badge: 3 },
    ]},
    { label: 'Content', items: [
      { id: 'modules', t: 'Modules', d: I.layers, k: 'M', count: 12 },
      { id: 'lessons', t: 'Lessons', d: I.code, k: 'L', count: 86 },
      { id: 'media', t: 'Media library', d: I.download, k: 'I' },
    ]},
    { label: 'People', items: [
      { id: 'users', t: 'Users', d: I.user, k: 'U', count: '1.2k' },
      { id: 'team', t: 'Team', d: I.shield, k: 'T' },
    ]},
    { label: 'System', items: [
      { id: 'health', t: 'API & logs', d: I.globe, k: 'H', dot: MRN.ok },
      { id: 'settings', t: 'Settings', d: I.gear, k: ',' },
    ]},
  ];
  return (
    <div style={{ width: 240, background: MRN.ink, color: '#fff', padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: 4, borderRight: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px 12px' }}>
        <svg width="26" height="26" viewBox="0 0 220 220">
          <path d="M110 6c52 0 78 0 92 14s14 40 14 92-0 78-14 92-40 14-92 14-78 0-92-14S4 174 4 122s-0-78 14-92S58 6 110 6Z" fill={MRN.coral}/>
          <g fill="none" stroke="#1A1410" strokeWidth="12">
            <ellipse cx="110" cy="110" rx="84" ry="32"/>
            <ellipse cx="110" cy="110" rx="84" ry="32" transform="rotate(60 110 110)"/>
            <ellipse cx="110" cy="110" rx="84" ry="32" transform="rotate(120 110 110)"/>
          </g>
          <circle cx="110" cy="110" r="16" fill="#1A1410"/>
        </svg>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: -0.2 }}>Master <span style={{ color: MRN.coral }}>RN</span></div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', fontWeight: 700, fontFamily: '"JetBrains Mono", monospace', letterSpacing: 0.6 }}>admin · v1.0</div>
        </div>
        <div style={{ marginLeft: 'auto', width: 22, height: 22, borderRadius: 5, background: 'rgba(255,255,255,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.55)' }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M7 7l10 10M17 7L7 17"/></svg>
        </div>
      </div>

      {/* Cmd-K search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 8,
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                    fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
        <Icon d={I.search} size={13}/>
        <span style={{ flex: 1 }}>Search or jump to…</span>
        <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, padding: '1px 5px', borderRadius: 4,
                       background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}>⌘K</span>
      </div>

      {/* Sections */}
      <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 12, flex: 1, overflow: 'hidden' }}>
        {sections.map(sec => (
          <div key={sec.label} style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <div style={{ padding: '6px 10px 4px', fontSize: 10, fontWeight: 700,
                          color: 'rgba(255,255,255,0.4)', letterSpacing: 1, fontFamily: '"JetBrains Mono", monospace' }}>
              {sec.label.toUpperCase()}
            </div>
            {sec.items.map(it => {
              const isActive = it.id === active;
              return (
                <div key={it.id} style={{
                  display: 'flex', alignItems: 'center', gap: 9, padding: '6px 10px', borderRadius: 6,
                  background: isActive ? 'rgba(242,106,74,0.14)' : 'transparent',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                  fontSize: 13, fontWeight: isActive ? 700 : 600, position: 'relative',
                }}>
                  {isActive && <div style={{ position: 'absolute', left: -10, top: 4, bottom: 4, width: 2, borderRadius: 2, background: MRN.coral }}/>}
                  <Icon d={it.d} size={14} style={{ color: isActive ? MRN.coral : 'rgba(255,255,255,0.55)' }}/>
                  <span style={{ flex: 1 }}>{it.t}</span>
                  {it.dot && <span style={{ width: 6, height: 6, borderRadius: 3, background: it.dot }}/>}
                  {it.badge && (
                    <span style={{ background: MRN.coral, color: '#fff', fontSize: 9, fontWeight: 800,
                                   padding: '1px 5px', borderRadius: 4, lineHeight: 1.3 }}>{it.badge}</span>
                  )}
                  {it.count && !it.badge && (
                    <span style={{ fontSize: 10, fontFamily: '"JetBrains Mono", monospace',
                                   color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>{it.count}</span>
                  )}
                  <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, opacity: 0.35,
                                 fontWeight: 700, padding: '1px 4px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3 }}>
                    G {it.k}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* User pill */}
      <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '10px 4px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '6px 6px', borderRadius: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 14,
                        background: `linear-gradient(135deg, ${MRN.coral}, ${MRN.yellow})`, color: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12 }}>A</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700 }}>Admin</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>admin@masterrn.dev</div>
          </div>
          <Icon d={I.arrowUp} size={12} style={{ opacity: 0.4 }}/>
        </div>
      </div>
    </div>
  );
}

function AdminHeader({ title, sub, breadcrumbs, actions }) {
  return (
    <div style={{ padding: '14px 24px', borderBottom: `1px solid ${MRN.rule}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FCFAF5' }}>
      <div style={{ minWidth: 0 }}>
        {breadcrumbs && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: MRN.mute, fontWeight: 600, marginBottom: 4 }}>
            {breadcrumbs.map((b, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span style={{ opacity: 0.5 }}>/</span>}
                <span style={{ color: i === breadcrumbs.length - 1 ? MRN.ink : MRN.mute, fontWeight: i === breadcrumbs.length - 1 ? 700 : 600 }}>{b}</span>
              </React.Fragment>
            ))}
          </div>
        )}
        <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.3, lineHeight: 1.1 }}>{title}</div>
        {sub && <div style={{ fontSize: 12, color: MRN.mute, fontWeight: 600, marginTop: 2 }}>{sub}</div>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {actions}
      </div>
    </div>
  );
}

// ── Reusable bits ────────────────────────────────────────────────
function AdminBtn({ children, primary, ghost, danger, icon, kbd, sm }) {
  const styles = primary
    ? { background: MRN.ink, color: '#fff', border: '1px solid ' + MRN.ink }
    : danger
      ? { background: '#FCD9CF', color: MRN.coralDeep, border: '1px solid ' + MRN.coralSoft }
      : ghost
        ? { background: 'transparent', color: MRN.inkSoft, border: '1px solid transparent' }
        : { background: '#fff', color: MRN.ink, border: '1px solid ' + MRN.rule };
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: sm ? '5px 10px' : '7px 12px', borderRadius: 7,
      fontSize: sm ? 11 : 12, fontWeight: 700, ...styles,
    }}>
      {icon && <Icon d={icon} size={sm ? 11 : 12} sw={2}/>}
      {children}
      {kbd && (
        <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, opacity: 0.55,
                       padding: '0 4px', borderRadius: 3, marginLeft: 2,
                       background: primary ? 'rgba(255,255,255,0.12)' : MRN.cardAlt }}>{kbd}</span>
      )}
    </div>
  );
}

function StatusPill({ s }) {
  const map = {
    Published: { bg: '#E3F2E9', fg: MRN.ok, dot: MRN.ok },
    Draft:     { bg: MRN.cardAlt, fg: MRN.inkSoft, dot: MRN.mute },
    Review:    { bg: MRN.yellowSoft, fg: '#7A5510', dot: MRN.yellow },
    Archived:  { bg: '#EFE6DA', fg: MRN.mute, dot: MRN.mute },
  };
  const c = map[s] || map.Draft;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5,
                   padding: '2px 8px', borderRadius: 999, background: c.bg, color: c.fg,
                   fontSize: 11, fontWeight: 700 }}>
      <span style={{ width: 5, height: 5, borderRadius: 3, background: c.dot }}/>
      {s}
    </span>
  );
}

function ModuleTag({ n, color }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '2px 7px 2px 4px',
                   borderRadius: 5, background: MRN.cardAlt, fontSize: 11, fontWeight: 700, color: MRN.inkSoft }}>
      <span style={{ width: 14, height: 14, borderRadius: 4, background: color, flexShrink: 0 }}/>
      M{String(n).padStart(2, '0')}
    </span>
  );
}

// ── 1. Dashboard ──────────────────────────────────────────────────
function AdminDashboard() {
  // Sparkline data for KPIs
  const sp = (vals, color) => {
    const max = Math.max(...vals), min = Math.min(...vals);
    const pts = vals.map((v, i) => `${(i / (vals.length - 1)) * 120},${28 - ((v - min) / (max - min || 1)) * 24}`).join(' ');
    return (
      <svg width="120" height="32" style={{ position: 'absolute', right: 8, bottom: 8 }}>
        <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx={120} cy={28 - ((vals[vals.length - 1] - min) / (max - min || 1)) * 24} r="2.5" fill={color}/>
      </svg>
    );
  };

  // Bar chart for "Lessons completed last 14 days"
  const bars = [12, 18, 9, 22, 31, 28, 19, 24, 36, 41, 33, 47, 39, 52];

  return (
    <AdminShell
      active="dash"
      title="Dashboard"
      sub="Tuesday, May 16 · welcome back, Admin"
      headerActions={<>
        <AdminBtn icon={I.refresh}>Sync</AdminBtn>
        <AdminBtn primary icon={I.plus} kbd="N">New lesson</AdminBtn>
      </>}
    >
      <div style={{ padding: '16px 24px 24px', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Coral hero — matches mobile coral hero treatment */}
        <div style={{ background: MRN.ink, borderRadius: 16, padding: '18px 22px', position: 'relative', overflow: 'hidden', color: '#fff' }}>
          {/* dotted bg */}
          <svg viewBox="0 0 1400 200" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.5, pointerEvents: 'none' }}>
            <defs>
              <pattern id="adgrid" width="22" height="22" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="0.8" fill="rgba(255,255,255,0.08)"/>
              </pattern>
              <linearGradient id="adfade" x1="0" x2="1">
                <stop offset="0" stopColor="#161311" stopOpacity="0"/>
                <stop offset="1" stopColor="#161311" stopOpacity="0.85"/>
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#adgrid)"/>
            <rect width="100%" height="100%" fill="url(#adfade)"/>
          </svg>
          <div style={{ position: 'absolute', top: -40, right: -30, width: 260, height: 260, borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(242,106,74,0.35) 0%, rgba(242,106,74,0) 70%)' }}/>
          <div style={{ position: 'absolute', top: 18, right: 28, fontFamily: '"JetBrains Mono", monospace',
                        fontSize: 100, fontWeight: 800, color: 'rgba(242,106,74,0.10)', lineHeight: 0.85, letterSpacing: -4 }}>{'</>'}</div>

          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 36 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 3, height: 14, borderRadius: 2, background: MRN.coral }}/>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, fontWeight: 700, color: MRN.coral, letterSpacing: 1.4 }}>THIS WEEK</div>
              </div>
              <div style={{ marginTop: 6, fontSize: 28, fontWeight: 800, letterSpacing: -0.5, lineHeight: 1.1 }}>
                +217 lessons completed
              </div>
              <div style={{ marginTop: 4, fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
                ↑ 28% vs last week · 1,242 active learners · API healthy
              </div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'flex-end', gap: 5, height: 76 }}>
              {bars.map((v, i) => (
                <div key={i} style={{
                  width: 9, height: `${(v / 52) * 76}px`, borderRadius: 2,
                  background: i === bars.length - 1 ? MRN.coral : 'rgba(255,255,255,0.18)',
                }}/>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <div style={{ padding: '8px 14px', borderRadius: 8, background: MRN.coral, color: '#fff', fontWeight: 800, fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Icon d={I.plus} size={12} sw={2.2}/> New lesson
              </div>
              <div style={{ padding: '8px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.08)', color: '#fff', fontWeight: 800, fontSize: 12 }}>Open editor</div>
            </div>
          </div>
        </div>

        {/* KPI row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {[
            { l: 'Modules', n: '12', d: '+2 this month', c: MRN.coral, spark: [4,5,5,6,7,8,10,10,11,11,12], up: true },
            { l: 'Lessons', n: '86', d: '+11 this month', c: MRN.yellow, spark: [40,45,55,60,68,72,75,80,82,84,86], up: true },
            { l: 'Avg read time', n: '6.4m', d: '−0.3m vs last week', c: MRN.mint, spark: [7.1,7,6.8,6.9,6.7,6.6,6.5,6.5,6.4,6.4,6.4], up: false },
            { l: 'API p99', n: '38 ms', d: 'healthy · MySQL ok', c: MRN.ok, spark: [60,52,48,44,40,42,38,36,40,38,38], up: false },
          ].map(k => (
            <div key={k.l} style={{ background: '#fff', borderRadius: 12, padding: '14px 16px',
                                    border: `1px solid ${MRN.rule}`, position: 'relative', overflow: 'hidden' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: MRN.mute, letterSpacing: 0.4 }}>{k.l.toUpperCase()}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: MRN.ink, letterSpacing: -0.5 }}>{k.n}</div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: k.up ? MRN.ok : MRN.coralDeep, marginTop: 2 }}>
                {k.up ? '↑' : '↓'} {k.d}
              </div>
              {sp(k.spark, k.c)}
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 12, flex: 1, minHeight: 0 }}>
          {/* Recent activity feed */}
          <div style={{ background: '#fff', borderRadius: 12, border: `1px solid ${MRN.rule}`, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${MRN.rule}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 800 }}>Recent activity</div>
                <span style={{ fontSize: 11, fontWeight: 700, color: MRN.mute }}>last 24 hours</span>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <AdminBtn ghost sm>All</AdminBtn>
                <AdminBtn ghost sm>Edits</AdminBtn>
                <AdminBtn ghost sm>Users</AdminBtn>
              </div>
            </div>
            <div style={{ flex: 1, overflow: 'hidden', padding: '4px 0' }}>
              {[
                { who: 'You', wIcon: 'A', icon: I.check,  what: 'published',  on: 'Tab navigator setup', meta: 'Navigation · 8 min', t: '2m', color: MRN.ok },
                { who: 'Aman',  wIcon: 'A', icon: I.edit, what: 'edited',    on: 'Props & children',    meta: 'Components & JSX',   t: '14m', color: MRN.coral },
                { who: 'System', wIcon: '⚙', icon: I.refresh, what: 'rebuilt search index', on: '',     meta: '86 lessons · 412 ms', t: '38m', color: MRN.mute },
                { who: 'Priya',  wIcon: 'P', icon: I.plus, what: 'created',  on: 'useCallback vs useMemo', meta: 'State & Hooks · draft', t: '1h', color: MRN.coral },
                { who: 'You',    wIcon: 'A', icon: I.trash, what: 'archived', on: 'Old animation primer', meta: 'UI · 5 min',         t: '3h', color: MRN.mute },
                { who: 'Aman',   wIcon: 'A', icon: I.bookmark, what: 'flagged', on: 'AsyncStorage patterns', meta: 'Native APIs · needs review', t: '5h', color: MRN.yellow },
                { who: 'API',    wIcon: '↯', icon: I.globe, what: 'health check passed', on: '', meta: 'MySQL ok · 38 ms', t: '6h', color: MRN.ok },
                { who: 'Priya',  wIcon: 'P', icon: I.edit, what: 'edited',    on: 'JSX in 5 minutes',    meta: 'Components & JSX',   t: '8h', color: MRN.coral },
              ].map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 16px',
                                       borderBottom: i < 7 ? `1px solid ${MRN.rule}` : 'none' }}>
                  <div style={{ width: 24, height: 24, borderRadius: 12, flexShrink: 0,
                                background: a.who === 'System' || a.who === 'API' ? MRN.cardAlt : `linear-gradient(135deg, ${MRN.coral}, ${MRN.yellow})`,
                                color: a.who === 'System' || a.who === 'API' ? MRN.inkSoft : '#fff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 800, fontSize: 11 }}>{a.wIcon}</div>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: MRN.cardAlt,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: a.color, flexShrink: 0 }}>
                    <Icon d={a.icon} size={12} sw={2}/>
                  </div>
                  <div style={{ flex: 1, minWidth: 0, fontSize: 12, color: MRN.inkSoft }}>
                    <span style={{ fontWeight: 800, color: MRN.ink }}>{a.who}</span> {a.what}{a.on ? ' ' : ''}
                    {a.on && <span style={{ fontWeight: 700, color: MRN.ink }}>{a.on}</span>}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: MRN.mute, minWidth: 200, textAlign: 'right' }}>{a.meta}</div>
                  <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, fontWeight: 700, color: MRN.mute, width: 30, textAlign: 'right' }}>{a.t}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
            {/* Quick actions */}
            <div style={{ background: '#fff', borderRadius: 12, border: `1px solid ${MRN.rule}`, padding: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 8 }}>Quick actions</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {[
                  ['New module', I.plus, 'M'],
                  ['New lesson', I.edit, 'L'],
                  ['Invite teammate', I.user, 'I'],
                  ['Reorder path', I.layers, 'R'],
                  ['Open in app', I.play, 'O'],
                  ['Export CSV', I.download, 'E'],
                ].map(([t, ic, k]) => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px',
                                          borderRadius: 8, background: MRN.cardAlt, fontSize: 12, fontWeight: 700, color: MRN.ink }}>
                    <Icon d={ic} size={13}/>
                    <span style={{ flex: 1 }}>{t}</span>
                    <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, opacity: 0.5, padding: '1px 4px',
                                   borderRadius: 3, border: `1px solid ${MRN.rule}` }}>⌘{k}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Drafts pinned */}
            <div style={{ background: '#fff', borderRadius: 12, border: `1px solid ${MRN.rule}`, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '12px 14px', borderBottom: `1px solid ${MRN.rule}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 13, fontWeight: 800 }}>Pinned · drafts</div>
                <span style={{ fontSize: 11, fontWeight: 700, color: MRN.mute }}>5 / 11</span>
              </div>
              <div style={{ overflow: 'hidden', flex: 1 }}>
                {[
                  { t: 'Props & children', m: 2, mt: 'Components & JSX', s: 'Draft', age: '14m' },
                  { t: 'useCallback vs useMemo', m: 4, mt: 'State & Hooks', s: 'Draft', age: '1h' },
                  { t: 'FlatList performance', m: 6, mt: 'Performance', s: 'Review', age: '2d' },
                  { t: 'Deep-linking routes', m: 3, mt: 'Navigation', s: 'Draft', age: '3d' },
                  { t: 'AsyncStorage patterns', m: 5, mt: 'Native APIs', s: 'Review', age: '5d' },
                ].map((l, i) => (
                  <div key={l.t} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px',
                                          borderBottom: i < 4 ? `1px solid ${MRN.rule}` : 'none' }}>
                    <ModuleTag n={l.m} color={[MRN.coral, MRN.yellow, MRN.mint, MRN.blush, MRN.coralSoft, MRN.yellowSoft][l.m % 6]}/>
                    <div style={{ flex: 1, minWidth: 0, fontSize: 12, fontWeight: 700, color: MRN.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.t}</div>
                    <StatusPill s={l.s}/>
                    <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: MRN.mute, fontWeight: 700, width: 30, textAlign: 'right' }}>{l.age}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

// ── 2. Modules ────────────────────────────────────────────────────
function AdminModules() {
  const mods = [
    { n: 1, t: 'Foundations',       d: 'JS & RN basics',         lessons: 6, time: '42m',    color: MRN.coral,     prereq: '—',         status: 'Published' },
    { n: 2, t: 'Components & JSX',  d: 'Building blocks',        lessons: 8, time: '1h 04m', color: MRN.yellow,    prereq: 'M01',       status: 'Published' },
    { n: 3, t: 'Navigation',        d: 'Stack, tabs, drawer',    lessons: 6, time: '48m',    color: MRN.mint,      prereq: 'M02',       status: 'Published' },
    { n: 4, t: 'State & Hooks',     d: 'useState → context',     lessons: 9, time: '1h 22m', color: MRN.blush,     prereq: 'M02',       status: 'Review' },
    { n: 5, t: 'Native APIs',       d: 'Storage, camera, gps',   lessons: 7, time: '58m',    color: MRN.coralSoft, prereq: 'M03',       status: 'Draft' },
    { n: 6, t: 'Performance',       d: 'Profiling & lists',      lessons: 5, time: '36m',    color: MRN.yellowSoft,prereq: 'M05',       status: 'Draft' },
    { n: 7, t: 'Animation',         d: 'Reanimated + gestures',  lessons: 6, time: '52m',    color: MRN.coral,     prereq: 'M04',       status: 'Draft' },
    { n: 8, t: 'Testing',           d: 'Jest + RNTL',            lessons: 4, time: '34m',    color: MRN.mint,      prereq: 'M04',       status: 'Archived' },
  ];
  return (
    <AdminShell
      active="modules"
      title="Modules"
      sub={`${mods.length} modules · 86 lessons total`}
      breadcrumbs={['Content', 'Modules']}
      headerActions={<>
        <AdminBtn icon={I.filter} kbd="F">Filter</AdminBtn>
        <AdminBtn icon={I.copy}>Export</AdminBtn>
        <AdminBtn primary icon={I.plus} kbd="N">New module</AdminBtn>
      </>}
    >
      <div style={{ padding: '14px 24px 24px', height: '100%', display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden' }}>
        {/* sub-tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {[
            ['All', 12, true],
            ['Published', 3],
            ['Review', 1],
            ['Draft', 3],
            ['Archived', 1],
          ].map(([t, n, a]) => (
            <div key={t} style={{
              padding: '6px 12px', borderRadius: 7, fontSize: 12, fontWeight: 700,
              background: a ? MRN.ink : 'transparent', color: a ? '#fff' : MRN.inkSoft,
              display: 'inline-flex', alignItems: 'center', gap: 6,
              border: a ? '1px solid ' + MRN.ink : '1px solid transparent',
            }}>
              {t}
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                             padding: '0 5px', borderRadius: 3,
                             background: a ? 'rgba(255,255,255,0.18)' : MRN.cardAlt,
                             color: a ? 'rgba(255,255,255,0.7)' : MRN.mute }}>{n}</span>
            </div>
          ))}
          <div style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 7, background: '#fff', border: `1px solid ${MRN.rule}`, fontSize: 12, fontWeight: 600, color: MRN.mute, width: 280 }}>
            <Icon d={I.search} size={13}/> Search modules…
            <span style={{ marginLeft: 'auto', fontFamily: '"JetBrains Mono", monospace', fontSize: 10, padding: '1px 4px', borderRadius: 3, background: MRN.cardAlt }}>/</span>
          </div>
        </div>

        {/* Table */}
        <div style={{ background: '#fff', borderRadius: 12, border: `1px solid ${MRN.rule}`, overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '24px 26px 60px 1.6fr 90px 90px 90px 110px 80px 60px', gap: 10, padding: '8px 14px',
                        fontSize: 10, fontWeight: 700, color: MRN.mute, letterSpacing: 0.4, background: '#FAF5EC', borderBottom: `1px solid ${MRN.rule}` }}>
            <div></div>
            <div><div style={{ width: 12, height: 12, borderRadius: 3, border: `1.5px solid ${MRN.rule}` }}/></div>
            <div>#</div>
            <div>TITLE</div>
            <div>LESSONS</div>
            <div>TIME</div>
            <div>PREREQ</div>
            <div>STATUS</div>
            <div>UPDATED</div>
            <div></div>
          </div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            {mods.map((m, i) => (
              <div key={m.n} style={{
                display: 'grid', gridTemplateColumns: '24px 26px 60px 1.6fr 90px 90px 90px 110px 80px 60px', gap: 10,
                padding: '8px 14px', alignItems: 'center', borderBottom: i < mods.length - 1 ? `1px solid ${MRN.rule}` : 'none',
                fontSize: 12, position: 'relative',
              }}>
                {/* drag handle */}
                <div style={{ color: MRN.mute, cursor: 'grab', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="10" height="14" viewBox="0 0 10 14"><circle cx="2" cy="3" r="1" fill="currentColor"/><circle cx="2" cy="7" r="1" fill="currentColor"/><circle cx="2" cy="11" r="1" fill="currentColor"/><circle cx="8" cy="3" r="1" fill="currentColor"/><circle cx="8" cy="7" r="1" fill="currentColor"/><circle cx="8" cy="11" r="1" fill="currentColor"/></svg>
                </div>
                <div style={{ width: 14, height: 14, borderRadius: 3, border: `1.5px solid ${MRN.rule}` }}/>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 700, color: MRN.coralDeep, fontSize: 11 }}>M{String(m.n).padStart(2, '0')}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, background: m.color, flexShrink: 0 }}/>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontWeight: 700, color: MRN.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.t}</div>
                    <div style={{ fontSize: 11, color: MRN.mute, fontWeight: 600 }}>{m.d}</div>
                  </div>
                </div>
                <div style={{ fontWeight: 700, color: MRN.inkSoft }}>{m.lessons}</div>
                <div style={{ fontWeight: 700, color: MRN.inkSoft, fontFamily: '"JetBrains Mono", monospace', fontSize: 11 }}>{m.time}</div>
                <div style={{ fontWeight: 700, color: MRN.inkSoft, fontFamily: '"JetBrains Mono", monospace', fontSize: 11 }}>{m.prereq}</div>
                <div><StatusPill s={m.status}/></div>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: MRN.mute, fontWeight: 700 }}>{['2m','14m','1h','3h','2d','5d','1w','2w'][i]}</div>
                <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                  <div style={{ width: 22, height: 22, borderRadius: 5, background: MRN.cardAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', color: MRN.inkSoft }}><Icon d={I.edit} size={11}/></div>
                  <div style={{ width: 22, height: 22, borderRadius: 5, background: MRN.cardAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', color: MRN.inkSoft }}><Icon d={I.more} size={11}/></div>
                </div>
              </div>
            ))}
          </div>
          {/* Footer */}
          <div style={{ padding: '8px 14px', borderTop: `1px solid ${MRN.rule}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: MRN.mute, fontWeight: 700, background: '#FAF5EC' }}>
            <div>8 of 12 modules</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <AdminBtn sm ghost>← Prev</AdminBtn>
              <AdminBtn sm ghost>Next →</AdminBtn>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

// ── 3. Module editor — image upload, color picker, lesson reorder ─
function AdminModuleEdit() {
  return (
    <AdminShell
      active="modules"
      title="Components & JSX"
      sub="Module 02 · last edited by Aman, 14m ago"
      breadcrumbs={['Content', 'Modules', 'M02 · Components & JSX']}
      headerActions={<>
        <span style={{ fontSize: 11, fontWeight: 700, color: MRN.ok, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, background: MRN.ok }}/> Auto-saved 12s ago
        </span>
        <AdminBtn icon={I.play}>Preview in app</AdminBtn>
        <AdminBtn primary icon={I.check} kbd="⌘S">Publish</AdminBtn>
      </>}
    >
      <div style={{ padding: '16px 24px 24px', height: '100%', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14, overflow: 'hidden' }}>
        {/* LEFT: form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden' }}>
          {/* Cover */}
          <div style={{ background: '#fff', borderRadius: 12, border: `1px solid ${MRN.rule}`, padding: 14 }}>
            <FieldLabel>COVER · 16:9 PNG / JPG, max 2 MB</FieldLabel>
            <div style={{ marginTop: 8, height: 132, borderRadius: 10, position: 'relative', overflow: 'hidden',
                          background: MRN.coral, display: 'flex', alignItems: 'flex-end', padding: 14, color: '#fff' }}>
              <svg viewBox="0 0 400 132" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.35 }}>
                <path d="M0 90 Q 100 30 400 80" stroke="#fff" strokeWidth="1.5" fill="none"/>
                <circle cx="360" cy="22" r="22" fill={MRN.ink}/>
              </svg>
              <div style={{ position: 'relative' }}>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>MODULE 02</div>
                <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.05, marginTop: 2 }}>Components & JSX</div>
              </div>
              <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 6 }}>
                <div style={{ padding: '5px 9px', borderRadius: 6, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', color: '#fff', fontWeight: 700, fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <Icon d={I.download} size={11}/> Replace
                </div>
                <div style={{ padding: '5px 9px', borderRadius: 6, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', color: '#fff', fontWeight: 700, fontSize: 11 }}>•••</div>
              </div>
            </div>
            <div style={{ marginTop: 6, fontSize: 11, fontFamily: '"JetBrains Mono", monospace', color: MRN.mute }}>cdn.masterrn.dev/m02-cover.png · 1920×1080 · 412 KB</div>
          </div>

          {/* Basics */}
          <div style={{ background: '#fff', borderRadius: 12, border: `1px solid ${MRN.rule}`, padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <FieldLabel>BASICS</FieldLabel>
              <span style={{ fontSize: 10, fontFamily: '"JetBrains Mono", monospace', color: MRN.mute, fontWeight: 700 }}>id · m02-components-jsx</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 80px 110px', gap: 10, marginTop: 10 }}>
              <AdminField label="TITLE" value="Components & JSX"/>
              <AdminField label="ORDER" value="2" mono/>
              <AdminField label="STATUS" value="Published" status/>
            </div>
            <div style={{ marginTop: 10 }}>
              <AdminField label="DESCRIPTION" value="Building blocks of any React Native screen — what a component is, JSX rules, props, children, and patterns of composition." multiline/>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 130px', gap: 10, marginTop: 10 }}>
              <AdminField label="PREREQUISITES" value="JavaScript · ES6 · Module 01" chips/>
              <AdminField label="READ TIME (auto)" value="1h 04m" mono/>
            </div>
          </div>

          {/* Theme */}
          <div style={{ background: '#fff', borderRadius: 12, border: `1px solid ${MRN.rule}`, padding: 14 }}>
            <FieldLabel>THEME</FieldLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 10 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: MRN.mute, marginBottom: 6 }}>ACCENT COLOR</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[MRN.coral, MRN.yellow, MRN.mint, MRN.blush, MRN.coralSoft, '#9F7AEA', '#5BB5E0'].map((c, i) => (
                    <div key={i} style={{
                      width: 26, height: 26, borderRadius: 7, background: c,
                      border: i === 0 ? `2px solid ${MRN.ink}` : `1px solid ${MRN.rule}`,
                      boxShadow: i === 0 ? `0 0 0 2px #fff inset` : 'none',
                    }}/>
                  ))}
                  <div style={{ width: 26, height: 26, borderRadius: 7, border: `1px dashed ${MRN.rule}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: MRN.mute }}>
                    <Icon d={I.plus} size={12}/>
                  </div>
                </div>
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px',
                              background: MRN.cardAlt, borderRadius: 7, fontSize: 11, fontFamily: '"JetBrains Mono", monospace', color: MRN.inkSoft, fontWeight: 700 }}>
                  <div style={{ width: 14, height: 14, borderRadius: 3, background: MRN.coral }}/>
                  #F26A4A
                  <span style={{ marginLeft: 'auto', opacity: 0.5 }}>contrast AA ✓</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: MRN.mute, marginBottom: 6 }}>ICON</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
                  {[I.layers, I.code, I.sparkle, I.flame, I.star, I.shield, I.globe].map((d, i) => (
                    <div key={i} style={{
                      aspectRatio: '1', borderRadius: 6,
                      background: i === 1 ? MRN.coralSoft : MRN.cardAlt,
                      border: i === 1 ? `1.5px solid ${MRN.coral}` : `1px solid ${MRN.rule}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: i === 1 ? MRN.coralDeep : MRN.inkSoft,
                    }}>
                      <Icon d={d} size={14}/>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Lessons reorder */}
          <div style={{ background: '#fff', borderRadius: 12, border: `1px solid ${MRN.rule}`, padding: 0, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '12px 14px', borderBottom: `1px solid ${MRN.rule}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FieldLabel>LESSONS · DRAG TO REORDER</FieldLabel>
                <span style={{ fontSize: 10, fontFamily: '"JetBrains Mono", monospace', color: MRN.mute, fontWeight: 700 }}>8 items</span>
              </div>
              <AdminBtn sm icon={I.plus}>Add lesson</AdminBtn>
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              {[
                { n: 1, t: 'What is JSX?', time: '4 min', s: 'Published' },
                { n: 2, t: 'Functional components', time: '6 min', s: 'Published' },
                { n: 3, t: 'Props & children', time: '5 min', s: 'Draft', focused: true },
                { n: 4, t: 'Composition patterns', time: '7 min', s: 'Draft' },
                { n: 5, t: 'Conditional rendering', time: '5 min', s: 'Review' },
                { n: 6, t: 'Lists & keys', time: '6 min', s: 'Published' },
              ].map((l, i, a) => (
                <div key={l.n} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '7px 14px',
                  background: l.focused ? '#FFF5F1' : '#fff',
                  borderBottom: i < a.length - 1 ? `1px solid ${MRN.rule}` : 'none',
                  borderLeft: l.focused ? `2px solid ${MRN.coral}` : '2px solid transparent',
                }}>
                  <div style={{ color: MRN.mute }}><svg width="10" height="14" viewBox="0 0 10 14"><circle cx="2" cy="3" r="1" fill="currentColor"/><circle cx="2" cy="7" r="1" fill="currentColor"/><circle cx="2" cy="11" r="1" fill="currentColor"/><circle cx="8" cy="3" r="1" fill="currentColor"/><circle cx="8" cy="7" r="1" fill="currentColor"/><circle cx="8" cy="11" r="1" fill="currentColor"/></svg></div>
                  <div style={{ width: 22, height: 22, borderRadius: 5, background: MRN.cardAlt, color: MRN.inkSoft,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"JetBrains Mono", monospace', fontSize: 10, fontWeight: 700 }}>{l.n}</div>
                  <div style={{ flex: 1, fontSize: 12, fontWeight: 700, color: MRN.ink }}>{l.t}</div>
                  <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, fontWeight: 700, color: MRN.mute }}>{l.time}</div>
                  <StatusPill s={l.s}/>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: live preview + meta */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden' }}>
          <div style={{ background: MRN.cardAlt, borderRadius: 12, border: `1px solid ${MRN.rule}`,
                        padding: 18, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 12 }}>
              <FieldLabel>LIVE PREVIEW · MODULE DETAIL</FieldLabel>
              <div style={{ display: 'flex', gap: 4 }}>
                {['📱 Mobile', '💻 Web'].map((t, i) => (
                  <div key={t} style={{ padding: '4px 10px', borderRadius: 5, fontSize: 11, fontWeight: 700,
                                        background: i === 0 ? MRN.ink : '#fff',
                                        color: i === 0 ? '#fff' : MRN.inkSoft, border: i === 0 ? 'none' : `1px solid ${MRN.rule}` }}>{t}</div>
                ))}
              </div>
            </div>
            {/* Mini mobile preview */}
            <div style={{
              width: 280, height: 540, borderRadius: 38, background: MRN.cream,
              boxShadow: '0 20px 40px rgba(0,0,0,0.18), 0 0 0 7px #16110d',
              padding: '34px 14px 18px', position: 'relative',
            }}>
              <div style={{ position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)',
                            width: 76, height: 22, borderRadius: 16, background: '#16110d' }}/>
              <div style={{ background: MRN.ink, borderRadius: 18, padding: 14, color: '#fff', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -30, right: -20, width: 120, height: 120, borderRadius: '50%',
                              background: 'radial-gradient(circle, rgba(242,106,74,0.4) 0%, rgba(242,106,74,0) 70%)' }}/>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, position: 'relative' }}>
                  <div style={{ width: 3, height: 12, borderRadius: 2, background: MRN.coral }}/>
                  <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, fontWeight: 700, color: MRN.coral, letterSpacing: 1.2 }}>MODULE 02</div>
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.05, marginTop: 4, position: 'relative' }}>Components<br/>& JSX</div>
                <div style={{ marginTop: 12, display: 'flex', gap: 5, flexWrap: 'wrap', position: 'relative' }}>
                  <Chip color="rgba(255,255,255,0.10)" fg="#fff">8 lessons</Chip>
                  <Chip color="rgba(255,255,255,0.10)" fg="#fff">1h 04m</Chip>
                  <Chip color={MRN.coral} fg="#fff">Beginner</Chip>
                </div>
              </div>
              <div style={{ marginTop: 10, fontFamily: '"JetBrains Mono", monospace', fontSize: 9, fontWeight: 700, letterSpacing: 1, color: MRN.mute }}>PREREQUISITES</div>
              <div style={{ display: 'flex', gap: 5, marginTop: 6 }}>
                {['JavaScript','ES6','Module 01'].map(p => (
                  <div key={p} style={{ padding: '5px 9px', borderRadius: 999, background: MRN.coralSoft,
                                         border: `1px solid ${MRN.coral}`, fontSize: 10, fontWeight: 800, color: MRN.coralDeep, whiteSpace: 'nowrap' }}>{p}</div>
                ))}
              </div>
              <div style={{ marginTop: 14, fontSize: 12, fontWeight: 800 }}>Lessons</div>
              <div style={{ marginTop: 6, background: '#fff', borderRadius: 12, padding: 4 }}>
                {[1,2,3].map(n => (
                  <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 8px', borderBottom: n < 3 ? `1px solid ${MRN.rule}` : 'none' }}>
                    <div style={{ width: 22, height: 22, borderRadius: 11, background: n === 3 ? MRN.coral : MRN.cardAlt,
                                  color: n === 3 ? '#fff' : MRN.inkSoft,
                                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800 }}>{n}</div>
                    <div style={{ flex: 1, fontSize: 11, fontWeight: 700, color: MRN.ink }}>Lesson {n}</div>
                    <Icon d={I.arrowR} size={11} style={{ color: MRN.mute }}/>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Validation */}
          <div style={{ background: '#fff', borderRadius: 12, border: `1px solid ${MRN.rule}`, padding: 14 }}>
            <FieldLabel>VALIDATION</FieldLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 8, fontSize: 12 }}>
              {[
                ['ok', 'Title 16/120 chars'],
                ['ok', 'Description present'],
                ['ok', 'Cover image · 1920×1080'],
                ['ok', 'Hex valid · contrast AA'],
                ['warn', '1 lesson in Review (M02·L05)'],
              ].map(([s, t]) => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 6, height: 6, borderRadius: 3, background: s === 'ok' ? MRN.ok : MRN.yellow }}/>
                  <span style={{ color: MRN.inkSoft }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

function FieldLabel({ children }) {
  return <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, fontWeight: 700, color: MRN.mute, letterSpacing: 0.6 }}>{children}</div>;
}

function AdminField({ label, value, multiline, mono, status, chips }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div style={{
        marginTop: 6, background: '#FAF5EC', border: `1px solid ${MRN.rule}`, borderRadius: 8,
        padding: multiline ? '10px 12px' : '8px 10px',
        fontSize: 12, fontWeight: 600, color: MRN.ink,
        fontFamily: mono ? '"JetBrains Mono", monospace' : MRN.font,
        minHeight: multiline ? 56 : 32, lineHeight: multiline ? 1.55 : 1.3,
        display: 'flex', alignItems: 'center', gap: 6, flexWrap: chips ? 'wrap' : 'nowrap',
      }}>
        {status && <span style={{ width: 6, height: 6, borderRadius: 3, background: MRN.ok }}/>}
        {chips ? value.split(' · ').map(p => (
          <span key={p} style={{ padding: '3px 8px', borderRadius: 5, background: MRN.coralSoft, color: MRN.coralDeep, fontSize: 11, fontWeight: 700 }}>{p}</span>
        )) : value}
      </div>
    </div>
  );
}

// ── 4. Lessons list — grouped, filters, bulk actions ──────────────
function AdminLessons() {
  const groups = [
    { mn: 1, mt: 'Foundations', color: MRN.coral, items: [
      { n: 1, t: 'Welcome to React Native', time: '4', s: 'Published', age: '2w', sel: false },
      { n: 2, t: 'How RN differs from web React', time: '6', s: 'Published', age: '2w', sel: false },
    ]},
    { mn: 2, mt: 'Components & JSX', color: MRN.yellow, items: [
      { n: 1, t: 'What is JSX?', time: '4', s: 'Published', age: '1w', sel: false },
      { n: 2, t: 'Functional components', time: '6', s: 'Published', age: '6d', sel: false },
      { n: 3, t: 'Props & children', time: '5', s: 'Draft', age: '14m', sel: true },
      { n: 4, t: 'Composition patterns', time: '7', s: 'Draft', age: '2d', sel: true },
      { n: 5, t: 'Conditional rendering', time: '5', s: 'Review', age: '1d', sel: false },
    ]},
    { mn: 4, mt: 'State & Hooks', color: MRN.blush, items: [
      { n: 1, t: 'useState patterns', time: '6', s: 'Published', age: '4d', sel: false },
      { n: 2, t: 'useEffect lifecycles', time: '9', s: 'Published', age: '3d', sel: false },
      { n: 3, t: 'useCallback vs useMemo', time: '5', s: 'Draft', age: '1h', sel: false },
    ]},
  ];
  const selectedCount = groups.flatMap(g => g.items).filter(l => l.sel).length;
  return (
    <AdminShell
      active="lessons"
      title="Lessons"
      sub="86 lessons · grouped by module"
      breadcrumbs={['Content', 'Lessons']}
      headerActions={<>
        <AdminBtn icon={I.filter} kbd="F">Filters · 2</AdminBtn>
        <AdminBtn icon={I.copy}>Export</AdminBtn>
        <AdminBtn primary icon={I.plus} kbd="N">New lesson</AdminBtn>
      </>}
    >
      <div style={{ padding: '14px 24px 24px', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Filter row */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          <FilterChip label="Status" value="Draft, Review" coral/>
          <FilterChip label="Module" value="All"/>
          <FilterChip label="Author" value="Anyone"/>
          <FilterChip label="Updated" value="Last 30 days" coral/>
          <FilterChip icon={I.plus} label="" value="Add filter" ghost/>
          <div style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 7, background: '#fff', border: `1px solid ${MRN.rule}`, fontSize: 12, fontWeight: 600, color: MRN.mute, width: 280 }}>
            <Icon d={I.search} size={13}/> Search 86 lessons…
            <span style={{ marginLeft: 'auto', fontFamily: '"JetBrains Mono", monospace', fontSize: 10, padding: '1px 4px', borderRadius: 3, background: MRN.cardAlt }}>/</span>
          </div>
        </div>

        {/* Bulk action bar */}
        {selectedCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
                        background: MRN.ink, color: '#fff', borderRadius: 8 }}>
            <div style={{ width: 14, height: 14, borderRadius: 3, background: MRN.coral, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Icon d={I.check} size={10} sw={2.6}/>
            </div>
            <span style={{ fontSize: 12, fontWeight: 800 }}>{selectedCount} selected</span>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
              {['Publish', 'Mark for review', 'Move to module…', 'Duplicate', 'Archive'].map((t, i) => (
                <div key={t} style={{ padding: '5px 10px', borderRadius: 6,
                                      background: i === 0 ? MRN.coral : 'rgba(255,255,255,0.1)',
                                      color: '#fff', fontSize: 11, fontWeight: 800 }}>{t}</div>
              ))}
            </div>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M7 7l10 10M17 7L7 17"/></svg>
            </div>
          </div>
        )}

        {/* Table */}
        <div style={{ background: '#fff', borderRadius: 12, border: `1px solid ${MRN.rule}`, overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '24px 60px 70px 1.6fr 90px 80px 100px 110px 80px 50px', gap: 10, padding: '7px 14px',
                        fontSize: 10, fontWeight: 700, color: MRN.mute, letterSpacing: 0.4, background: '#FAF5EC', borderBottom: `1px solid ${MRN.rule}` }}>
            <div><div style={{ width: 12, height: 12, borderRadius: 3, border: `1.5px solid ${MRN.rule}` }}/></div>
            <div>MOD</div>
            <div>ORDER</div>
            <div>TITLE</div>
            <div>READ TIME</div>
            <div>AUTHOR</div>
            <div>STATUS</div>
            <div>UPDATED</div>
            <div>VIEWS</div>
            <div></div>
          </div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            {groups.map((g, gi) => (
              <React.Fragment key={g.mn}>
                {/* Group header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px',
                              background: '#FAF5EC', borderTop: gi === 0 ? 'none' : `1px solid ${MRN.rule}`,
                              borderBottom: `1px solid ${MRN.rule}`, fontSize: 11, fontWeight: 800, color: MRN.inkSoft }}>
                  <Icon d={I.arrowR} size={10} style={{ transform: 'rotate(90deg)', color: MRN.mute }}/>
                  <ModuleTag n={g.mn} color={g.color}/>
                  <span style={{ fontWeight: 800, color: MRN.ink }}>{g.mt}</span>
                  <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: MRN.mute, fontWeight: 700 }}>{g.items.length} lessons</span>
                </div>
                {g.items.map((l, i) => (
                  <div key={i} style={{
                    display: 'grid', gridTemplateColumns: '24px 60px 70px 1.6fr 90px 80px 100px 110px 80px 50px', gap: 10,
                    padding: '7px 14px', alignItems: 'center',
                    borderBottom: i < g.items.length - 1 ? `1px solid ${MRN.rule}` : 'none',
                    background: l.sel ? '#FFF5F1' : '#fff', fontSize: 12,
                  }}>
                    <div style={{
                      width: 14, height: 14, borderRadius: 3,
                      background: l.sel ? MRN.coral : '#fff',
                      border: l.sel ? `1px solid ${MRN.coral}` : `1.5px solid ${MRN.rule}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {l.sel && <Icon d={I.check} size={9} sw={3} style={{ color: '#fff' }}/>}
                    </div>
                    <ModuleTag n={g.mn} color={g.color}/>
                    <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: MRN.mute, fontWeight: 700 }}>L{String(l.n).padStart(2, '0')}</div>
                    <div style={{ fontWeight: 700, color: MRN.ink }}>{l.t}</div>
                    <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: MRN.inkSoft, fontWeight: 700 }}>{l.time} min</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 18, height: 18, borderRadius: 9, background: `linear-gradient(135deg, ${MRN.coral}, ${MRN.yellow})`, color: '#fff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 9 }}>{['A','P','Y'][i % 3]}</div>
                      <span style={{ fontSize: 11, color: MRN.inkSoft, fontWeight: 600 }}>{['Aman','Priya','You'][i % 3]}</span>
                    </div>
                    <StatusPill s={l.s}/>
                    <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: MRN.mute, fontWeight: 700 }}>{l.age}</div>
                    <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: MRN.inkSoft, fontWeight: 700 }}>{Math.round(Math.random() * 800 + 120)}</div>
                    <div style={{ display: 'flex', gap: 3, justifyContent: 'flex-end' }}>
                      <div style={{ width: 22, height: 22, borderRadius: 5, background: MRN.cardAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', color: MRN.inkSoft }}><Icon d={I.edit} size={11}/></div>
                      <div style={{ width: 22, height: 22, borderRadius: 5, background: MRN.cardAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', color: MRN.inkSoft }}><Icon d={I.more} size={11}/></div>
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
          <div style={{ padding: '7px 14px', borderTop: `1px solid ${MRN.rule}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: MRN.mute, fontWeight: 700, background: '#FAF5EC' }}>
            <div>10 of 86 lessons · 2 selected</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <AdminBtn sm ghost>← Prev</AdminBtn>
              <span style={{ padding: '5px 10px', fontFamily: '"JetBrains Mono", monospace' }}>1 / 9</span>
              <AdminBtn sm ghost>Next →</AdminBtn>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

function FilterChip({ label, value, coral, ghost, icon }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 10px',
                  borderRadius: 999, fontSize: 11, fontWeight: 700,
                  background: ghost ? 'transparent' : (coral ? MRN.coralSoft : '#fff'),
                  color: coral ? MRN.coralDeep : MRN.inkSoft,
                  border: ghost ? `1px dashed ${MRN.rule}` : `1px solid ${coral ? MRN.coral : MRN.rule}` }}>
      {icon && <Icon d={icon} size={10} sw={2.2}/>}
      {label && <span style={{ color: MRN.mute, fontWeight: 600 }}>{label}:</span>}
      <span>{value}</span>
      {!ghost && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" style={{ opacity: 0.5, marginLeft: 2 }}><path d="M6 9l6 6 6-6"/></svg>}
    </div>
  );
}

// ── 5. Lesson editor — split: source + live preview + block toolbar
function AdminLessonEditor() {
  return (
    <AdminShell
      active="lessons"
      title="Props & children: passing data down"
      sub="M02 · Lesson 03 · 5 min read · last saved 12s ago"
      breadcrumbs={['Content', 'Lessons', 'M02 · Components & JSX', 'L03 · Props & children']}
      headerActions={<>
        <span style={{ fontSize: 11, fontWeight: 700, color: MRN.ok, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, background: MRN.ok }}/> Auto-saved
        </span>
        <AdminBtn icon={I.clock}>History</AdminBtn>
        <AdminBtn icon={I.play}>Preview in app</AdminBtn>
        <AdminBtn primary icon={I.check} kbd="⌘P">Publish</AdminBtn>
      </>}
    >
      <div style={{ height: '100%', display: 'grid', gridTemplateColumns: '180px 1fr 380px', overflow: 'hidden' }}>
        {/* LEFT: block palette / outline */}
        <div style={{ borderRight: `1px solid ${MRN.rule}`, background: '#FCFAF5', padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden' }}>
          <div>
            <FieldLabel>BLOCKS</FieldLabel>
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 3 }}>
              {[
                ['Heading', I.edit, '⌘1'],
                ['Paragraph', I.layers, '⌘2'],
                ['Code block', I.code, '⌘C'],
                ['Callout', I.sparkle, '⌘K'],
                ['Image', I.download, '⌘I'],
                ['Quote', I.bookmark, '⌘Q'],
                ['Divider', I.more, '—'],
              ].map(([t, ic, k]) => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px', borderRadius: 6,
                                       background: t === 'Code block' ? MRN.coralSoft : 'transparent', fontSize: 12, fontWeight: 700,
                                       color: t === 'Code block' ? MRN.coralDeep : MRN.inkSoft }}>
                  <Icon d={ic} size={12}/>
                  <span style={{ flex: 1 }}>{t}</span>
                  <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, opacity: 0.5 }}>{k}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <FieldLabel>OUTLINE</FieldLabel>
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 1, fontSize: 11, fontWeight: 600, color: MRN.inkSoft }}>
              {[
                ['H2', 'Props & children'],
                ['H3', 'Basic example'],
                ['H3', 'Wrapping with children'],
                ['CODE', '<Card> component', 'active'],
                ['H3', 'Try it'],
                ['NOTE', 'Challenge: React.Children.map'],
              ].map(([k, t, a], i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 6px', borderRadius: 4,
                                       background: a === 'active' ? MRN.cardAlt : 'transparent',
                                       color: a === 'active' ? MRN.ink : MRN.inkSoft, fontWeight: a === 'active' ? 700 : 600 }}>
                  <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: MRN.mute, width: 30 }}>{k}</span>
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 'auto' }}>
            <FieldLabel>METADATA</FieldLabel>
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4, fontSize: 11, color: MRN.inkSoft }}>
              <Meta k="ID" v="m02-l03" mono/>
              <Meta k="Words" v="412"/>
              <Meta k="Read" v="5 min"/>
              <Meta k="Order" v="3 of 8"/>
              <Meta k="Tags" v="props · jsx"/>
            </div>
          </div>
        </div>

        {/* CENTER: editor — content blocks */}
        <div style={{ display: 'flex', flexDirection: 'column', borderRight: `1px solid ${MRN.rule}`, overflow: 'hidden' }}>
          {/* Toolbar */}
          <div style={{ padding: '8px 14px', borderBottom: `1px solid ${MRN.rule}`,
                        display: 'flex', alignItems: 'center', gap: 4, background: '#fff', flexWrap: 'wrap' }}>
            {['H1','H2','H3'].map(t => (
              <div key={t} style={{ padding: '4px 8px', borderRadius: 5, background: t === 'H2' ? MRN.cardAlt : 'transparent', fontSize: 11, fontWeight: 800, color: MRN.inkSoft }}>{t}</div>
            ))}
            <div style={{ width: 1, height: 16, background: MRN.rule, margin: '0 4px' }}/>
            {[['B', 'bold'], ['I', 'italic'], ['U', 'underline'], ['S', 'strike']].map(([t, k]) => (
              <div key={k} style={{ width: 26, height: 26, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: MRN.inkSoft }}>{t}</div>
            ))}
            <div style={{ width: 1, height: 16, background: MRN.rule, margin: '0 4px' }}/>
            {['• List', '1. List', '“ Quote', '</> Code', '🔗 Link', '🖼 Image'].map(t => (
              <div key={t} style={{ padding: '4px 8px', borderRadius: 5, fontSize: 11, fontWeight: 700, color: MRN.inkSoft }}>{t}</div>
            ))}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: MRN.mute, fontWeight: 700 }}>
              <span>412 words</span>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', padding: '1px 4px', borderRadius: 3, background: MRN.cardAlt }}>⌘/</span>
              <span>menu</span>
            </div>
          </div>

          {/* Content area */}
          <div style={{ flex: 1, overflow: 'hidden', padding: '20px 40px', background: '#fff' }}>
            {/* H2 block */}
            <EditorBlock kind="H2">
              <div style={{ fontSize: 26, fontWeight: 800, color: MRN.ink, letterSpacing: -0.3, lineHeight: 1.15 }}>Props & children</div>
            </EditorBlock>
            <EditorBlock kind="P">
              <div style={{ fontSize: 14, color: MRN.inkSoft, lineHeight: 1.65 }}>
                Components accept inputs called <b style={{ color: MRN.ink }}>props</b>. They flow from parent to child and are read-only inside the component that receives them.
              </div>
            </EditorBlock>
            <EditorBlock kind="H3">
              <div style={{ fontSize: 18, fontWeight: 800, color: MRN.ink }}>Basic example</div>
            </EditorBlock>
            <EditorBlock kind="CODE" focused>
              <div style={{ background: '#16110d', borderRadius: 10, padding: '12px 16px',
                            fontFamily: '"JetBrains Mono", monospace', fontSize: 12, lineHeight: 1.7, color: '#F5EFE6', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 8, right: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(245,239,230,0.5)' }}>jsx</span>
                  <div style={{ padding: '2px 6px', borderRadius: 4, background: 'rgba(255,255,255,0.1)', fontSize: 10, fontWeight: 700, color: '#fff' }}>copy</div>
                </div>
                <div><span style={{ color: '#FFB199' }}>function</span> <span style={{ color: '#F5C24B' }}>Card</span>({'{ children }'}) {'{'}</div>
                <div style={{ paddingLeft: 12 }}><span style={{ color: '#FFB199' }}>return</span> (</div>
                <div style={{ paddingLeft: 24 }}>&lt;<span style={{ color: '#9EC9A8' }}>View</span> style={'{styles.card}'}&gt;</div>
                <div style={{ paddingLeft: 36 }}>{'{children}'}</div>
                <div style={{ paddingLeft: 24 }}>&lt;/<span style={{ color: '#9EC9A8' }}>View</span>&gt;</div>
                <div style={{ paddingLeft: 12 }}>)</div>
                <div>{'}'}<span style={{ background: MRN.coral, display: 'inline-block', width: 6, height: 14, verticalAlign: '-2px', marginLeft: 2 }}/></div>
              </div>
            </EditorBlock>
            <EditorBlock kind="P">
              <div style={{ fontSize: 14, color: MRN.inkSoft, lineHeight: 1.65 }}>
                Use it like any other component — the JSX between the tags becomes <code style={{ background: MRN.cardAlt, padding: '1px 6px', borderRadius: 4, fontFamily: '"JetBrains Mono", monospace', fontSize: 12 }}>props.children</code>.
              </div>
            </EditorBlock>
            <EditorBlock kind="NOTE">
              <div style={{ padding: 14, borderRadius: 12, background: MRN.yellowSoft, border: `1px dashed ${MRN.yellow}`,
                            fontSize: 13, color: MRN.inkSoft, lineHeight: 1.55 }}>
                <b style={{ color: MRN.ink }}>Challenge:</b> wrap two <code>&lt;Text&gt;</code> nodes inside <code>&lt;Card&gt;</code> and add a divider between them using <code>React.Children.map</code>.
              </div>
            </EditorBlock>
            {/* Add block */}
            <div style={{ marginTop: 16, padding: '10px 12px', border: `1px dashed ${MRN.rule}`, borderRadius: 8,
                          display: 'flex', alignItems: 'center', gap: 8, color: MRN.mute, fontSize: 12, fontWeight: 600 }}>
              <Icon d={I.plus} size={12}/> Type <span style={{ fontFamily: '"JetBrains Mono", monospace', padding: '1px 4px', borderRadius: 3, background: MRN.cardAlt, color: MRN.inkSoft, fontWeight: 700 }}>/</span> to add a block
            </div>
          </div>
        </div>

        {/* RIGHT: live preview */}
        <div style={{ background: '#FCFAF5', padding: 14, display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FieldLabel>LIVE PREVIEW</FieldLabel>
            <div style={{ display: 'flex', gap: 4 }}>
              {['Mobile', 'Web'].map((t, i) => (
                <div key={t} style={{ padding: '4px 10px', borderRadius: 5, fontSize: 11, fontWeight: 700,
                                      background: i === 0 ? MRN.ink : '#fff',
                                      color: i === 0 ? '#fff' : MRN.inkSoft, border: i === 0 ? 'none' : `1px solid ${MRN.rule}` }}>{t}</div>
              ))}
            </div>
          </div>
          {/* Mini phone */}
          <div style={{
            margin: '0 auto', width: 320, height: 600, borderRadius: 40, background: MRN.cream,
            boxShadow: '0 20px 40px rgba(0,0,0,0.18), 0 0 0 8px #16110d',
            padding: '36px 16px 20px', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', width: 86, height: 24, borderRadius: 18, background: '#16110d' }}/>
            {/* slim header */}
            <div style={{ background: MRN.ink, borderRadius: 16, padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ width: 28, height: 28, borderRadius: 14, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Icon d={I.arrowL} size={12}/>
              </div>
              <div style={{ color: '#fff', fontSize: 11, fontWeight: 800 }}>Lesson 3/8</div>
              <div style={{ width: 28, height: 28, borderRadius: 14, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: MRN.coral }}>
                <Icon d={I.heart} size={12} fill={MRN.coral}/>
              </div>
            </div>
            <div style={{ padding: '10px 4px 0' }}>
              <div style={{ display: 'inline-block', padding: '3px 9px', borderRadius: 999, background: MRN.coralSoft, color: MRN.coralDeep, fontSize: 10, fontWeight: 800 }}>Components & JSX</div>
              <div style={{ marginTop: 8, fontSize: 22, fontWeight: 800, lineHeight: 1.05, color: MRN.ink, letterSpacing: -0.3 }}>Props & children</div>
              <div style={{ marginTop: 8, fontSize: 12, color: MRN.inkSoft, lineHeight: 1.55 }}>
                Components accept inputs called <b style={{ color: MRN.ink }}>props</b>. They flow parent → child and are read-only.
              </div>
              <div style={{ marginTop: 12, fontSize: 14, fontWeight: 800, color: MRN.ink }}>Basic example</div>
              <div style={{ marginTop: 8, background: '#16110d', borderRadius: 10, padding: '10px 12px',
                            fontFamily: '"JetBrains Mono", monospace', fontSize: 10, lineHeight: 1.6, color: '#F5EFE6' }}>
                <div><span style={{ color: '#FFB199' }}>function</span> <span style={{ color: '#F5C24B' }}>Card</span>({'{ children }'}) {'{'}</div>
                <div style={{ paddingLeft: 10 }}>return &lt;<span style={{ color: '#9EC9A8' }}>View</span>&gt;{'{children}'}&lt;/&gt;</div>
                <div>{'}'}</div>
              </div>
              <div style={{ marginTop: 10, padding: 10, borderRadius: 10, background: MRN.yellowSoft, border: `1px dashed ${MRN.yellow}`, fontSize: 11, color: MRN.inkSoft }}>
                <b style={{ color: MRN.ink }}>Challenge:</b> wrap two <code>&lt;Text&gt;</code> nodes inside <code>&lt;Card&gt;</code>.
              </div>
            </div>
          </div>
          {/* Below preview: build info */}
          <div style={{ background: '#fff', border: `1px solid ${MRN.rule}`, borderRadius: 10, padding: 10, display: 'flex', flexDirection: 'column', gap: 4, fontSize: 11 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: MRN.mute, fontWeight: 600 }}>Sanitized</span><span style={{ color: MRN.ok, fontWeight: 700 }}>DOMPurify ✓</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: MRN.mute, fontWeight: 600 }}>Syntax</span><span style={{ color: MRN.ok, fontWeight: 700 }}>highlight.js ✓</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: MRN.mute, fontWeight: 600 }}>Render time</span><span style={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 700, color: MRN.inkSoft }}>14 ms</span></div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

function Meta({ k, v, mono }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 6px' }}>
      <span style={{ color: MRN.mute, fontWeight: 600 }}>{k}</span>
      <span style={{ color: MRN.ink, fontWeight: 700, fontFamily: mono ? '"JetBrains Mono", monospace' : MRN.font }}>{v}</span>
    </div>
  );
}

function EditorBlock({ kind, focused, children }) {
  return (
    <div style={{
      position: 'relative', padding: '8px 0', marginLeft: -10, paddingLeft: 10, borderRadius: 6,
      background: focused ? '#FFF5F1' : 'transparent',
      borderLeft: focused ? `2px solid ${MRN.coral}` : '2px solid transparent',
    }}>
      <div style={{ position: 'absolute', left: -32, top: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
        <div style={{ width: 14, height: 14, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', color: MRN.mute }}>
          <Icon d={I.plus} size={10} sw={2}/>
        </div>
        <div style={{ width: 10, height: 14, color: MRN.mute, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="8" height="12" viewBox="0 0 10 14"><circle cx="2" cy="3" r="1" fill="currentColor"/><circle cx="2" cy="7" r="1" fill="currentColor"/><circle cx="2" cy="11" r="1" fill="currentColor"/><circle cx="8" cy="3" r="1" fill="currentColor"/><circle cx="8" cy="7" r="1" fill="currentColor"/><circle cx="8" cy="11" r="1" fill="currentColor"/></svg>
        </div>
      </div>
      {children}
    </div>
  );
}

Object.assign(window, { AdminShell, AdminDashboard, AdminModules, AdminModuleEdit, AdminLessons, AdminLessonEditor });
