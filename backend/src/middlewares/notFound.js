const ApiError = require('../utils/ApiError');

function notFound(req, res, next) {
  next(ApiError.notFound(`Rota ${req.method} ${req.originalUrl} nao existe.`));
}

module.exports = notFound;
