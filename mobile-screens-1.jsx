// Mobile screens 1: Splash, Home, Modules list, Module detail, Lesson reader top, Lesson code

function ScreenSplash() {
  return (
    <Phone>
      <style>{`
        @keyframes mrn-orbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes mrn-pulse { 0%,100% { opacity: 0.35; transform: translate(-50%,-50%) scale(0.95); } 50% { opacity: 0.6; transform: translate(-50%,-50%) scale(1.05); } }
        @keyframes mrn-rise { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .mrn-orbit-spin { transform-origin: 110px 110px; animation: mrn-orbit 14s linear infinite; }
        .mrn-orbit-spin-rev { transform-origin: 110px 110px; animation: mrn-orbit 22s linear infinite reverse; }
        .mrn-glow { animation: mrn-pulse 4s ease-in-out infinite; }
        .mrn-rise-1 { animation: mrn-rise 0.7s ease-out 0.15s both; }
        .mrn-rise-2 { animation: mrn-rise 0.7s ease-out 0.35s both; }
        .mrn-rise-3 { animation: mrn-rise 0.7s ease-out 0.55s both; }
      `}</style>
      <div style={{ flex: 1, background: '#0B0907', position: 'relative', overflow: 'hidden',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {/* soft coral pulse behind logo */}
        <div className="mrn-glow" style={{
          position: 'absolute', top: '42%', left: '50%',
          width: 240, height: 240, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(242,106,74,0.28) 0%, rgba(242,106,74,0) 65%)',
          filter: 'blur(6px)', pointerEvents: 'none',
        }}/>

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 36px' }}>
          {/* Coral squircle with dark React Native atom */}
          <div className="mrn-rise-1" style={{ margin: '0 auto 22px', width: 92, height: 92 }}>
            <svg width="92" height="92" viewBox="0 0 220 220" style={{ display: 'block' }}>
              <path d="M110 6c52 0 78 0 92 14s14 40 14 92-0 78-14 92-40 14-92 14-78 0-92-14S4 174 4 122s-0-78 14-92S58 6 110 6Z" fill={MRN.coral}/>
              <g fill="none" stroke="#1A1410" strokeWidth="7">
                <ellipse cx="110" cy="110" rx="84" ry="32"/>
                <ellipse cx="110" cy="110" rx="84" ry="32" transform="rotate(60 110 110)"/>
                <ellipse cx="110" cy="110" rx="84" ry="32" transform="rotate(120 110 110)"/>
              </g>
              <circle cx="110" cy="110" r="14" fill="#1A1410"/>
            </svg>
          </div>

          {/* Wordmark — "Master RN" */}
          <div className="mrn-rise-2" style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.7, lineHeight: 1, color: '#fff' }}>
            Master <span style={{ color: MRN.coral }}>RN</span>
          </div>

          {/* Tagline — tight, flanked by accent lines */}
          <div className="mrn-rise-3" style={{
            marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <div style={{ width: 18, height: 1, background: 'rgba(242,106,74,0.5)' }}/>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.55)',
              letterSpacing: 1.4, display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <span style={{ color: MRN.coral, opacity: 0.85 }}>//</span>
              <span>LEARN</span>
              <span style={{ color: MRN.coral, opacity: 0.7 }}>·</span>
              <span>SHIP</span>
              <span style={{ color: MRN.coral, opacity: 0.7 }}>·</span>
              <span>NATIVE</span>
            </div>
            <div style={{ width: 18, height: 1, background: 'rgba(242,106,74,0.5)' }}/>
          </div>
        </div>

        {/* version footer */}
        <div style={{
          position: 'absolute', bottom: 24, left: 0, right: 0, textAlign: 'center',
          fontFamily: '"JetBrains Mono", monospace', fontSize: 9, fontWeight: 700,
          color: 'rgba(255,255,255,0.3)', letterSpacing: 1.5,
        }}>
          v1.0.0
        </div>
      </div>
    </Phone>
  );
}

