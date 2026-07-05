-- Add email and address columns to payments table
ALTER TABLE payments ADD COLUMN IF NOT EXISTS email TEXT DEFAULT '';
ALTER TABLE payments ADD COLUMN IF NOT EXISTS address TEXT DEFAULT '';
ALTER TABLE payments ADD COLUMN IF NOT EXISTS shipping NUMERIC DEFAULT 0;
