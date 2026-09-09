const menuItemModel = require('../models/menuItemModel');
const categoryModel = require('../models/categoryModel');
const slugify = require('../utils/slugify');
const ApiError = require('../utils/ApiError');

async function listPublic(categorySlug) {
  return menuItemModel.findAllPublic({ categorySlug });
}

async function getBySlug(slug) {
  const item = await menuItemModel.findBySlugPublic(slug);
  if (!item) throw ApiError.notFound('Prato nao encontrado.');
  return item;
}

async function listAdmin() {
  return menuItemModel.findAllAdmin();
}

async function create(data) {
  const category = await categoryModel.findById(data.category_id);
  if (!category) throw ApiError.badRequest('Categoria informada nao existe.');
  const slug = slugify(data.name);
  return menuItemModel.create({ ...data, slug });
}

async function update(id, data) {
  const item = await menuItemModel.findById(id);
  if (!item) throw ApiError.notFound('Prato nao encontrado.');
  if (data.category_id) {
    const category = await categoryModel.findById(data.category_id);
    if (!category) throw ApiError.badRequest('Categoria informada nao existe.');
  }
  const fields = { ...data };
  if (data.name) fields.slug = slugify(data.name);
  return menuItemModel.update(id, fields);
}

async function remove(id) {
  const item = await menuItemModel.findById(id);
  if (!item) throw ApiError.notFound('Prato nao encontrado.');
  await menuItemModel.remove(id);
}

module.exports = { listPublic, getBySlug, listAdmin, create, update, remove };
