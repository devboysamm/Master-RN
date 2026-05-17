import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Modules as ModulesAPI } from '../api/client';
import { MRN, moduleSwatches } from '../theme/tokens';

const empty = {
  title: '',
  description: '',
  prerequisites: '',
  icon: 'book',
  image_url: '',
  background_color: '#EAF2FF',
  order_index: 0,
};

const ICON_OPTIONS = ['book', 'code', 'layers', 'flame', 'sparkle', 'shield', 'compass', 'star'];

export default function ModuleEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new' || !id;
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (isNew) return;
    ModulesAPI.get(id)
      .then((m) => setForm({ ...empty, ...m }))
      .catch((e) => setErr(e?.response?.data?.message || e.message))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const set = (k) => (e) => {
    const v = e.target ? e.target.value : e;
    setForm((prev) => ({ ...prev, [k]: v }));
  };

  const save = async () => {
    if (!form.title.trim()) {
      setErr('Title is required.');
      return;
    }
    if (!/^#[0-9A-Fa-f]{6}$/.test(form.background_color || '')) {
      setErr('Background color must be a 6-digit hex (e.g. #EAF2FF).');
      return;
    }
    if (form.image_url && !/^https?:\/\//i.test(form.image_url)) {
      setErr('Image URL must start with http:// or https://');
      return;
    }
    setSaving(true);
    setErr(null);
    try {
      const body = {
        ...form,
        order_index: Number(form.order_index) || 0,
      };
      if (isNew) {
        await ModulesAPI.create(body);
      } else {
        await ModulesAPI.update(id, body);
      }
      navigate('/modules');
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: 32 }} className="empty">Loading…</div>;

  return (
    <div style={{ padding: '24px 32px', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
        <button className="btn ghost sm" onClick={() => navigate('/modules')}>← Back</button>
        <div>
          <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.4 }}>
            {isNew ? 'New module' : 'Edit module'}
          </div>
          <div style={{ fontSize: 13, color: MRN.mute, fontWeight: 600, marginTop: 2 }}>
            {isNew ? 'Create a new learning module' : `Editing ID ${id}`}
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
          <button className="btn ghost" onClick={() => navigate('/modules')}>Cancel</button>
          <button className="btn" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : 'Save module'}
          </button>
        </div>
      </div>

      {err && <div className="banner err">{err}</div>}

      <div className="card">
        <div className="field">
          <label className="label">Title</label>
          <input className="input" value={form.title} onChange={set('title')} placeholder="React Basics"/>
        </div>

        <div className="field">
          <label className="label">Description</label>
          <textarea className="textarea" value={form.description || ''} onChange={set('description')} placeholder="Start here — covers JSX and components." rows={3}/>
        </div>

        <div className="field">
          <label className="label">Prerequisites (comma separated)</label>
          <input className="input" value={form.prerequisites || ''} onChange={set('prerequisites')} placeholder="JavaScript, ES6"/>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          <div className="field">
            <label className="label">Icon</label>
            <select className="select" value={form.icon || 'book'} onChange={set('icon')}>
              {ICON_OPTIONS.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div className="field">
            <label className="label">Order index</label>
            <input className="input" type="number" value={form.order_index ?? 0} onChange={set('order_index')}/>
          </div>
        </div>

        <div className="field">
          <label className="label">Image URL (optional)</label>
          <input className="input" value={form.image_url || ''} onChange={set('image_url')} placeholder="https://example.com/cover.png"/>
        </div>

        <div className="field">
          <label className="label">Background color</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <input
              type="color"
              value={form.background_color || '#EAF2FF'}
              onChange={set('background_color')}
              style={{ width: 52, height: 44, border: `1px solid ${MRN.rule}`, borderRadius: 10, padding: 4, background: '#fff' }}
            />
            <input
              className="input"
              value={form.background_color || '#EAF2FF'}
              onChange={set('background_color')}
              style={{ maxWidth: 140, fontFamily: MRN.mono }}
            />
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {moduleSwatches.map((c) => (
                <button
                  key={c}
                  onClick={() => set('background_color')(c)}
                  title={c}
                  style={{
                    width: 26, height: 26, borderRadius: 7,
                    background: c, cursor: 'pointer',
                    border: form.background_color?.toLowerCase() === c.toLowerCase()
                      ? `2px solid ${MRN.ink}` : `1px solid ${MRN.rule}`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div style={{
          marginTop: 18, padding: 16,
          borderRadius: 14, background: form.background_color || '#EAF2FF',
          border: `1px solid ${MRN.rule}`,
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: MRN.inkSoft, marginBottom: 6, letterSpacing: 0.4 }}>
            PREVIEW
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: MRN.ink }}>
            {form.title || 'Module title'}
          </div>
          <div style={{ fontSize: 13, color: MRN.inkSoft, marginTop: 4 }}>
            {form.description || 'Module description goes here.'}
          </div>
        </div>
      </div>
    </div>
  );
}