function ScreenHome() {
  const categories = [
    { t: 'All', active: true },
    { t: 'Beginner' },
    { t: 'Hooks' },
    { t: 'Navigation' },
    { t: 'Native APIs' },
    { t: 'UI / Animation' },
  ];
  const starters = [
    { n: '01', t: 'What is React Native?', mod: 'Foundations', time: '4 min', tag: 'Start here', new: true },
    { n: '02', t: 'JSX in 5 minutes', mod: 'Components & JSX', time: '5 min' },
    { n: '03', t: 'Your first screen', mod: 'Foundations', time: '7 min' },
  ];
  return (
    <Phone>
      <TopHeader/>
      <div style={{ flex: 1, overflow: 'hidden', padding: '4px 16px 96px' }}>
        {/* Continue card — slim */}
        <div style={{ background: MRN.ink, borderRadius: 22, padding: '14px 16px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -30, right: -20, width: 120, height: 120, borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(242,106,74,0.35) 0%, rgba(242,106,74,0) 70%)' }}/>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative' }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: MRN.coral, color: '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon d={I.play} size={18} fill="#fff"/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: 1.2 }}>CONTINUE · M02 · L03</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginTop: 2 }}>Props & children</div>
              <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.12)', position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, width: '37%', borderRadius: 2, background: MRN.coral }}/>
                </div>
                <span style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.7)' }}>3/8</span>
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: MRN.ink, letterSpacing: -0.3 }}>Explore</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: MRN.coralDeep }}>See all →</div>
        </div>
        <div style={{
          marginTop: 10, display: 'flex', gap: 6, overflowX: 'auto', padding: '2px 4px 4px 0',
          WebkitMaskImage: 'linear-gradient(90deg, #000 0, #000 92%, transparent 100%)',
        }}>
          {categories.map(c => (
            <div key={c.t} style={{
              flexShrink: 0, padding: '8px 14px', borderRadius: 999,
              background: c.active ? MRN.ink : MRN.card,
              color: c.active ? '#fff' : MRN.inkSoft,
              fontSize: 12, fontWeight: 800, whiteSpace: 'nowrap',
              border: c.active ? '1px solid transparent' : `1px solid ${MRN.rule}`,
            }}>{c.t}</div>
          ))}
        </div>

        {/* Start here list */}
        <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: MRN.ink, letterSpacing: -0.3 }}>Start here</div>
            <div style={{ padding: '3px 8px', borderRadius: 999, background: MRN.coralSoft, color: MRN.coralDeep,
                          fontSize: 9, fontWeight: 800, letterSpacing: 0.5 }}>NEW</div>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: MRN.mute }}>3 lessons</div>
        </div>
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {starters.map((l, i) => (
            <div key={l.n} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: MRN.card, borderRadius: 16, padding: '10px 12px',
              border: i === 0 ? `1.5px solid ${MRN.coral}` : `1px solid ${MRN.rule}`,
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 12,
                background: i === 0 ? MRN.coral : MRN.cardAlt,
                color: i === 0 ? '#fff' : MRN.inkSoft,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: '"JetBrains Mono", monospace', fontSize: 11, fontWeight: 800,
              }}>{l.n}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: MRN.ink, lineHeight: 1.2 }}>{l.t}</div>
                <div style={{ fontSize: 10, color: MRN.mute, fontWeight: 700, marginTop: 2 }}>{l.mod} · {l.time}</div>
              </div>
              <div style={{ color: i === 0 ? MRN.coral : MRN.mute }}>
                <Icon d={I.arrowR} size={16}/>
              </div>
            </div>
          ))}
        </div>

        {/* Featured */}
        <div style={{ marginTop: 18, fontSize: 18, fontWeight: 800, color: MRN.ink, letterSpacing: -0.3 }}>Featured module</div>
        <div style={{ marginTop: 10, position: 'relative', borderRadius: 22, overflow: 'hidden', background: MRN.yellow, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Chip color="#fff8dc" fg={MRN.ink}>Module 03 · Hooks</Chip>
            <div style={{ width: 28, height: 28, borderRadius: 14, background: MRN.ink, color: '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon d={I.arrowUp} size={13} style={{ transform: 'rotate(45deg)' }}/>
            </div>
          </div>
          <div style={{ marginTop: 8, fontSize: 20, fontWeight: 800, lineHeight: 1.1, color: MRN.ink, maxWidth: 200 }}>
            useState, useEffect, useMemo
          </div>
          <div style={{ marginTop: 12 }}>
            <PillButton dark>START NOW</PillButton>
          </div>
          <svg viewBox="0 0 80 80" width="68" height="68" style={{ position: 'absolute', right: 14, bottom: 8 }}>
            <circle cx="40" cy="40" r="32" fill={MRN.ink}/>
            <text x="40" y="49" textAnchor="middle" fontFamily='"JetBrains Mono", monospace' fontSize="18" fontWeight="800" fill={MRN.coral}>{'</>'}</text>
          </svg>
        </div>
      </div>
      <TabBar active="home"/>
    </Phone>
  );
}

function ScreenModules() {
  const mods = [
    { n: '01', t: 'Foundations', d: 'JS & RN basics', lessons: 6, time: '42m', art: 'a', done: 6 },
    { n: '02', t: 'Components & JSX', d: 'Building blocks', lessons: 8, time: '1h 04m', art: 'b', done: 3 },
    { n: '03', t: 'Navigation', d: 'Stack, tabs, drawer', lessons: 6, time: '48m', art: 'c', done: 0 },
    { n: '04', t: 'State & Hooks', d: 'useState → context', lessons: 9, time: '1h 22m', art: 'd', done: 0 },
  ];
  return (
    <Phone>
      <div style={{ padding: '14px 20px 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ width: 38, height: 38, borderRadius: 19, background: MRN.card,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: MRN.ink }}>
            <Icon d={I.arrowL} size={18}/>
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: MRN.ink }}>All Modules</div>
          <div style={{ width: 38, height: 38, borderRadius: 19, background: MRN.card,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: MRN.ink }}>
            <Icon d={I.filter} size={16}/>
          </div>
        </div>
        <div style={{ marginTop: 14, fontSize: 30, fontWeight: 800, color: MRN.ink, letterSpacing: -0.6 }}>Learning Path</div>
        <div style={{ marginTop: 4, fontSize: 13, color: MRN.mute, fontWeight: 500 }}>29 lessons · 4h 16m total</div>
      </div>
      <div style={{ flex: 1, overflow: 'hidden', padding: '14px 16px 96px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {mods.map(m => {
          const pct = Math.round((m.done / m.lessons) * 100);
          return (
            <div key={m.n} style={{
              background: MRN.card, borderRadius: 22, padding: 14,
              display: 'flex', gap: 12, alignItems: 'center',
            }}>
              <div style={{ width: 70, height: 78, borderRadius: 16, overflow: 'hidden', flexShrink: 0 }}>
                <GeoArt variant={m.art} style={{ width: '100%', height: '100%', display: 'block' }}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, fontWeight: 700, color: MRN.coralDeep, letterSpacing: 1 }}>MODULE {m.n}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: MRN.ink, marginTop: 2 }}>{m.t}</div>
                <div style={{ fontSize: 11, color: MRN.mute, fontWeight: 600, marginTop: 2 }}>{m.lessons} lessons · {m.time}</div>
                <div style={{ marginTop: 8, height: 5, borderRadius: 3, background: MRN.cardAlt, position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, width: `${pct}%`, borderRadius: 3, background: pct === 100 ? MRN.ok : MRN.coral }}/>
                </div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 800, color: MRN.inkSoft }}>{pct}%</div>
            </div>
          );
        })}
      </div>
      <TabBar active="explore"/>
    </Phone>
  );
}

