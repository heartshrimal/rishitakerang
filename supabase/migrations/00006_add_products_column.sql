-- Add products JSONB column to payments table for multi-product (cart) orders
ALTER TABLE payments ADD COLUMN IF NOT EXISTS products JSONB DEFAULT '[]'::jsonb;
