const categoryModel = require('../models/categoryModel');
const slugify = require('../utils/slugify');
const ApiError = require('../utils/ApiError');

async function listPublic() {
  return categoryModel.findAllActive();
}

async function listAdmin() {
  return categoryModel.findAllAdmin();
}

async function create(data) {
  const slug = slugify(data.name);
  const existing = await categoryModel.findBySlug(slug);
  if (existing) throw ApiError.conflict('Ja existe uma categoria com um nome muito semelhante.');
  return categoryModel.create({ ...data, slug });
}

async function update(id, data) {
  const category = await categoryModel.findById(id);
  if (!category) throw ApiError.notFound('Categoria nao encontrada.');
  const fields = { ...data };
  if (data.name) fields.slug = slugify(data.name);
  return categoryModel.update(id, fields);
}

async function remove(id) {
  const category = await categoryModel.findById(id);
  if (!category) throw ApiError.notFound('Categoria nao encontrada.');
  await categoryModel.remove(id);
}

module.exports = { listPublic, listAdmin, create, update, remove };
