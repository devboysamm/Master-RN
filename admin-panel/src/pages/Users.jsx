import { useEffect, useState } from 'react';
import { Users as UsersAPI } from '../api/client';
import { MRN } from '../theme/tokens';
import Modal from '../components/Modal';

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
  const [ok, setOk] = useState(null);

  const [viewing, setViewing] = useState(null);   // full user detail (fetched)
  const [editing, setEditing] = useState(null);   // user being edited
  const [editForm, setEditForm] = useState({ name: '', email_verified: 0 });
  const [resetting, setResetting] = useState(null); // user for password reset
  const [newPassword, setNewPassword] = useState('');
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(false);

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

  const flash = (msg) => { setOk(msg); setTimeout(() => setOk(null), 2500); };
  const fail = (e, fallback) => setErr(e?.response?.data?.message || e?.message || fallback);

  const openView = async (u) => {
    setErr(null);
    try {
      const detail = await UsersAPI.get(u.id);
      setViewing(detail || u);
    } catch (e) {
      fail(e, 'Could not load user');
    }
  };

  const openEdit = (u) => {
    setErr(null);
    setEditForm({ name: u.name || '', email_verified: u.email_verified ? 1 : 0 });
    setEditing(u);
  };

  const saveEdit = async () => {
    setBusy(true);
    setErr(null);
    try {
      await UsersAPI.update(editing.id, {
        name: editForm.name.trim(),
        email_verified: editForm.email_verified ? 1 : 0,
      });
      setEditing(null);
      flash('User updated.');
      await load();
    } catch (e) {
      fail(e, 'Could not update user');
    } finally {
      setBusy(false);
    }
  };

  const openReset = (u) => {
    setErr(null);
    setNewPassword('');
    setResetting(u);
  };

  const saveReset = async () => {
    if (newPassword.length < 8) { setErr('Password must be at least 8 characters.'); return; }
    setBusy(true);
    setErr(null);
    try {
      await UsersAPI.resetPassword(resetting.id, newPassword);
      setResetting(null);
      flash('Password reset.');
    } catch (e) {
      fail(e, 'Could not reset password');
    } finally {
      setBusy(false);
    }
  };

  const doDelete = async () => {
    setBusy(true);
    setErr(null);
    try {
      await UsersAPI.remove(toDelete.id);
      setToDelete(null);
      flash('User deleted.');
      await load();
    } catch (e) {
      fail(e, 'Could not delete user');
    } finally {
      setBusy(false);
    }
  };

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
      {ok && <div className="banner ok">{ok}</div>}

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
                <th style={{ width: 150 }}>Verified</th>
                <th style={{ width: 130 }}>Joined</th>
                <th style={{ textAlign: 'right', width: 320 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 700, color: MRN.ink }}>{u.name || '—'}</td>
                  <td style={{ color: MRN.inkSoft, fontFamily: MRN.mono, fontSize: 14 }}>{u.email}</td>
                  <td><VerifiedBadge verified={u.email_verified} /></td>
                  <td style={{ fontFamily: MRN.mono, color: MRN.mute, fontSize: 14 }}>
                    {formatJoined(u.created_at)}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      <button className="btn ghost sm" onClick={() => openView(u)}>View</button>
                      <button className="btn ghost sm" onClick={() => openEdit(u)}>Edit</button>
                      <button className="btn ghost sm" onClick={() => openReset(u)}>Reset password</button>
                      <button className="btn danger sm" onClick={() => setToDelete(u)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* VIEW */}
      <Modal
        open={!!viewing}
        onClose={() => setViewing(null)}
        title="User detail"
        footer={<button className="btn ghost" onClick={() => setViewing(null)}>Close</button>}>
        {viewing && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <DetailRow label="Name" value={viewing.name || '—'} />
            <DetailRow label="Email" value={viewing.email} mono />
            <DetailRow label="Verified" value={viewing.email_verified ? 'Yes' : 'No'} />
            <DetailRow label="Bio" value={viewing.bio || '—'} />
            <DetailRow label="Joined" value={formatJoined(viewing.created_at)} mono />
            <DetailRow label="User ID" value={String(viewing.id)} mono />
          </div>
        )}
      </Modal>

      {/* EDIT */}
      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Edit user"
        footer={
          <>
            <button className="btn ghost" onClick={() => setEditing(null)} disabled={busy}>Cancel</button>
            <button className="btn" onClick={saveEdit} disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
          </>
        }>
        <div className="field">
          <label className="label">Name</label>
          <input
            className="input"
            value={editForm.name}
            onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="User name"
            maxLength={120}
          />
        </div>
        <div className="field">
          <label className="label">Email verified</label>
          <button
            className="btn ghost"
            onClick={() => setEditForm((f) => ({ ...f, email_verified: f.email_verified ? 0 : 1 }))}
            style={{ alignSelf: 'flex-start' }}>
            {editForm.email_verified ? '✓ Verified — tap to unset' : '✗ Unverified — tap to verify'}
          </button>
        </div>
      </Modal>

      {/* RESET PASSWORD */}
      <Modal
        open={!!resetting}
        onClose={() => setResetting(null)}
        title="Reset password"
        footer={
          <>
            <button className="btn ghost" onClick={() => setResetting(null)} disabled={busy}>Cancel</button>
            <button className="btn" onClick={saveReset} disabled={busy}>{busy ? 'Saving…' : 'Set password'}</button>
          </>
        }>
        <div style={{ fontSize: 14, color: MRN.inkSoft, lineHeight: 1.6, marginBottom: 14 }}>
          Set a new password for <strong style={{ color: MRN.ink }}>{resetting?.email}</strong>.
          They can sign in with it immediately.
        </div>
        <div className="field">
          <label className="label">New password (min 8 chars)</label>
          <input
            className="input"
            type="text"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
          />
        </div>
      </Modal>

      {/* DELETE CONFIRM — same pattern as Modules.jsx */}
      <Modal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="Delete user"
        footer={
          <>
            <button className="btn ghost" onClick={() => setToDelete(null)} disabled={busy}>Cancel</button>
            <button
              className="btn"
              style={{ background: MRN.coralDeep, borderColor: MRN.coralDeep }}
              onClick={doDelete}
              disabled={busy}>
              {busy ? 'Deleting…' : 'Delete'}
            </button>
          </>
        }>
        <div style={{ fontSize: 15, color: MRN.inkSoft, lineHeight: 1.6 }}>
          Are you sure you want to delete <strong style={{ color: MRN.ink }}>{toDelete?.email}</strong>?
          This permanently removes their account. This action cannot be undone.
        </div>
      </Modal>
    </div>
  );
}

function DetailRow({ label, value, mono }) {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <div style={{ width: 90, flexShrink: 0, fontSize: 12, fontWeight: 700, color: MRN.mute, textTransform: 'uppercase', letterSpacing: 0.6, paddingTop: 2 }}>
        {label}
      </div>
      <div style={{ flex: 1, fontSize: 15, color: MRN.ink, fontFamily: mono ? MRN.mono : undefined, wordBreak: 'break-word' }}>
        {value}
      </div>
    </div>
  );
}
