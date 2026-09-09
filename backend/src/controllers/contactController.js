const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const { contactSchema } = require('../validators/contactValidator');
const contactService = require('../services/contactService');

const sendMessage = asyncHandler(async (req, res) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    throw ApiError.badRequest('Nao foi possivel enviar sua mensagem. Verifique os dados informados.', parsed.error.flatten().fieldErrors);
  }

  if (parsed.data.website) {
    return success(res, { message: 'Mensagem enviada com sucesso.' }, 201);
  }

  const { website, ...data } = parsed.data;
  await contactService.createMessage(data);
  return success(res, { message: 'Mensagem enviada com sucesso. Responderemos em breve.' }, 201);
});

module.exports = { sendMessage };
