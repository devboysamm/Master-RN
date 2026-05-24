import { useEffect, useState } from 'react';
import { Notifications as NotificationsAPI } from '../api/client';
import { MRN } from '../theme/tokens';
import Modal from '../components/Modal';

function formatDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function NotificationsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [ok, setOk] = useState(null);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);

  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const list = await NotificationsAPI.list();
      setItems(Array.isArray(list) ? list : []);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const flash = (msg) => { setOk(msg); setTimeout(() => setOk(null), 3500); };

  const onSend = async (e) => {
    e.preventDefault();
    const t = title.trim();
    if (!t) { setErr('A title is required.'); return; }
    setSending(true);
    setErr(null);
    setOk(null);
    try {
      const res = await NotificationsAPI.send(t, body.trim());
      const recipients = res?.recipients ?? 0;
      const sent = res?.sent ?? 0;
      const failed = res?.failed ?? 0;
      flash(
        recipients === 0
          ? 'Saved. No registered devices to deliver to yet.'
          : `Sent to ${sent}/${recipients} device${recipients === 1 ? '' : 's'}` +
            (failed ? ` · ${failed} failed` : '') + '.'
      );
      setTitle('');
      setBody('');
      load();
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || 'Could not send notification');
    } finally {
      setSending(false);
    }
  };

  // Removes the history entry only — it does not unsend anything delivered.
  const doDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    setErr(null);
    try {
      await NotificationsAPI.remove(toDelete.id);
      setToDelete(null);
      flash('Notification removed from history.');
      load();
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1400, margin: '0 auto' }}>
      <div className="page-head">
        <div>
          <div className="page-title">Notifications</div>
          <div className="page-sub">
            Send a push notification to everyone with the app installed.
          </div>
        </div>
        <button className="btn ghost" onClick={load} disabled={loading}>
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {err && <div className="banner err">{err}</div>}
      {ok && <div className="banner ok">{ok}</div>}

      {/* Compose */}
      <form className="card" onSubmit={onSend} style={{ marginBottom: 24 }}>
        <div className="field">
          <label className="label">Title</label>
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. New lessons just dropped 🎉"
            maxLength={255}
          />
        </div>
        <div className="field">
          <label className="label">Message</label>
          <textarea
            className="textarea"
            rows={4}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write the notification body…"
            maxLength={5000}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn" type="submit" disabled={sending || !title.trim()}>
            {sending ? 'Sending…' : 'Send notification'}
          </button>
        </div>
      </form>

      {/* History */}
      <div className="card" style={{ padding: 0 }}>
        {loading ? (
          <div className="empty">Loading notifications…</div>
        ) : items.length === 0 ? (
          <div className="empty">No notifications sent yet.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 280 }}>Title</th>
                <th>Message</th>
                <th style={{ width: 190 }}>Sent</th>
                <th style={{ width: 90 }}></th>
              </tr>
            </thead>
            <tbody>
              {items.map((n) => (
                <tr key={n.id}>
                  <td style={{ color: MRN.ink, fontWeight: 700 }}>{n.title}</td>
                  <td style={{ color: MRN.inkSoft, maxWidth: 600, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {n.body || '—'}
                  </td>
                  <td style={{ fontFamily: MRN.mono, color: MRN.mute, fontSize: 13 }}>{formatDate(n.created_at)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn danger sm" onClick={() => setToDelete(n)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete confirm */}
      <Modal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="Delete notification"
        footer={
          <>
            <button className="btn ghost" onClick={() => setToDelete(null)} disabled={deleting}>Cancel</button>
            <button
              className="btn"
              style={{ background: MRN.coralDeep, borderColor: MRN.coralDeep }}
              onClick={doDelete}
              disabled={deleting}>
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          </>
        }>
        <div style={{ fontSize: 15, color: MRN.inkSoft, lineHeight: 1.6 }}>
          Delete <strong style={{ color: MRN.ink }}>{toDelete?.title}</strong> from the history?
          This only removes the record here — it does not unsend the notification from any device.
        </div>
      </Modal>
    </div>
  );
}
