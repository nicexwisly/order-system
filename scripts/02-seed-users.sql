-- Enable pgcrypto if needed
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Remove existing users
DELETE FROM users WHERE username IN ('admin', 'fish', 'pork');

-- Insert users with fixed bcrypt hashes
INSERT INTO users (username, password_hash, role) VALUES
  ('admin', '$2a$10$5tK1S/2K6X1HxR7Uf6AXvOfAbp1Q6EJ7fGqGv2XZh9Zz8VZ9cN9mi', 'admin'),
  ('fish',  '$2a$10$QoIrt7dZ/6hPqk3Gy27G9OG7K.3g91M4YOYF4BcvjUpMj7hBqT0Tu', 'fish'),
  ('pork',  '$2a$10$X2AFyHsoPjlJQf65vH5eQOZy9LSa9c2F1n6vVX2jlQKMu5omJ/26C', 'pork');
