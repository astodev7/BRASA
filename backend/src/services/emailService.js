const nodemailer = require('nodemailer');
const env = require('../config/env');
const logger = require('../utils/logger');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!env.smtp.host) return null; // email nao configurado (ex: ambiente local/demo)

  transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    auth: env.smtp.user ? { user: env.smtp.user, pass: env.smtp.password } : undefined,
  });
  return transporter;
}

async function sendMail({ to, subject, html, text }) {
  const t = getTransporter();
  if (!t) {
    // Em ambientes sem SMTP configurado (dev/demo), apenas registramos o envio
    logger.info('E-mail simulado (SMTP nao configurado)', { to, subject });
    return { simulated: true };
  }
  try {
    return await t.sendMail({ from: env.smtp.from, to, subject, html, text });
  } catch (err) {
    // Falha de e-mail nunca deve derrubar a requisicao principal
    logger.error('Falha ao enviar e-mail', { to, subject, error: err.message });
    return { error: true };
  }
}

async function sendReservationReceivedEmail(reservation) {
  await sendMail({
    to: reservation.email,
    subject: 'BRASA — recebemos sua solicitacao de reserva',
    text: `Ola ${reservation.customer_name}, recebemos sua solicitacao de reserva para ${reservation.reservation_date} as ${reservation.reservation_time}, para ${reservation.guests} pessoa(s). Em breve confirmaremos por e-mail.`,
  });

  if (env.restaurantNotificationEmail) {
    await sendMail({
      to: env.restaurantNotificationEmail,
      subject: `Nova solicitacao de reserva — ${reservation.customer_name}`,
      text: `Nova reserva pendente:\nCliente: ${reservation.customer_name}\nEmail: ${reservation.email}\nTelefone: ${reservation.phone}\nData: ${reservation.reservation_date} ${reservation.reservation_time}\nPessoas: ${reservation.guests}\nObservacoes: ${reservation.notes || '-'}`,
    });
  }
}

async function sendReservationStatusUpdateEmail(reservation) {
  const statusLabels = {
    confirmed: 'confirmada',
    cancelled: 'cancelada',
    completed: 'concluida',
    pending: 'pendente',
  };
  await sendMail({
    to: reservation.email,
    subject: `BRASA — sua reserva foi ${statusLabels[reservation.status] || reservation.status}`,
    text: `Ola ${reservation.customer_name}, sua reserva para ${reservation.reservation_date} as ${reservation.reservation_time} foi atualizada para: ${statusLabels[reservation.status] || reservation.status}.`,
  });
}

module.exports = { sendReservationReceivedEmail, sendReservationStatusUpdateEmail };
