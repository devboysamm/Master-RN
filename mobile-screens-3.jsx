// Auth screens: Welcome (choose auth method) and Login/Register form

function ScreenWelcome() {
  return (
    <Phone>
      <div style={{ flex: 1, background: '#0B0907', position: 'relative', overflow: 'hidden',
                    display: 'flex', flexDirection: 'column', padding: '40px 24px 36px' }}>
        {/* faint coral glow */}
        <div style={{
          position: 'absolute', top: '18%', left: '50%', transform: 'translateX(-50%)',
          width: 340, height: 340, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(242,106,74,0.20) 0%, rgba(242,106,74,0) 65%)',
          filter: 'blur(8px)',
        }}/>

        {/* Top: logo + brand */}
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', marginTop: 36 }}>
          <svg width="84" height="84" viewBox="0 0 220 220" style={{ display: 'block', margin: '0 auto 22px' }}>
            <path d="M110 6c52 0 78 0 92 14s14 40 14 92-0 78-14 92-40 14-92 14-78 0-92-14S4 174 4 122s-0-78 14-92S58 6 110 6Z" fill={MRN.coral}/>
            <g fill="none" stroke="#1A1410" strokeWidth="7">
              <ellipse cx="110" cy="110" rx="84" ry="32"/>
              <ellipse cx="110" cy="110" rx="84" ry="32" transform="rotate(60 110 110)"/>
              <ellipse cx="110" cy="110" rx="84" ry="32" transform="rotate(120 110 110)"/>
            </g>
            <circle cx="110" cy="110" r="14" fill="#1A1410"/>
          </svg>
          <div style={{ fontSize: 30, fontWeight: 800, color: '#fff', letterSpacing: -0.7, lineHeight: 1 }}>
            Master <span style={{ color: MRN.coral }}>RN</span>
          </div>
          <div style={{ marginTop: 12, fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 500, maxWidth: 240, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.5 }}>
            Ship native apps with confidence — bite-sized lessons, real code.
          </div>
        </div>

        {/* Buttons */}
        <div style={{ position: 'relative', zIndex: 1, marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{
            background: MRN.coral, borderRadius: 18, padding: '16px 18px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            color: '#fff', fontWeight: 800, fontSize: 14,
          }}>
            <span>Create account</span>
            <Icon d={I.arrowR} size={16} sw={2.2}/>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.08)', borderRadius: 18, padding: '16px 18px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            color: '#fff', fontWeight: 800, fontSize: 14,
            border: '1px solid rgba(255,255,255,0.12)',
          }}>
            <span>Sign in</span>
            <Icon d={I.arrowR} size={16} sw={2.2}/>
          </div>

          {/* divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '6px 0 4px' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.12)' }}/>
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: 1.4 }}>OR</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.12)' }}/>
          </div>

          {/* social */}
          <div style={{ display: 'flex', gap: 8 }}>
            <SocialBtn label="Google" letter="G"/>
            <SocialBtn label="Apple" letter=""/>
            <SocialBtn label="GitHub" letter=""/>
          </div>

          {/* guest */}
          <div style={{
            marginTop: 4, textAlign: 'center', padding: '8px',
            fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.6)',
          }}>
            or <span style={{ color: MRN.coral, textDecoration: 'underline', textUnderlineOffset: 3 }}>continue as guest</span>
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 1, marginTop: 10, textAlign: 'center', fontSize: 10, color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>
          By continuing you agree to our <span style={{ color: 'rgba(255,255,255,0.7)' }}>Terms</span> & <span style={{ color: 'rgba(255,255,255,0.7)' }}>Privacy</span>
        </div>
      </div>
    </Phone>
  );
}

function SocialBtn({ label, letter }) {
  // letter is text fallback for icons we don't have; for Apple/GitHub draw inline
  return (
    <div style={{
      flex: 1, padding: '12px 0', borderRadius: 14,
      background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      color: '#fff', fontWeight: 800, fontSize: 12,
    }}>
      {label === 'Google' && (
        <svg width="14" height="14" viewBox="0 0 24 24">
          <path d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4c-.2 1.3-.9 2.4-2 3.1v2.6h3.2c1.9-1.7 3-4.3 3-7.5z" fill="#4285F4"/>
          <path d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6C4.7 19.7 8.1 22 12 22z" fill="#34A853"/>
          <path d="M6.4 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3.1C2.4 8.8 2 10.4 2 12s.4 3.2 1.1 4.6L6.4 14z" fill="#FBBC05"/>
          <path d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.8-2.8C17 3 14.7 2 12 2 8.1 2 4.7 4.3 3.1 7.4L6.4 10c.8-2.3 3-4.1 5.6-4.1z" fill="#EA4335"/>
        </svg>
      )}
      {label === 'Apple' && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
          <path d="M17.5 12.5c0-2.6 2.1-3.8 2.2-3.9-1.2-1.7-3-2-3.7-2-1.6-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9-1.7 0-3.3 1-4.2 2.5-1.8 3.1-.5 7.7 1.3 10.2.9 1.3 1.9 2.6 3.3 2.5 1.3-.1 1.8-.9 3.4-.9s2.1.9 3.4.9c1.4 0 2.3-1.2 3.2-2.5.7-1 1-2 1.4-3.1-2.5-1-3.2-3.3-3.2-3.7zM14.7 4.5C15.5 3.6 16 2.4 15.8 1c-1.1.1-2.5.8-3.3 1.7-.8.8-1.4 2-1.2 3.3 1.3.1 2.5-.6 3.4-1.5z"/>
        </svg>
      )}
      {label === 'GitHub' && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
          <path d="M12 2C6.5 2 2 6.6 2 12.3c0 4.5 2.9 8.3 6.8 9.7.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1 .8-.2 1.6-.3 2.5-.3s1.7.1 2.5.3c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5 4-1.4 6.8-5.2 6.8-9.7C22 6.6 17.5 2 12 2z"/>
        </svg>
      )}
      {label}
    </div>
  );
}

