-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  utr TEXT DEFAULT '',
  product_name TEXT NOT NULL,
  product_price NUMERIC NOT NULL,
  product_id BIGINT,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Allow anonymous read/write for payments (needed for public order tracking)
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read payments" ON payments
  FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert payments" ON payments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous update payments" ON payments
  FOR UPDATE USING (true);
