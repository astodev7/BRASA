const { reservationSchema } = require('../src/validators/reservationValidator');

function futureDate(daysAhead) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().slice(0, 10);
}

describe('reservationSchema', () => {
  const base = {
    customer_name: 'Maria Silva',
    email: 'maria@example.com',
    phone: '(81) 99999-0000',
    reservation_date: futureDate(3),
    reservation_time: '20:00',
    guests: 4,
    notes: '',
  };

  test('aceita uma reserva valida', () => {
    const result = reservationSchema.safeParse(base);
    expect(result.success).toBe(true);
  });

  test('rejeita data no passado', () => {
    const result = reservationSchema.safeParse({ ...base, reservation_date: '2020-01-01' });
    expect(result.success).toBe(false);
  });

  test('rejeita horario fora do funcionamento', () => {
    const result = reservationSchema.safeParse({ ...base, reservation_time: '09:00' });
    expect(result.success).toBe(false);
  });

  test('rejeita numero de pessoas invalido', () => {
    const result = reservationSchema.safeParse({ ...base, guests: 0 });
    expect(result.success).toBe(false);
  });

  test('rejeita email invalido', () => {
    const result = reservationSchema.safeParse({ ...base, email: 'nao-e-email' });
    expect(result.success).toBe(false);
  });

  test('honeypot preenchido e considerado invalido para bots', () => {
    const result = reservationSchema.safeParse({ ...base, website: 'http://spam.com' });
    expect(result.success).toBe(false);
  });
});
