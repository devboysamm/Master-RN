// Mobile screens 2: Bookmarks, AI Chat, Profile, Settings

function ScreenBookmarks() {
  const items = [
    { mod: 'Components & JSX', t: 'Functional components', time: '6 min', art: 'a' },
    { mod: 'Navigation', t: 'Tab navigator setup', time: '8 min', art: 'c' },
    { mod: 'State & Hooks', t: 'useReducer in practice', time: '11 min', art: 'b' },
    { mod: 'Native APIs', t: 'AsyncStorage patterns', time: '5 min', art: 'd' },
  ];
  return (
    <Phone>
      <div style={{ padding: '14px 20px 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: -0.6, color: MRN.ink }}>Saved</div>
          <div style={{ width: 40, height: 40, borderRadius: 20, background: MRN.card,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: MRN.ink }}>
            <Icon d={I.filter} size={16}/>
          </div>
        </div>
        <div style={{ fontSize: 13, color: MRN.mute, fontWeight: 600, marginTop: 2 }}>Lessons you've bookmarked</div>
      </div>

      {/* summary card */}
      <div style={{ padding: '16px 16px 0' }}>
        <div style={{ background: MRN.ink, color: '#fff', borderRadius: 22, padding: 18, position: 'relative', overflow: 'hidden' }}>
          <svg viewBox="0 0 200 60" style={{ position: 'absolute', right: 0, top: 0, width: 160, height: 80, opacity: 0.6 }}>
            <circle cx="160" cy="20" r="28" fill={MRN.coral}/>
            <path d="M0 50 Q 80 0 200 40" stroke={MRN.yellow} strokeWidth="1.2" fill="none" opacity="0.7"/>
          </svg>
          <div style={{ display: 'flex', gap: 18, position: 'relative' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.55)', letterSpacing: 0.4 }}>BOOKMARKS</div>
              <div style={{ fontSize: 30, fontWeight: 800 }}>12</div>
            </div>
            <div style={{ width: 1, background: 'rgba(255,255,255,0.18)' }}/>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.55)', letterSpacing: 0.4 }}>TOTAL READ</div>
              <div style={{ fontSize: 30, fontWeight: 800 }}>1h 18m</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', padding: '16px 16px 96px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((b, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', background: MRN.card, borderRadius: 20, padding: 12 }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, overflow: 'hidden', flexShrink: 0 }}>
              <GeoArt variant={b.art} style={{ width: '100%', height: '100%', display: 'block' }}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: MRN.coralDeep, letterSpacing: 0.5 }}>{b.mod.toUpperCase()}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: MRN.ink, marginTop: 2 }}>{b.t}</div>
              <div style={{ fontSize: 11, color: MRN.mute, fontWeight: 600, marginTop: 2 }}>{b.time} read</div>
            </div>
            <div style={{ color: MRN.coral }}><Icon d={I.bookmark} size={18} fill={MRN.coral}/></div>
          </div>
        ))}
      </div>
      <TabBar active="profile"/>
    </Phone>
  );
}

