const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');

function extractToken(req) {
  if (req.cookies && req.cookies.brasa_token) return req.cookies.brasa_token;
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) return header.slice(7);
  return null;
}

function requireAuth(req, res, next) {
  const token = extractToken(req);
  if (!token) return next(ApiError.unauthorized('Sessao ausente. Faca login novamente.'));

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = payload;
    return next();
  } catch (err) {
    return next(ApiError.unauthorized('Sessao invalida ou expirada. Faca login novamente.'));
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return next(ApiError.unauthorized());
    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden('Voce nao tem permissao para executar esta acao.'));
    }
    return next();
  };
}

module.exports = { requireAuth, requireRole };
