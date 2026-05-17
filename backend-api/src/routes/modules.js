const express = require('express');
const ctrl = require('../controllers/modulesController');

const router = express.Router();

router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);
router.get('/:id/lessons', ctrl.listLessons);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
