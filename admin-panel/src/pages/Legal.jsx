import { useEffect, useState } from 'react';
import { Legal as LegalAPI, apiBaseURL } from '../api/client';
import { MRN } from '../theme/tokens';

const SECTIONS = [
  {
    key: 'terms',
    title: 'Terms of Service',
    hint: 'Shown on the website Terms page and linked from the app footer.',
    placeholder: 'Enter the full Terms of Service text or HTML…',
  },
  {
    key: 'privacy',
    title: 'Privacy Policy',
    hint: 'Shown on the website Privacy page and linked from the app footer.',
    placeholder: 'Enter the full Privacy Policy text or HTML…',
  },
];

function formatUpdated(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString();
}

export default function Legal() {
  const [bodies, setBodies] = useState({ terms: '', privacy: '' });
  const [updatedAt, setUpdatedAt] = useState({ terms: null, privacy: null });
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState(null);
  const [err, setErr] = useState(null);
  const [ok, setOk] = useState(null);

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const results = await Promise.all(SECTIONS.map((s) => LegalAPI.get(s.key)));
      const nextBodies = {};
      const nextUpdated = {};
      SECTIONS.forEach((s, i) => {
        nextBodies[s.key] = results[i]?.body || '';
        nextUpdated[s.key] = results[i]?.updated_at || null;
      });
      setBodies(nextBodies);
      setUpdatedAt(nextUpdated);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || 'Failed to load legal content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const setBody = (key) => (e) => setBodies((b) => ({ ...b, [key]: e.target.value }));

  const save = async (key, title) => {
    setErr(null);
    setOk(null);
    setSavingKey(key);
    try {
      const data = await LegalAPI.update(key, bodies[key]);
      setUpdatedAt((u) => ({ ...u, [key]: data?.updated_at || new Date().toISOString() }));
      setOk(`${title} saved.`);
      setTimeout(() => setOk(null), 3000);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || 'Could not save');
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div className="page-title">Legal</div>
        <div className="page-sub">
          Terms of Service and Privacy Policy — served from the API and shown on the website
        </div>
      </div>

      {err && <div className="banner err">{err}</div>}
      {ok && <div className="banner ok">{ok}</div>}

      {SECTIONS.map((s) => {
        const updated = formatUpdated(updatedAt[s.key]);
        return (
          <div className="card" style={{ marginBottom: 22 }} key={s.key}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div>
                <div className="section-title">{s.title}</div>
                <div style={{ fontSize: 13, color: MRN.mute, fontWeight: 600, marginTop: 4, fontFamily: MRN.mono }}>
                  PUT {apiBaseURL}/api/legal/{s.key}
                </div>
              </div>
              <button
                className="btn"
                onClick={() => save(s.key, s.title)}
                disabled={loading || savingKey === s.key}>
                {savingKey === s.key ? 'Saving…' : 'Save changes'}
              </button>
            </div>

            {loading ? (
              <div className="empty">Loading…</div>
            ) : (
              <div className="field" style={{ marginTop: 12 }}>
                <label className="label">{s.title} content</label>
                <textarea
                  className="textarea"
                  rows={16}
                  value={bodies[s.key]}
                  onChange={setBody(s.key)}
                  placeholder={s.placeholder}
                  style={{ fontFamily: MRN.mono }}
                />
                <div style={{ fontSize: 12, color: MRN.mute, marginTop: 4 }}>
                  {s.hint}{updated ? ` · Last updated ${updated}` : ''}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
