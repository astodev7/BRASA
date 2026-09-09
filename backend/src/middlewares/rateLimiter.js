const rateLimit = require('express-rate-limit');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');

function buildLimiter(max, message) {
  return rateLimit({
    windowMs: env.rateLimit.windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next) => {
      next(ApiError.tooManyRequests(message));
    },
  });
}

const loginLimiter = buildLimiter(
  env.rateLimit.maxLogin,
  'Muitas tentativas de login. Aguarde alguns minutos e tente novamente.'
);

const publicFormLimiter = buildLimiter(
  env.rateLimit.maxPublic,
  'Muitas solicitacoes enviadas. Aguarde um momento antes de tentar novamente.'
);

module.exports = { loginLimiter, publicFormLimiter };
