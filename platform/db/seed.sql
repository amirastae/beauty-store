INSERT OR IGNORE INTO products
(id, slug, title, subtitle, description, status, thumbnail_url, created_at, updated_at)
VALUES
('prod_serum','luminous-barrier-serum','Luminous Barrier Serum','30 ML · SKIN','Barrier-support serum with a silky finish.','active','https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=900&q=86',datetime('now'),datetime('now')),
('prod_tint','velvet-skin-tint','Velvet Skin Tint','30 ML · COLOR','Lightweight complexion tint.','active','https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=86',datetime('now'),datetime('now')),
('prod_cream','cloud-cream','Cloud Cream','50 ML · SKIN','Daily comfort moisturizer.','active','https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=900&q=86',datetime('now'),datetime('now'));

INSERT OR IGNORE INTO product_variants
(id, product_id, sku, title, status, price_minor, currency_code, option_json, inventory_policy, position, created_at, updated_at)
VALUES
('var_serum_std','prod_serum','VLR-SER-30','30 ML','active',5800,'USD','{}','deny',0,datetime('now'),datetime('now')),
('var_tint_std','prod_tint','VLR-TINT-30','30 ML','active',4200,'USD','{}','deny',0,datetime('now'),datetime('now')),
('var_cream_std','prod_cream','VLR-CRM-50','50 ML','active',6400,'USD','{}','deny',0,datetime('now'),datetime('now'));

INSERT OR IGNORE INTO inventory_items (variant_id, stock_on_hand, reserved, updated_at)
VALUES
('var_serum_std',100,0,datetime('now')),
('var_tint_std',100,0,datetime('now')),
('var_cream_std',100,0,datetime('now'));
