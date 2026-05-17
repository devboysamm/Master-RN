import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';
import { Modules as ModulesAPI, Lessons as LessonsAPI } from '../api/client';
import { MRN } from '../theme/tokens';

const empty = {
  module_id: '',
  title: '',
  description: '',
  content: '',
  read_time: 5,
  lesson_order: 0,
};

const TEMPLATES = [
  { label: 'H1', snippet: '<h1>Heading</h1>\n' },
  { label: 'H2', snippet: '<h2>Section heading</h2>\n' },
  { label: 'H3', snippet: '<h3>Subsection</h3>\n' },
  { label: 'Paragraph', snippet: '<p>Your paragraph text here.</p>\n' },
  { label: 'Bullet list', snippet: '<ul>\n  <li>Item one</li>\n  <li>Item two</li>\n  <li>Item three</li>\n</ul>\n' },
  { label: 'Numbered list', snippet: '<ol>\n  <li>First</li>\n  <li>Second</li>\n  <li>Third</li>\n</ol>\n' },
  { label: 'Code block', snippet: '<pre><code class="language-javascript">const App = () => (\n  &lt;Text&gt;Hello&lt;/Text&gt;\n);</code></pre>\n' },
  { label: 'Inline code', snippet: '<code>useState</code> ' },
  { label: 'Quote', snippet: '<blockquote>Memorable callout goes here.</blockquote>\n' },
  { label: 'Link', snippet: '<a href="https://reactnative.dev">React Native docs</a> ' },
];

export default function LessonEditor() {
  const { id } = useParams();
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const isNew = id === 'new' || !id;

  const [form, setForm] = useState(empty);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);
  const previewRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      try {
        const list = await ModulesAPI.list();
        const items = Array.isArray(list) ? list : [];
        setModules(items);
        if (isNew) {
          const preselect = search.get('module');
          setForm((f) => ({
            ...f,
            module_id: preselect ? Number(preselect) : (items[0]?.id ?? ''),
          }));
        } else {
          const l = await LessonsAPI.get(id);
          setForm({ ...empty, ...l });
        }
      } catch (e) {
        setErr(e?.response?.data?.message || e.message);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [id, isNew]);

  const sanitized = useMemo(() => {
    return DOMPurify.sanitize(form.content || '', {
      ADD_ATTR: ['target', 'class'],
    });
  }, [form.content]);

  useEffect(() => {
    if (!previewRef.current) return;
    previewRef.current.querySelectorAll('pre code').forEach((block) => {
      try { hljs.highlightElement(block); } catch {}
    });
  }, [sanitized]);

  const set = (k) => (e) => {
    const v = e.target ? e.target.value : e;
    setForm((prev) => ({ ...prev, [k]: v }));
  };

  const insertSnippet = (snippet) => {
    const ta = textareaRef.current;
    if (!ta) {
      setForm((f) => ({ ...f, content: (f.content || '') + snippet }));
      return;
    }
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const content = form.content || '';
    const next = content.slice(0, start) + snippet + content.slice(end);
    setForm((f) => ({ ...f, content: next }));
    requestAnimationFrame(() => {
      ta.focus();
      const pos = start + snippet.length;
      ta.setSelectionRange(pos, pos);
    });
  };

  const save = async () => {
    if (!form.title.trim()) { setErr('Title is required.'); return; }
    if (!form.module_id) { setErr('Module is required.'); return; }
    setSaving(true);
    setErr(null);
    try {
      const body = {
        ...form,
        module_id: Number(form.module_id),
        read_time: Number(form.read_time) || 0,
        lesson_order: Number(form.lesson_order) || 0,
      };
      if (isNew) {
        await LessonsAPI.create(body);
      } else {
        await LessonsAPI.update(id, body);
      }
      navigate('/lessons');
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: 32 }} className="empty">Loading…</div>;

  return (
    <div style={{ padding: '24px 32px', maxWidth: 1500, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <button className="btn ghost sm" onClick={() => navigate('/lessons')}>← Back</button>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.4 }}>
            {isNew ? 'New lesson' : 'Edit lesson'}
          </div>
          <div style={{ fontSize: 12, color: MRN.mute, fontWeight: 600, marginTop: 2 }}>
            {isNew ? 'Write rich HTML content with a live preview' : `Editing ID ${id}`}
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
          <button className="btn ghost" onClick={() => navigate('/lessons')}>Cancel</button>
          <button className="btn" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : 'Save lesson'}
          </button>
        </div>
      </div>

      {err && <div className="banner err">{err}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <div className="card" style={{ padding: 18, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="field" style={{ marginBottom: 12 }}>
              <label className="label">Module</label>
              <select className="select" value={form.module_id} onChange={set('module_id')}>
                <option value="">Choose a module…</option>
                {modules.map((m) => (
                  <option key={m.id} value={m.id}>{m.title}</option>
                ))}
              </select>
            </div>
            <div className="field" style={{ marginBottom: 12 }}>
              <label className="label">Lesson order</label>
              <input className="input" type="number" value={form.lesson_order ?? 0} onChange={set('lesson_order')}/>
            </div>
          </div>

          <div className="field" style={{ marginBottom: 12 }}>
            <label className="label">Title</label>
            <input className="input" value={form.title} onChange={set('title')} placeholder="JSX in 5 minutes"/>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: 12 }}>
            <div className="field" style={{ marginBottom: 12 }}>
              <label className="label">Description</label>
              <input className="input" value={form.description || ''} onChange={set('description')} placeholder="Quick intro to JSX"/>
            </div>
            <div className="field" style={{ marginBottom: 12 }}>
              <label className="label">Read time (min)</label>
              <input className="input" type="number" value={form.read_time ?? 5} onChange={set('read_time')}/>
            </div>
          </div>

          <div className="field" style={{ marginBottom: 8 }}>
            <label className="label">Content templates</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {TEMPLATES.map((t) => (
                <button
                  key={t.label}
                  onClick={() => insertSnippet(t.snippet)}
                  style={{
                    padding: '6px 11px', borderRadius: 8,
                    background: MRN.cardAlt, color: MRN.inkSoft,
                    fontSize: 11, fontWeight: 700,
                    border: `1px solid ${MRN.rule}`,
                    fontFamily: MRN.mono,
                  }}>{t.label}</button>
              ))}
            </div>
          </div>

          <div className="field" style={{ marginBottom: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
            <label className="label">HTML content</label>
            <textarea
              ref={textareaRef}
              className="textarea"
              value={form.content || ''}
              onChange={set('content')}
              spellCheck={false}
              style={{
                flex: 1, minHeight: 360,
                fontFamily: MRN.mono, fontSize: 12.5, lineHeight: 1.6,
                background: MRN.ink, color: '#F5EFE6',
                border: `1px solid ${MRN.ink}`,
              }}
              placeholder="<h2>Hello</h2>\n<p>Start writing your lesson...</p>"
            />
          </div>
        </div>

        <div className="card" style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{
            padding: '14px 22px', borderBottom: `1px solid ${MRN.rule}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: MRN.card,
          }}>
            <div style={{ fontSize: 13, fontWeight: 800 }}>Live preview</div>
            <span className="pill">DOMPurify · highlight.js</span>
          </div>
          <div
            ref={previewRef}
            className="preview"
            style={{ padding: 24, overflowY: 'auto', maxHeight: 'calc(100vh - 180px)' }}
            dangerouslySetInnerHTML={{ __html: sanitized }}
          />
          {!form.content && (
            <div className="empty" style={{ padding: 30 }}>
              Preview will appear here as you type HTML on the left.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
