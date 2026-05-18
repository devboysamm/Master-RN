const Module = require('../models/Module');
const Lesson = require('../models/Lesson');

const HEX6 = /^#[0-9A-Fa-f]{6}$/;
const HTTP_URL = /^https?:\/\//i;
const DATA_URL = /^data:image\/(png|jpe?g|gif|webp|svg\+xml)(;[^,]*)?,/i;

function validateModulePayload(body, { partial = false } = {}) {
  if (!partial || Object.prototype.hasOwnProperty.call(body, 'title')) {
    if (!body.title || typeof body.title !== 'string' || body.title.trim() === '') {
      return 'title is required';
    }
  }
  if (Object.prototype.hasOwnProperty.call(body, 'background_color') && body.background_color != null) {
    if (typeof body.background_color !== 'string' || !HEX6.test(body.background_color)) {
      return 'background_color must be a 6-digit hex (e.g. #61DAFB)';
    }
  }
  if (Object.prototype.hasOwnProperty.call(body, 'image_url') && body.image_url != null && body.image_url !== '') {
    if (typeof body.image_url !== 'string' || (!HTTP_URL.test(body.image_url) && !DATA_URL.test(body.image_url))) {
      return 'image_url must be an http(s):// URL or a data:image/... URI';
    }
  }
  if (Object.prototype.hasOwnProperty.call(body, 'order_index') && body.order_index != null) {
    if (typeof body.order_index !== 'number' || !Number.isFinite(body.order_index)) {
      return 'order_index must be a number';
    }
  }
  return null;
}

async function list(req, res, next) {
  try {
    const data = await Module.findAll();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid module id' });
    }
    const data = await Module.findById(id);
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function listLessons(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid module id' });
    }
    const mod = await Module.findById(id);
    if (!mod) return res.status(404).json({ success: false, message: 'Not found' });
    const data = await Lesson.findByModuleId(id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const err = validateModulePayload(req.body);
    if (err) return res.status(400).json({ success: false, message: err });
    const data = await Module.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid module id' });
    }
    const err = validateModulePayload(req.body, { partial: true });
    if (err) return res.status(400).json({ success: false, message: err });
    const existing = await Module.findById(id);
    if (!existing) return res.status(404).json({ success: false, message: 'Not found' });
    const data = await Module.update(id, req.body);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid module id' });
    }
    const ok = await Module.remove(id);
    if (!ok) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Module deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getOne, listLessons, create, update, remove };
