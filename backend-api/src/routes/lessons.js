const express = require('express');
const ctrl = require('../controllers/lessonsController');
const requireAdmin = require('../middlewares/requireAdmin');

const router = express.Router();

// Reads stay PUBLIC (the mobile app reads lessons).
router.get('/lessons/:id', ctrl.getOne);
router.get('/lesson/:id', ctrl.getOne);
// Writes are admin-only.
router.post('/lessons', requireAdmin, ctrl.create);
router.put('/lessons/:id', requireAdmin, ctrl.update);
router.delete('/lessons/:id', requireAdmin, ctrl.remove);

module.exports = router;
