const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');

const JWT_EXPIRES_IN = '7d';

// Admin tokens carry role: 'admin' so requireAdmin can distinguish them from
// normal user tokens (which only carry `sub`). Reuses the shared JWT_SECRET.
function signAdminToken(adminId) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    const err = new Error('Auth is not configured');
    err.noSecret = true;
    throw err;
  }
  return jwt.sign({ sub: String(adminId), role: 'admin' }, secret, { expiresIn: JWT_EXPIRES_IN });
}

async function login(req, res) {
  try {
    const username = typeof req.body.username === 'string' ? req.body.username.trim() : '';
    const password = req.body.password;
    if (!username || typeof password !== 'string' || password.length === 0) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const admin = await AdminUser.findByUsername(username);
    // Same generic message whether the username or password is wrong.
    if (!admin || !admin.password_hash) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, admin.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signAdminToken(admin.id);
    return res.json({ token, admin: { id: admin.id, username: admin.username } });
  } catch (err) {
    if (err && err.noSecret) return res.status(500).json({ error: 'Auth is not configured' });
    console.error('[admin-auth] error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Verify a token is still valid (used by the panel on reload).
async function me(req, res) {
  try {
    const admin = await AdminUser.findById(req.admin.id);
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    return res.json({ admin });
  } catch (err) {
    console.error('[admin-auth] error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { login, me };
