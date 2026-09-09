const contactMessageModel = require('../models/contactMessageModel');
const ApiError = require('../utils/ApiError');

async function createMessage(data) {
  return contactMessageModel.create(data);
}

async function listAdmin(filters) {
  return contactMessageModel.findAllAdmin(filters);
}

async function updateStatus(id, status) {
  const message = await contactMessageModel.findById(id);
  if (!message) throw ApiError.notFound('Mensagem nao encontrada.');
  return contactMessageModel.updateStatus(id, status);
}

async function countNew() {
  return contactMessageModel.countNew();
}

module.exports = { createMessage, listAdmin, updateStatus, countNew };
