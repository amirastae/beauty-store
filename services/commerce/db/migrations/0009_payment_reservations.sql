ALTER TABLE orders ADD COLUMN payment_expires_at TEXT;

CREATE INDEX IF NOT EXISTS idx_orders_payment_expiry
ON orders(status, payment_status, payment_expires_at);
