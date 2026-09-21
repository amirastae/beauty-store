INSERT OR IGNORE INTO products
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
