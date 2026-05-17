const express = require('express');
const ctrl = require('../controllers/appContentController');

const router = express.Router();

router.get('/', ctrl.get);
router.put('/', ctrl.put);

module.exports = router;
