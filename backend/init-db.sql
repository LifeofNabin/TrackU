-- ===== FILE: /Users/nabin/TrackU/backend/init-db.sql =====
-- Create user if it doesn't exist
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE rolname = 'tracku_user') THEN

      CREATE ROLE tracku_user LOGIN PASSWORD 'tracku_pass';
   END IF;
END
$do$;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE tracku_dev TO tracku_user;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";