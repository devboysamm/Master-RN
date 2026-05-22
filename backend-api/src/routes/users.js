const express = require('express');
const ctrl = require('../controllers/usersController');
const requireAdmin = require('../middlewares/requireAdmin');

const router = express.Router();

// All user-management endpoints are admin-only.
router.use(requireAdmin);

router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);
router.patch('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);
router.post('/:id/reset-password', ctrl.resetPassword);

module.exports = router;
