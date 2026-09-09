const { query } = require('../config/db');

const PUBLIC_COLUMNS = `
  mi.id, mi.name, mi.slug, mi.description, mi.price, mi.image_url,
  mi.ingredients, mi.allergens, mi.available, mi.featured, mi.display_order,
  c.id AS category_id, c.name AS category_name, c.slug AS category_slug
`;

async function findAllPublic({ categorySlug } = {}) {
  const params = [];
  let where = 'WHERE c.active = true';
  if (categorySlug) {
    params.push(categorySlug);
    where += ` AND c.slug = $${params.length}`;
  }
  const { rows } = await query(
    `SELECT ${PUBLIC_COLUMNS}
     FROM menu_items mi
     JOIN categories c ON c.id = mi.category_id
     ${where}
     ORDER BY c.display_order ASC, mi.display_order ASC, mi.name ASC`,
    params
  );
  return rows;
}

async function findBySlugPublic(slug) {
  const { rows } = await query(
    `SELECT ${PUBLIC_COLUMNS}
     FROM menu_items mi
     JOIN categories c ON c.id = mi.category_id
     WHERE mi.slug = $1`,
    [slug]
  );
  return rows[0] || null;
}

async function findAllAdmin() {
  const { rows } = await query(
    `SELECT ${PUBLIC_COLUMNS}
     FROM menu_items mi
     JOIN categories c ON c.id = mi.category_id
     ORDER BY c.display_order ASC, mi.display_order ASC, mi.name ASC`
  );
  return rows;
}

async function findById(id) {
  const { rows } = await query('SELECT * FROM menu_items WHERE id = $1', [id]);
  return rows[0] || null;
}

async function create(data) {
  const { rows } = await query(
    `INSERT INTO menu_items
      (category_id, name, slug, description, price, image_url, ingredients, allergens, available, featured, display_order)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     RETURNING *`,
    [
      data.category_id, data.name, data.slug, data.description || null, data.price,
      data.image_url || null, data.ingredients || [], data.allergens || [],
      data.available !== false, !!data.featured, data.display_order || 0,
    ]
  );
  return rows[0];
}

async function update(id, fields) {
  const keys = Object.keys(fields);
  if (keys.length === 0) return findById(id);
  const setClause = keys.map((k, i) => `${k} = $${i + 2}`).join(', ');
  const values = keys.map((k) => fields[k]);
  const { rows } = await query(
    `UPDATE menu_items SET ${setClause}, updated_at = now() WHERE id = $1 RETURNING *`,
    [id, ...values]
  );
  return rows[0] || null;
}

async function remove(id) {
  const { rowCount } = await query('DELETE FROM menu_items WHERE id = $1', [id]);
  return rowCount > 0;
}

async function countAvailable() {
  const { rows } = await query('SELECT COUNT(*)::int AS count FROM menu_items WHERE available = true');
  return rows[0].count;
}

async function countFeatured() {
  const { rows } = await query('SELECT COUNT(*)::int AS count FROM menu_items WHERE featured = true');
  return rows[0].count;
}

module.exports = {
  findAllPublic, findBySlugPublic, findAllAdmin, findById, create, update, remove,
  countAvailable, countFeatured,
};
