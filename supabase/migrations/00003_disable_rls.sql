-- Disable RLS on payments table (service role key is used, RLS is unnecessary)
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous read payments" ON payments;
DROP POLICY IF EXISTS "Allow anonymous insert payments" ON payments;
DROP POLICY IF EXISTS "Allow anonymous update payments" ON payments;
