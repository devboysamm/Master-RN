const User = require('../models/User');

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

module.exports = { list };
