const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const { menuItemSchema, menuItemUpdateSchema } = require('../validators/menuValidator');
const menuService = require('../services/menuService');

const list = asyncHandler(async (req, res) => {
  const items = await menuService.listAdmin();
  return success(res, { items });
});

const create = asyncHandler(async (req, res) => {
  const parsed = menuItemSchema.safeParse(req.body);
  if (!parsed.success) throw ApiError.badRequest('Dados do prato invalidos.', parsed.error.flatten().fieldErrors);
  const item = await menuService.create(parsed.data);
  return success(res, { item }, 201);
});

const update = asyncHandler(async (req, res) => {
  const parsed = menuItemUpdateSchema.safeParse(req.body);
  if (!parsed.success) throw ApiError.badRequest('Dados do prato invalidos.', parsed.error.flatten().fieldErrors);
  const item = await menuService.update(Number(req.params.id), parsed.data);
  return success(res, { item });
});

const remove = asyncHandler(async (req, res) => {
  await menuService.remove(Number(req.params.id));
  return success(res, { message: 'Prato removido com sucesso.' });
});

module.exports = { list, create, update, remove };
