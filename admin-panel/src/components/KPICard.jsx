import { MRN } from '../theme/tokens';

export default function KPICard({ label, value, sub, accent = MRN.coral, icon }) {
  return (
    <div style={{
      background: MRN.card,
      borderRadius: 22,
      padding: '20px 22px',
      border: `1px solid ${MRN.rule}`,
      position: 'relative',
      overflow: 'hidden',
      minHeight: 124,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          fontSize: 11, fontWeight: 700, color: MRN.mute,
          letterSpacing: 0.5, textTransform: 'uppercase',
        }}>{label}</div>
        {icon && (
          <div style={{
            width: 30, height: 30, borderRadius: 10,
            background: `${accent}22`, color: accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={icon}/>
            </svg>
          </div>
        )}
      </div>
      <div style={{
        fontSize: 32, fontWeight: 800, color: MRN.ink,
        letterSpacing: -0.8, marginTop: 8, lineHeight: 1.05,
      }}>{value}</div>
      {sub && (
        <div style={{
          fontSize: 12, fontWeight: 600, color: MRN.mute, marginTop: 6,
        }}>{sub}</div>
      )}
      <div style={{
        position: 'absolute', right: -20, bottom: -20,
        width: 80, height: 80, borderRadius: '50%',
        background: `${accent}10`, pointerEvents: 'none',
      }}/>
    </div>
  );
}
