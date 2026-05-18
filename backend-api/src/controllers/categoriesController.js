const Category = require('../models/Category');
const Module = require('../models/Module');

const HEX6 = /^#[0-9A-Fa-f]{6}$/;

function validateCategoryPayload(body, { partial = false } = {}) {
  if (!partial || Object.prototype.hasOwnProperty.call(body, 'name')) {
    if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
      return 'name is required';
    }
  }
  if (Object.prototype.hasOwnProperty.call(body, 'color') && body.color != null) {
    if (typeof body.color !== 'string' || !HEX6.test(body.color)) {
      return 'color must be a 6-digit hex (e.g. #F26A4A)';
    }
  }
  if (Object.prototype.hasOwnProperty.call(body, 'order_index') && body.order_index != null) {
    if (typeof body.order_index !== 'number' || !Number.isFinite(body.order_index)) {
      return 'order_index must be a number';
    }
  }
  return null;
}

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

async function list(req, res, next) {
  try {
    const data = await Category.findAll();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: 'Invalid category id' });
    const data = await Category.findById(id);
    if (!data) return res.status(404).json({ success: false, message: 'Not found' });
    const moduleIds = await Category.getModuleIds(id);
    res.json({ success: true, data: { ...data, module_ids: moduleIds } });
  } catch (err) {
    next(err);
  }
}

async function listCategoryModules(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: 'Invalid category id' });
    const cat = await Category.findById(id);
    if (!cat) return res.status(404).json({ success: false, message: 'Not found' });
    const data = await Category.getModules(id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const err = validateCategoryPayload(req.body);
    if (err) return res.status(400).json({ success: false, message: err });
    const data = await Category.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: 'Invalid category id' });
    const err = validateCategoryPayload(req.body, { partial: true });
    if (err) return res.status(400).json({ success: false, message: err });
    const existing = await Category.findById(id);
    if (!existing) return res.status(404).json({ success: false, message: 'Not found' });
    const data = await Category.update(id, req.body);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: 'Invalid category id' });
    const ok = await Category.remove(id);
    if (!ok) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
}

async function addModule(req, res, next) {
  try {
    const id = parseId(req.params.id);
    const moduleId = parseId(req.body?.module_id);
    if (!id) return res.status(400).json({ success: false, message: 'Invalid category id' });
    if (!moduleId) return res.status(400).json({ success: false, message: 'module_id is required' });
    const cat = await Category.findById(id);
    if (!cat) return res.status(404).json({ success: false, message: 'Category not found' });
    const mod = await Module.findById(moduleId);
    if (!mod) return res.status(404).json({ success: false, message: 'Module not found' });
    await Category.addModule(id, moduleId);
    res.status(201).json({ success: true, message: 'Module added' });
  } catch (err) {
    next(err);
  }
}

async function removeModule(req, res, next) {
  try {
    const id = parseId(req.params.id);
    const moduleId = parseId(req.params.moduleId);
    if (!id || !moduleId) {
      return res.status(400).json({ success: false, message: 'Invalid id' });
    }
    const ok = await Category.removeModule(id, moduleId);
    if (!ok) return res.status(404).json({ success: false, message: 'Mapping not found' });
    res.json({ success: true, message: 'Module removed from category' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  list, getOne, listCategoryModules, create, update, remove, addModule, removeModule,
};
