const { query } = require('../config/db');

async function findByEmail(email) {
  const { rows } = await query('SELECT * FROM admin_users WHERE email = $1 AND active = true', [email]);
  return rows[0] || null;
}

async function findById(id) {
  const { rows } = await query('SELECT id, name, email, role, active FROM admin_users WHERE id = $1', [id]);
  return rows[0] || null;
}

module.exports = { findByEmail, findById };
