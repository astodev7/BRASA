const { Pool } = require('pg');
const env = require('./env');

// Bancos locais (localhost/127.0.0.1) normalmente nao exigem SSL.
// Bancos hospedados (Supabase, RDS, Render, etc.) geralmente exigem,
// mesmo fora de producao — entao habilitamos SSL sempre que a URL
// nao apontar para uma instancia local.
function resolveSsl(connectionString) {
  if (!connectionString) return false;
  const isLocal = /localhost|127\.0\.0\.1/.test(connectionString);
  return isLocal ? false : { rejectUnauthorized: false };
}

const pool = new Pool({
  connectionString: env.databaseUrl,
  max: 10,
  idleTimeoutMillis: 30000,
  ssl: resolveSsl(env.databaseUrl),
});

pool.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.error('[db] Erro inesperado no pool de conexoes', err);
});

async function query(text, params) {
  return pool.query(text, params);
}

async function getClient() {
  return pool.connect();
}

async function checkConnection() {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = { pool, query, getClient, checkConnection };
