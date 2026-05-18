const fs = require('fs');
const path = require('path');
const multer = require('multer');

const UPLOADS_DIR = path.join(__dirname, '..', '..', 'public', 'uploads');
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const ALLOWED_EXTS = new Set(['.png', '.jpg', '.jpeg', '.svg', '.webp', '.gif']);
const ALLOWED_MIMES = new Set([
  'image/png', 'image/jpeg', 'image/svg+xml', 'image/webp', 'image/gif',
]);
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

function sanitizeBase(name) {
  const base = path.basename(name).normalize('NFKD').replace(/[^\w.-]+/g, '-');
  return base.slice(0, 80) || 'file';
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const stem = path.basename(file.originalname, ext);
    cb(null, `${Date.now()}-${sanitizeBase(stem)}${ext}`);
  },
});

function fileFilter(_req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_EXTS.has(ext) || !ALLOWED_MIMES.has(file.mimetype)) {
    return cb(new Error('Unsupported file type. Allowed: png, jpg, svg, webp, gif.'));
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_BYTES },
});

function buildUrl(req, filename) {
  const protocol = req.protocol || 'http';
  const host = req.get('host');
  return `${protocol}://${host}/uploads/${filename}`;
}

function uploadOne(req, res, next) {
  upload.single('image')(req, res, (err) => {
    if (err) {
      const status = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
      return res.status(status).json({ success: false, message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded (field "image").' });
    }
    res.status(201).json({
      success: true,
      data: {
        url: buildUrl(req, req.file.filename),
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    });
  });
  // We intentionally do not call next() — multer calls our callback above.
  void next;
}

async function list(req, res, next) {
  try {
    const entries = await fs.promises.readdir(UPLOADS_DIR, { withFileTypes: true });
    const files = await Promise.all(
      entries
        .filter((e) => e.isFile() && ALLOWED_EXTS.has(path.extname(e.name).toLowerCase()))
        .map(async (e) => {
          const stat = await fs.promises.stat(path.join(UPLOADS_DIR, e.name));
          return {
            filename: e.name,
            url: buildUrl(req, e.name),
            size: stat.size,
            uploaded_at: stat.mtime.toISOString(),
          };
        })
    );
    files.sort((a, b) => b.uploaded_at.localeCompare(a.uploaded_at));
    res.json({ success: true, data: files });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const filename = req.params.filename;
    // Hard guard against path traversal.
    if (!filename || filename.includes('/') || filename.includes('\\') || filename.includes('..')) {
      return res.status(400).json({ success: false, message: 'Invalid filename.' });
    }
    const full = path.join(UPLOADS_DIR, filename);
    if (!full.startsWith(UPLOADS_DIR + path.sep)) {
      return res.status(400).json({ success: false, message: 'Invalid filename.' });
    }
    try {
      await fs.promises.unlink(full);
    } catch (e) {
      if (e.code === 'ENOENT') {
        return res.status(404).json({ success: false, message: 'File not found.' });
      }
      throw e;
    }
    res.json({ success: true, message: 'File deleted.', data: { filename } });
  } catch (err) {
    next(err);
  }
}

module.exports = { uploadOne, list, remove, UPLOADS_DIR };
