const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/ApiResponse');
const categoryService = require('../services/categoryService');

const listPublic = asyncHandler(async (req, res) => {
  const categories = await categoryService.listPublic();
  return success(res, { categories });
});

module.exports = { listPublic };
