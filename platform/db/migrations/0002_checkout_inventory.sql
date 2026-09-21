CREATE TABLE IF NOT EXISTS inventory_events (
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
