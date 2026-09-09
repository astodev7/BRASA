/* Executa todos os arquivos .sql desta pasta em ordem alfabetica.
   Uso: node database/migrations/run.js */
require('dotenv').config({ path: require('path').resolve(__dirname, '../../backend/.env') });
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

function resolveSsl(connectionString) {
  if (!connectionString) return false;
  const isLocal = /localhost|127\.0\.0\.1/.test(connectionString);
  return isLocal ? false : { rejectUnauthorized: false };
}

async function run() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: resolveSsl(process.env.DATABASE_URL),
  });
  await client.connect();

  const dir = __dirname;
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();

  for (const file of files) {
    const sql = fs.readFileSync(path.join(dir, file), 'utf8');
    // eslint-disable-next-line no-console
    console.log(`Aplicando migration: ${file}`);
    await client.query(sql);
  }

  await client.end();
  // eslint-disable-next-line no-console
  console.log('Migrations aplicadas com sucesso.');
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Falha ao aplicar migrations:', err.message);
  process.exit(1);
});
