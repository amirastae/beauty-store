import type { Env } from '../env'

const MIGRATIONS = [
  `PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','active','archived')),
  thumbnail_url TEXT,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS product_variants (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','disabled')),
  price_minor INTEGER NOT NULL CHECK(price_minor >= 0),
  compare_at_minor INTEGER,
  currency_code TEXT NOT NULL DEFAULT 'USD',
  option_json TEXT NOT NULL DEFAULT '{}',
  inventory_policy TEXT NOT NULL DEFAULT 'deny' CHECK(inventory_policy IN ('deny','continue')),
  position INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id, position);

CREATE TABLE IF NOT EXISTS inventory_items (
  variant_id TEXT PRIMARY KEY REFERENCES product_variants(id) ON DELETE CASCADE,
  stock_on_hand INTEGER NOT NULL DEFAULT 0,
  reserved INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL,
  CHECK(stock_on_hand >= 0),
  CHECK(reserved >= 0),
  CHECK(reserved <= stock_on_hand)
);

CREATE TABLE IF NOT EXISTS collections (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS collection_products (
  collection_id TEXT NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  position INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY(collection_id, product_id)
);

CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  first_name TEXT,
  last_name TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS addresses (
  id TEXT PRIMARY KEY,
  customer_id TEXT REFERENCES customers(id) ON DELETE CASCADE,
  kind TEXT NOT NULL DEFAULT 'shipping',
  full_name TEXT NOT NULL,
  line1 TEXT NOT NULL,
  line2 TEXT,
  city TEXT NOT NULL,
  region TEXT,
  postal_code TEXT NOT NULL,
  country_code TEXT NOT NULL,
  phone TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS carts (
  id TEXT PRIMARY KEY,
  customer_id TEXT REFERENCES customers(id) ON DELETE SET NULL,
  email TEXT,
  currency_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open','completed','abandoned')),
  subtotal_minor INTEGER NOT NULL DEFAULT 0,
  discount_minor INTEGER NOT NULL DEFAULT 0,
  shipping_minor INTEGER NOT NULL DEFAULT 0,
  tax_minor INTEGER NOT NULL DEFAULT 0,
  total_minor INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS cart_items (
  id TEXT PRIMARY KEY,
  cart_id TEXT NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  variant_id TEXT NOT NULL REFERENCES product_variants(id),
  quantity INTEGER NOT NULL CHECK(quantity > 0 AND quantity <= 20),
  unit_price_minor INTEGER NOT NULL CHECK(unit_price_minor >= 0),
  line_total_minor INTEGER NOT NULL CHECK(line_total_minor >= 0),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_cart_items_cart ON cart_items(cart_id);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  order_number INTEGER NOT NULL UNIQUE,
  customer_id TEXT REFERENCES customers(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  currency_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_status TEXT NOT NULL DEFAULT 'unpaid',
  fulfillment_status TEXT NOT NULL DEFAULT 'unfulfilled',
  subtotal_minor INTEGER NOT NULL,
  discount_minor INTEGER NOT NULL DEFAULT 0,
  shipping_minor INTEGER NOT NULL DEFAULT 0,
  tax_minor INTEGER NOT NULL DEFAULT 0,
  total_minor INTEGER NOT NULL,
  shipping_address_json TEXT NOT NULL,
  billing_address_json TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT,
  variant_id TEXT,
  product_title TEXT NOT NULL,
  variant_title TEXT NOT NULL,
  sku TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK(quantity > 0),
  unit_price_minor INTEGER NOT NULL,
  line_total_minor INTEGER NOT NULL,
  snapshot_json TEXT NOT NULL DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  order_id TEXT REFERENCES orders(id) ON DELETE SET NULL,
  cart_id TEXT REFERENCES carts(id) ON DELETE SET NULL,
  provider TEXT NOT NULL,
  provider_reference TEXT,
  status TEXT NOT NULL,
  amount_minor INTEGER NOT NULL,
  currency_code TEXT NOT NULL,
  idempotency_key TEXT UNIQUE,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS idempotency_keys (
  key TEXT PRIMARY KEY,
  scope TEXT NOT NULL,
  request_hash TEXT NOT NULL,
  response_status INTEGER,
  response_body TEXT,
  locked_until TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS wishlists (
  customer_id TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL,
  PRIMARY KEY(customer_id, product_id)
);

CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  customer_id TEXT REFERENCES customers(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
  title TEXT,
  body TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_reviews_product_status ON reviews(product_id, status);
`,
  `CREATE TABLE IF NOT EXISTS inventory_events (
  id TEXT PRIMARY KEY,
  variant_id TEXT NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK(event_type IN ('stock_in','stock_out','reserve','release','adjust')),
  quantity INTEGER NOT NULL,
  reference_type TEXT,
  reference_id TEXT,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_inventory_events_variant_created
ON inventory_events(variant_id, created_at DESC);

CREATE TABLE IF NOT EXISTS checkout_events (
  id TEXT PRIMARY KEY,
  cart_id TEXT,
  order_id TEXT,
  event_type TEXT NOT NULL,
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_checkout_events_cart_created
ON checkout_events(cart_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_orders_customer_created
ON orders(customer_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_orders_email_created
ON orders(email, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_products_status_created
ON products(status, created_at DESC);
`,
  `CREATE TABLE IF NOT EXISTS outbox_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  aggregate_type TEXT NOT NULL,
  aggregate_id TEXT NOT NULL,
  payload_json TEXT NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','processing','processed','failed')),
  attempts INTEGER NOT NULL DEFAULT 0,
  available_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  processed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_outbox_status_available
ON outbox_events(status, available_at, created_at);

CREATE TABLE IF NOT EXISTS webhook_events (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  external_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'received',
  created_at TEXT NOT NULL,
  processed_at TEXT,
  UNIQUE(provider, external_id)
);

CREATE INDEX IF NOT EXISTS idx_webhook_provider_created
ON webhook_events(provider, created_at DESC);

CREATE TABLE IF NOT EXISTS promotions (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE COLLATE NOCASE,
  title TEXT NOT NULL,
  kind TEXT NOT NULL CHECK(kind IN ('percentage','fixed')),
  value INTEGER NOT NULL CHECK(value >= 0),
  minimum_subtotal_minor INTEGER NOT NULL DEFAULT 0,
  starts_at TEXT,
  ends_at TEXT,
  usage_limit INTEGER,
  usage_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','active','disabled')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
`,
  `CREATE TABLE IF NOT EXISTS external_refs (
  namespace TEXT NOT NULL,
  external_id TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  PRIMARY KEY(namespace, external_id, resource_type)
);

CREATE INDEX IF NOT EXISTS idx_external_refs_resource
ON external_refs(resource_type, resource_id);

INSERT OR IGNORE INTO products
(id, slug, title, subtitle, description, status, thumbnail_url, metadata_json, created_at, updated_at)
VALUES
('prod_v2_lip','velvet-cloud-lip','Velvet Cloud Lip','رژ لب مخملی کلود','VELOURA v2 storefront compatibility product.','active','https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1200&q=88','{"frontend":"veloura-v2.1","category":"لب"}',datetime('now'),datetime('now')),
('prod_v2_serum','pearl-barrier-serum','Pearl Barrier Serum','سرم سد دفاعی پرل','VELOURA v2 storefront compatibility product.','active','https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=1200&q=88','{"frontend":"veloura-v2.1","category":"پوست"}',datetime('now'),datetime('now')),
('prod_v2_perfume','afterlight-eau-de-parfum-v2','Afterlight Eau de Parfum','ادوپرفیوم افترلایت','VELOURA v2 storefront compatibility product.','active','https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=88','{"frontend":"veloura-v2.1","category":"عطر"}',datetime('now'),datetime('now')),
('prod_v2_eye','luminous-eye-veil','Luminous Eye Veil','سایه چشم لومینوس ویل','VELOURA v2 storefront compatibility product.','active','https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=88','{"frontend":"veloura-v2.1","category":"چشم"}',datetime('now'),datetime('now'));

INSERT OR IGNORE INTO product_variants
(id, product_id, sku, title, status, price_minor, compare_at_minor, currency_code, option_json, inventory_policy, position, created_at, updated_at)
VALUES
('var_v2_lip_rose','prod_v2_lip','VLR-V2-LIP-ROSE','رز خاموش','active',18900000,21900000,'IRR','{"shade_id":"rose","shade_name":"رز خاموش","hex":"#A85B67"}','deny',0,datetime('now'),datetime('now')),
('var_v2_lip_berry','prod_v2_lip','VLR-V2-LIP-BERRY','بری عمیق','active',18900000,21900000,'IRR','{"shade_id":"berry","shade_name":"بری عمیق","hex":"#6B263B"}','deny',1,datetime('now'),datetime('now')),
('var_v2_lip_nude','prod_v2_lip','VLR-V2-LIP-NUDE','نود گرم','active',18900000,21900000,'IRR','{"shade_id":"nude","shade_name":"نود گرم","hex":"#B77B68"}','deny',2,datetime('now'),datetime('now')),
('var_v2_serum_default','prod_v2_serum','VLR-V2-SERUM','Default','active',27400000,NULL,'IRR','{}','deny',0,datetime('now'),datetime('now')),
('var_v2_perfume_default','prod_v2_perfume','VLR-V2-PERFUME','50 ML','active',49800000,NULL,'IRR','{}','deny',0,datetime('now'),datetime('now')),
('var_v2_eye_champagne','prod_v2_eye','VLR-V2-EYE-CHAMP','شامپاین','active',22400000,NULL,'IRR','{"shade_id":"champagne","shade_name":"شامپاین","hex":"#D4B184"}','deny',0,datetime('now'),datetime('now')),
('var_v2_eye_bronze','prod_v2_eye','VLR-V2-EYE-BRONZE','برنز','active',22400000,NULL,'IRR','{"shade_id":"bronze","shade_name":"برنز","hex":"#8B5C42"}','deny',1,datetime('now'),datetime('now')),
('var_v2_eye_plum','prod_v2_eye','VLR-V2-EYE-PLUM','آلوئی','active',22400000,NULL,'IRR','{"shade_id":"plum","shade_name":"آلوئی","hex":"#684252"}','deny',2,datetime('now'),datetime('now'));

INSERT OR IGNORE INTO inventory_items (variant_id, stock_on_hand, reserved, updated_at)
SELECT id, 100, 0, datetime('now')
FROM product_variants
WHERE id LIKE 'var_v2_%';

INSERT OR IGNORE INTO external_refs
(namespace, external_id, resource_type, resource_id, metadata_json, created_at)
VALUES
('veloura-v2.1','lip-velvet-01','product','prod_v2_lip','{}',datetime('now')),
('veloura-v2.1','serum-01','product','prod_v2_serum','{}',datetime('now')),
('veloura-v2.1','perfume-01','product','prod_v2_perfume','{}',datetime('now')),
('veloura-v2.1','eye-01','product','prod_v2_eye','{}',datetime('now')),
('veloura-v2.1','lip-velvet-01:rose','variant','var_v2_lip_rose','{}',datetime('now')),
('veloura-v2.1','lip-velvet-01:berry','variant','var_v2_lip_berry','{}',datetime('now')),
('veloura-v2.1','lip-velvet-01:nude','variant','var_v2_lip_nude','{}',datetime('now')),
('veloura-v2.1','serum-01:default','variant','var_v2_serum_default','{}',datetime('now')),
('veloura-v2.1','perfume-01:default','variant','var_v2_perfume_default','{}',datetime('now')),
('veloura-v2.1','eye-01:champagne','variant','var_v2_eye_champagne','{}',datetime('now')),
('veloura-v2.1','eye-01:bronze','variant','var_v2_eye_bronze','{}',datetime('now')),
('veloura-v2.1','eye-01:plum','variant','var_v2_eye_plum','{}',datetime('now'));
`,
  `-- Compatibility catalog imported from shop-v1.1.0-work JSON snapshots.
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_1','shop-1-hydrating-face-serum','Hydrating Face Serum','skincare','Lightweight hydrating serum for glowing skin','active','/shop/v1.1.0/public/hydrating-face-serum.jpg','{"frontend":"shop-v1.1.0","legacy_id":1,"category":"skincare"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_1_default','prod_shop_1','SHOP-001','Default','active',4500,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_1_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','1','product','prod_shop_1','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','1:default','variant','var_shop_1_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_2','shop-2-eye-cream','Eye Cream','skincare','Nourishing eye cream for delicate skin','active','/shop/v1.1.0/public/eye-cream-luxury.jpg','{"frontend":"shop-v1.1.0","legacy_id":2,"category":"skincare"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_2_default','prod_shop_2','SHOP-002','Default','active',5200,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_2_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','2','product','prod_shop_2','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','2:default','variant','var_shop_2_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_3','shop-3-moisturizer-spf','Moisturizer SPF','skincare','Daily moisturizer with SPF protection','active','/shop/v1.1.0/public/moisturizer-spf-sunscreen.jpg','{"frontend":"shop-v1.1.0","legacy_id":3,"category":"skincare"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_3_default','prod_shop_3','SHOP-003','Default','active',6200,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_3_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','3','product','prod_shop_3','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','3:default','variant','var_shop_3_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_4','shop-4-facial-cleanser','Facial Cleanser','skincare','Gentle cleanser for all skin types','active','/shop/v1.1.0/public/facial-cleanser-luxury.jpg','{"frontend":"shop-v1.1.0","legacy_id":4,"category":"skincare"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_4_default','prod_shop_4','SHOP-004','Default','active',3800,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_4_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','4','product','prod_shop_4','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','4:default','variant','var_shop_4_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_5','shop-5-night-cream','Night Cream','skincare','Rich night cream for overnight renewal','active','/shop/v1.1.0/public/night-cream-moisturizer.jpg','{"frontend":"shop-v1.1.0","legacy_id":5,"category":"skincare"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_5_default','prod_shop_5','SHOP-005','Default','active',5800,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_5_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','5','product','prod_shop_5','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','5:default','variant','var_shop_5_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_6','shop-6-face-mask','Face Mask','skincare','Luxurious face mask for pampering sessions','active','/shop/v1.1.0/public/luxury-face-mask-skincare.jpg','{"frontend":"shop-v1.1.0","legacy_id":6,"category":"skincare"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_6_default','prod_shop_6','SHOP-006','Default','active',4200,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_6_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','6','product','prod_shop_6','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','6:default','variant','var_shop_6_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_7','shop-7-toner','Toner','skincare','Balancing toner for skin preparation','active','/shop/v1.1.0/public/face-toner-skincare.jpg','{"frontend":"shop-v1.1.0","legacy_id":7,"category":"skincare"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_7_default','prod_shop_7','SHOP-007','Default','active',3500,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_7_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','7','product','prod_shop_7','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','7:default','variant','var_shop_7_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_8','shop-8-retinol-treatment','Retinol Treatment','skincare','Advanced retinol treatment for anti-aging','active','/shop/v1.1.0/public/retinol-treatment-skincare.jpg','{"frontend":"shop-v1.1.0","legacy_id":8,"category":"skincare"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_8_default','prod_shop_8','SHOP-008','Default','active',6800,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_8_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','8','product','prod_shop_8','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','8:default','variant','var_shop_8_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_9','shop-9-silk-serum','Silk Serum','skincare','Luxurious silk-infused serum for radiant skin','active','/shop/v1.1.0/public/luxury-purple-cosmetic-serum-bottle.jpg','{"frontend":"shop-v1.1.0","legacy_id":9,"category":"skincare"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_9_default','prod_shop_9','SHOP-009','Default','active',4999,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_9_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','9','product','prod_shop_9','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','9:default','variant','var_shop_9_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_10','shop-10-lavender-mask','Lavender Mask','skincare','Calming lavender-infused face mask','active','/shop/v1.1.0/public/luxury-purple-face-mask-jar.jpg','{"frontend":"shop-v1.1.0","legacy_id":10,"category":"skincare"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_10_default','prod_shop_10','SHOP-010','Default','active',3999,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_10_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','10','product','prod_shop_10','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','10:default','variant','var_shop_10_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_11','shop-11-pearl-cream','Pearl Cream','skincare','Premium pearl cream for luminous skin','active','/shop/v1.1.0/public/luxury-white-pearl-cream-jar.jpg','{"frontend":"shop-v1.1.0","legacy_id":11,"category":"skincare"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_11_default','prod_shop_11','SHOP-011','Default','active',5999,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_11_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','11','product','prod_shop_11','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','11:default','variant','var_shop_11_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_12','shop-12-rose-oil','Rose Oil','skincare','Nourishing rose oil for skin radiance','active','/shop/v1.1.0/public/luxury-rose-oil-bottle.jpg','{"frontend":"shop-v1.1.0","legacy_id":12,"category":"skincare"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_12_default','prod_shop_12','SHOP-012','Default','active',4499,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_12_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','12','product','prod_shop_12','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','12:default','variant','var_shop_12_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_13','shop-13-glow-toner','Glow Toner','skincare','Brightening toner for a radiant glow','active','/shop/v1.1.0/public/luxury-purple-toner-bottle.jpg','{"frontend":"shop-v1.1.0","legacy_id":13,"category":"skincare"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_13_default','prod_shop_13','SHOP-013','Default','active',3499,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_13_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','13','product','prod_shop_13','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','13:default','variant','var_shop_13_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_14','shop-14-night-elixir','Night Elixir','skincare','Nighttime serum elixir for skin restoration','active','/shop/v1.1.0/public/luxury-night-serum-bottle.jpg','{"frontend":"shop-v1.1.0","legacy_id":14,"category":"skincare"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_14_default','prod_shop_14','SHOP-014','Default','active',5499,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_14_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','14','product','prod_shop_14','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','14:default','variant','var_shop_14_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_15','shop-15-luxury-lipstick','Luxury Lipstick','makeup','Premium luxury lipstick with rich, luxurious color','active','/shop/v1.1.0/public/luxury-lipstick-makeup.jpg','{"frontend":"shop-v1.1.0","legacy_id":15,"category":"makeup"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_15_default','prod_shop_15','SHOP-015','Default','active',3800,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_15_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','15','product','prod_shop_15','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','15:default','variant','var_shop_15_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_16','shop-16-foundation-primer','Foundation Primer','makeup','Smooth, long-lasting makeup primer','active','/shop/v1.1.0/public/foundation-primer-makeup.jpg','{"frontend":"shop-v1.1.0","legacy_id":16,"category":"makeup"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_16_default','prod_shop_16','SHOP-016','Default','active',3500,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_16_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','16','product','prod_shop_16','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','16:default','variant','var_shop_16_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_17','shop-17-mascara-pro','Mascara Pro','makeup','Professional-grade mascara with volumizing formula','active','/shop/v1.1.0/public/mascara-professional-makeup.jpg','{"frontend":"shop-v1.1.0","legacy_id":17,"category":"makeup"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_17_default','prod_shop_17','SHOP-017','Default','active',3200,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_17_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','17','product','prod_shop_17','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','17:default','variant','var_shop_17_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_18','shop-18-eye-shadow-palette','Eye Shadow Palette','makeup','Versatile eyeshadow palette with rich pigments','active','/shop/v1.1.0/public/eyeshadow-palette-makeup.jpg','{"frontend":"shop-v1.1.0","legacy_id":18,"category":"makeup"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_18_default','prod_shop_18','SHOP-018','Default','active',5500,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_18_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','18','product','prod_shop_18','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','18:default','variant','var_shop_18_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_19','shop-19-blush','Blush','makeup','Natural-looking blush for radiant cheeks','active','/shop/v1.1.0/public/blush-makeup-product.jpg','{"frontend":"shop-v1.1.0","legacy_id":19,"category":"makeup"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_19_default','prod_shop_19','SHOP-019','Default','active',2800,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_19_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','19','product','prod_shop_19','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','19:default','variant','var_shop_19_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_20','shop-20-eyeliner','Eyeliner','makeup','Precision eyeliner for perfect definition','active','/shop/v1.1.0/public/eyeliner-makeup.jpg','{"frontend":"shop-v1.1.0","legacy_id":20,"category":"makeup"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_20_default','prod_shop_20','SHOP-020','Default','active',2200,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_20_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','20','product','prod_shop_20','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','20:default','variant','var_shop_20_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_21','shop-21-foundation','Foundation','makeup','Full-coverage foundation for flawless skin','active','/shop/v1.1.0/public/foundation-makeup-product.jpg','{"frontend":"shop-v1.1.0","legacy_id":21,"category":"makeup"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_21_default','prod_shop_21','SHOP-021','Default','active',4800,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_21_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','21','product','prod_shop_21','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','21:default','variant','var_shop_21_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_22','shop-22-highlighter','Highlighter','makeup','Shimmering highlighter for luminous glow','active','/shop/v1.1.0/public/highlighter-makeup-product.jpg','{"frontend":"shop-v1.1.0","legacy_id":22,"category":"makeup"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_22_default','prod_shop_22','SHOP-022','Default','active',3200,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_22_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','22','product','prod_shop_22','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','22:default','variant','var_shop_22_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_23','shop-23-liquid-lipstick','Liquid Lipstick','makeup','Long-wearing liquid lipstick with bold color','active','/shop/v1.1.0/public/liquid-lipstick-makeup.jpg','{"frontend":"shop-v1.1.0","legacy_id":23,"category":"makeup"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_23_default','prod_shop_23','SHOP-023','Default','active',2999,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_23_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','23','product','prod_shop_23','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','23:default','variant','var_shop_23_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_24','shop-24-floral-fragrance','Floral Fragrance','fragrance','Beautiful floral fragrance with elegant notes','active','/shop/v1.1.0/public/floral-fragrance-perfume.jpg','{"frontend":"shop-v1.1.0","legacy_id":24,"category":"fragrance"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_24_default','prod_shop_24','SHOP-024','Default','active',8500,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_24_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','24','product','prod_shop_24','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','24:default','variant','var_shop_24_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_25','shop-25-vanilla-fragrance','Vanilla Fragrance','fragrance','Warm vanilla fragrance with luxurious scent','active','/shop/v1.1.0/public/vanilla-fragrance-perfume.jpg','{"frontend":"shop-v1.1.0","legacy_id":25,"category":"fragrance"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_25_default','prod_shop_25','SHOP-025','Default','active',7500,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_25_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','25','product','prod_shop_25','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','25:default','variant','var_shop_25_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_26','shop-26-citrus-splash','Citrus Splash','fragrance','Refreshing citrus fragrance','active','/shop/v1.1.0/public/citrus-splash-perfume.jpg','{"frontend":"shop-v1.1.0","legacy_id":26,"category":"fragrance"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_26_default','prod_shop_26','SHOP-026','Default','active',6800,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_26_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','26','product','prod_shop_26','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','26:default','variant','var_shop_26_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_27','shop-27-woody-essence','Woody Essence','fragrance','Deep woody fragrance with sophistication','active','/shop/v1.1.0/public/woody-essence-perfume.jpg','{"frontend":"shop-v1.1.0","legacy_id":27,"category":"fragrance"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_27_default','prod_shop_27','SHOP-027','Default','active',9200,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_27_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','27','product','prod_shop_27','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','27:default','variant','var_shop_27_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_28','shop-28-ocean-breeze','Ocean Breeze','fragrance','Fresh ocean breeze fragrance','active','/shop/v1.1.0/public/ocean-breeze-perfume.jpg','{"frontend":"shop-v1.1.0","legacy_id":28,"category":"fragrance"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_28_default','prod_shop_28','SHOP-028','Default','active',7200,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_28_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','28','product','prod_shop_28','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','28:default','variant','var_shop_28_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_29','shop-29-rose-garden','Rose Garden','fragrance','Romantic rose garden fragrance','active','/shop/v1.1.0/public/rose-garden-perfume.jpg','{"frontend":"shop-v1.1.0","legacy_id":29,"category":"fragrance"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_29_default','prod_shop_29','SHOP-029','Default','active',8800,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_29_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','29','product','prod_shop_29','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','29:default','variant','var_shop_29_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_30','shop-30-musk-elegance','Musk Elegance','fragrance','Elegant musk fragrance','active','/shop/v1.1.0/public/musk-elegance-perfume.jpg','{"frontend":"shop-v1.1.0","legacy_id":30,"category":"fragrance"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_30_default','prod_shop_30','SHOP-030','Default','active',7800,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_30_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','30','product','prod_shop_30','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','30:default','variant','var_shop_30_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_31','shop-31-jasmine-night','Jasmine Night','fragrance','Nighttime jasmine fragrance','active','/shop/v1.1.0/public/jasmine-night-perfume.jpg','{"frontend":"shop-v1.1.0","legacy_id":31,"category":"fragrance"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_31_default','prod_shop_31','SHOP-031','Default','active',8200,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_31_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','31','product','prod_shop_31','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','31:default','variant','var_shop_31_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_32','shop-32-lavender-essence','Lavender Essence','fragrance','Calming lavender essence fragrance','active','/shop/v1.1.0/public/lavender-essence-perfume.jpg','{"frontend":"shop-v1.1.0","legacy_id":32,"category":"fragrance"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_32_default','prod_shop_32','SHOP-032','Default','active',6499,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_32_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','32','product','prod_shop_32','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','32:default','variant','var_shop_32_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_33','shop-33-hair-growth-supplement','Hair Growth Supplement','wellness','Natural supplement for healthy hair growth','active','/shop/v1.1.0/public/hair-growth-supplement.jpg','{"frontend":"shop-v1.1.0","legacy_id":33,"category":"wellness"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_33_default','prod_shop_33','SHOP-033','Default','active',4800,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_33_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','33','product','prod_shop_33','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','33:default','variant','var_shop_33_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_34','shop-34-collagen-powder','Collagen Powder','wellness','Premium collagen powder for skin elasticity','active','/shop/v1.1.0/public/collagen-powder-beauty.jpg','{"frontend":"shop-v1.1.0","legacy_id":34,"category":"wellness"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_34_default','prod_shop_34','SHOP-034','Default','active',5500,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_34_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','34','product','prod_shop_34','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','34:default','variant','var_shop_34_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_35','shop-35-vitamin-serum','Vitamin Serum','wellness','Daily vitamin serum for wellness support','active','/shop/v1.1.0/public/vitamin-serum-wellness.jpg','{"frontend":"shop-v1.1.0","legacy_id":35,"category":"wellness"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_35_default','prod_shop_35','SHOP-035','Default','active',5200,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_35_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','35','product','prod_shop_35','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','35:default','variant','var_shop_35_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_36','shop-36-hydration-tablets','Hydration Tablets','wellness','Electrolyte hydration tablets','active','/shop/v1.1.0/public/hydration-tablets-wellness.jpg','{"frontend":"shop-v1.1.0","legacy_id":36,"category":"wellness"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_36_default','prod_shop_36','SHOP-036','Default','active',3500,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_36_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','36','product','prod_shop_36','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','36:default','variant','var_shop_36_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_37','shop-37-skin-glow-capsules','Skin Glow Capsules','wellness','Capsules for radiant, glowing skin','active','/shop/v1.1.0/public/skin-glow-capsules.jpg','{"frontend":"shop-v1.1.0","legacy_id":37,"category":"wellness"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_37_default','prod_shop_37','SHOP-037','Default','active',6200,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_37_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','37','product','prod_shop_37','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','37:default','variant','var_shop_37_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_38','shop-38-bio-serum','Bio Serum','wellness','Bioavailable serum supplement','active','/shop/v1.1.0/public/bio-serum-wellness.jpg','{"frontend":"shop-v1.1.0","legacy_id":38,"category":"wellness"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_38_default','prod_shop_38','SHOP-038','Default','active',4500,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_38_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','38','product','prod_shop_38','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','38:default','variant','var_shop_38_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_39','shop-39-antioxidant-blend','Antioxidant Blend','wellness','Powerful antioxidant blend for health','active','/shop/v1.1.0/public/antioxidant-blend-wellness.jpg','{"frontend":"shop-v1.1.0","legacy_id":39,"category":"wellness"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_39_default','prod_shop_39','SHOP-039','Default','active',5800,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_39_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','39','product','prod_shop_39','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','39:default','variant','var_shop_39_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_40','shop-40-youth-complex','Youth Complex','wellness','Complete youth-enhancing supplement complex','active','/shop/v1.1.0/public/youth-complex-supplement.jpg','{"frontend":"shop-v1.1.0","legacy_id":40,"category":"wellness"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_40_default','prod_shop_40','SHOP-040','Default','active',7000,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_40_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','40','product','prod_shop_40','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','40:default','variant','var_shop_40_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_41','shop-41-skincare-starter-set','Skincare Starter Set','sets','Complete skincare starter set for beginners','active','/shop/v1.1.0/public/skincare-starter-set.jpg','{"frontend":"shop-v1.1.0","legacy_id":41,"category":"sets"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_41_default','prod_shop_41','SHOP-041','Default','active',8900,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_41_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','41','product','prod_shop_41','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','41:default','variant','var_shop_41_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_42','shop-42-makeup-essentials-bundle','Makeup Essentials Bundle','sets','Essential makeup products bundle','active','/shop/v1.1.0/public/makeup-essentials-bundle.jpg','{"frontend":"shop-v1.1.0","legacy_id":42,"category":"sets"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_42_default','prod_shop_42','SHOP-042','Default','active',12500,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_42_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','42','product','prod_shop_42','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','42:default','variant','var_shop_42_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_43','shop-43-luxury-travel-set','Luxury Travel Set','sets','Luxurious travel-sized beauty set','active','/shop/v1.1.0/public/luxury-travel-set.jpg','{"frontend":"shop-v1.1.0","legacy_id":43,"category":"sets"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_43_default','prod_shop_43','SHOP-043','Default','active',7900,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_43_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','43','product','prod_shop_43','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','43:default','variant','var_shop_43_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_44','shop-44-date-night-set','Date Night Set','sets','Perfect makeup set for date nights','active','/shop/v1.1.0/public/date-night-makeup-set.jpg','{"frontend":"shop-v1.1.0","legacy_id":44,"category":"sets"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_44_default','prod_shop_44','SHOP-044','Default','active',9500,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_44_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','44','product','prod_shop_44','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','44:default','variant','var_shop_44_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_45','shop-45-glow-getter-set','Glow Getter Set','sets','Complete glow-getting beauty set','active','/shop/v1.1.0/public/glow-getter-set.jpg','{"frontend":"shop-v1.1.0","legacy_id":45,"category":"sets"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_45_default','prod_shop_45','SHOP-045','Default','active',11000,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_45_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','45','product','prod_shop_45','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','45:default','variant','var_shop_45_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_46','shop-46-wellness-bundle','Wellness Bundle','sets','Complete wellness supplement bundle','active','/shop/v1.1.0/public/wellness-bundle-set.jpg','{"frontend":"shop-v1.1.0","legacy_id":46,"category":"sets"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_46_default','prod_shop_46','SHOP-046','Default','active',13500,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_46_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','46','product','prod_shop_46','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','46:default','variant','var_shop_46_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_47','shop-47-complete-beauty-set','Complete Beauty Set','sets','Complete all-in-one beauty collection','active','/shop/v1.1.0/public/complete-beauty-set.jpg','{"frontend":"shop-v1.1.0","legacy_id":47,"category":"sets"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_47_default','prod_shop_47','SHOP-047','Default','active',15000,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_47_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','47','product','prod_shop_47','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','47:default','variant','var_shop_47_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_48','shop-48-signature-collection','Signature Collection','sets','Premium signature collection set','active','/shop/v1.1.0/public/signature-collection-set.jpg','{"frontend":"shop-v1.1.0","legacy_id":48,"category":"sets"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_48_default','prod_shop_48','SHOP-048','Default','active',18000,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_48_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','48','product','prod_shop_48','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','48:default','variant','var_shop_48_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_49','shop-49-volumizing-shampoo','Volumizing Shampoo','haircare','Volumizing shampoo for fuller hair','active','/shop/v1.1.0/public/volumizing-shampoo-haircare.jpg','{"frontend":"shop-v1.1.0","legacy_id":49,"category":"haircare"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_49_default','prod_shop_49','SHOP-049','Default','active',3200,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_49_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','49','product','prod_shop_49','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','49:default','variant','var_shop_49_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_50','shop-50-deep-conditioner','Deep Conditioner','haircare','Rich deep conditioning treatment','active','/shop/v1.1.0/public/deep-conditioner-haircare.jpg','{"frontend":"shop-v1.1.0","legacy_id":50,"category":"haircare"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_50_default','prod_shop_50','SHOP-050','Default','active',3800,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_50_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','50','product','prod_shop_50','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','50:default','variant','var_shop_50_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_51','shop-51-hair-growth-serum','Hair Growth Serum','haircare','Serum to promote hair growth','active','/shop/v1.1.0/public/hair-growth-serum.jpg','{"frontend":"shop-v1.1.0","legacy_id":51,"category":"haircare"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_51_default','prod_shop_51','SHOP-051','Default','active',4800,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_51_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','51','product','prod_shop_51','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','51:default','variant','var_shop_51_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_52','shop-52-silk-hair-mask','Silk Hair Mask','haircare','Luxurious silk hair mask treatment','active','/shop/v1.1.0/public/silk-hair-mask-treatment.jpg','{"frontend":"shop-v1.1.0","legacy_id":52,"category":"haircare"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_52_default','prod_shop_52','SHOP-052','Default','active',4200,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_52_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','52','product','prod_shop_52','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','52:default','variant','var_shop_52_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_53','shop-53-keratin-treatment','Keratin Treatment','haircare','Professional keratin treatment','active','/shop/v1.1.0/public/keratin-treatment-haircare.jpg','{"frontend":"shop-v1.1.0","legacy_id":53,"category":"haircare"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_53_default','prod_shop_53','SHOP-053','Default','active',5500,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_53_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','53','product','prod_shop_53','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','53:default','variant','var_shop_53_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_54','shop-54-anti-frizz-spray','Anti-Frizz Spray','haircare','Anti-frizz spray for smooth hair','active','/shop/v1.1.0/public/anti-frizz-spray-haircare.jpg','{"frontend":"shop-v1.1.0","legacy_id":54,"category":"haircare"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_54_default','prod_shop_54','SHOP-054','Default','active',2800,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_54_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','54','product','prod_shop_54','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','54:default','variant','var_shop_54_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_55','shop-55-hair-oil-elixir','Hair Oil Elixir','haircare','Luxurious hair oil elixir','active','/shop/v1.1.0/public/hair-oil-elixir.jpg','{"frontend":"shop-v1.1.0","legacy_id":55,"category":"haircare"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_55_default','prod_shop_55','SHOP-055','Default','active',3500,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_55_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','55','product','prod_shop_55','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','55:default','variant','var_shop_55_default','{}',datetime('now'));
INSERT OR IGNORE INTO products (id,slug,title,subtitle,description,status,thumbnail_url,metadata_json,created_at,updated_at) VALUES ('prod_shop_56','shop-56-scalp-therapy-shampoo','Scalp Therapy Shampoo','haircare','Therapeutic scalp shampoo','active','/shop/v1.1.0/public/scalp-therapy-shampoo.jpg','{"frontend":"shop-v1.1.0","legacy_id":56,"category":"haircare"}',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO product_variants (id,product_id,sku,title,status,price_minor,compare_at_minor,currency_code,option_json,inventory_policy,position,created_at,updated_at) VALUES ('var_shop_56_default','prod_shop_56','SHOP-056','Default','active',3600,NULL,'USD','{}','deny',0,datetime('now'),datetime('now'));
INSERT OR IGNORE INTO inventory_items (variant_id,stock_on_hand,reserved,updated_at) VALUES ('var_shop_56_default',100,0,datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','56','product','prod_shop_56','{}',datetime('now'));
INSERT OR IGNORE INTO external_refs (namespace,external_id,resource_type,resource_id,metadata_json,created_at) VALUES ('shop-v1.1.0','56:default','variant','var_shop_56_default','{}',datetime('now'));
`
]

