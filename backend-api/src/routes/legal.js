const express = require('express');
const ctrl = require('../controllers/legalController');
const requireAdmin = require('../middlewares/requireAdmin');

const router = express.Router();

// GET stays PUBLIC so the app/website can render Terms & Privacy.
router.get('/:key', ctrl.get);
// Editing the content is admin-only.
router.put('/:key', requireAdmin, ctrl.put);

module.exports = router;
