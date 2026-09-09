const { z } = require('zod');

// Horario de funcionamento do restaurante (usado tambem no frontend)
const OPENING_HOUR = 18; // 18:00
const CLOSING_HOUR = 23; // ultima reserva 23:00
const MIN_GUESTS = 1;
const MAX_GUESTS = 20;

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const reservationSchema = z
  .object({
    customer_name: z.string().trim().min(2, 'Informe seu nome completo.').max(120),
    email: z.string().trim().email('Informe um e-mail valido.'),
    phone: z
      .string()
      .trim()
      .min(8, 'Informe um telefone valido.')
      .max(20)
      .regex(/^[0-9()+\-\s]+$/, 'Telefone contem caracteres invalidos.'),
    reservation_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data invalida. Utilize o formato AAAA-MM-DD.'),
    reservation_time: z
      .string()
      .regex(timeRegex, 'Horario invalido. Utilize o formato HH:MM.'),
    guests: z
      .number({ invalid_type_error: 'Informe o numero de pessoas.' })
      .int()
      .min(MIN_GUESTS, `O numero minimo de pessoas e ${MIN_GUESTS}.`)
      .max(MAX_GUESTS, `Para grupos acima de ${MAX_GUESTS} pessoas, entre em contato diretamente.`),
    notes: z.string().trim().max(500).optional().or(z.literal('')),
    // honeypot anti-spam: deve chegar vazio
    website: z.string().max(0, 'Solicitacao invalida.').optional().or(z.literal('')),
  })
  .superRefine((data, ctx) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const requestedDate = new Date(`${data.reservation_date}T00:00:00`);

    if (Number.isNaN(requestedDate.getTime()) || requestedDate < today) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['reservation_date'],
        message: 'A data da reserva nao pode estar no passado.',
      });
    }

    const maxAdvanceDays = 90;
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + maxAdvanceDays);
    if (requestedDate > maxDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['reservation_date'],
        message: `Reservas podem ser feitas com ate ${maxAdvanceDays} dias de antecedencia.`,
      });
    }

    const [hour] = data.reservation_time.split(':').map(Number);
    if (hour < OPENING_HOUR || hour > CLOSING_HOUR) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['reservation_time'],
        message: `O restaurante aceita reservas entre ${OPENING_HOUR}:00 e ${CLOSING_HOUR}:00.`,
      });
    }
  });

const statusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
});

module.exports = { reservationSchema, statusSchema, OPENING_HOUR, CLOSING_HOUR };
