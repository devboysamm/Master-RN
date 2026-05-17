import { useEffect } from 'react';
import { MRN } from '../theme/tokens';

export default function Modal({ open, onClose, title, children, footer, width = 520 }) {
  useEffect(() => {
    if (!open) return;
    const handler = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(22,19,17,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20, backdropFilter: 'blur(2px)',
      }}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: width, maxHeight: '90vh',
          background: MRN.cream, borderRadius: 22,
          boxShadow: '0 30px 80px rgba(0,0,0,0.30)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
        <div style={{
          padding: '18px 24px', borderBottom: `1px solid ${MRN.rule}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: MRN.card,
        }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: MRN.ink }}>{title}</div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 8, color: MRN.inkSoft,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18"/>
            </svg>
          </button>
        </div>
        <div style={{ padding: 24, overflowY: 'auto', flex: 1 }}>
          {children}
        </div>
        {footer && (
          <div style={{
            padding: '14px 24px', borderTop: `1px solid ${MRN.rule}`,
            background: MRN.card, display: 'flex', justifyContent: 'flex-end', gap: 10,
          }}>{footer}</div>
        )}
      </div>
    </div>
  );
}
