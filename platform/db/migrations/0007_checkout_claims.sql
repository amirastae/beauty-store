CREATE TABLE IF NOT EXISTS checkout_claims (
  cart_id TEXT PRIMARY KEY REFERENCES carts(id) ON DELETE CASCADE,
  idempotency_key TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_checkout_claims_expires
ON checkout_claims(expires_at);
