const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');
const env = require('../config/env');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let error = err;

  if (!(error instanceof ApiError)) {
    // Erros nao previstos nunca vazam detalhes internos para o cliente
    logger.error('Erro nao tratado', {
      message: err.message,
      stack: env.isProduction ? undefined : err.stack,
      path: req.originalUrl,
      method: req.method,
    });
    error = ApiError.internal();
  } else if (error.statusCode >= 500) {
    logger.error(error.message, { code: error.code, path: req.originalUrl });
  } else {
    logger.warn(error.message, { code: error.code, path: req.originalUrl });
  }

  const body = {
    success: false,
    error: {
      code: error.code,
      message: error.message,
    },
  };

  if (error.details) body.error.details = error.details;
  if (!env.isProduction && error.stack && error.statusCode >= 500) {
    body.error.stack = error.stack;
  }

  res.status(error.statusCode).json(body);
}

module.exports = errorHandler;
