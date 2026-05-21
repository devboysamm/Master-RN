const Legal = require('../models/LegalContent');

const ALLOWED_KEYS = ['terms', 'privacy'];

async function get(req, res, next) {
  try {
    const { key } = req.params;
    if (!ALLOWED_KEYS.includes(key)) {
      return res.status(400).json({ success: false, message: 'Invalid legal key' });
    }
    const row = await Legal.get(key);
    // Always return a shell so the consumer has a body to render/edit.
    res.json({ success: true, data: row || { key, body: '', updated_at: null } });
  } catch (err) {
    next(err);
  }
}

async function put(req, res, next) {
  try {
    const { key } = req.params;
    if (!ALLOWED_KEYS.includes(key)) {
      return res.status(400).json({ success: false, message: 'Invalid legal key' });
    }
    const body = typeof req.body.body === 'string' ? req.body.body : '';
    const data = await Legal.upsert(key, body);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = { get, put };