function ScreenAIChat() {
  return (
    <Phone>
      <div style={{ padding: '14px 20px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ width: 38, height: 38, borderRadius: 19, background: MRN.card,
                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon d={I.arrowL} size={16}/>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 16, background: MRN.ink,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: MRN.coral, fontFamily: '"JetBrains Mono", monospace', fontWeight: 800, fontSize: 14 }}>{'<>'}</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: MRN.ink, lineHeight: 1.1 }}>Native AI</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: MRN.ok }}>● online</div>
          </div>
        </div>
        <div style={{ width: 38, height: 38, borderRadius: 19, background: MRN.card,
                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon d={I.more} size={18}/>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', padding: '8px 16px 110px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* AI bubble */}
        <div style={{ alignSelf: 'flex-start', maxWidth: '85%' }}>
          <div style={{ background: MRN.card, borderRadius: 20, borderTopLeftRadius: 6, padding: '12px 14px',
                        fontSize: 13.5, color: MRN.inkSoft, lineHeight: 1.45 }}>
            Hey John 👋 — want a quick recap of <b style={{ color: MRN.ink }}>useEffect</b>, or are you stuck on something specific?
          </div>
          <div style={{ fontSize: 10, color: MRN.mute, marginTop: 4, marginLeft: 6, fontWeight: 600 }}>9:41 AM</div>
        </div>

        {/* User bubble */}
        <div style={{ alignSelf: 'flex-end', maxWidth: '85%' }}>
          <div style={{ background: MRN.coral, color: '#fff', borderRadius: 20, borderTopRightRadius: 6, padding: '12px 14px',
                        fontSize: 13.5, lineHeight: 1.45, fontWeight: 600 }}>
            Why does my effect run twice on mount?
          </div>
        </div>

        {/* AI bubble with code */}
        <div style={{ alignSelf: 'flex-start', maxWidth: '92%' }}>
          <div style={{ background: MRN.card, borderRadius: 20, borderTopLeftRadius: 6, padding: '12px 14px',
                        fontSize: 13.5, color: MRN.inkSoft, lineHeight: 1.5 }}>
            That's StrictMode in dev. React mounts → unmounts → mounts again to surface side-effect bugs. Try this pattern:
            <div style={{ marginTop: 10 }}>
              <CodeBlock lines={[
                `<span style="color:#FFB199">useEffect</span>(() => {`,
                `  <span style="color:#FFB199">const</span> sub = api.<span style="color:#F5C24B">on</span>(...)`,
                `  <span style="color:#FFB199">return</span> () => sub.<span style="color:#F5C24B">off</span>()`,
                `}, [])`,
              ]}/>
            </div>
            <div style={{ marginTop: 10, fontSize: 13 }}>The cleanup makes double-invocation safe.</div>
          </div>
        </div>

        {/* Suggestion chips */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
          <Chip color={MRN.cardAlt} fg={MRN.ink}>Show me an example</Chip>
          <Chip color={MRN.cardAlt} fg={MRN.ink}>What's StrictMode?</Chip>
        </div>
      </div>

      {/* Composer */}
      <div style={{ position: 'absolute', left: 14, right: 14, bottom: 90, zIndex: 36,
                    background: MRN.card, borderRadius: 26, padding: '8px 8px 8px 18px',
                    display: 'flex', alignItems: 'center', gap: 8,
                    boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }}>
        <div style={{ flex: 1, fontSize: 13, color: MRN.mute, fontWeight: 600 }}>Ask anything about React Native…</div>
        <div style={{ width: 40, height: 40, borderRadius: 20, background: MRN.coral, color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon d={I.send} size={16}/>
        </div>
      </div>
      <TabBar active="chat"/>
    </Phone>
  );
}

function ScreenProfile() {
  return (
    <Phone>
      <div style={{ padding: '14px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ width: 38, height: 38, borderRadius: 19, background: MRN.card,
                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon d={I.arrowL} size={16}/>
        </div>
        <div style={{ fontSize: 14, fontWeight: 800, color: MRN.ink }}>Profile</div>
        <div style={{ width: 38, height: 38, borderRadius: 19, background: MRN.card,
                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon d={I.gear} size={16} sw={1.6}/>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', padding: '16px 16px 96px' }}>
        {/* hero — ink with dotted-grid + glow + ghost glyph */}
        <div style={{ background: MRN.ink, borderRadius: 26, padding: 18, position: 'relative', overflow: 'hidden' }}>
          {/* dotted grid */}
          <svg viewBox="0 0 320 200" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.5, pointerEvents: 'none' }}>
            <defs>
              <pattern id="mrnGridP" width="22" height="22" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="0.8" fill="rgba(255,255,255,0.08)"/>
              </pattern>
              <linearGradient id="mrnFadeP" x1="0" x2="1">
                <stop offset="0" stopColor="#161311" stopOpacity="0"/>
                <stop offset="1" stopColor="#161311" stopOpacity="0.95"/>
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#mrnGridP)"/>
            <rect width="100%" height="100%" fill="url(#mrnFadeP)"/>
          </svg>
          {/* coral glow */}
          <div style={{ position: 'absolute', top: -40, right: -30, width: 160, height: 160, borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(242,106,74,0.35) 0%, rgba(242,106,74,0) 70%)', pointerEvents: 'none' }}/>
          {/* ghost glyph */}
          <div style={{ position: 'absolute', top: 6, right: 12, fontFamily: '"JetBrains Mono", monospace',
                        fontSize: 70, fontWeight: 800, color: 'rgba(242,106,74,0.10)', lineHeight: 0.85, letterSpacing: -3, pointerEvents: 'none' }}>{'</>'}</div>

          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 32,
              background: `linear-gradient(135deg, ${MRN.coral}, ${MRN.yellow})`,
              color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 26,
              border: '3px solid rgba(255,255,255,0.15)',
            }}>J</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 3, height: 12, borderRadius: 2, background: MRN.coral }}/>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, fontWeight: 700, color: MRN.coral, letterSpacing: 1.2 }}>MEMBER · LV3</div>
              </div>
              <div style={{ color: '#fff', fontSize: 20, fontWeight: 800, letterSpacing: -0.3, marginTop: 2 }}>John Carter</div>
              <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, fontWeight: 600, marginTop: 1 }}>@johnc · joined Mar 2026</div>
            </div>
          </div>
          <div style={{ position: 'relative', marginTop: 12, display: 'flex', gap: 6 }}>
            <Chip color="rgba(255,255,255,0.10)" fg="#fff">⭐ Level 3</Chip>
            <Chip color={MRN.coral} fg="#fff">🔥 12-day streak</Chip>
          </div>
        </div>

        {/* stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 12 }}>
          {[['12', 'Lessons'], ['2', 'Modules'], ['1h 18m', 'Read time']].map(([n, l]) => (
            <div key={l} style={{ background: MRN.card, borderRadius: 16, padding: '12px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: MRN.ink }}>{n}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: MRN.mute, letterSpacing: 0.3, marginTop: 2 }}>{l.toUpperCase()}</div>
            </div>
          ))}
        </div>

        {/* menu */}
        <div style={{ marginTop: 16, background: MRN.card, borderRadius: 22, overflow: 'hidden' }}>
          {[
            ['Bookmarked lessons', I.bookmark, '12'],
            ['Completed', I.check, '12'],
            ['Downloads', I.download, '4'],
            ['Achievements', I.star, 'Level 3'],
            ['Notifications', I.bell, 'On'],
          ].map(([t, ic, r], i, a) => (
            <div key={t} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '14px 14px',
              borderBottom: i < a.length - 1 ? `1px solid ${MRN.rule}` : 'none',
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 12, background: MRN.cardAlt,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: MRN.ink }}>
                <Icon d={ic} size={16}/>
              </div>
              <div style={{ flex: 1, fontSize: 14, fontWeight: 700, color: MRN.ink }}>{t}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: MRN.mute }}>{r}</div>
              <div style={{ color: MRN.mute }}><Icon d={I.arrowR} size={14}/></div>
            </div>
          ))}
        </div>
      </div>
      <TabBar active="profile"/>
    </Phone>
  );
}

