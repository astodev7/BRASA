const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const { statusSchema } = require('../validators/contactValidator');
const contactService = require('../services/contactService');

const list = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const messages = await contactService.listAdmin({ status });
  return success(res, { messages });
});

const updateStatus = asyncHandler(async (req, res) => {
  const parsed = statusSchema.safeParse(req.body);
  if (!parsed.success) throw ApiError.badRequest('Status invalido.', parsed.error.flatten().fieldErrors);
  const message = await contactService.updateStatus(Number(req.params.id), parsed.data.status);
  return success(res, { message });
});

module.exports = { list, updateStatus };
