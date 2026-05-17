import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modules as ModulesAPI } from '../api/client';
import { MRN } from '../theme/tokens';
import Modal from '../components/Modal';

const SORTS = [
  { id: 'order',   label: 'Order' },
  { id: 'title',   label: 'Title' },
  { id: 'lessons', label: 'Lessons' },
  { id: 'time',    label: 'Read time' },
];

export default function ModulesPage() {
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [counts, setCounts] = useState({});
  const [readTimes, setReadTimes] = useState({});
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('order');
  const [toDelete, setToDelete] = useState(null);

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const list = await ModulesAPI.list();
      const items = Array.isArray(list) ? list : [];
      setModules(items);

      const results = await Promise.all(
        items.map((m) => ModulesAPI.lessons(m.id).catch(() => []))
      );
      const c = {}, r = {};
      results.forEach((arr, i) => {
        const id = items[i].id;
        c[id] = (arr || []).length;
        r[id] = (arr || []).reduce((sum, l) => sum + (l.read_time || 0), 0);
      });
      setCounts(c); setReadTimes(r);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    const list = term
      ? modules.filter((m) =>
          (m.title || '').toLowerCase().includes(term) ||
          (m.description || '').toLowerCase().includes(term)
        )
      : modules.slice();
    list.sort((a, b) => {
      if (sort === 'title')   return (a.title || '').localeCompare(b.title || '');
      if (sort === 'lessons') return (counts[b.id] || 0) - (counts[a.id] || 0);
      if (sort === 'time')    return (readTimes[b.id] || 0) - (readTimes[a.id] || 0);
      return (a.order_index || 0) - (b.order_index || 0);
    });
    return list;
  }, [modules, q, sort, counts, readTimes]);

  const doDelete = async () => {
    if (!toDelete) return;
    try {
      await ModulesAPI.remove(toDelete.id);
      setToDelete(null);
      load();
    } catch (e) {
      alert(e?.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1600, margin: '0 auto' }}>
      <div className="page-head">
        <div>
          <div className="page-title">Modules</div>
          <div className="page-sub">
            {modules.length} {modules.length === 1 ? 'module' : 'modules'} · organize your course
          </div>
        </div>
        <button className="btn" onClick={() => navigate('/modules/new')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
          New module
        </button>
      </div>

      {err && <div className="banner err">{err}</div>}

      <div className="toolbar">
        <input
          className="input"
          placeholder="Search modules…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ maxWidth: 420 }}
        />
        <div style={{ display: 'flex', gap: 4, background: MRN.cardAlt, padding: 5, borderRadius: 12 }}>
          {SORTS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSort(s.id)}
              style={{
                padding: '9px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700,
                background: sort === s.id ? '#fff' : 'transparent',
                color: sort === s.id ? MRN.ink : MRN.mute,
                boxShadow: sort === s.id ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
              }}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {loading ? (
          <div className="empty">Loading modules…</div>
        ) : filtered.length === 0 ? (
          <div className="empty">
            {q ? 'No modules match your search.' : 'No modules yet. Create one to get started.'}
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 50 }}>#</th>
                <th>Title</th>
                <th>Description</th>
                <th style={{ textAlign: 'right' }}>Lessons</th>
                <th style={{ textAlign: 'right' }}>Read</th>
                <th style={{ width: 160, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id}>
                  <td>
                    <div style={{
                      width: 38, height: 38, borderRadius: 9,
                      background: m.background_color || '#EAF2FF',
                      border: `1px solid ${MRN.rule}`,
                    }}/>
                  </td>
                  <td style={{ fontWeight: 700, color: MRN.ink, fontSize: 15 }}>
                    <div>{m.title}</div>
                    <div style={{ fontSize: 12, color: MRN.mute, fontFamily: MRN.mono, fontWeight: 600, marginTop: 3 }}>
                      ID {m.id} · order {m.order_index || 0}
                    </div>
                  </td>
                  <td style={{
                    color: MRN.inkSoft, maxWidth: 460,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{m.description || '—'}</td>
                  <td style={{ textAlign: 'right', fontFamily: MRN.mono, color: MRN.inkSoft, fontSize: 14 }}>
                    {counts[m.id] ?? 0}
                  </td>
                  <td style={{ textAlign: 'right', fontFamily: MRN.mono, color: MRN.mute, fontSize: 14 }}>
                    {readTimes[m.id] ?? 0}m
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 6 }}>
                      <button className="btn ghost sm" onClick={() => navigate(`/modules/${m.id}`)}>Edit</button>
                      <button className="btn danger sm" onClick={() => setToDelete(m)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="Delete module"
        footer={
          <>
            <button className="btn ghost" onClick={() => setToDelete(null)}>Cancel</button>
            <button className="btn" style={{ background: MRN.coralDeep, borderColor: MRN.coralDeep }} onClick={doDelete}>Delete</button>
          </>
        }>
        <div style={{ fontSize: 15, color: MRN.inkSoft, lineHeight: 1.6 }}>
          Are you sure you want to delete <strong style={{ color: MRN.ink }}>{toDelete?.title}</strong>?
          This will also delete its lessons. This action cannot be undone.
        </div>
      </Modal>
    </div>
  );
}
