const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const { categorySchema, categoryUpdateSchema } = require('../validators/menuValidator');
const categoryService = require('../services/categoryService');

const list = asyncHandler(async (req, res) => {
  const categories = await categoryService.listAdmin();
  return success(res, { categories });
});

const create = asyncHandler(async (req, res) => {
  const parsed = categorySchema.safeParse(req.body);
  if (!parsed.success) throw ApiError.badRequest('Dados da categoria invalidos.', parsed.error.flatten().fieldErrors);
  const category = await categoryService.create(parsed.data);
  return success(res, { category }, 201);
});

const update = asyncHandler(async (req, res) => {
  const parsed = categoryUpdateSchema.safeParse(req.body);
  if (!parsed.success) throw ApiError.badRequest('Dados da categoria invalidos.', parsed.error.flatten().fieldErrors);
  const category = await categoryService.update(Number(req.params.id), parsed.data);
  return success(res, { category });
});

const remove = asyncHandler(async (req, res) => {
  await categoryService.remove(Number(req.params.id));
  return success(res, { message: 'Categoria removida com sucesso.' });
});

module.exports = { list, create, update, remove };