const SEED = `INSERT OR IGNORE INTO products
(id, slug, title, subtitle, description, status, thumbnail_url, created_at, updated_at)
VALUES
('prod_serum','luminous-barrier-serum','Luminous Barrier Serum','30 ML · SKIN','Barrier-support serum with a silky finish.','active','https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=900&q=86',datetime('now'),datetime('now')),
('prod_tint','velvet-skin-tint','Velvet Skin Tint','30 ML · COLOR','Lightweight complexion tint.','active','https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=86',datetime('now'),datetime('now')),
('prod_cream','cloud-cream','Cloud Cream','50 ML · SKIN','Daily comfort moisturizer.','active','https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=900&q=86',datetime('now'),datetime('now')),
('prod_scent04','no-04-skin-scent','No. 04 Skin Scent','50 ML · SCENT','Soft skin-close fragrance.','active','https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=86',datetime('now'),datetime('now')),
('prod_balm','soft-focus-balm','Soft Focus Balm','8 G · COLOR','Soft-focus complexion balm.','active','https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?auto=format&fit=crop&w=900&q=86',datetime('now'),datetime('now')),
('prod_cleanser','daily-reset-cleanser','Daily Reset Cleanser','120 ML · SKIN','Gentle daily reset cleanser.','active','https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=900&q=86',datetime('now'),datetime('now')),
('prod_oil','rose-veil-oil','Rose Veil Oil','30 ML · SKIN','Lightweight radiance face oil.','active','https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=86',datetime('now'),datetime('now')),
('prod_afterlight','afterlight-eau-de-parfum','Afterlight Eau de Parfum','50 ML · SCENT','Veloura signature fragrance.','active','https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=86',datetime('now'),datetime('now'));

INSERT OR IGNORE INTO product_variants
(id, product_id, sku, title, status, price_minor, currency_code, option_json, inventory_policy, position, created_at, updated_at)
VALUES
('var_serum_std','prod_serum','VLR-SER-30','30 ML','active',5800,'USD','{}','deny',0,datetime('now'),datetime('now')),
('var_tint_std','prod_tint','VLR-TINT-30','30 ML','active',4200,'USD','{}','deny',0,datetime('now'),datetime('now')),
('var_cream_std','prod_cream','VLR-CRM-50','50 ML','active',6400,'USD','{}','deny',0,datetime('now'),datetime('now')),
('var_scent04_std','prod_scent04','VLR-SCN-04','50 ML','active',8600,'USD','{}','deny',0,datetime('now'),datetime('now')),
('var_balm_std','prod_balm','VLR-BALM-08','8 G','active',3800,'USD','{}','deny',0,datetime('now'),datetime('now')),
('var_cleanser_std','prod_cleanser','VLR-CLN-120','120 ML','active',3600,'USD','{}','deny',0,datetime('now'),datetime('now')),
('var_oil_std','prod_oil','VLR-OIL-30','30 ML','active',5400,'USD','{}','deny',0,datetime('now'),datetime('now')),
('var_afterlight_std','prod_afterlight','VLR-AFT-50','50 ML','active',9200,'USD','{}','deny',0,datetime('now'),datetime('now'));

INSERT OR IGNORE INTO inventory_items (variant_id, stock_on_hand, reserved, updated_at)
VALUES
('var_serum_std',100,0,datetime('now')),
('var_tint_std',100,0,datetime('now')),
('var_cream_std',100,0,datetime('now')),
('var_scent04_std',100,0,datetime('now')),
('var_balm_std',100,0,datetime('now')),
('var_cleanser_std',100,0,datetime('now')),
('var_oil_std',100,0,datetime('now')),
('var_afterlight_std',100,0,datetime('now'));
`

let ready = false
let inflight: Promise<void> | null = null

export async function ensurePreviewDatabase(env: Env) {
  if (!env.DB || env.AUTO_BOOTSTRAP !== '1' || ready) return
  if (inflight) return inflight

  inflight = (async () => {
    const exists = await env.DB!
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='products' LIMIT 1")
      .first()

    if (!exists) {
      for (const migration of MIGRATIONS) {
        await env.DB!.exec(migration)
      }
      await env.DB!.exec(SEED)
    }

    ready = true
  })()

  try {
    await inflight
  } finally {
    inflight = null
  }
}
