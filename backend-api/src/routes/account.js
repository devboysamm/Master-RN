const express = require('express');
const ctrl = require('../controllers/authController');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

// DELETE /api/account — the logged-in user permanently deletes their own
// account and all personal data. Behind normal user auth (not admin).
router.delete('/', requireAuth, ctrl.deleteAccount);

module.exports = router;
