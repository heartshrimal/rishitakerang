-- Products table
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  slug TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  price NUMERIC NOT NULL,
  image TEXT,
  images JSONB DEFAULT '[]',
  description TEXT DEFAULT '',
  details JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT DEFAULT '📦',
  description TEXT DEFAULT ''
);

-- Seed categories
INSERT INTO categories (name, slug, icon, description) VALUES
  ('Bag Charms', 'bag-charms', '👜', 'Cute clay charms to hang on your bags.'),
  ('Mini Frames', 'mini-frames', '🖼️', 'Tiny frames for your favorite memories.'),
  ('Keychains', 'keychains', '🔑', 'Keychains crafted with love.'),
  ('Earrings', 'earrings', '✨', 'Lightweight clay earrings for every day.')
ON CONFLICT (slug) DO NOTHING;

-- Seed products
INSERT INTO products (id, name, category, slug, featured, price, image, images, description, details) VALUES
  (1, 'Custom Bag Charm', 'Bag Charms', 'bag-charms', true, 499, '/products/bag_charm.png',
   '["/products/bag_charm.png","https://placehold.co/400x400/c4956a/ffffff?text=Angle+2","https://placehold.co/400x400/d48464/ffffff?text=With+Bag"]',
   'A fully customizable clay bag charm made to match your vibe. Choose your colors, add initials, and make it yours.',
   '["Hand-sculpted polymer clay","~2.5 inches in size","Silver-plated ring clip included","Water-resistant coating"]'),
  (2, 'Couple Frame', 'Mini Frames', 'mini-frames', true, 399, '/products/min_frame.png',
   '["/products/min_frame.png","https://placehold.co/400x400/9ab0a0/ffffff?text=Side+View","https://placehold.co/400x400/c4956a/ffffff?text=On+Desk"]',
   'A cute mini frame for your favorite couple photo. Hand-sculpted details make every frame one of a kind.',
   '["Hand-sculpted polymer clay","~3 inches tall","Fits standard 2x2 photo","Comes in a gift box"]'),
  (3, 'Nimbu Mirchi Earrings', 'Earrings', 'earrings', true, 149, '/products/earrings.png',
   '["/products/earrings.png","https://placehold.co/400x400/d48464/ffffff?text=Pair+View","https://placehold.co/400x400/c4956a/ffffff?text=On+Ear"]',
   'Playful nimbu mirchi inspired earrings. Lightweight, fun, and perfect for adding a desi touch to any outfit.',
   '["Air-dry polymer clay","~1.5 inches long","Nickel-free hooks","Feather-light weight"]'),
  (4, 'Teddy Keychain', 'Keychains', 'keychains', true, 299, '/products/camp_bag_charm.png',
   '["/products/camp_bag_charm.png","https://placehold.co/400x400/9ab0a0/ffffff?text=Back+View","https://placehold.co/400x400/d48464/ffffff?text=On+Keys"]',
   'A tiny teddy bear keychain to carry a little warmth with you everywhere. Super cute and lightweight.',
   '["Hand-sculpted polymer clay","~2 inches tall","Stainless steel key ring","Protective gloss coating"]'),
  (5, 'Heart Bag Charm', 'Bag Charms', 'bag-charms', false, 449, '/products/bag_charm.png',
   '["/products/bag_charm.png","https://placehold.co/400x400/c4956a/ffffff?text=Side+View","https://placehold.co/400x400/d48464/ffffff?text=On+Bag"]',
   'A heart-shaped clay charm with love baked into every detail. Comes with a sturdy silver ring clip.',
   '["Hand-sculpted polymer clay","~2 inches wide","Silver-plated ring clip","Gift wrapping available"]'),
  (6, 'Daisy Earrings', 'Earrings', 'earrings', false, 199, '/products/earrings.png',
   '["/products/earrings.png","https://placehold.co/400x400/9ab0a0/ffffff?text=Angle+2","https://placehold.co/400x400/c4956a/ffffff?text=Styled"]',
   'Hand-pressed daisy earrings that bring a little sunshine to your day. Super lightweight and hypoallergenic.',
   '["Air-dry polymer clay","~1.5 inches diameter","Nickel-free hooks","Comes in a pouch"]'),
  (7, 'Photo Keychain', 'Keychains', 'keychains', false, 349, '/products/camp_bag_charm.png',
   '["/products/camp_bag_charm.png","https://placehold.co/400x400/d48464/ffffff?text=Open+View","https://placehold.co/400x400/9ab0a0/ffffff?text=With+Photo"]',
   'A clay keychain with space for your favorite tiny photo. Makes a thoughtful gift for friends and family.',
   '["Hand-sculpted polymer clay","~2 inches wide","Stainless steel key ring","Photo slot included"]'),
  (8, 'Custom Frame', 'Mini Frames', 'mini-frames', false, 449, '/products/min_frame.png',
   '["/products/min_frame.png","https://placehold.co/400x400/c4956a/ffffff?text=Angle+2","https://placehold.co/400x400/9ab0a0/ffffff?text=On+Shelf"]',
   'A custom mini frame for your desk or shelf. Choose theme, colors, and add names for a personal touch.',
   '["Hand-sculpted polymer clay","~3 inches tall","Fits standard 2x2 photo","Custom text available"]')
ON CONFLICT (id) DO NOTHING;

-- Reset the sequence to the next available ID
SELECT setval('products_id_seq', COALESCE((SELECT MAX(id) FROM products), 1));
SELECT setval('categories_id_seq', COALESCE((SELECT MAX(id) FROM categories), 1));
