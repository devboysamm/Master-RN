const jwt = require('jsonwebtoken');

/**
 * Express middleware: requires a valid admin JWT in the
 * `Authorization: Bearer <token>` header. The token must carry role: 'admin'
 * (issued by POST /api/admin/login). On success attaches `req.admin = { id }`.
 * Responds 401 on a missing/malformed/invalid/expired or non-admin token.
 */
function requireAdmin(req, res, next) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ error: 'Auth is not configured' });
  }

  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' });
  }

  try {
    const payload = jwt.verify(token, secret);
    if (payload.role !== 'admin') {
      return res.status(401).json({ error: 'Admin access required' });
    }
    req.admin = { id: Number(payload.sub) };
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = requireAdmin;
