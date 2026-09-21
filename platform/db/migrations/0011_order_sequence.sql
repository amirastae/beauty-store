CREATE TABLE IF NOT EXISTS order_sequences (
  name TEXT PRIMARY KEY,
  next_value INTEGER NOT NULL CHECK(next_value >= 0)
);

INSERT OR IGNORE INTO order_sequences (name, next_value)
VALUES ('order', 99999999);
