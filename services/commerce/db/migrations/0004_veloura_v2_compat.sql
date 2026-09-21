CREATE TABLE IF NOT EXISTS external_refs (
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
