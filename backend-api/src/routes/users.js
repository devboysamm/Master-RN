const express = require('express');
const ctrl = require('../controllers/usersController');

const router = express.Router();

// TODO: protect with admin auth (currently open to match other admin endpoints).
router.get('/', ctrl.list);

module.exports = router;
