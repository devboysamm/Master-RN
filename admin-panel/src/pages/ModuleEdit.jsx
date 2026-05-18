import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Modules as ModulesAPI } from '../api/client';
import { MRN, moduleSwatches } from '../theme/tokens';
import ImagePicker from '../components/ImagePicker';

const empty = {
  title: '',
  description: '',
  prerequisites: '',
  icon: 'book',
  image_url: '',
  background_color: '#EAF2FF',
  order_index: 0,
};

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
    if (
      form.image_url &&
      !/^https?:\/\//i.test(form.image_url) &&
      !/^data:image\//i.test(form.image_url)
    ) {
      setErr('Image must be an http(s):// URL or a data:image/... URI.');
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
    <div style={{ padding: '32px 40px', maxWidth: 1080, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <button className="btn ghost sm" onClick={() => navigate('/modules')}>← Back</button>
        <div>
          <div className="page-title">
            {isNew ? 'New module' : 'Edit module'}
          </div>
          <div className="page-sub">
            {isNew ? 'Create a new learning module' : `Editing ID ${id}`}
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
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

        <div className="field">
          <label className="label">Image</label>
          <ImagePicker
            value={form.image_url || ''}
            onChange={(url) => setForm((prev) => ({ ...prev, image_url: url }))}
            placeholder="No image set"
          />
        </div>

        <div className="field">
          <label className="label">Background color</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <input
              type="color"
              value={form.background_color || '#EAF2FF'}
              onChange={set('background_color')}
              style={{ width: 60, height: 50, border: `1px solid ${MRN.rule}`, borderRadius: 12, padding: 5, background: '#fff' }}
            />
            <input
              className="input"
              value={form.background_color || '#EAF2FF'}
              onChange={set('background_color')}
              style={{ maxWidth: 160, fontFamily: MRN.mono }}
            />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {moduleSwatches.map((c) => (
                <button
                  key={c}
                  onClick={() => set('background_color')(c)}
                  title={c}
                  style={{
                    width: 32, height: 32, borderRadius: 8,
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
          marginTop: 22, padding: 22,
          borderRadius: 16, background: form.background_color || '#EAF2FF',
          border: `1px solid ${MRN.rule}`,
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: MRN.inkSoft, marginBottom: 8, letterSpacing: 0.6 }}>
            PREVIEW
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: MRN.ink, letterSpacing: -0.3 }}>
            {form.title || 'Module title'}
          </div>
          <div style={{ fontSize: 15, color: MRN.inkSoft, marginTop: 6 }}>
            {form.description || 'Module description goes here.'}
          </div>
        </div>
      </div>
    </div>
  );
}
