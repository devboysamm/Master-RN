const express = require('express');
const ctrl = require('../controllers/usersController');

const router = express.Router();

// TODO: protect all of these with admin auth (currently open to match the
// other admin endpoints).
router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);
router.patch('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);
router.post('/:id/reset-password', ctrl.resetPassword);

module.exports = router;
