-- urmareste.online — schema Faza 0
-- Rulare: psql -U <user> -d urmareste -f schema.sql

CREATE TABLE IF NOT EXISTS sector (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(40) UNIQUE NOT NULL,          -- ex: 'sector-3', 'voluntari'
  nume VARCHAR(60) NOT NULL,                  -- ex: 'Sector 3', 'Voluntari'
  tip VARCHAR(20) NOT NULL DEFAULT 'sector'   -- 'sector' (Bucuresti) | 'ilfov'
);

CREATE TABLE IF NOT EXISTS category (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(60) UNIQUE NOT NULL,           -- ex: 'instalatori'
  nume VARCHAR(80) NOT NULL,                  -- ex: 'Instalatori sanitare/termice'
  necesita_autorizatie BOOLEAN NOT NULL DEFAULT FALSE,
  tip_autorizatie VARCHAR(20)                 -- 'ANRE' | 'ISCIR' | NULL
    CHECK (tip_autorizatie IN ('ANRE', 'ISCIR') OR tip_autorizatie IS NULL)
);

CREATE TABLE IF NOT EXISTS business (
  id SERIAL PRIMARY KEY,
  nume VARCHAR(150) NOT NULL CHECK (char_length(nume) >= 2),
  descriere TEXT CHECK (char_length(descriere) <= 500),
  ani_experienta VARCHAR(20),                 -- '1-3', '3-5', '5+'
  program TEXT,
  telefon VARCHAR(20) NOT NULL,
  whatsapp VARCHAR(20),
  email VARCHAR(150),
  adresa TEXT,

  plan VARCHAR(20) NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'premium', 'elite')),
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  autorizatie_numar VARCHAR(50),
  autorizatie_scan_url TEXT,                  -- doar vizibil in admin, nu public

  lead_count INTEGER NOT NULL DEFAULT 0 CHECK (lead_count >= 0),
  rating_mediu NUMERIC(2,1) CHECK (rating_mediu BETWEEN 0 AND 5),

  creat_la TIMESTAMPTZ NOT NULL DEFAULT now(),
  activ BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS business_photo (
  id SERIAL PRIMARY KEY,
  business_id INTEGER NOT NULL REFERENCES business(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  ordine INTEGER NOT NULL DEFAULT 0
);

-- relatii many-to-many
CREATE TABLE IF NOT EXISTS business_category_map (
  business_id INTEGER NOT NULL REFERENCES business(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES category(id) ON DELETE CASCADE,
  PRIMARY KEY (business_id, category_id)
);

CREATE TABLE IF NOT EXISTS business_sector_map (
  business_id INTEGER NOT NULL REFERENCES business(id) ON DELETE CASCADE,
  sector_id INTEGER NOT NULL REFERENCES sector(id) ON DELETE CASCADE,
  PRIMARY KEY (business_id, sector_id)
);

CREATE TABLE IF NOT EXISTS lead (
  id SERIAL PRIMARY KEY,
  business_id INTEGER NOT NULL REFERENCES business(id) ON DELETE CASCADE,
  sector_id INTEGER REFERENCES sector(id),
  client_nume VARCHAR(100) NOT NULL,
  client_telefon VARCHAR(20) NOT NULL,
  mesaj TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'nou' CHECK (status IN ('nou', 'contactat', 'finalizat')),
  creat_la TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS review (
  id SERIAL PRIMARY KEY,
  business_id INTEGER NOT NULL REFERENCES business(id) ON DELETE CASCADE,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  text TEXT,
  aprobat BOOLEAN NOT NULL DEFAULT FALSE,     -- moderare manuala in Faza 1-2
  creat_la TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- indexuri pentru cautarile /categorie/sector
CREATE INDEX IF NOT EXISTS idx_bcm_category ON business_category_map(category_id);
CREATE INDEX IF NOT EXISTS idx_bsm_sector ON business_sector_map(sector_id);
CREATE INDEX IF NOT EXISTS idx_business_activ ON business(activ) WHERE activ = TRUE;

-- seed: 9 zone
INSERT INTO sector (slug, nume, tip) VALUES
  ('sector-1', 'Sector 1', 'sector'),
  ('sector-2', 'Sector 2', 'sector'),
  ('sector-3', 'Sector 3', 'sector'),
  ('sector-4', 'Sector 4', 'sector'),
  ('sector-5', 'Sector 5', 'sector'),
  ('sector-6', 'Sector 6', 'sector'),
  ('voluntari', 'Voluntari', 'ilfov'),
  ('otopeni', 'Otopeni', 'ilfov'),
  ('popesti-leordeni', 'Popești-Leordeni', 'ilfov')
ON CONFLICT (slug) DO NOTHING;

-- seed: 10 categorii MVP
INSERT INTO category (slug, nume, necesita_autorizatie, tip_autorizatie) VALUES
  ('instalatori', 'Instalatori sanitare/termice', FALSE, NULL),
  ('centrale-gaz', 'Tehnicieni autorizați centrale gaz', TRUE, 'ISCIR'),
  ('electricieni', 'Electricieni autorizați ANRE', TRUE, 'ANRE'),
  ('curatenie', 'Curățenie apartamente/birouri', FALSE, NULL),
  ('zugravi', 'Zugravi/gletuit/rigips', FALSE, NULL),
  ('aer-conditionat', 'Aer condiționat — montaj/service', FALSE, NULL),
  ('gradina', 'Amenajări grădină/curte', FALSE, NULL),
  ('dezinsectie-mutari', 'Dezinsecție/deratizare & mutări', FALSE, NULL),
  ('tamplari', 'Tâmplari/mobilă la comandă', FALSE, NULL),
  ('reparatii-electrocasnice', 'Reparații electrocasnice', FALSE, NULL)
ON CONFLICT (slug) DO NOTHING;
