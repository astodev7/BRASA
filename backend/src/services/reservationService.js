const reservationModel = require('../models/reservationModel');
const ApiError = require('../utils/ApiError');
const emailService = require('./emailService');
const logger = require('../utils/logger');

async function createReservation(data) {
  const reservation = await reservationModel.create(data);

  // O envio de e-mail nunca deve bloquear ou derrubar a resposta da API
  emailService.sendReservationReceivedEmail(reservation).catch((err) => {
    logger.error('Falha ao notificar reserva por e-mail', { error: err.message });
  });

  return reservation;
}

async function listAdmin(filters) {
  return reservationModel.findAllAdmin(filters);
}

async function updateStatus(id, status) {
  const reservation = await reservationModel.findById(id);
  if (!reservation) throw ApiError.notFound('Reserva nao encontrada.');

  const updated = await reservationModel.updateStatus(id, status);

  emailService.sendReservationStatusUpdateEmail(updated).catch((err) => {
    logger.error('Falha ao notificar atualizacao de reserva', { error: err.message });
  });

  return updated;
}

async function dashboardCounts() {
  const [pending, confirmed] = await Promise.all([
    reservationModel.countByStatus('pending'),
    reservationModel.countByStatus('confirmed'),
  ]);
  return { pending, confirmed };
}

module.exports = { createReservation, listAdmin, updateStatus, dashboardCounts };
