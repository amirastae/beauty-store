CREATE TABLE IF NOT EXISTS checkout_claims (
  cart_id TEXT PRIMARY KEY REFERENCES carts(id) ON DELETE CASCADE,
  idempotency_key TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_checkout_claims_idempotency
ON checkout_claims(idempotency_key);

CREATE INDEX IF NOT EXISTS idx_checkout_claims_expires
ON checkout_claims(expires_at);