function ScreenModuleDetail() {
  const lessons = [
    { n: 1, t: 'What is JSX?', time: '4 min', done: true, book: false },
    { n: 2, t: 'Functional components', time: '6 min', done: true, book: true },
    { n: 3, t: 'Props & children', time: '5 min', done: false, book: false, current: true },
    { n: 4, t: 'Composition patterns', time: '7 min', done: false, book: false },
    { n: 5, t: 'Conditional rendering', time: '5 min', done: false, book: true },
    { n: 6, t: 'Lists & keys', time: '6 min', done: false, book: false },
  ];
  return (
    <Phone>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {/* Hero — black with subtle code-grid effect */}
        <div style={{ position: 'relative', margin: '8px 16px 0', borderRadius: 26, overflow: 'hidden', background: MRN.ink, padding: '16px 18px 18px' }}>
          {/* Decorative code pattern */}
          <svg viewBox="0 0 320 200" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.5, pointerEvents: 'none' }}>
            <defs>
              <pattern id="mrnGrid" width="22" height="22" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="0.8" fill="rgba(255,255,255,0.08)"/>
              </pattern>
              <linearGradient id="mrnFade" x1="0" x2="1">
                <stop offset="0" stopColor="#161311" stopOpacity="0"/>
                <stop offset="1" stopColor="#161311" stopOpacity="0.95"/>
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#mrnGrid)"/>
            <rect width="100%" height="100%" fill="url(#mrnFade)"/>
          </svg>
          {/* Glow accent + monospace ghost glyph */}
          <div style={{ position: 'absolute', top: -40, right: -30, width: 160, height: 160, borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(242,106,74,0.35) 0%, rgba(242,106,74,0) 70%)', pointerEvents: 'none' }}/>
          <div style={{ position: 'absolute', top: 14, right: 14, fontFamily: '"JetBrains Mono", monospace',
                        fontSize: 88, fontWeight: 800, color: 'rgba(242,106,74,0.10)', lineHeight: 0.85, letterSpacing: -4, pointerEvents: 'none' }}>{'</>'}</div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
            <div style={{ width: 38, height: 38, borderRadius: 19, background: 'rgba(255,255,255,0.12)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Icon d={I.arrowL} size={18}/>
            </div>
            <div style={{ width: 38, height: 38, borderRadius: 19, background: 'rgba(255,255,255,0.12)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', color: MRN.coral }}>
              <Icon d={I.heart} size={18}/>
            </div>
          </div>

          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
              <div style={{ width: 4, height: 14, borderRadius: 2, background: MRN.coral }}/>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, fontWeight: 700, color: MRN.coral, letterSpacing: 1.4 }}>MODULE 02</div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', lineHeight: 1.05, marginTop: 6 }}>Components<br/>& JSX</div>
            <div style={{ marginTop: 14, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <Chip color="rgba(255,255,255,0.10)" fg="#fff">8 lessons</Chip>
              <Chip color="rgba(255,255,255,0.10)" fg="#fff">1h 04m</Chip>
              <Chip color={MRN.coral} fg="#fff">Beginner</Chip>
            </div>
          </div>
        </div>

        {/* Prerequisites — single-line coral pill slider */}
        <div style={{ marginTop: 14, padding: '0 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px 8px' }}>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, fontWeight: 700, letterSpacing: 1.4, color: MRN.mute }}>PREREQUISITES</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: MRN.coralDeep }}>swipe →</div>
          </div>
          <div style={{
            display: 'flex', gap: 6, overflowX: 'auto', padding: '2px 4px 4px',
            WebkitMaskImage: 'linear-gradient(90deg, #000 0, #000 88%, transparent 100%)',
          }}>
            {['JavaScript', 'ES6 syntax', 'Module 01', 'NPM basics'].map(p => (
              <div key={p} style={{
                flexShrink: 0, padding: '8px 14px', borderRadius: 999,
                background: MRN.coralSoft, border: `1px solid ${MRN.coral}`,
                fontSize: 12, fontWeight: 800, color: MRN.coralDeep, whiteSpace: 'nowrap',
              }}>{p}</div>
            ))}
          </div>
        </div>

        <div style={{ padding: '14px 16px 96px' }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: MRN.ink, padding: '0 4px 8px' }}>Lessons</div>
          <div style={{ background: MRN.card, borderRadius: 22, padding: 6 }}>
            {lessons.map((l, i) => (
              <div key={l.n} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 12px',
                borderBottom: i < lessons.length - 1 ? `1px solid ${MRN.rule}` : 'none',
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 17, flexShrink: 0,
                  background: l.done ? MRN.ok : (l.current ? MRN.coral : MRN.cardAlt),
                  color: l.done || l.current ? '#fff' : MRN.inkSoft,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800,
                }}>
                  {l.done ? <Icon d={I.check} size={16} sw={2.4}/> : l.n}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: MRN.ink }}>{l.t}</div>
                  <div style={{ fontSize: 11, color: MRN.mute, fontWeight: 600, marginTop: 2 }}>{l.time}{l.done ? ' · Completed' : (l.current ? ' · In progress' : '')}</div>
                </div>
                <div style={{ color: l.book ? MRN.coral : MRN.mute }}>
                  <Icon d={I.bookmark} size={18} fill={l.book ? MRN.coral : 'none'}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <TabBar active="explore"/>
    </Phone>
  );
}

