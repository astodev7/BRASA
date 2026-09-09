const { query } = require('../config/db');

async function create(data) {
  const { rows } = await query(
    `INSERT INTO reservations
      (customer_name, email, phone, reservation_date, reservation_time, guests, notes, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,'pending')
     RETURNING *`,
    [data.customer_name, data.email, data.phone, data.reservation_date, data.reservation_time, data.guests, data.notes || null]
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
    `SELECT * FROM reservations ${where} ORDER BY reservation_date DESC, reservation_time DESC`,
    params
  );
  return rows;
}

async function findById(id) {
  const { rows } = await query('SELECT * FROM reservations WHERE id = $1', [id]);
  return rows[0] || null;
}

async function updateStatus(id, status) {
  const { rows } = await query(
    `UPDATE reservations SET status = $2, updated_at = now() WHERE id = $1 RETURNING *`,
    [id, status]
  );
  return rows[0] || null;
}

async function countByStatus(status) {
  const { rows } = await query('SELECT COUNT(*)::int AS count FROM reservations WHERE status = $1', [status]);
  return rows[0].count;
}

module.exports = { create, findAllAdmin, findById, updateStatus, countByStatus };
