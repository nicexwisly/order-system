-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Users can only see their own record
CREATE POLICY "Users can view own record" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

-- Orders policies
-- Admin can see all orders
CREATE POLICY "Admin can view all orders" ON orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id::text = auth.uid()::text 
      AND users.role = 'admin'
    )
  );

-- Department users can only see their department's orders
CREATE POLICY "Department users can view own department orders" ON orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id::text = auth.uid()::text 
      AND users.role = department
    )
  );

-- Admin can insert orders for any department
CREATE POLICY "Admin can insert orders" ON orders
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id::text = auth.uid()::text 
      AND users.role = 'admin'
    )
  );

-- Department users can insert orders for their department
CREATE POLICY "Department users can insert own department orders" ON orders
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id::text = auth.uid()::text 
      AND users.role = department
    )
  );

-- Similar policies for UPDATE and DELETE
CREATE POLICY "Admin can update all orders" ON orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id::text = auth.uid()::text 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Department users can update own department orders" ON orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id::text = auth.uid()::text 
      AND users.role = department
    )
  );

CREATE POLICY "Admin can delete all orders" ON orders
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id::text = auth.uid()::text 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Department users can delete own department orders" ON orders
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id::text = auth.uid()::text 
      AND users.role = department
    )
  );
