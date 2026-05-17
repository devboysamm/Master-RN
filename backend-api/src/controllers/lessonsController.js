const Lesson = require('../models/Lesson');
const Module = require('../models/Module');

function validateLessonPayload(body, { partial = false } = {}) {
  if (!partial || Object.prototype.hasOwnProperty.call(body, 'module_id')) {
    const moduleId = Number(body.module_id);
    if (!Number.isInteger(moduleId) || moduleId <= 0) {
      return 'module_id is required and must be a positive integer';
    }
  }
  if (!partial || Object.prototype.hasOwnProperty.call(body, 'title')) {
    if (!body.title || typeof body.title !== 'string' || body.title.trim() === '') {
      return 'title is required';
    }
  }
  if (Object.prototype.hasOwnProperty.call(body, 'read_time') && body.read_time != null) {
    if (typeof body.read_time !== 'number' || !Number.isFinite(body.read_time)) {
      return 'read_time must be a number';
    }
  }
  if (Object.prototype.hasOwnProperty.call(body, 'lesson_order') && body.lesson_order != null) {
    if (typeof body.lesson_order !== 'number' || !Number.isFinite(body.lesson_order)) {
      return 'lesson_order must be a number';
    }
  }
  return null;
}

async function getOne(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid lesson id' });
    }
    const data = await Lesson.findById(id);
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const err = validateLessonPayload(req.body);
    if (err) return res.status(400).json({ success: false, message: err });
    const parent = await Module.findById(Number(req.body.module_id));
    if (!parent) {
      return res.status(400).json({ success: false, message: 'module_id does not reference an existing module' });
    }
    const data = await Lesson.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid lesson id' });
    }
    const err = validateLessonPayload(req.body, { partial: true });
    if (err) return res.status(400).json({ success: false, message: err });
    const existing = await Lesson.findById(id);
    if (!existing) return res.status(404).json({ success: false, message: 'Not found' });
    if (Object.prototype.hasOwnProperty.call(req.body, 'module_id')) {
      const parent = await Module.findById(Number(req.body.module_id));
      if (!parent) {
        return res.status(400).json({ success: false, message: 'module_id does not reference an existing module' });
      }
    }
    const data = await Lesson.update(id, req.body);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid lesson id' });
    }
    const ok = await Lesson.remove(id);
    if (!ok) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Lesson deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getOne, create, update, remove };
