import { useEffect, useState } from 'react';
import { Reports as ReportsAPI } from '../api/client';
import { MRN } from '../theme/tokens';

const STATUSES = ['new', 'seen', 'resolved'];

const STATUS_STYLE = {
  new:      { bg: '#FCE9D9', fg: '#C2410C' },
  seen:     { bg: '#E5E7EB', fg: '#374151' },
  resolved: { bg: '#DCEDE2', fg: '#3F8A57' },
};

function formatDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.new;
  return (
    <span style={{
      display: 'inline-block', padding: '3px 9px', borderRadius: 999,
      fontSize: 12, fontWeight: 700, background: s.bg, color: s.fg,
      textTransform: 'capitalize',
    }}>
      {status || 'new'}
    </span>
  );
}

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [ok, setOk] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const list = await ReportsAPI.list();
      setReports(Array.isArray(list) ? list : []);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const flash = (msg) => { setOk(msg); setTimeout(() => setOk(null), 2500); };

  const changeStatus = async (id, status) => {
    setBusyId(id);
    setErr(null);
    try {
      const updated = await ReportsAPI.setStatus(id, status);
      setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status: updated?.status ?? status } : r)));
      flash('Status updated.');
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || 'Could not update status');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1400, margin: '0 auto' }}>
      <div className="page-head">
        <div>
          <div className="page-title">Problem reports</div>
          <div className="page-sub">
            {loading ? 'Loading…' : `${reports.length} ${reports.length === 1 ? 'report' : 'reports'} from the app`}
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
          <div className="empty">Loading reports…</div>
        ) : reports.length === 0 ? (
          <div className="empty">No problem reports yet.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Message</th>
                <th style={{ width: 130 }}>Category</th>
                <th style={{ width: 110 }}>Platform</th>
                <th style={{ width: 90 }}>Version</th>
                <th style={{ width: 200 }}>User</th>
                <th style={{ width: 170 }}>Date</th>
                <th style={{ width: 230 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id}>
                  <td style={{ color: MRN.ink, maxWidth: 420, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {r.message}
                  </td>
                  <td style={{ color: MRN.inkSoft }}>{r.category || '—'}</td>
                  <td style={{ color: MRN.inkSoft }}>{r.platform || '—'}</td>
                  <td style={{ fontFamily: MRN.mono, color: MRN.mute, fontSize: 13 }}>{r.app_version || '—'}</td>
                  <td style={{ fontFamily: MRN.mono, color: MRN.inkSoft, fontSize: 13, wordBreak: 'break-all' }}>
                    {r.user_email || '—'}
                  </td>
                  <td style={{ fontFamily: MRN.mono, color: MRN.mute, fontSize: 13 }}>{formatDate(r.created_at)}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <StatusBadge status={r.status} />
                      <div style={{ display: 'inline-flex', gap: 4 }}>
                        {STATUSES.map((s) => (
                          <button
                            key={s}
                            className="btn ghost sm"
                            onClick={() => changeStatus(r.id, s)}
                            disabled={busyId === r.id || r.status === s}
                            style={{ textTransform: 'capitalize', opacity: r.status === s ? 0.4 : 1 }}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
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
