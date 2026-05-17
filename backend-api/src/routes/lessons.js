const express = require('express');
const ctrl = require('../controllers/lessonsController');

const router = express.Router();

router.get('/lessons/:id', ctrl.getOne);
router.get('/lesson/:id', ctrl.getOne);
router.post('/lessons', ctrl.create);
router.put('/lessons/:id', ctrl.update);
router.delete('/lessons/:id', ctrl.remove);

module.exports = router;
