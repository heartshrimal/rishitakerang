-- Banner config table (single row for banner items)
CREATE TABLE IF NOT EXISTS banner_config (
  id INTEGER PRIMARY KEY DEFAULT 1,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Seed default items
INSERT INTO banner_config (id, items) VALUES (
  1,
  '["🎉 Sale! Up to 20% off on select items","🚚 Free shipping on orders above ₹2000","💝 Handmade with love, just for you","✨ Custom orders welcome — DM to customize"]'::jsonb
) ON CONFLICT (id) DO NOTHING;

ALTER TABLE banner_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read banner" ON banner_config
  FOR SELECT USING (true);

CREATE POLICY "Allow admin update banner" ON banner_config
  FOR UPDATE USING (true) WITH CHECK (true);
