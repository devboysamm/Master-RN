const express = require('express');
const ctrl = require('../controllers/chatController');

const router = express.Router();

router.post('/', ctrl.chat);

module.exports = router;
