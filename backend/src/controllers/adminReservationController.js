const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const { statusSchema } = require('../validators/reservationValidator');
const reservationService = require('../services/reservationService');

const list = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const reservations = await reservationService.listAdmin({ status });
  return success(res, { reservations });
});

const updateStatus = asyncHandler(async (req, res) => {
  const parsed = statusSchema.safeParse(req.body);
  if (!parsed.success) throw ApiError.badRequest('Status invalido.', parsed.error.flatten().fieldErrors);
  const reservation = await reservationService.updateStatus(Number(req.params.id), parsed.data.status);
  return success(res, { reservation });
});

module.exports = { list, updateStatus };
