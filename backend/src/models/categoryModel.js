const { query } = require('../config/db');

async function findAllActive() {
  const { rows } = await query(
    `SELECT id, name, slug, description, display_order
     FROM categories WHERE active = true
     ORDER BY display_order ASC, name ASC`
  );
  return rows;
}

async function findAllAdmin() {
  const { rows } = await query(
    `SELECT * FROM categories ORDER BY display_order ASC, name ASC`
  );
  return rows;
}

async function findById(id) {
  const { rows } = await query('SELECT * FROM categories WHERE id = $1', [id]);
  return rows[0] || null;
}

async function findBySlug(slug) {
  const { rows } = await query('SELECT * FROM categories WHERE slug = $1', [slug]);
  return rows[0] || null;
}

async function create({ name, slug, description, display_order, active }) {
  const { rows } = await query(
    `INSERT INTO categories (name, slug, description, display_order, active)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [name, slug, description || null, display_order || 0, active !== false]
  );
  return rows[0];
}

async function update(id, fields) {
  const keys = Object.keys(fields);
  if (keys.length === 0) return findById(id);
  const setClause = keys.map((k, i) => `${k} = $${i + 2}`).join(', ');
  const values = keys.map((k) => fields[k]);
  const { rows } = await query(
    `UPDATE categories SET ${setClause}, updated_at = now() WHERE id = $1 RETURNING *`,
    [id, ...values]
  );
  return rows[0] || null;
}

async function remove(id) {
  const { rowCount } = await query('DELETE FROM categories WHERE id = $1', [id]);
  return rowCount > 0;
}

module.exports = { findAllActive, findAllAdmin, findById, findBySlug, create, update, remove };
