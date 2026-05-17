import { MRN } from '../theme/tokens';

export default function KPICard({ label, value, sub, accent = MRN.coral, icon }) {
  return (
    <div style={{
      background: MRN.card,
      borderRadius: 22,
      padding: '26px 28px',
      border: `1px solid ${MRN.rule}`,
      position: 'relative',
      overflow: 'hidden',
      minHeight: 168,
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          fontSize: 12, fontWeight: 700, color: MRN.mute,
          letterSpacing: 0.6, textTransform: 'uppercase',
        }}>{label}</div>
        {icon && (
          <div style={{
            width: 38, height: 38, borderRadius: 11,
            background: `${accent}22`, color: accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={icon}/>
            </svg>
          </div>
        )}
      </div>
      <div style={{
        fontSize: 52, fontWeight: 800, color: MRN.ink,
        letterSpacing: -1.4, marginTop: 14, lineHeight: 1,
      }}>{value}</div>
      {sub && (
        <div style={{
          fontSize: 14, fontWeight: 600, color: MRN.mute, marginTop: 10,
        }}>{sub}</div>
      )}
      <div style={{
        position: 'absolute', right: -30, bottom: -30,
        width: 120, height: 120, borderRadius: '50%',
        background: `${accent}10`, pointerEvents: 'none',
      }}/>
    </div>
  );
}
