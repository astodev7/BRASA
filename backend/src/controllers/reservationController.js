const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const { reservationSchema } = require('../validators/reservationValidator');
const reservationService = require('../services/reservationService');

const createReservation = asyncHandler(async (req, res) => {
  const parsed = reservationSchema.safeParse(req.body);
  if (!parsed.success) {
    throw ApiError.badRequest('Nao foi possivel enviar sua reserva. Verifique os dados informados.', parsed.error.flatten().fieldErrors);
  }

  // honeypot: se preenchido, finge sucesso e descarta (nao alerta o bot)
  if (parsed.data.website) {
    return success(res, { message: 'Recebemos sua solicitacao de reserva.' }, 201);
  }

  const { website, ...data } = parsed.data;
  const reservation = await reservationService.createReservation(data);
  return success(res, {
    message: 'Recebemos sua solicitacao de reserva.',
    reservation: {
      id: reservation.id,
      status: reservation.status,
      reservation_date: reservation.reservation_date,
      reservation_time: reservation.reservation_time,
    },
  }, 201);
});

module.exports = { createReservation };
