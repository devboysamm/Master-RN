const express = require('express');
const ctrl = require('../controllers/notificationsController');
const requireAuth = require('../middlewares/requireAuth');
const requireAdmin = require('../middlewares/requireAdmin');

const router = express.Router();

// AUTHENTICATED user endpoints (mobile app).
router.post('/register-token', requireAuth, ctrl.registerToken);
router.get('/', requireAuth, ctrl.list);

// ADMIN ONLY — compose + broadcast a notification.
router.post('/send', requireAdmin, ctrl.send);

module.exports = router;
