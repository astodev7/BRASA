const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/ApiResponse');
const { loginSchema } = require('../validators/authValidator');
const authService = require('../services/authService');
const ApiError = require('../utils/ApiError');
const env = require('../config/env');

const COOKIE_NAME = 'brasa_token';

const login = asyncHandler(async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    throw ApiError.badRequest('Dados de login invalidos.', parsed.error.flatten().fieldErrors);
  }

  const { token, user } = await authService.login(parsed.data.email, parsed.data.password);

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: 'lax',
    maxAge: 8 * 60 * 60 * 1000,
  });

  return success(res, { user });
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie(COOKIE_NAME);
  return success(res, { message: 'Logout realizado com sucesso.' });
});

const me = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user.sub);
  return success(res, { user });
});

module.exports = { login, logout, me };
