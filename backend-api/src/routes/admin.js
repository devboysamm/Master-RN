const express = require('express');
const ctrl = require('../controllers/adminAuthController');
const requireAdmin = require('../middlewares/requireAdmin');

const router = express.Router();

router.post('/login', ctrl.login);
router.get('/me', requireAdmin, ctrl.me);

module.exports = router;
