BEGIN;

DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'app_user') THEN
    CREATE ROLE app_user WITH LOGIN PASSWORD 'coding_test_password';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'datatys_db') THEN
    CREATE DATABASE datatys_db;
  END IF;
END $$;

GRANT ALL PRIVILEGES ON DATABASE datatys_db TO app_user;

\c datatys_db;

DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE,
  password TEXT,
  first_name TEXT,
  last_name TEXT,
  country TEXT,
  city TEXT,
  phone_number TEXT,
  position TEXT,
  avatar_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS _index_users_email ON users (email);

COMMIT;