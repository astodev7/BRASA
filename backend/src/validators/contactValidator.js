const { z } = require('zod');

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Informe seu nome.').max(120),
  email: z.string().trim().email('Informe um e-mail valido.'),
  phone: z.string().trim().max(20).optional().or(z.literal('')),
  subject: z.string().trim().min(2, 'Informe um assunto.').max(150),
  message: z.string().trim().min(10, 'A mensagem deve ter pelo menos 10 caracteres.').max(2000),
  website: z.string().max(0, 'Solicitacao invalida.').optional().or(z.literal('')),
});

const statusSchema = z.object({
  status: z.enum(['new', 'read', 'replied', 'archived']),
});

module.exports = { contactSchema, statusSchema };
