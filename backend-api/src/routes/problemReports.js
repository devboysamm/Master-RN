const express = require('express');
const ctrl = require('../controllers/problemReportsController');

const router = express.Router();

// POST is PUBLIC — the mobile app submits reports without auth.
router.post('/', ctrl.create);

// GET (list) + PATCH (status) are ADMIN-ONLY. The requireAdmin guard is
// attached in Part B (admin auth lockdown).
router.get('/', ctrl.list);
router.patch('/:id', ctrl.updateStatus);

module.exports = router;