function ScreenAuth() {
  return (
    <Phone>
      <div style={{ flex: 1, background: '#0B0907', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* coral glow */}
        <div style={{
          position: 'absolute', top: -80, right: -60, width: 280, height: 280, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(242,106,74,0.22) 0%, rgba(242,106,74,0) 65%)',
          filter: 'blur(8px)',
        }}/>

        {/* Top bar: back + small atom */}
        <div style={{ padding: '14px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
          <div style={{ width: 38, height: 38, borderRadius: 19, background: 'rgba(255,255,255,0.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                        border: '1px solid rgba(255,255,255,0.1)' }}>
            <Icon d={I.arrowL} size={16}/>
          </div>
          <svg width="32" height="32" viewBox="0 0 220 220">
            <path d="M110 6c52 0 78 0 92 14s14 40 14 92-0 78-14 92-40 14-92 14-78 0-92-14S4 174 4 122s-0-78 14-92S58 6 110 6Z" fill={MRN.coral}/>
            <g fill="none" stroke="#1A1410" strokeWidth="12">
              <ellipse cx="110" cy="110" rx="84" ry="32"/>
              <ellipse cx="110" cy="110" rx="84" ry="32" transform="rotate(60 110 110)"/>
              <ellipse cx="110" cy="110" rx="84" ry="32" transform="rotate(120 110 110)"/>
            </g>
          </svg>
        </div>

        {/* Headline */}
        <div style={{ padding: '22px 24px 0', position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, fontWeight: 700, color: MRN.coral, letterSpacing: 1.4 }}>GET STARTED</div>
          <div style={{ marginTop: 6, fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: -0.6, lineHeight: 1.05 }}>
            Create your<br/>account
          </div>
        </div>

        {/* Segmented tabs */}
        <div style={{ margin: '22px 20px 0', padding: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 14, display: 'flex', gap: 4, position: 'relative', zIndex: 1, border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{
            flex: 1, padding: '10px 0', textAlign: 'center', borderRadius: 10,
            background: MRN.coral, color: '#fff', fontSize: 12, fontWeight: 800,
          }}>Sign up</div>
          <div style={{
            flex: 1, padding: '10px 0', textAlign: 'center', borderRadius: 10,
            color: 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: 700,
          }}>Sign in</div>
        </div>

        {/* Form */}
        <div style={{ padding: '18px 20px 0', display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', zIndex: 1 }}>
          <AuthInput label="NAME" value="John Carter"/>
          <AuthInput label="EMAIL" value="john@example.com" mono/>
          <AuthInput label="PASSWORD" value="••••••••••" mono show/>
        </div>

        {/* Strength */}
        <div style={{ padding: '6px 20px 0', display: 'flex', alignItems: 'center', gap: 8, position: 'relative', zIndex: 1 }}>
          <div style={{ flex: 1, display: 'flex', gap: 3 }}>
            <div style={{ flex: 1, height: 3, borderRadius: 2, background: MRN.coral }}/>
            <div style={{ flex: 1, height: 3, borderRadius: 2, background: MRN.coral }}/>
            <div style={{ flex: 1, height: 3, borderRadius: 2, background: MRN.coral }}/>
            <div style={{ flex: 1, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.12)' }}/>
          </div>
          <div style={{ fontSize: 10, fontWeight: 700, color: MRN.coral }}>Strong</div>
        </div>

        {/* Primary CTA */}
        <div style={{ padding: '18px 20px 0', position: 'relative', zIndex: 1 }}>
          <div style={{
            background: MRN.coral, color: '#fff', borderRadius: 18, padding: '16px 18px',
            fontWeight: 800, fontSize: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span>Create account</span>
            <Icon d={I.arrowR} size={16} sw={2.2}/>
          </div>
        </div>

        {/* Divider + social row */}
        <div style={{ padding: '14px 20px 0', display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 1 }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.10)' }}/>
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: 1.4 }}>OR</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.10)' }}/>
        </div>
        <div style={{ padding: '10px 20px 0', display: 'flex', gap: 8, position: 'relative', zIndex: 1 }}>
          <SocialBtn label="Google"/>
          <SocialBtn label="Apple"/>
          <SocialBtn label="GitHub"/>
        </div>

        {/* Guest footer */}
        <div style={{ marginTop: 'auto', padding: '18px 20px 18px', textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.55)', fontWeight: 600, position: 'relative', zIndex: 1 }}>
          Just looking around? <span style={{ color: MRN.coral, fontWeight: 800, textDecoration: 'underline', textUnderlineOffset: 3 }}>Continue as guest</span>
        </div>
      </div>
    </Phone>
  );
}

function AuthInput({ label, value, mono, show }) {
  return (
    <div>
      <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: 6, letterSpacing: 1.2 }}>{label}</div>
      <div style={{
        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14,
        padding: '13px 14px', display: 'flex', alignItems: 'center', gap: 8,
        fontSize: 14, fontWeight: 600, color: '#fff',
        fontFamily: mono ? '"JetBrains Mono", monospace' : MRN.font,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>{value}</div>
        {show && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { ScreenWelcome, ScreenAuth });
