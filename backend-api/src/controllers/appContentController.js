const AppContent = require('../models/AppContent');

const REQUIRED_FIELDS = ['welcome_title', 'welcome_description', 'motivation_text', 'motivation_quote'];

function validateAppContentPayload(body) {
  for (const field of REQUIRED_FIELDS) {
    const value = body[field];
    if (value == null || typeof value !== 'string' || value.trim() === '') {
      return `${field} is required`;
    }
  }
  return null;
}

async function get(req, res, next) {
  try {
    const data = await AppContent.get();
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function put(req, res, next) {
  try {
    const err = validateAppContentPayload(req.body);
    if (err) return res.status(400).json({ success: false, message: err });
    const data = await AppContent.upsert(req.body);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = { get, put };
