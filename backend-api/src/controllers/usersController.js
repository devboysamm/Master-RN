const bcrypt = require('bcryptjs');
const User = require('../models/User');

const BCRYPT_ROUNDS = 10;

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// Admin listing of registered users. Returns { success, data } to match the
// existing content endpoints. Password hashes are never selected/returned.
async function list(req, res, next) {
  try {
    const data = await User.findAll();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: 'Invalid user id' });
    const user = await User.findById(id); // SAFE_COLS — no password_hash
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: 'Invalid user id' });

    const fields = {};
    if (Object.prototype.hasOwnProperty.call(req.body, 'name')) {
      const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
      if (name.length < 1 || name.length > 120) {
        return res.status(400).json({ success: false, message: 'Name must be between 1 and 120 characters' });
      }
      fields.name = name;
    }
    if (Object.prototype.hasOwnProperty.call(req.body, 'email_verified')) {
      fields.email_verified = req.body.email_verified ? 1 : 0;
    }
    if (Object.keys(fields).length === 0) {
      return res.status(400).json({ success: false, message: 'Nothing to update' });
    }

    const existing = await User.findById(id);
    if (!existing) return res.status(404).json({ success: false, message: 'User not found' });

    const user = await User.adminUpdate(id, fields);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: 'Invalid user id' });
    const affected = await User.remove(id);
    if (!affected) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: { id } });
  } catch (err) {
    next(err);
  }
}

async function resetPassword(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: 'Invalid user id' });

    const newPassword = req.body.newPassword;
    if (typeof newPassword !== 'string' || newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }

    const existing = await User.findById(id);
    if (!existing) return res.status(404).json({ success: false, message: 'User not found' });

    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    await User.setPasswordHash(id, passwordHash);
    res.json({ success: true, data: { id } });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getOne, update, remove, resetPassword };
