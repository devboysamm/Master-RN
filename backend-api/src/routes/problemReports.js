const express = require('express');
const ctrl = require('../controllers/problemReportsController');
const requireAdmin = require('../middlewares/requireAdmin');

const router = express.Router();

// POST is PUBLIC — the mobile app submits reports without auth.
router.post('/', ctrl.create);

// GET (list) + PATCH (status) are ADMIN-ONLY.
router.get('/', requireAdmin, ctrl.list);
router.patch('/:id', requireAdmin, ctrl.updateStatus);

module.exports = router;
