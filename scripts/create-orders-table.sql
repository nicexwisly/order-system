-- Create the orders table in Supabase
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  item_number VARCHAR(100) NOT NULL,
  qty INTEGER NOT NULL CHECK (qty > 0),
  details TEXT,
  day_pickup DATE NOT NULL,
  time_pickup TIME NOT NULL,
  department VARCHAR(20) NOT NULL CHECK (department IN ('Fish', 'Butchery')),
  status VARCHAR(20) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in process', 'complete')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index for faster queries by department and status
CREATE INDEX IF NOT EXISTS idx_orders_department ON orders(department);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_pickup_date ON orders(day_pickup);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update updated_at
CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON orders 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO orders (customer_name, item_number, qty, details, day_pickup, time_pickup, department, status) VALUES
('John Smith', 'F001', 2, 'Fresh salmon fillets, skin removed', '2024-01-15', '14:30', 'Fish', 'new'),
('Mary Johnson', 'B002', 1, 'Ribeye steak, 1 inch thick', '2024-01-15', '16:00', 'Butchery', 'new'),
('David Wilson', 'F003', 3, 'Whole sea bass, cleaned and scaled', '2024-01-16', '10:00', 'Fish', 'in process'),
('Sarah Brown', 'B004', 2, 'Ground beef, 80/20 mix', '2024-01-16', '15:30', 'Butchery', 'complete'),
('Mike Davis', 'F005', 1, 'Tuna steaks, sushi grade', '2024-01-17', '12:00', 'Fish', 'new');
