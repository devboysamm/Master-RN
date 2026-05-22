import { useState } from 'react';
import { AdminAuth, setAdminToken } from '../api/client';
import { MRN } from '../theme/tokens';

export default function Login({ onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const { token } = await AdminAuth.login(username.trim(), password);
      if (!token) throw new Error('No token returned');
      setAdminToken(token);
      onSuccess(token);
    } catch (e2) {
      setErr(e2?.response?.data?.error || e2?.response?.data?.message || e2.message || 'Invalid credentials');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', width: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: MRN.cream, fontFamily: MRN.font, padding: 24,
    }}>
      <form
        onSubmit={submit}
        style={{
          width: '100%', maxWidth: 400,
          background: '#FBF6EE', border: '1px solid rgba(22,19,17,0.08)',
          borderRadius: 22, padding: 32,
          boxShadow: '0 18px 40px rgba(22,19,17,0.10)',
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <svg width="40" height="40" viewBox="0 0 220 220">
            <path d="M110 6c52 0 78 0 92 14s14 40 14 92-0 78-14 92-40 14-92 14-78 0-92-14S4 174 4 122s-0-78 14-92S58 6 110 6Z" fill={MRN.coral}/>
            <g fill="none" stroke="#1A1410" strokeWidth="12">
              <ellipse cx="110" cy="110" rx="84" ry="32"/>
              <ellipse cx="110" cy="110" rx="84" ry="32" transform="rotate(60 110 110)"/>
              <ellipse cx="110" cy="110" rx="84" ry="32" transform="rotate(120 110 110)"/>
            </g>
            <circle cx="110" cy="110" r="16" fill="#1A1410"/>
          </svg>
          <div>
            <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: -0.3, color: MRN.ink }}>
              Master <span style={{ color: MRN.coral }}>RN</span> Admin
            </div>
            <div style={{ fontSize: 13, color: MRN.mute, fontWeight: 600 }}>Sign in to continue</div>
          </div>
        </div>

        {err && <div className="banner err" style={{ marginBottom: 16 }}>{err}</div>}

        <div className="field">
          <label className="label">Username</label>
          <input
            className="input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            autoComplete="username"
            placeholder="admin"
          />
        </div>

        <div className="field" style={{ marginTop: 14 }}>
          <label className="label">Password</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="••••••••"
          />
        </div>

        <button
          className="btn"
          type="submit"
          disabled={busy || !username.trim() || !password}
          style={{ width: '100%', marginTop: 22, justifyContent: 'center' }}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
