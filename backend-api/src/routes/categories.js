const express = require('express');
const ctrl = require('../controllers/categoriesController');
const requireAdmin = require('../middlewares/requireAdmin');

const router = express.Router();

// Reads stay PUBLIC (app/website browse categories).
router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);
router.get('/:id/modules', ctrl.listCategoryModules);
// Writes are admin-only.
router.post('/', requireAdmin, ctrl.create);
router.put('/:id', requireAdmin, ctrl.update);
router.delete('/:id', requireAdmin, ctrl.remove);
router.post('/:id/modules', requireAdmin, ctrl.addModule);
router.delete('/:id/modules/:moduleId', requireAdmin, ctrl.removeModule);

module.exports = router;
