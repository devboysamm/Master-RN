const express = require('express');
const ctrl = require('../controllers/authController');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

router.post('/signup', ctrl.signup);
router.post('/verify-otp', ctrl.verifyOtp);
router.post('/login', ctrl.login);
router.post('/forgot-password', ctrl.forgotPassword);
router.post('/reset-password', ctrl.resetPassword);
// GitHub OAuth (public): app gets the authorize URL from /start, GitHub
// redirects back to /callback which deep-links the signed JWT into the app.
router.get('/github/start', ctrl.githubStart);
router.get('/github/callback', ctrl.githubCallback);
router.get('/me', requireAuth, ctrl.me);
router.patch('/me', requireAuth, ctrl.updateMe);

module.exports = router;
