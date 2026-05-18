import { useCallback, useEffect, useRef, useState } from 'react';
import { Uploads } from '../api/client';
import { MRN } from '../theme/tokens';
import Modal from '../components/Modal';

const ACCEPT = 'image/png,image/jpeg,image/svg+xml,image/webp,image/gif';

function formatSize(bytes) {
  if (bytes == null) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function Media() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [ok, setOk] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const data = await Uploads.list();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const uploadFiles = useCallback(async (fileList) => {
    const files = Array.from(fileList || []);
    if (files.length === 0) return;
    setUploading(true);
    setErr(null);
    let added = 0;
    let failed = 0;
    for (const f of files) {
      try {
        await Uploads.upload(f);
        added++;
      } catch (e) {
        failed++;
        console.error('Upload failed:', e?.response?.data?.message || e.message);
      }
    }
    setUploading(false);
    setOk(`Uploaded ${added}${failed ? ` · ${failed} failed` : ''}`);
    setTimeout(() => setOk(null), 2500);
    load();
  }, []);

  const onInputChange = (e) => {
    uploadFiles(e.target.files);
    e.target.value = '';
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    uploadFiles(e.dataTransfer.files);
  };

  const doDelete = async () => {
    if (!toDelete) return;
    try {
      await Uploads.remove(toDelete.filename);
      setToDelete(null);
      load();
    } catch (e) {
      alert(e?.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1400, margin: '0 auto' }}>
      <div className="page-head">
        <div>
          <div className="page-title">Media library</div>
          <div className="page-sub">
            {items.length} {items.length === 1 ? 'file' : 'files'} · uploaded images served from /uploads
          </div>
        </div>
        <button className="btn" onClick={() => inputRef.current?.click()} disabled={uploading}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
          {uploading ? 'Uploading…' : 'Upload'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          multiple
          onChange={onInputChange}
          style={{ display: 'none' }}
        />
      </div>

      {err && <div className="banner err">{err}</div>}
      {ok && <div className="banner ok">{ok}</div>}

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        style={{
          padding: 24, borderRadius: 14, marginBottom: 22,
          background: dragOver ? '#FFF3EE' : MRN.card,
          border: `2px dashed ${dragOver ? MRN.coral : MRN.rule}`,
          textAlign: 'center',
          transition: 'background 0.15s, border-color 0.15s',
        }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: MRN.ink }}>
          {dragOver ? 'Drop to upload' : 'Drag & drop images here, or click Upload above'}
        </div>
        <div style={{ fontSize: 12, color: MRN.mute, marginTop: 4 }}>
          PNG · JPG · SVG · WebP · GIF · max 5 MB each
        </div>
      </div>

      {loading ? (
        <div className="card"><div className="empty">Loading media…</div></div>
      ) : items.length === 0 ? (
        <div className="card"><div className="empty">No uploads yet. Drop a file above to get started.</div></div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 14,
        }}>
          {items.map((it) => (
            <MediaCard key={it.filename} item={it} onDelete={() => setToDelete(it)} />
          ))}
        </div>
      )}

      <Modal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="Delete file"
        footer={
          <>
            <button className="btn ghost" onClick={() => setToDelete(null)}>Cancel</button>
            <button className="btn" style={{ background: MRN.coralDeep, borderColor: MRN.coralDeep }} onClick={doDelete}>Delete</button>
          </>
        }>
        <div style={{ fontSize: 15, color: MRN.inkSoft, lineHeight: 1.6 }}>
          Delete <strong style={{ color: MRN.ink, fontFamily: MRN.mono, fontSize: 13 }}>{toDelete?.filename}</strong>?
          This is permanent — any modules or lessons referencing the URL will show a broken image.
        </div>
      </Modal>
    </div>
  );
}

function MediaCard({ item, onDelete }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(item.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };
  return (
    <div style={{
      background: '#fff', borderRadius: 14, padding: 10,
      border: `1px solid ${MRN.rule}`,
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        width: '100%', aspectRatio: '1 / 1', borderRadius: 10,
        background: MRN.cardAlt, marginBottom: 10, overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <img src={item.url} alt={item.filename} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{
        fontSize: 12, fontWeight: 700, color: MRN.ink,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {item.filename}
      </div>
      <div style={{
        fontSize: 11, color: MRN.mute, fontFamily: MRN.mono, fontWeight: 600,
        marginTop: 2,
      }}>
        {formatSize(item.size)}
      </div>
      <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
        <button className="btn ghost sm" onClick={copy} style={{ flex: 1 }}>
          {copied ? 'Copied!' : 'Copy URL'}
        </button>
        <button className="btn ghost sm" onClick={onDelete} style={{ color: MRN.coralDeep }}>
          Delete
        </button>
      </div>
    </div>
  );
}
