const express = require('express');
const ctrl = require('../controllers/modulesController');
const requireAdmin = require('../middlewares/requireAdmin');

const router = express.Router();

// Reads stay PUBLIC (the mobile app reads modules + their lessons).
router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);
router.get('/:id/lessons', ctrl.listLessons);
// Writes are admin-only.
router.post('/', requireAdmin, ctrl.create);
router.put('/:id', requireAdmin, ctrl.update);
router.delete('/:id', requireAdmin, ctrl.remove);

module.exports = router;
