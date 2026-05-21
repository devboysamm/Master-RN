import { useEffect, useState } from 'react';
import { Users as UsersAPI } from '../api/client';
import { MRN } from '../theme/tokens';

function formatJoined(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function VerifiedBadge({ verified }) {
  const on = !!verified;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px',
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 700,
        background: on ? '#DCEDE2' : 'rgba(22,19,17,0.05)',
        color: on ? '#3F8A57' : MRN.mute,
      }}
    >
      {on ? '✓ Verified' : '✗ Unverified'}
    </span>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const list = await UsersAPI.list();
      setUsers(Array.isArray(list) ? list : []);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1600, margin: '0 auto' }}>
      <div className="page-head">
        <div>
          <div className="page-title">Users</div>
          <div className="page-sub">
            {loading ? 'Loading…' : `${users.length} registered ${users.length === 1 ? 'user' : 'users'}`}
          </div>
        </div>
        <button className="btn ghost" onClick={load} disabled={loading}>
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {err && <div className="banner err">{err}</div>}

      <div className="card" style={{ padding: 0 }}>
        {loading ? (
          <div className="empty">Loading users…</div>
        ) : users.length === 0 ? (
          <div className="empty">No registered users yet.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th style={{ width: 160 }}>Verified</th>
                <th style={{ textAlign: 'right', width: 160 }}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 700, color: MRN.ink }}>{u.name || '—'}</td>
                  <td style={{ color: MRN.inkSoft, fontFamily: MRN.mono, fontSize: 14 }}>{u.email}</td>
                  <td><VerifiedBadge verified={u.email_verified} /></td>
                  <td style={{ textAlign: 'right', fontFamily: MRN.mono, color: MRN.mute, fontSize: 14 }}>
                    {formatJoined(u.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
