import { useEffect, useState } from 'react';
import { Categories as CategoriesAPI, Modules as ModulesAPI } from '../api/client';
import { MRN } from '../theme/tokens';
import Modal from '../components/Modal';

const ICONS = ['book', 'layers', 'sparkle', 'compass', 'shield', 'flame'];

const blankForm = {
  name: '',
  icon: 'book',
  color: '#F26A4A',
  order_index: 0,
};

export default function CategoriesPage() {
  const [cats, setCats] = useState([]);
  const [modules, setModules] = useState([]);
  const [moduleIds, setModuleIds] = useState({}); // categoryId -> [moduleId]
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [ok, setOk] = useState(null);

  const [editing, setEditing] = useState(null); // category object or 'new'
  const [form, setForm] = useState(blankForm);
  const [saving, setSaving] = useState(false);

  const [assigning, setAssigning] = useState(null); // category for module-assignment modal
  const [toDelete, setToDelete] = useState(null);

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const [cList, mList] = await Promise.all([
        CategoriesAPI.list(),
        ModulesAPI.list(),
      ]);
      const catList = Array.isArray(cList) ? cList : [];
      const modList = Array.isArray(mList) ? mList : [];
      setCats(catList);
      setModules(modList);
      // Fetch module IDs per category in parallel so we can show counts/assignments.
      const idsMap = {};
      await Promise.all(catList.map(async (c) => {
        try {
          const detail = await CategoriesAPI.get(c.id);
          idsMap[c.id] = detail?.module_ids || [];
        } catch {
          idsMap[c.id] = [];
        }
      }));
      setModuleIds(idsMap);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const startNew = () => { setForm({ ...blankForm, order_index: cats.length + 1 }); setEditing('new'); };
  const startEdit = (c) => { setForm({ name: c.name, icon: c.icon, color: c.color, order_index: c.order_index }); setEditing(c); };

  const save = async () => {
    setSaving(true);
    try {
      if (editing === 'new') {
        await CategoriesAPI.create(form);
        setOk('Category created.');
      } else {
        await CategoriesAPI.update(editing.id, form);
        setOk('Category updated.');
      }
      setEditing(null);
      setTimeout(() => setOk(null), 2500);
      load();
    } catch (e) {
      alert(e?.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const doDelete = async () => {
    if (!toDelete) return;
    try {
      await CategoriesAPI.remove(toDelete.id);
      setToDelete(null);
      load();
    } catch (e) {
      alert(e?.response?.data?.message || 'Delete failed');
    }
  };

  const toggleModule = async (categoryId, moduleId, currentlyAssigned) => {
    try {
      if (currentlyAssigned) {
        await CategoriesAPI.removeModule(categoryId, moduleId);
      } else {
        await CategoriesAPI.addModule(categoryId, moduleId);
      }
      const detail = await CategoriesAPI.get(categoryId);
      setModuleIds((m) => ({ ...m, [categoryId]: detail?.module_ids || [] }));
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to update');
    }
  };

  const set = (k) => (e) => {
    const v = e.target.value;
    setForm((f) => ({ ...f, [k]: k === 'order_index' ? Number(v) || 0 : v }));
  };

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1600, margin: '0 auto' }}>
      <div className="page-head">
        <div>
          <div className="page-title">Categories</div>
          <div className="page-sub">
            {cats.length} {cats.length === 1 ? 'category' : 'categories'} · drive the Home “Explore” filter chips
          </div>
        </div>
        <button className="btn" onClick={startNew}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
          New category
        </button>
      </div>

      {err && <div className="banner err">{err}</div>}
      {ok && <div className="banner ok">{ok}</div>}

      <div className="card" style={{ padding: 0 }}>
        {loading ? (
          <div className="empty">Loading categories…</div>
        ) : cats.length === 0 ? (
          <div className="empty">No categories yet. Create one to get started.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 60 }}>Order</th>
                <th style={{ width: 60 }}>Color</th>
                <th>Name</th>
                <th>Icon</th>
                <th style={{ textAlign: 'right' }}>Modules</th>
                <th style={{ width: 280, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cats.map((c) => {
                const count = moduleIds[c.id]?.length ?? c.module_count ?? 0;
                return (
                  <tr key={c.id}>
                    <td style={{ fontFamily: MRN.mono, color: MRN.mute, fontSize: 13 }}>{c.order_index}</td>
                    <td>
                      <div style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: c.color, border: `1px solid ${MRN.rule}`,
                      }}/>
                    </td>
                    <td style={{ fontWeight: 700, color: MRN.ink, fontSize: 15 }}>
                      {c.name}
                      <div style={{ fontSize: 12, color: MRN.mute, fontFamily: MRN.mono, fontWeight: 600, marginTop: 3 }}>
                        ID {c.id}
                      </div>
                    </td>
                    <td style={{ color: MRN.inkSoft, fontFamily: MRN.mono, fontSize: 13 }}>{c.icon}</td>
                    <td style={{ textAlign: 'right', fontFamily: MRN.mono, color: MRN.inkSoft, fontSize: 14 }}>
                      {count}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button className="btn ghost sm" onClick={() => setAssigning(c)}>Assign modules</button>
                        <button className="btn ghost sm" onClick={() => startEdit(c)}>Edit</button>
                        <button className="btn danger sm" onClick={() => setToDelete(c)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Create / edit modal */}
      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing === 'new' ? 'New category' : `Edit ${editing?.name || ''}`}
        footer={
          <>
            <button className="btn ghost" onClick={() => setEditing(null)}>Cancel</button>
            <button className="btn" onClick={save} disabled={saving || !form.name.trim()}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </>
        }>
        <div style={{ display: 'grid', gap: 16 }}>
          <div className="field">
            <label className="label">Name</label>
            <input className="input" value={form.name} onChange={set('name')} placeholder="e.g. Beginner"/>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div className="field">
              <label className="label">Icon</label>
              <select className="input" value={form.icon} onChange={set('icon')}>
                {ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div className="field">
              <label className="label">Color (hex)</label>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input className="input" value={form.color} onChange={set('color')} placeholder="#F26A4A" style={{ flex: 1 }}/>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: form.color, border: `1px solid ${MRN.rule}` }}/>
              </div>
            </div>
            <div className="field">
              <label className="label">Order</label>
              <input className="input" type="number" value={form.order_index} onChange={set('order_index')}/>
            </div>
          </div>
        </div>
      </Modal>

      {/* Module assignment modal */}
      <Modal
        open={!!assigning}
        onClose={() => setAssigning(null)}
        title={`Modules in “${assigning?.name || ''}”`}
        footer={
          <button className="btn" onClick={() => setAssigning(null)}>Done</button>
        }>
        <div style={{ fontSize: 13, color: MRN.mute, marginBottom: 12 }}>
          Tap a module to add/remove it from this category. The mobile app uses these to filter the Home “Start here” list.
        </div>
        <div style={{ display: 'grid', gap: 8, maxHeight: 420, overflowY: 'auto' }}>
          {modules.map((m) => {
            const assigned = (moduleIds[assigning?.id] || []).includes(m.id);
            return (
              <label
                key={m.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: `1px solid ${assigned ? MRN.coral : MRN.rule}`,
                  background: assigned ? '#FFF3EE' : '#fff',
                  cursor: 'pointer',
                }}>
                <input
                  type="checkbox"
                  checked={assigned}
                  onChange={() => assigning && toggleModule(assigning.id, m.id, assigned)}
                />
                <div style={{
                  width: 26, height: 26, borderRadius: 7,
                  background: m.background_color || '#EAF2FF',
                  border: `1px solid ${MRN.rule}`,
                }}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: MRN.ink }}>{m.title}</div>
                  <div style={{ fontSize: 12, color: MRN.mute, fontFamily: MRN.mono, fontWeight: 600, marginTop: 2 }}>
                    ID {m.id} · order {m.order_index || 0}
                  </div>
                </div>
              </label>
            );
          })}
          {modules.length === 0 && (
            <div className="empty">No modules exist yet. Create some first.</div>
          )}
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="Delete category"
        footer={
          <>
            <button className="btn ghost" onClick={() => setToDelete(null)}>Cancel</button>
            <button className="btn" style={{ background: MRN.coralDeep, borderColor: MRN.coralDeep }} onClick={doDelete}>Delete</button>
          </>
        }>
        <div style={{ fontSize: 15, color: MRN.inkSoft, lineHeight: 1.6 }}>
          Delete <strong style={{ color: MRN.ink }}>{toDelete?.name}</strong>?
          The module assignments will be removed but the modules themselves stay.
        </div>
      </Modal>
    </div>
  );
}
