const jwt = require('jsonwebtoken');

/**
 * Express middleware: requires a valid `Authorization: Bearer <token>`.
 * On success attaches `req.user = { id }` (id = JWT `sub`). Returns 401
 * on a missing/malformed/invalid/expired token. Exported for reuse by
 * any route that needs to be behind login.
 */
function requireAuth(req, res, next) {
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
    req.user = { id: Number(payload.sub) };
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = requireAuth;
