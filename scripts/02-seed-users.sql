-- Insert predefined users with hashed passwords
-- Note: In production, use proper password hashing like bcrypt
INSERT INTO users (username, password_hash, role) VALUES
  ('admin', crypt('admin01', gen_salt('bf')), 'admin'),
  ('fish', crypt('fish01', gen_salt('bf')), 'fish'),
  ('pork', crypt('pork01', gen_salt('bf')), 'pork')
ON CONFLICT (username) DO NOTHING;
