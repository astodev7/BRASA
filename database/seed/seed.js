/* Popula o banco com dados ficticios de demonstracao.
   Uso: node database/seed/seed.js
   NUNCA utilizar dados pessoais reais. */
require('dotenv').config({ path: require('path').resolve(__dirname, '../../backend/.env') });
const bcrypt = require('bcrypt');
const { Client } = require('pg');

function slugify(text) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const categories = [
  { name: 'Entradas', description: 'Para abrir o apetite antes da brasa.' },
  { name: 'Carnes', description: 'Cortes selecionados grelhados na brasa de carvao.' },
  { name: 'Peixes', description: 'Pescados frescos preparados na grelha.' },
  { name: 'Acompanhamentos', description: 'Para completar o prato principal.' },
  { name: 'Sobremesas', description: 'O ponto final da refeicao.' },
  { name: 'Drinks', description: 'Coqueteis autorais e classicos.' },
];

const menuByCategory = {
  Entradas: [
    { name: 'Pao de Alho na Brasa', price: 28.0, description: 'Pao artesanal grelhado com manteiga de alho e ervas.', ingredients: ['pao artesanal', 'manteiga', 'alho', 'salsa'], allergens: ['gluten', 'lacteos'], featured: false },
    { name: 'Carpaccio de Picanha', price: 42.0, description: 'Fatias finas de picanha maturada, rucula e parmesao.', ingredients: ['picanha', 'rucula', 'parmesao', 'azeite'], allergens: ['lacteos'], featured: true },
  ],
  Carnes: [
    { name: 'Picanha na Brasa', price: 96.0, description: 'Picanha grelhada no ponto, servida com farofa e vinagrete.', ingredients: ['picanha', 'farofa', 'vinagrete'], allergens: [], featured: true },
    { name: 'Costela 12 Horas', price: 88.0, description: 'Costela bovina cozida lentamente na brasa por 12 horas.', ingredients: ['costela bovina', 'temperos naturais'], allergens: [], featured: true },
    { name: 'Fraldinha Grelhada', price: 79.0, description: 'Fraldinha grelhada no ponto com manteiga de ervas.', ingredients: ['fraldinha', 'manteiga', 'ervas'], allergens: ['lacteos'], featured: false },
  ],
  Peixes: [
    { name: 'Robalo na Brasa', price: 84.0, description: 'Filé de robalo grelhado com legumes da estacao.', ingredients: ['robalo', 'legumes', 'azeite'], allergens: ['peixe'], featured: false },
    { name: 'Camarao na Brasa', price: 92.0, description: 'Camaroes grandes grelhados com manteiga de limao siciliano.', ingredients: ['camarao', 'manteiga', 'limao siciliano'], allergens: ['crustaceos', 'lacteos'], featured: false },
  ],
  Acompanhamentos: [
    { name: 'Farofa de Banana', price: 18.0, description: 'Farofa crocante com banana caramelizada.', ingredients: ['farinha de mandioca', 'banana', 'manteiga'], allergens: ['lacteos'], featured: false },
    { name: 'Batata Rustica na Brasa', price: 22.0, description: 'Batatas assadas na brasa com alecrim.', ingredients: ['batata', 'alecrim', 'azeite'], allergens: [], featured: false },
  ],
  Sobremesas: [
    { name: 'Doce de Leite com Queijo', price: 24.0, description: 'Doce de leite artesanal com queijo minas grelhado.', ingredients: ['doce de leite', 'queijo minas'], allergens: ['lacteos'], featured: false },
    { name: 'Abacaxi na Brasa', price: 22.0, description: 'Abacaxi grelhado com canela e sorvete de creme.', ingredients: ['abacaxi', 'canela', 'sorvete'], allergens: ['lacteos'], featured: true },
  ],
  Drinks: [
    { name: 'Caipirinha BRASA', price: 26.0, description: 'Cachaca artesanal, limao e um toque de gengibre.', ingredients: ['cachaca', 'limao', 'gengibre'], allergens: [], featured: false },
    { name: 'Negroni Defumado', price: 34.0, description: 'Negroni classico com toque defumado na brasa.', ingredients: ['gin', 'campari', 'vermute'], allergens: [], featured: false },
  ],
};

function resolveSsl(connectionString) {
  if (!connectionString) return false;
  const isLocal = /localhost|127\.0\.0\.1/.test(connectionString);
  return isLocal ? false : { rejectUnauthorized: false };
}

async function seed() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: resolveSsl(process.env.DATABASE_URL),
  });
  await client.connect();

  try {
    await client.query('BEGIN');

    // Limpa dados de demonstracao previamente inseridos (idempotente)
    await client.query('TRUNCATE reservations, contact_messages, menu_items, categories, admin_users RESTART IDENTITY CASCADE');

    const categoryIds = {};
    for (let i = 0; i < categories.length; i += 1) {
      const c = categories[i];
      const slug = slugify(c.name);
      const { rows } = await client.query(
        `INSERT INTO categories (name, slug, description, display_order, active)
         VALUES ($1,$2,$3,$4,true) RETURNING id`,
        [c.name, slug, c.description, i]
      );
      categoryIds[c.name] = rows[0].id;
    }

    for (const [categoryName, items] of Object.entries(menuByCategory)) {
      for (let i = 0; i < items.length; i += 1) {
        const item = items[i];
        const slug = slugify(item.name);
        await client.query(
          `INSERT INTO menu_items
            (category_id, name, slug, description, price, image_url, ingredients, allergens, available, featured, display_order)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,true,$9,$10)`,
          [
            categoryIds[categoryName], item.name, slug, item.description, item.price,
            // Imagem de demonstração — substituir por fotografia real do prato em produção
            '/images/menu/placeholder.svg', item.ingredients, item.allergens, item.featured, i,
          ]
        );
      }
    }

    // Usuario administrativo de DESENVOLVIMENTO apenas.
    // Trocar a senha imediatamente em qualquer ambiente real.
    const devPassword = 'BrasaAdmin#2026';
    const passwordHash = await bcrypt.hash(devPassword, 12);
    await client.query(
      `INSERT INTO admin_users (name, email, password_hash, role, active)
       VALUES ($1,$2,$3,'admin',true)`,
      ['Administrador BRASA', 'admin@brasa.example', passwordHash]
    );

    // Reserva de exemplo
    await client.query(
      `INSERT INTO reservations (customer_name, email, phone, reservation_date, reservation_time, guests, notes, status)
       VALUES ($1,$2,$3, CURRENT_DATE + INTERVAL '2 days', '20:00', 2, 'Mesa perto da janela, se possivel.', 'pending')`,
      ['Cliente Exemplo', 'cliente.exemplo@example.com', '(81) 90000-0000']
    );

    await client.query('COMMIT');

    // eslint-disable-next-line no-console
    console.log('Seed concluido com sucesso.');
    // eslint-disable-next-line no-console
    console.log(`Credenciais de administrador (APENAS DESENVOLVIMENTO): admin@brasa.example / ${devPassword}`);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    await client.end();
  }
}

seed().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Falha ao popular o banco:', err.message);
  process.exit(1);
});
