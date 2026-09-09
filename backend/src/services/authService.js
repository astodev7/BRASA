const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const adminUserModel = require('../models/adminUserModel');

async function login(email, password) {
  const user = await adminUserModel.findByEmail(email);
  // Mensagem generica: nunca revelar se o e-mail existe ou nao
  if (!user) throw ApiError.unauthorized('E-mail ou senha invalidos.');

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw ApiError.unauthorized('E-mail ou senha invalidos.');

  const token = jwt.sign(
    { sub: user.id, role: user.role, name: user.name },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
}

async function getCurrentUser(userId) {
  const user = await adminUserModel.findById(userId);
  if (!user) throw ApiError.unauthorized();
  return user;
}

module.exports = { login, getCurrentUser };