function ScreenLessonReader() {
  return (
    <Phone>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {/* Hero — black, compact */}
        <div style={{ position: 'relative', margin: '8px 16px 0', borderRadius: 20, overflow: 'hidden', background: MRN.ink, padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ width: 34, height: 34, borderRadius: 17, background: 'rgba(255,255,255,0.12)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Icon d={I.arrowL} size={15}/>
            </div>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>Lesson 3/8</div>
            <div style={{ width: 34, height: 34, borderRadius: 17, background: 'rgba(255,255,255,0.12)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', color: MRN.coral }}>
              <Icon d={I.heart} size={15} fill={MRN.coral}/>
            </div>
          </div>
        </div>

        {/* Card */}
        <div style={{ padding: '14px 22px 96px' }}>
          <Chip color={MRN.coralSoft} fg={MRN.coralDeep}>📘 Components & JSX</Chip>
          <div style={{ fontSize: 26, fontWeight: 800, color: MRN.ink, lineHeight: 1.1, marginTop: 12, letterSpacing: -0.4 }}>
            Props & children:<br/>passing data down
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 12, fontSize: 12, color: MRN.mute, fontWeight: 700 }}>
            <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center', color: MRN.inkSoft }}>
              <Icon d={I.clock} size={14}/> 5 min read
            </span>
            <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center', color: MRN.inkSoft }}>
              <Icon d={I.layers} size={14}/> 4 examples
            </span>
          </div>
          <div style={{ marginTop: 16, fontSize: 14, lineHeight: 1.6, color: MRN.inkSoft }}>
            Components accept inputs called <b style={{ color: MRN.ink }}>props</b>. They flow from parent to child and are read-only inside the component that receives them.
          </div>
          <div style={{ marginTop: 16, fontSize: 16, fontWeight: 800, color: MRN.ink }}>Basic example</div>
          <div style={{ marginTop: 10 }}>
            <CodeBlock lines={[
              `<span style="color:#FFB199">function</span> <span style="color:#F5C24B">Greeting</span>({ name }) {`,
              `  <span style="color:#FFB199">return</span> &lt;<span style="color:#9EC9A8">Text</span>&gt;Hi, {name}!&lt;/&gt;`,
              `}`,
            ]}/>
          </div>
        </div>
      </div>
    </Phone>
  );
}

