class ApiError extends Error {
  constructor(statusCode, code, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;
  }

  static badRequest(message, details = null) {
    return new ApiError(400, 'VALIDATION_ERROR', message, details);
  }

  static unauthorized(message = 'Nao autenticado.') {
    return new ApiError(401, 'UNAUTHORIZED', message);
  }

  static forbidden(message = 'Acesso negado.') {
    return new ApiError(403, 'FORBIDDEN', message);
  }

  static notFound(message = 'Recurso nao encontrado.') {
    return new ApiError(404, 'NOT_FOUND', message);
  }

  static conflict(message) {
    return new ApiError(409, 'CONFLICT', message);
  }

  static tooManyRequests(message = 'Muitas requisicoes. Tente novamente mais tarde.') {
    return new ApiError(429, 'RATE_LIMITED', message);
  }

  static internal(message = 'Erro interno do servidor.') {
    return new ApiError(500, 'INTERNAL_ERROR', message);
  }
}

module.exports = ApiError;
