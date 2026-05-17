import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Modules, Lessons, Health } from '../api/client';
import { MRN } from '../theme/tokens';
import KPICard from '../components/KPICard';

const ICONS = {
  layers: 'M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 18l9 5 9-5',
  code:   'M9 8l-5 4 5 4M15 8l5 4-5 4M14 4l-4 16',
  clock:  'M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2',
  globe:  'M12 21a9 9 0 100-18 9 9 0 000 18zM3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18',
  plus:   'M12 5v14M5 12h14',
  edit:   'M4 20h4l11-11-4-4L4 16v4zM14 6l4 4',
  gear:   'M12 15a3 3 0 100-6 3 3 0 000 6z',
  refresh:'M3 12a9 9 0 0115-6.7L21 8M21 3v5h-5M21 12a9 9 0 01-15 6.7L3 16M3 21v-5h5',
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [latestLessons, setLatestLessons] = useState([]);
  const [health, setHealth] = useState({ status: 'checking' });
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const mods = await Modules.list();
      const list = Array.isArray(mods) ? mods : [];
      setModules(list);

      const lessonsByMod = await Promise.all(
        list.slice(0, 6).map((m) => Modules.lessons(m.id).catch(() => []))
      );
      const flat = lessonsByMod.flatMap((arr, i) =>
        (arr || []).map((l) => ({ ...l, module_title: list[i]?.title }))
      );
      setLatestLessons(flat.slice(-6).reverse());

      try {
        const h = await Health.check();
        setHealth({ status: 'ok', ...h });
      } catch {
        setHealth({ status: 'down' });
      }
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const totalLessons = latestLessons.length;
  const lessonsCount = modules.reduce((sum, m) => sum + (m.lesson_count || 0), 0) || totalLessons;
  const avgRead = (() => {
    const times = latestLessons.map((l) => l.read_time).filter(Boolean);
    if (!times.length) return '—';
    return (times.reduce((a, b) => a + b, 0) / times.length).toFixed(1) + 'm';
  })();

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1600, margin: '0 auto' }}>
      <div className="page-head">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-sub">Welcome back · Master RN admin</div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn ghost" onClick={load}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={ICONS.refresh}/></svg>
            Refresh
          </button>
          <button className="btn" onClick={() => navigate('/lessons/new')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d={ICONS.plus}/></svg>
            New lesson
          </button>
        </div>
      </div>

      {err && <div className="banner err">{err}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, marginBottom: 28 }}>
        <KPICard label="Modules" value={loading ? '—' : modules.length} sub="Across the catalog" accent={MRN.coral} icon={ICONS.layers}/>
        <KPICard label="Lessons" value={loading ? '—' : lessonsCount} sub="All authored lessons" accent={MRN.yellow} icon={ICONS.code}/>
        <KPICard label="Avg read time" value={loading ? '—' : avgRead} sub="From latest lessons" accent={MRN.mint} icon={ICONS.clock}/>
        <KPICard label="API health" value={health.status === 'ok' ? 'Healthy' : health.status === 'down' ? 'Down' : '…'} sub={health.message || 'GET /health'} accent={health.status === 'ok' ? MRN.ok : MRN.coralDeep} icon={ICONS.globe}/>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 18 }}>
        <div className="card" style={{ padding: 0 }}>
          <div style={{
            padding: '22px 26px', borderBottom: `1px solid ${MRN.rule}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div className="section-title">Latest lessons</div>
            <Link to="/lessons" style={{ fontSize: 14, color: MRN.coral, fontWeight: 700 }}>View all →</Link>
          </div>
          {latestLessons.length === 0 ? (
            <div className="empty">{loading ? 'Loading…' : 'No lessons yet. Create one to get started.'}</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Module</th>
                  <th style={{ textAlign: 'right' }}>Read time</th>
                  <th style={{ textAlign: 'right', width: 120 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {latestLessons.map((l) => (
                  <tr key={l.id}>
                    <td style={{ fontWeight: 700, color: MRN.ink }}>{l.title}</td>
                    <td style={{ color: MRN.inkSoft }}>{l.module_title}</td>
                    <td style={{ textAlign: 'right', fontFamily: MRN.mono, color: MRN.mute, fontSize: 14 }}>
                      {l.read_time}m
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn ghost sm" onClick={() => navigate(`/lessons/${l.id}`)}>Open</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '22px 26px', borderBottom: `1px solid ${MRN.rule}` }}>
            <div className="section-title">Quick actions</div>
            <div style={{ fontSize: 14, color: MRN.mute, fontWeight: 600, marginTop: 4 }}>Jump straight in</div>
          </div>
          <div style={{ padding: 22, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <QuickAction label="New module"    icon={ICONS.plus}    onClick={() => navigate('/modules/new')} accent={MRN.coral}/>
            <QuickAction label="New lesson"    icon={ICONS.edit}    onClick={() => navigate('/lessons/new')} accent={MRN.yellow}/>
            <QuickAction label="Manage modules" icon={ICONS.layers} onClick={() => navigate('/modules')}     accent={MRN.mint}/>
            <QuickAction label="App content"   icon={ICONS.gear}    onClick={() => navigate('/settings')}    accent={MRN.coralDeep}/>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickAction({ label, icon, onClick, accent }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '18px 18px', borderRadius: 16,
      background: '#fff', border: `1px solid ${MRN.rule}`,
      fontSize: 15, fontWeight: 700, color: MRN.ink,
      textAlign: 'left', width: '100%',
      transition: 'background 0.15s, border-color 0.15s',
    }}
    onMouseEnter={(e) => e.currentTarget.style.borderColor = accent}
    onMouseLeave={(e) => e.currentTarget.style.borderColor = MRN.rule}>
      <div style={{
        width: 40, height: 40, borderRadius: 11,
        background: `${accent}22`, color: accent,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d={icon}/></svg>
      </div>
      <span>{label}</span>
    </button>
  );
}
