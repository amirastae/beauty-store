import type { Env } from '../env'

const CORE_SCHEMA = `PRAGMA foreign_keys = ON;

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
`
const AUX_SCHEMA = `CREATE TABLE IF NOT EXISTS inventory_events (
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
`
const EVENTS_SCHEMA = `CREATE TABLE IF NOT EXISTS outbox_events (
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
`
const FRONTEND_COMPAT = `CREATE TABLE IF NOT EXISTS external_refs (
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
`
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
      await env.DB!.exec(CORE_SCHEMA)
      await env.DB!.exec(AUX_SCHEMA)
      await env.DB!.exec(EVENTS_SCHEMA)
      await env.DB!.exec(FRONTEND_COMPAT)
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
