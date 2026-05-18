import { useEffect, useRef, useState } from 'react';
import { Uploads } from '../api/client';
import { MRN } from '../theme/tokens';
import Modal from './Modal';

const ACCEPT = 'image/png,image/jpeg,image/svg+xml,image/webp,image/gif';

function formatSize(bytes) {
  if (bytes == null) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function ImagePicker({ value, onChange, placeholder = 'No image set' }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState(null);
  const [browsing, setBrowsing] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    setErr(null);
    try {
      const { url } = await Uploads.upload(file);
      onChange(url);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const onFileInput = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
    e.target.value = ''; // allow re-uploading the same file
  };

  const clear = () => onChange('');

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        onChange={onFileInput}
        style={{ display: 'none' }}
      />

      <div style={{
        display: 'flex', alignItems: 'center', gap: 16, padding: 12,
        background: '#fff', border: `1px solid ${MRN.rule}`, borderRadius: 14,
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: 12, flexShrink: 0,
          background: MRN.cardAlt,
          border: `1px solid ${MRN.rule}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
        }}>
          {value ? (
            <img src={value} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ fontSize: 11, fontFamily: MRN.mono, color: MRN.mute, fontWeight: 700, textAlign: 'center', padding: 4 }}>
              {placeholder}
            </div>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: MRN.mono, fontSize: 12, color: MRN.inkSoft, fontWeight: 600,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {value || '—'}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn ghost sm"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}>
              {uploading ? 'Uploading…' : 'Upload'}
            </button>
            <button
              type="button"
              className="btn ghost sm"
              onClick={() => setBrowsing(true)}
              disabled={uploading}>
              Browse library
            </button>
            {value && (
              <button
                type="button"
                className="btn ghost sm"
                onClick={clear}
                style={{ color: MRN.coralDeep }}>
                Remove
              </button>
            )}
          </div>
          {err && (
            <div style={{ marginTop: 8, fontSize: 12, color: MRN.coralDeep, fontWeight: 600 }}>
              {err}
            </div>
          )}
        </div>
      </div>

      <LibraryModal
        open={browsing}
        onClose={() => setBrowsing(false)}
        onPick={(url) => { onChange(url); setBrowsing(false); }}
        selected={value}
      />
    </div>
  );
}

function LibraryModal({ open, onClose, onPick, selected }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setErr(null);
    Uploads.list()
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch((e) => setErr(e?.response?.data?.message || e.message))
      .finally(() => setLoading(false));
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Media library"
      width={780}
      footer={<button className="btn ghost" onClick={onClose}>Close</button>}>
      {err && <div className="banner err">{err}</div>}
      {loading ? (
        <div className="empty">Loading…</div>
      ) : items.length === 0 ? (
        <div className="empty">No uploads yet. Use the Media page to add files.</div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 12,
        }}>
          {items.map((it) => {
            const isSel = selected === it.url;
            return (
              <button
                key={it.filename}
                type="button"
                onClick={() => onPick(it.url)}
                style={{
                  background: '#fff',
                  border: `2px solid ${isSel ? MRN.coral : MRN.rule}`,
                  borderRadius: 12,
                  padding: 8,
                  cursor: 'pointer',
                  textAlign: 'left',
                  overflow: 'hidden',
                }}>
                <div style={{
                  width: '100%', aspectRatio: '1 / 1',
                  background: MRN.cardAlt, borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden', marginBottom: 8,
                }}>
                  <img src={it.url} alt={it.filename} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{
                  fontSize: 12, fontWeight: 700, color: MRN.ink,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {it.filename}
                </div>
                <div style={{ fontSize: 11, color: MRN.mute, fontFamily: MRN.mono, fontWeight: 600, marginTop: 2 }}>
                  {formatSize(it.size)}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </Modal>
  );
}