function ScreenLessonCode() {
  return (
    <Phone>
      {/* sticky mini-header */}
      <div style={{ padding: '8px 16px 0' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: MRN.card, borderRadius: 22, padding: '8px 10px',
        }}>
          <div style={{ width: 32, height: 32, borderRadius: 16, background: MRN.cardAlt,
                        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon d={I.arrowL} size={14}/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: MRN.mute }}>Lesson 3/8 · 60% read</div>
            <div style={{ height: 4, borderRadius: 2, background: MRN.cardAlt, marginTop: 4, position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, width: '60%', borderRadius: 2, background: MRN.coral }}/>
            </div>
          </div>
          <div style={{ width: 32, height: 32, borderRadius: 16, background: MRN.cardAlt,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: MRN.coral }}>
            <Icon d={I.bookmark} size={14} fill={MRN.coral}/>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', padding: '14px 22px 120px' }}>
        <div style={{ fontSize: 15, lineHeight: 1.65, color: MRN.inkSoft }}>
          Children let a component wrap arbitrary content. Pair them with <code style={{ background: MRN.cardAlt, padding: '1px 6px', borderRadius: 6, fontFamily: '"JetBrains Mono", monospace', fontSize: 12 }}>React.Children</code> when you need to inspect what was passed in.
        </div>

        <div style={{ fontSize: 17, fontWeight: 800, color: MRN.ink, marginTop: 18 }}>1. Wrapping with children</div>
        <div style={{ marginTop: 10 }}>
          <CodeBlock lines={[
            `<span style="color:#FFB199">function</span> <span style="color:#F5C24B">Card</span>({ children }) {`,
            `  <span style="color:#FFB199">return</span> (`,
            `    &lt;<span style="color:#9EC9A8">View</span> style={styles.card}&gt;`,
            `      {children}`,
            `    &lt;/<span style="color:#9EC9A8">View</span>&gt;`,
            `  )`,
            `}`,
          ]}/>
        </div>

        <div style={{ marginTop: 14, fontSize: 14, lineHeight: 1.65, color: MRN.inkSoft }}>
          Use it like any other component — the JSX between the tags becomes <code style={{ background: MRN.cardAlt, padding: '1px 6px', borderRadius: 6, fontFamily: '"JetBrains Mono", monospace', fontSize: 12 }}>props.children</code>.
        </div>

        <div style={{ fontSize: 17, fontWeight: 800, color: MRN.ink, marginTop: 18 }}>Try it</div>
        <div style={{
          marginTop: 10, padding: 14, borderRadius: 18,
          background: MRN.yellowSoft, border: `1px dashed ${MRN.yellow}`,
          fontSize: 13, color: MRN.inkSoft,
        }}>
          <b style={{ color: MRN.ink }}>Challenge:</b> wrap two <code>&lt;Text&gt;</code> nodes inside <code>&lt;Card&gt;</code> and add a divider between them using <code>React.Children.map</code>.
        </div>

        {/* footer — slide to complete */}
        <div style={{
          position: 'absolute', left: 16, right: 16, bottom: 90,
          background: MRN.ink, borderRadius: 999, padding: 4, height: 56,
          display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
        }}>
          {/* progress fill */}
          <div style={{
            position: 'absolute', top: 4, bottom: 4, left: 4, width: '38%',
            borderRadius: 999, background: `linear-gradient(90deg, ${MRN.coralDeep}, ${MRN.coral})`,
            opacity: 0.18,
          }}/>
          {/* knob */}
          <div style={{
            width: 48, height: 48, borderRadius: 24, background: MRN.coral,
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
            position: 'relative', zIndex: 1,
            boxShadow: '0 6px 16px rgba(242,106,74,0.45)',
          }}>
            <Icon d={I.arrowR} size={18} sw={2.4}/>
          </div>
          {/* label */}
          <div style={{ flex: 1, textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#fff', letterSpacing: 0.3 }}>Slide to complete</div>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: 1.2, marginTop: 1 }}>
              LESSON 3 / 8
            </div>
          </div>
          {/* check hint */}
          <div style={{
            width: 32, height: 32, borderRadius: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(255,255,255,0.35)', marginRight: 10, position: 'relative', zIndex: 1,
          }}>
            <Icon d={I.check} size={16} sw={2.4}/>
          </div>
        </div>
      </div>
    </Phone>
  );
}

Object.assign(window, { ScreenSplash, ScreenHome, ScreenModules, ScreenModuleDetail, ScreenLessonReader, ScreenLessonCode });
