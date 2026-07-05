-- Banner items table (each row is one banner message)
CREATE TABLE IF NOT EXISTS banner_items (
  id BIGSERIAL PRIMARY KEY,
  text TEXT NOT NULL DEFAULT '',
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE banner_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read banner_items" ON banner_items
  FOR SELECT USING (true);

CREATE POLICY "Allow admin insert banner_items" ON banner_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin update banner_items" ON banner_items
  FOR UPDATE USING (true);

CREATE POLICY "Allow admin delete banner_items" ON banner_items
  FOR DELETE USING (true);
