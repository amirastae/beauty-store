ALTER TABLE carts ADD COLUMN phone TEXT;
ALTER TABLE orders ADD COLUMN phone TEXT;

CREATE INDEX IF NOT EXISTS idx_orders_phone_created
ON orders(phone, created_at DESC);
