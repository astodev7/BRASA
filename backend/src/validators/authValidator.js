const { z } = require('zod');

const loginSchema = z.object({
  email: z.string().trim().email('Informe um e-mail valido.'),
  password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres.'),
});

module.exports = { loginSchema };
