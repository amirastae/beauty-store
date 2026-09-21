CREATE TABLE IF NOT EXISTS order_receipts (
  token_hash TEXT PRIMARY KEY,
  order_id TEXT NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL,
  expires_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_order_receipts_expiry
ON order_receipts(expires_at);
