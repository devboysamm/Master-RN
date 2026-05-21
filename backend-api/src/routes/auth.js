const express = require('express');
const ctrl = require('../controllers/authController');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

router.post('/signup', ctrl.signup);
router.post('/verify-otp', ctrl.verifyOtp);
router.post('/login', ctrl.login);
router.post('/forgot-password', ctrl.forgotPassword);
router.post('/reset-password', ctrl.resetPassword);
router.get('/me', requireAuth, ctrl.me);
router.patch('/me', requireAuth, ctrl.updateMe);

module.exports = router;
