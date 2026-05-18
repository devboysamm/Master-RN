const express = require('express');
const ctrl = require('../controllers/categoriesController');

const router = express.Router();

router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);
router.get('/:id/modules', ctrl.listCategoryModules);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);
router.post('/:id/modules', ctrl.addModule);
router.delete('/:id/modules/:moduleId', ctrl.removeModule);

module.exports = router;
