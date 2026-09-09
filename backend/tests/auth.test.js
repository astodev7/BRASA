const { loginSchema } = require('../src/validators/authValidator');

describe('loginSchema', () => {
  test('aceita credenciais bem formadas', () => {
    const result = loginSchema.safeParse({ email: 'admin@brasa.example', password: 'senha1234' });
    expect(result.success).toBe(true);
  });

  test('rejeita e-mail invalido', () => {
    const result = loginSchema.safeParse({ email: 'nao-email', password: 'senha1234' });
    expect(result.success).toBe(false);
  });

  test('rejeita senha curta', () => {
    const result = loginSchema.safeParse({ email: 'admin@brasa.example', password: '123' });
    expect(result.success).toBe(false);
  });
});
