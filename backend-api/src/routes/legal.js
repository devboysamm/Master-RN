const express = require('express');
const ctrl = require('../controllers/legalController');

const router = express.Router();

// TODO: admin-protect the PUT later (currently open to match the other
// admin endpoints). GET stays public so the website can render the content.
router.get('/:key', ctrl.get);
router.put('/:key', ctrl.put);

module.exports = router;
