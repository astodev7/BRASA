-- BRASA — schema inicial
-- Executar com: psql $DATABASE_URL -f database/migrations/001_init.sql

BEGIN;

CREATE TABLE IF NOT EXISTS categories (
  id             SERIAL PRIMARY KEY,
  name           VARCHAR(100) NOT NULL,
  slug           VARCHAR(120) NOT NULL UNIQUE,
  description    TEXT,
  display_order  INTEGER NOT NULL DEFAULT 0,
  active         BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS menu_items (
  id             SERIAL PRIMARY KEY,
  category_id    INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  name           VARCHAR(150) NOT NULL,
  slug           VARCHAR(170) NOT NULL UNIQUE,
  description    TEXT,
  price          NUMERIC(10,2) NOT NULL CHECK (price > 0),
  image_url      TEXT,
  ingredients    TEXT[] NOT NULL DEFAULT '{}',
  allergens      TEXT[] NOT NULL DEFAULT '{}',
  available      BOOLEAN NOT NULL DEFAULT true,
  featured       BOOLEAN NOT NULL DEFAULT false,
  display_order  INTEGER NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reservations (
  id                 SERIAL PRIMARY KEY,
  customer_name      VARCHAR(120) NOT NULL,
  email              VARCHAR(150) NOT NULL,
  phone              VARCHAR(20) NOT NULL,
  reservation_date   DATE NOT NULL,
  reservation_time   TIME NOT NULL,
  guests             INTEGER NOT NULL CHECK (guests > 0),
  notes              TEXT,
  status             VARCHAR(20) NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending','confirmed','cancelled','completed')),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(120) NOT NULL,
  email       VARCHAR(150) NOT NULL,
  phone       VARCHAR(20),
  subject     VARCHAR(150) NOT NULL,
  message     TEXT NOT NULL,
  status      VARCHAR(20) NOT NULL DEFAULT 'new'
              CHECK (status IN ('new','read','replied','archived')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_users (
  id             SERIAL PRIMARY KEY,
  name           VARCHAR(120) NOT NULL,
  email          VARCHAR(150) NOT NULL UNIQUE,
  password_hash  TEXT NOT NULL,
  role           VARCHAR(20) NOT NULL DEFAULT 'manager' CHECK (role IN ('admin','manager')),
  active         BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indices para consultas frequentes
CREATE INDEX IF NOT EXISTS idx_menu_items_category_id ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(available);
CREATE INDEX IF NOT EXISTS idx_menu_items_featured ON menu_items(featured);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(active);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(reservation_date);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);

COMMIT;
