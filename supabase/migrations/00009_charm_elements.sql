DROP TABLE IF EXISTS charm_elements;
DROP TABLE IF EXISTS charm_categories;

CREATE TABLE charm_categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO charm_categories (name) VALUES
  ('Shapes'),
  ('Food & Drinks'),
  ('Decorations'),
  ('Animals');

CREATE TABLE charm_elements (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  image TEXT,
  price NUMERIC NOT NULL DEFAULT 100,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO charm_elements (name, category, price) VALUES
  ('Red Clay Ball', 'Shapes', 80),
  ('Blue Clay Ball', 'Shapes', 80),
  ('Pink Heart', 'Shapes', 100),
  ('Yellow Star', 'Shapes', 70),
  ('Green Leaf', 'Shapes', 60),
  ('Purple Flower', 'Shapes', 90),
  ('Coke Can', 'Food & Drinks', 120),
  ('Pizza Slice', 'Food & Drinks', 110),
  ('Ice Cream Cone', 'Food & Drinks', 100),
  ('Coffee Cup', 'Food & Drinks', 90),
  ('Donut', 'Food & Drinks', 80),
  ('Mini Star', 'Decorations', 60),
  ('Rainbow', 'Decorations', 120),
  ('Music Note', 'Decorations', 70),
  ('Butterfly', 'Decorations', 100),
  ('Moon', 'Decorations', 60),
  ('Cat Face', 'Animals', 110),
  ('Bunny', 'Animals', 100),
  ('Duck', 'Animals', 90);
