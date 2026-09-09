const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/ApiResponse');
const menuService = require('../services/menuService');

const listMenu = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const items = await menuService.listPublic(category);
  return success(res, { items });
});

const getItem = asyncHandler(async (req, res) => {
  const item = await menuService.getBySlug(req.params.slug);
  return success(res, { item });
});

module.exports = { listMenu, getItem };
