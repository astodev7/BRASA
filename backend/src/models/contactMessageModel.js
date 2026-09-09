const { query } = require('../config/db');

async function create(data) {
  const { rows } = await query(
    `INSERT INTO contact_messages (name, email, phone, subject, message, status)
     VALUES ($1,$2,$3,$4,$5,'new') RETURNING *`,
    [data.name, data.email, data.phone || null, data.subject, data.message]
  );
  return rows[0];
}

async function findAllAdmin({ status } = {}) {
  const params = [];
  let where = '';
  if (status) {
    params.push(status);
    where = `WHERE status = $${params.length}`;
  }
  const { rows } = await query(
    `SELECT * FROM contact_messages ${where} ORDER BY created_at DESC`,
    params
  );
  return rows;
}

async function findById(id) {
  const { rows } = await query('SELECT * FROM contact_messages WHERE id = $1', [id]);
  return rows[0] || null;
}

async function updateStatus(id, status) {
  const { rows } = await query(
    'UPDATE contact_messages SET status = $2 WHERE id = $1 RETURNING *',
    [id, status]
  );
  return rows[0] || null;
}

async function countNew() {
  const { rows } = await query("SELECT COUNT(*)::int AS count FROM contact_messages WHERE status = 'new'");
  return rows[0].count;
}

module.exports = { create, findAllAdmin, findById, updateStatus, countNew };
