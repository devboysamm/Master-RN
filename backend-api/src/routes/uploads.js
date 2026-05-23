const express = require('express');
const ctrl = require('../controllers/uploadsController');
const requireAdmin = require('../middlewares/requireAdmin');

const router = express.Router();

// POST /api/upload — multipart field "image". Admin-only (media management).
router.post('/upload', requireAdmin, ctrl.uploadOne);

// GET    /api/uploads            (read, left public)
// DELETE /api/uploads/:filename  (admin-only)
const list = express.Router();
list.get('/', ctrl.list);
list.delete('/:filename', requireAdmin, ctrl.remove);

module.exports = { upload: router, list };
