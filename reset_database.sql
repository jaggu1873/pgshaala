-- This will completely wipe all tables, types, and functions in the public schema
-- It is the safest way to ensure a 100% clean slate for migrations.

DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
