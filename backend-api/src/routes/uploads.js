const express = require('express');
const ctrl = require('../controllers/uploadsController');

const router = express.Router();

// POST /api/upload — multipart field "image"
router.post('/upload', ctrl.uploadOne);

// GET    /api/uploads
// DELETE /api/uploads/:filename
const list = express.Router();
list.get('/', ctrl.list);
list.delete('/:filename', ctrl.remove);

module.exports = { upload: router, list };
