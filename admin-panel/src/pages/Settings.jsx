import { useEffect, useState } from 'react';
import { AppContent, Health, Modules as ModulesAPI, apiBaseURL } from '../api/client';
import { MRN } from '../theme/tokens';

const emptyContent = {
  welcome_title: '',
  welcome_description: '',
  motivation_text: '',
  motivation_quote: '',
  welcome_subtitle: '',
  welcome_footer: '',
  app_description: '',
  terms_url: '',
  privacy_url: '',
  featured_module_id: '',
  premium_title: '',
  premium_description: '',
  support_email: '',
  contact_url: '',
  help_content: '',
};

// Only these are server-side required. Welcome screen extras + URLs are optional.
const REQUIRED_KEYS = ['welcome_title', 'welcome_description', 'motivation_text', 'motivation_quote'];

export default function Settings() {
  const [health, setHealth] = useState({ status: 'idle' });
  const [content, setContent] = useState(emptyContent);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);
  const [ok, setOk] = useState(null);

  const checkHealth = async () => {
    setHealth({ status: 'checking' });
    try {
      const h = await Health.check();
      setHealth({ status: 'ok', ...h, at: new Date().toLocaleTimeString() });
    } catch (e) {
      setHealth({ status: 'down', error: e.message, at: new Date().toLocaleTimeString() });
    }
  };

  const loadContent = async () => {
    setLoading(true);
    try {
      const [c, mList] = await Promise.all([
        AppContent.get().catch((e) => {
          if (e?.response?.status === 404) return null;
          throw e;
        }),
        ModulesAPI.list().catch(() => []),
      ]);
      const merged = { ...emptyContent, ...(c || {}) };
      // Normalise featured_module_id to string so the <select> behaves.
      merged.featured_module_id = c?.featured_module_id != null ? String(c.featured_module_id) : '';
      setContent(merged);
      setModules(Array.isArray(mList) ? mList : []);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
    loadContent();
  }, []);

  const set = (k) => (e) => setContent((c) => ({ ...c, [k]: e.target.value }));

  const save = async () => {
    setErr(null);
    setOk(null);
    for (const k of REQUIRED_KEYS) {
      if (!(content[k] || '').trim()) {
        setErr('Welcome title, description, motivation heading and quote are required.');
        return;
      }
    }
    setSaving(true);
    try {
      const payload = {
        ...content,
        featured_module_id: content.featured_module_id ? Number(content.featured_module_id) : null,
      };
      await AppContent.update(payload);
      setOk('App content saved.');
      setTimeout(() => setOk(null), 3000);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message);
    } finally {
      setSaving(false);
    }
  };

  const dot = (color) => (
    <span style={{ width: 9, height: 9, borderRadius: 5, background: color, display: 'inline-block' }}/>
  );

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div className="page-title">Settings</div>
        <div className="page-sub">
          API health and app content shown on the mobile home screen
        </div>
      </div>

      {err && <div className="banner err">{err}</div>}
      {ok && <div className="banner ok">{ok}</div>}

      <div className="card" style={{ marginBottom: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div className="section-title">API health</div>
            <div style={{ fontSize: 13, color: MRN.mute, fontWeight: 600, marginTop: 4, fontFamily: MRN.mono }}>
              GET {apiBaseURL}/health
            </div>
          </div>
          <button className="btn ghost" onClick={checkHealth}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 0115-6.7L21 8M21 3v5h-5M21 12a9 9 0 01-15 6.7L3 16M3 21v-5h5"/>
            </svg>
            Re-check
          </button>
        </div>
        <div style={{
          padding: 20, borderRadius: 14,
          background: health.status === 'ok' ? '#DCEDE2' : health.status === 'down' ? '#FCD9CF' : MRN.cardAlt,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          {dot(health.status === 'ok' ? MRN.ok : health.status === 'down' ? MRN.coralDeep : MRN.mute)}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: MRN.ink }}>
              {health.status === 'ok' ? 'API is healthy' :
               health.status === 'down' ? 'API is unreachable' :
               health.status === 'checking' ? 'Checking…' : 'Idle'}
            </div>
            <div style={{ fontSize: 13, color: MRN.inkSoft, marginTop: 4 }}>
              {health.message || health.error || 'Press re-check to ping the backend.'}
            </div>
          </div>
          {health.at && (
            <div style={{ fontFamily: MRN.mono, fontSize: 12, color: MRN.mute, fontWeight: 700 }}>
              {health.at}
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div>
            <div className="section-title">App content</div>
            <div style={{ fontSize: 13, color: MRN.mute, fontWeight: 600, marginTop: 4 }}>
              Welcome card and motivation card on the mobile home screen
            </div>
          </div>
          <button className="btn" onClick={save} disabled={saving || loading}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>

        {loading ? (
          <div className="empty">Loading content…</div>
        ) : (
          <div style={{ marginTop: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              <div className="field">
                <label className="label">Welcome title</label>
                <input className="input" value={content.welcome_title} onChange={set('welcome_title')} placeholder="Master React Native"/>
              </div>
              <div className="field">
                <label className="label">Motivation heading</label>
                <input className="input" value={content.motivation_text} onChange={set('motivation_text')} placeholder="Daily Motivation"/>
              </div>
            </div>
            <div className="field">
              <label className="label">Welcome description</label>
              <textarea className="textarea" rows={3} value={content.welcome_description} onChange={set('welcome_description')} placeholder="A practical React Native course app…"/>
            </div>
            <div className="field">
              <label className="label">Motivation quote</label>
              <textarea className="textarea" rows={3} value={content.motivation_quote} onChange={set('motivation_quote')} placeholder="Keep up the great work!"/>
            </div>

            <div style={{ height: 1, background: MRN.rule, margin: '12px 0 8px' }} />
            <div style={{ fontSize: 13, color: MRN.mute, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
              Welcome screen (mobile)
            </div>

            <div className="field">
              <label className="label">Welcome subtitle</label>
              <textarea
                className="textarea"
                rows={2}
                value={content.welcome_subtitle}
                onChange={set('welcome_subtitle')}
                placeholder="Ship native apps with confidence — bite-sized lessons, real code."
              />
              <div style={{ fontSize: 12, color: MRN.mute, marginTop: 4 }}>
                Shown under the “Master RN” wordmark on the Welcome screen.
              </div>
            </div>

            <div className="field">
              <label className="label">App description</label>
              <textarea
                className="textarea"
                rows={3}
                value={content.app_description}
                onChange={set('app_description')}
                placeholder="Master RN is a practical, bite-sized course to ship your first native app."
              />
              <div style={{ fontSize: 12, color: MRN.mute, marginTop: 4 }}>
                Marketing-style description. Used in About / store listings.
              </div>
            </div>

            <div className="field">
              <label className="label">Welcome footer text</label>
              <input
                className="input"
                value={content.welcome_footer}
                onChange={set('welcome_footer')}
                placeholder="By continuing you agree to our"
              />
              <div style={{ fontSize: 12, color: MRN.mute, marginTop: 4 }}>
                Sits before the Terms &amp; Privacy links at the bottom of Welcome.
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              <div className="field">
                <label className="label">Terms URL</label>
                <input
                  className="input"
                  value={content.terms_url}
                  onChange={set('terms_url')}
                  placeholder="https://masterreactnative.dev/terms-condition"
                />
              </div>
              <div className="field">
                <label className="label">Privacy URL</label>
                <input
                  className="input"
                  value={content.privacy_url}
                  onChange={set('privacy_url')}
                  placeholder="https://masterreactnative.dev/privacy"
                />
              </div>
            </div>

            <div style={{ height: 1, background: MRN.rule, margin: '12px 0 8px' }} />
            <div style={{ fontSize: 13, color: MRN.mute, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
              Home screen (mobile)
            </div>

            <div className="field">
              <label className="label">Featured module</label>
              <select
                className="input"
                value={content.featured_module_id}
                onChange={set('featured_module_id')}>
                <option value="">— None (hide featured section) —</option>
                {modules.map((m) => (
                  <option key={m.id} value={m.id}>
                    {String(m.order_index || m.id).padStart(2, '0')} · {m.title}
                  </option>
                ))}
              </select>
              <div style={{ fontSize: 12, color: MRN.mute, marginTop: 4 }}>
                Shown as the yellow “Featured module” card on Home. Leave blank to hide it.
              </div>
            </div>

            <div style={{ height: 1, background: MRN.rule, margin: '12px 0 8px' }} />
            <div style={{ fontSize: 13, color: MRN.mute, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
              Premium teaser (mobile)
            </div>

            <div className="field">
              <label className="label">Premium title</label>
              <input
                className="input"
                value={content.premium_title}
                onChange={set('premium_title')}
                placeholder="Unlock advanced patterns"
              />
              <div style={{ fontSize: 12, color: MRN.mute, marginTop: 4 }}>
                Leave blank to hide the Premium section on Home.
              </div>
            </div>
            <div className="field">
              <label className="label">Premium description</label>
              <textarea
                className="textarea"
                rows={3}
                value={content.premium_description}
                onChange={set('premium_description')}
                placeholder="Deep dives, source code, and weekly office hours."
              />
            </div>

            <div style={{ height: 1, background: MRN.rule, margin: '12px 0 8px' }} />
            <div style={{ fontSize: 13, color: MRN.mute, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
              About &amp; Support
            </div>

            <div className="field">
              <label className="label">About text</label>
              <textarea
                className="textarea"
                rows={4}
                value={content.app_description}
                onChange={set('app_description')}
                placeholder="Master RN is a practical, bite-sized course to ship your first native app."
              />
              <div style={{ fontSize: 12, color: MRN.mute, marginTop: 4 }}>
                Shown when the user taps “About Master RN” in the mobile Profile screen.
                (Same field as the App description above; edits sync.)
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              <div className="field">
                <label className="label">Support email</label>
                <input
                  className="input"
                  value={content.support_email}
                  onChange={set('support_email')}
                  placeholder="info@masterreactnative.dev"
                />
                <div style={{ fontSize: 12, color: MRN.mute, marginTop: 4 }}>
                  Displayed under “Help and feedback”.
                </div>
              </div>
              <div className="field">
                <label className="label">Contact page URL</label>
                <input
                  className="input"
                  value={content.contact_url}
                  onChange={set('contact_url')}
                  placeholder="https://masterreactnative.dev/contact-us"
                />
                <div style={{ fontSize: 12, color: MRN.mute, marginTop: 4 }}>
                  Opens in browser when the user taps “Help and feedback”.
                </div>
              </div>
            </div>

            <div className="field">
              <label className="label">Help page content (HTML)</label>
              <textarea
                className="textarea"
                rows={10}
                value={content.help_content}
                onChange={set('help_content')}
                placeholder={'<h2>Need a hand?</h2>\n<p>Email us at <a href="mailto:info@masterreactnative.dev">info@masterreactnative.dev</a></p>\n<h3>Report a bug</h3>\n<p>…</p>'}
                style={{ fontFamily: MRN.mono }}
              />
              <div style={{ fontSize: 12, color: MRN.mute, marginTop: 4 }}>
                Rendered on the mobile Help &amp; feedback screen. Supports
                <code style={{ background: MRN.cardAlt, padding: '0 4px', borderRadius: 3, margin: '0 4px' }}>&lt;h2&gt;</code>
                <code style={{ background: MRN.cardAlt, padding: '0 4px', borderRadius: 3, margin: '0 4px' }}>&lt;p&gt;</code>
                <code style={{ background: MRN.cardAlt, padding: '0 4px', borderRadius: 3, margin: '0 4px' }}>&lt;a&gt;</code>
                <code style={{ background: MRN.cardAlt, padding: '0 4px', borderRadius: 3, margin: '0 4px' }}>&lt;ul&gt;</code> etc.
                Leave blank to show “Content coming soon.”
              </div>
              {content.help_content?.trim() && (
                <div style={{
                  marginTop: 12, padding: 16, borderRadius: 12,
                  background: MRN.card, border: `1px solid ${MRN.rule}`,
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: MRN.mute, letterSpacing: 1, marginBottom: 8 }}>
                    PREVIEW
                  </div>
                  <div
                    style={{ fontSize: 14, lineHeight: 1.6, color: MRN.ink }}
                    dangerouslySetInnerHTML={{ __html: content.help_content }}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
