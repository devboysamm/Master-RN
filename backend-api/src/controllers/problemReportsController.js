const ProblemReport = require('../models/ProblemReport');

const VALID_STATUS = ['new', 'seen', 'resolved'];

// Trim a string field to a max length, returning null for empty/non-strings.
function clip(value, max) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : null;
}

// PUBLIC — the mobile app submits problem reports here.
async function create(req, res, next) {
  try {
    const message = typeof req.body.message === 'string' ? req.body.message.trim() : '';
    if (!message) {
      return res.status(400).json({ success: false, message: 'A problem description is required' });
    }
    const row = await ProblemReport.create({
      message: message.slice(0, 5000),
      category: clip(req.body.category, 40),
      app_version: clip(req.body.app_version, 40),
      platform: clip(req.body.platform, 40),
      user_email: clip(req.body.user_email, 190),
    });
    res.status(201).json({ success: true, data: row });
  } catch (err) {
    next(err);
  }
}

// ADMIN-ONLY — list every report, newest first.
async function list(req, res, next) {
  try {
    const data = await ProblemReport.findAll();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

// ADMIN-ONLY — update a report's triage status.
async function updateStatus(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid report id' });
    }
    const status = typeof req.body.status === 'string' ? req.body.status.trim() : '';
    if (!VALID_STATUS.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${VALID_STATUS.join(', ')}` });
    }
    const row = await ProblemReport.updateStatus(id, status);
    if (!row) return res.status(404).json({ success: false, message: 'Report not found' });
    res.json({ success: true, data: row });
  } catch (err) {
    next(err);
  }
}

module.exports = { create, list, updateStatus };
