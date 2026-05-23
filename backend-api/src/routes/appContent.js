const express = require('express');
const ctrl = require('../controllers/appContentController');
const requireAdmin = require('../middlewares/requireAdmin');

const router = express.Router();

// GET stays PUBLIC so the app/website can read app content.
router.get('/', ctrl.get);
// Editing app content is admin-only.
router.put('/', requireAdmin, ctrl.put);

module.exports = router;
