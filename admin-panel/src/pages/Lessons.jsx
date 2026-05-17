import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modules as ModulesAPI, Lessons as LessonsAPI } from '../api/client';
import { MRN } from '../theme/tokens';
import Modal from '../components/Modal';

export default function LessonsPage() {
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [byModule, setByModule] = useState({});
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [collapsed, setCollapsed] = useState({});

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const list = await ModulesAPI.list();
      const items = Array.isArray(list) ? list : [];
      items.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
      setModules(items);

      const results = await Promise.all(
        items.map((m) => ModulesAPI.lessons(m.id).catch(() => []))
      );
      const map = {};
      results.forEach((arr, i) => {
        const sorted = (arr || []).slice().sort((a, b) => (a.lesson_order || 0) - (b.lesson_order || 0));
        map[items[i].id] = sorted;
      });
      setByModule(map);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const doDelete = async () => {
    if (!toDelete) return;
    try {
      await LessonsAPI.remove(toDelete.id);
      setToDelete(null);
      load();
    } catch (e) {
      alert(e?.response?.data?.message || 'Delete failed');
    }
  };

  const total = Object.values(byModule).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1600, margin: '0 auto' }}>
      <div className="page-head">
        <div>
          <div className="page-title">Lessons</div>
          <div className="page-sub">
            {total} {total === 1 ? 'lesson' : 'lessons'} across {modules.length} {modules.length === 1 ? 'module' : 'modules'}
          </div>
        </div>
        <button
          className="btn"
          onClick={() => navigate('/lessons/new')}
          disabled={modules.length === 0}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
          New lesson
        </button>
      </div>

      {err && <div className="banner err">{err}</div>}

      {loading ? (
        <div className="card empty">Loading lessons…</div>
      ) : modules.length === 0 ? (
        <div className="card empty">
          You need at least one module before creating lessons.<br/>
          <button className="btn" style={{ marginTop: 14 }} onClick={() => navigate('/modules/new')}>Create a module</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {modules.map((m) => {
            const lessons = byModule[m.id] || [];
            const isCollapsed = collapsed[m.id];
            return (
              <div key={m.id} className="card" style={{ padding: 0 }}>
                <button
                  onClick={() => setCollapsed((c) => ({ ...c, [m.id]: !c[m.id] }))}
                  style={{
                    display: 'flex', width: '100%', alignItems: 'center', gap: 16,
                    padding: '20px 26px', borderBottom: isCollapsed ? 'none' : `1px solid ${MRN.rule}`,
                    cursor: 'pointer', textAlign: 'left',
                  }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: m.background_color || '#EAF2FF',
                    flexShrink: 0, border: `1px solid ${MRN.rule}`,
                  }}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 17, fontWeight: 800, color: MRN.ink, letterSpacing: -0.2 }}>{m.title}</div>
                    <div style={{ fontSize: 13, color: MRN.mute, fontWeight: 600, marginTop: 3 }}>
                      {lessons.length} {lessons.length === 1 ? 'lesson' : 'lessons'}
                    </div>
                  </div>
                  <span className="pill" style={{ background: MRN.cardAlt }}>
                    {lessons.reduce((s, l) => s + (l.read_time || 0), 0)}m total
                  </span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{
                    color: MRN.mute, transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s',
                  }}>
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>

                {!isCollapsed && (
                  lessons.length === 0 ? (
                    <div style={{ padding: 26, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                      <div style={{ fontSize: 15, color: MRN.mute }}>No lessons in this module yet.</div>
                      <button className="btn sm" onClick={() => navigate(`/lessons/new?module=${m.id}`)}>Add first lesson</button>
                    </div>
                  ) : (
                    <table className="table">
                      <thead>
                        <tr>
                          <th style={{ width: 70 }}>Order</th>
                          <th>Title</th>
                          <th>Description</th>
                          <th style={{ textAlign: 'right' }}>Read</th>
                          <th style={{ width: 180, textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lessons.map((l) => (
                          <tr key={l.id}>
                            <td style={{ fontFamily: MRN.mono, color: MRN.mute, fontSize: 14 }}>
                              {String(l.lesson_order || 0).padStart(2, '0')}
                            </td>
                            <td style={{ fontWeight: 700, color: MRN.ink }}>{l.title}</td>
                            <td style={{
                              color: MRN.inkSoft, maxWidth: 460,
                              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            }}>{l.description || '—'}</td>
                            <td style={{ textAlign: 'right', fontFamily: MRN.mono, color: MRN.mute, fontSize: 14 }}>
                              {l.read_time || 0}m
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <div style={{ display: 'inline-flex', gap: 6 }}>
                                <button className="btn ghost sm" onClick={() => navigate(`/lessons/${l.id}`)}>Edit</button>
                                <button className="btn danger sm" onClick={() => setToDelete(l)}>Delete</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )
                )}
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="Delete lesson"
        footer={
          <>
            <button className="btn ghost" onClick={() => setToDelete(null)}>Cancel</button>
            <button className="btn" style={{ background: MRN.coralDeep, borderColor: MRN.coralDeep }} onClick={doDelete}>Delete</button>
          </>
        }>
        <div style={{ fontSize: 15, color: MRN.inkSoft, lineHeight: 1.6 }}>
          Delete <strong style={{ color: MRN.ink }}>{toDelete?.title}</strong>? This cannot be undone.
        </div>
      </Modal>
    </div>
  );
}
