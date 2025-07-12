-- Ensure pgcrypto extension exists
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Remove any existing rows for these usernames
DELETE FROM users WHERE username IN ('admin', 'fish', 'pork');

-- Insert new hashed users
INSERT INTO users (username, password_hash, role)
VALUES
  ('admin', crypt('admin01', gen_salt('bf')), 'admin'),
  ('fish',  crypt('fish01', gen_salt('bf')), 'fish'),
  ('pork',  crypt('pork01', gen_salt('bf')), 'pork');