function ScreenSettings() {
  return (
    <Phone>
      <div style={{ padding: '14px 20px 4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ width: 38, height: 38, borderRadius: 19, background: MRN.card,
                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon d={I.arrowL} size={16}/>
        </div>
        <div style={{ fontSize: 14, fontWeight: 800, color: MRN.ink }}>Settings</div>
        <div style={{ width: 38 }}/>
      </div>
      <div style={{ padding: '8px 20px 0' }}>
        <div style={{ fontSize: 30, fontWeight: 800, color: MRN.ink, letterSpacing: -0.6 }}>Preferences</div>
        <div style={{ fontSize: 13, color: MRN.mute, fontWeight: 600, marginTop: 2 }}>Tweak how the app looks and behaves</div>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', padding: '16px 16px 96px' }}>
        {/* Theme card */}
        <div style={{ background: MRN.card, borderRadius: 22, padding: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: MRN.mute, letterSpacing: 0.4 }}>APPEARANCE</div>
          <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {[
              { id: 'light', label: 'Light', bg: MRN.cream, fg: MRN.ink, active: true },
              { id: 'dark', label: 'Dark', bg: MRN.ink, fg: '#fff', active: false },
              { id: 'system', label: 'System', bg: `linear-gradient(135deg, ${MRN.cream} 50%, ${MRN.ink} 50%)`, fg: MRN.ink, active: false },
            ].map(t => (
              <div key={t.id} style={{
                borderRadius: 14, padding: 10,
                background: MRN.cardAlt,
                border: t.active ? `2px solid ${MRN.coral}` : `2px solid transparent`,
              }}>
                <div style={{ height: 56, borderRadius: 10, background: t.bg, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 6, left: 6, width: 18, height: 3, borderRadius: 2, background: t.id === 'dark' ? '#fff' : MRN.ink, opacity: 0.6 }}/>
                  <div style={{ position: 'absolute', top: 12, left: 6, width: 28, height: 3, borderRadius: 2, background: t.id === 'dark' ? '#fff' : MRN.ink, opacity: 0.3 }}/>
                </div>
                <div style={{ marginTop: 6, fontSize: 12, fontWeight: 800, color: MRN.ink, textAlign: 'center' }}>{t.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* General list */}
        <div style={{ marginTop: 16, fontSize: 11, fontWeight: 700, color: MRN.mute, letterSpacing: 0.4, padding: '0 4px' }}>GENERAL</div>
        <div style={{ marginTop: 8, background: MRN.card, borderRadius: 22, overflow: 'hidden' }}>
          {[
            ['Notifications', I.bell, 'toggle-on'],
            ['Reduced motion', I.sparkle, 'toggle-off'],
            ['Offline downloads', I.download, '4 lessons'],
            ['Account & data', I.shield, ''],
            ['Reset local data', I.trash, '', true],
          ].map(([t, ic, r, danger], i, a) => (
            <div key={t} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '14px 14px',
              borderBottom: i < a.length - 1 ? `1px solid ${MRN.rule}` : 'none',
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 12, background: danger ? '#FCD9CF' : MRN.cardAlt,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: danger ? MRN.coralDeep : MRN.ink }}>
                <Icon d={ic} size={16}/>
              </div>
              <div style={{ flex: 1, fontSize: 14, fontWeight: 700, color: danger ? MRN.coralDeep : MRN.ink }}>{t}</div>
              {r === 'toggle-on' && (
                <div style={{ width: 44, height: 26, borderRadius: 13, background: MRN.coral, position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 3, right: 3, width: 20, height: 20, borderRadius: 10, background: '#fff' }}/>
                </div>
              )}
              {r === 'toggle-off' && (
                <div style={{ width: 44, height: 26, borderRadius: 13, background: MRN.cardAlt, position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 3, left: 3, width: 20, height: 20, borderRadius: 10, background: '#fff' }}/>
                </div>
              )}
              {typeof r === 'string' && !['toggle-on','toggle-off'].includes(r) && (
                <div style={{ fontSize: 12, fontWeight: 700, color: MRN.mute }}>{r}</div>
              )}
              {!danger && <div style={{ color: MRN.mute }}><Icon d={I.arrowR} size={14}/></div>}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 14, textAlign: 'center', fontSize: 11, color: MRN.mute, fontWeight: 600 }}>
          v1.0.0 · API connected ●
        </div>
      </div>
      <TabBar active="profile"/>
    </Phone>
  );
}

Object.assign(window, { ScreenBookmarks, ScreenAIChat, ScreenProfile, ScreenSettings });
