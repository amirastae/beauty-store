export type Shade = {
  id: string;
  nameFa: string;
  hex: string;
};

export type ProductCategory = "پوست" | "آرایش" | "عطر" | "مو" | "ست‌ها" | "سلامت";

export type Product = {
  id: string;
  slug: string;
  nameFa: string;
  nameEn: string;
  brand: string;
  category: ProductCategory;
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  badge?: string;
  image: string;
  imageAlt: string;
  shades?: Shade[];
};

type RawProduct = {
  id: number;
  slug: string;
  nameFa: string;
  nameEn: string;
  category: ProductCategory;
  usd: number;
  image: string;
  rating: number;
  reviewCount: number;
};

const rawProducts: RawProduct[] = [
  { id:1, slug:"pearl-barrier-serum", nameFa:"سرم آبرسان پرل", nameEn:"Hydrating Face Serum", category:"پوست", usd:45, image:"/hydrating-face-serum.jpg", rating:4.8, reviewCount:211 },
  { id:2, slug:"eye-cream", nameFa:"کرم دور چشم لیفت", nameEn:"Eye Cream", category:"پوست", usd:52, image:"/eye-cream-luxury.jpg", rating:4.9, reviewCount:89 },
  { id:3, slug:"moisturizer-spf", nameFa:"مرطوب‌کننده روزانه SPF", nameEn:"Moisturizer SPF", category:"پوست", usd:62, image:"/moisturizer-spf-sunscreen.jpg", rating:4.7, reviewCount:156 },
  { id:4, slug:"facial-cleanser", nameFa:"شوینده لطیف صورت", nameEn:"Facial Cleanser", category:"پوست", usd:38, image:"/facial-cleanser-luxury.jpg", rating:4.8, reviewCount:201 },
  { id:5, slug:"night-cream", nameFa:"کرم شب بازساز", nameEn:"Night Cream", category:"پوست", usd:58, image:"/night-cream-moisturizer.jpg", rating:4.6, reviewCount:98 },
  { id:6, slug:"face-mask", nameFa:"ماسک پاکسازی صورت", nameEn:"Face Mask", category:"پوست", usd:42, image:"/luxury-face-mask-skincare.jpg", rating:4.9, reviewCount:167 },
  { id:7, slug:"toner", nameFa:"تونر رز بالانس", nameEn:"Toner", category:"پوست", usd:35, image:"/face-toner-skincare.jpg", rating:4.7, reviewCount:142 },
  { id:8, slug:"retinol-treatment", nameFa:"درمان رتینول شب", nameEn:"Retinol Treatment", category:"پوست", usd:68, image:"/retinol-treatment-skincare.jpg", rating:4.8, reviewCount:178 },
  { id:9, slug:"silk-serum", nameFa:"سرم ابریشمی بنفش", nameEn:"Silk Serum", category:"پوست", usd:49.99, image:"/luxury-purple-cosmetic-serum-bottle.jpg", rating:4.8, reviewCount:124 },
  { id:10, slug:"lavender-mask", nameFa:"ماسک اسطوخودوس", nameEn:"Lavender Mask", category:"پوست", usd:39.99, image:"/luxury-purple-face-mask-jar.jpg", rating:4.9, reviewCount:89 },
  { id:11, slug:"pearl-cream", nameFa:"کرم مروارید", nameEn:"Pearl Cream", category:"پوست", usd:59.99, image:"/luxury-white-pearl-cream-jar.jpg", rating:4.7, reviewCount:156 },
  { id:12, slug:"rose-oil", nameFa:"روغن رز الیکسیر", nameEn:"Rose Oil", category:"پوست", usd:44.99, image:"/luxury-rose-oil-bottle.jpg", rating:4.8, reviewCount:201 },
  { id:13, slug:"glow-toner", nameFa:"تونر گلو", nameEn:"Glow Toner", category:"پوست", usd:34.99, image:"/luxury-purple-toner-bottle.jpg", rating:4.6, reviewCount:98 },
  { id:14, slug:"night-elixir", nameFa:"الیکسیر شب", nameEn:"Night Elixir", category:"پوست", usd:54.99, image:"/luxury-night-serum-bottle.jpg", rating:4.9, reviewCount:167 },
  { id:15, slug:"velvet-cloud-lip", nameFa:"رژ لب مخملی کلود", nameEn:"Luxury Lipstick", category:"آرایش", usd:38, image:"/luxury-lipstick-makeup.jpg", rating:4.8, reviewCount:328 },
  { id:16, slug:"foundation-primer", nameFa:"پرایمر فاندیشن", nameEn:"Foundation Primer", category:"آرایش", usd:35, image:"/foundation-primer-makeup.jpg", rating:4.7, reviewCount:132 },
  { id:17, slug:"mascara-pro", nameFa:"ریمل پرو", nameEn:"Mascara Pro", category:"آرایش", usd:32, image:"/mascara-professional-makeup.jpg", rating:4.9, reviewCount:189 },
  { id:18, slug:"luminous-eye-veil", nameFa:"سایه چشم لومینوس ویل", nameEn:"Eye Shadow Palette", category:"آرایش", usd:55, image:"/eyeshadow-palette-makeup.jpg", rating:4.8, reviewCount:97 },
  { id:19, slug:"blush", nameFa:"رژگونه مخملی", nameEn:"Blush", category:"آرایش", usd:28, image:"/blush-makeup-product.jpg", rating:4.6, reviewCount:118 },
  { id:20, slug:"eyeliner", nameFa:"خط چشم دقیق", nameEn:"Eyeliner", category:"آرایش", usd:22, image:"/eyeliner-makeup.jpg", rating:4.7, reviewCount:154 },
  { id:21, slug:"foundation", nameFa:"فاندیشن اسکین ویل", nameEn:"Foundation", category:"آرایش", usd:48, image:"/foundation-makeup-product.jpg", rating:4.8, reviewCount:203 },
  { id:22, slug:"highlighter", nameFa:"هایلایتر لومینوس", nameEn:"Highlighter", category:"آرایش", usd:32, image:"/highlighter-makeup-product.jpg", rating:4.9, reviewCount:176 },
  { id:23, slug:"liquid-lipstick", nameFa:"رژ لب مایع", nameEn:"Liquid Lipstick", category:"آرایش", usd:29.99, image:"/liquid-lipstick-makeup.jpg", rating:4.7, reviewCount:142 },
  { id:24, slug:"afterlight-eau-de-parfum", nameFa:"ادوپرفیوم افترلایت", nameEn:"Floral Fragrance", category:"عطر", usd:85, image:"/floral-fragrance-perfume.jpg", rating:4.8, reviewCount:184 },
  { id:25, slug:"vanilla-fragrance", nameFa:"عطر وانیلا امبر", nameEn:"Vanilla Fragrance", category:"عطر", usd:75, image:"/vanilla-fragrance-perfume.jpg", rating:4.7, reviewCount:165 },
  { id:26, slug:"citrus-splash", nameFa:"عطر سیتروس اسپلش", nameEn:"Citrus Splash", category:"عطر", usd:68, image:"/citrus-splash-perfume.jpg", rating:4.9, reviewCount:178 },
  { id:27, slug:"woody-essence", nameFa:"عطر وودی اسنس", nameEn:"Woody Essence", category:"عطر", usd:92, image:"/woody-essence-perfume.jpg", rating:4.8, reviewCount:142 },
  { id:28, slug:"ocean-breeze", nameFa:"عطر اوشن بریز", nameEn:"Ocean Breeze", category:"عطر", usd:72, image:"/ocean-breeze-perfume.jpg", rating:4.6, reviewCount:154 },
  { id:29, slug:"rose-garden", nameFa:"عطر رز گاردن", nameEn:"Rose Garden", category:"عطر", usd:88, image:"/rose-garden-perfume.jpg", rating:4.9, reviewCount:201 },
  { id:30, slug:"musk-elegance", nameFa:"عطر ماسک الگانس", nameEn:"Musk Elegance", category:"عطر", usd:78, image:"/musk-elegance-perfume.jpg", rating:4.7, reviewCount:167 },
  { id:31, slug:"jasmine-night", nameFa:"عطر جاسمین نایت", nameEn:"Jasmine Night", category:"عطر", usd:82, image:"/jasmine-night-perfume.jpg", rating:4.8, reviewCount:189 },
  { id:32, slug:"lavender-essence", nameFa:"عطر لاوندر اسنس", nameEn:"Lavender Essence", category:"عطر", usd:64.99, image:"/lavender-essence-perfume.jpg", rating:4.8, reviewCount:132 },
  { id:33, slug:"hair-growth-supplement", nameFa:"مکمل رشد مو", nameEn:"Hair Growth Supplement", category:"سلامت", usd:48, image:"/hair-growth-supplement.jpg", rating:4.7, reviewCount:118 },
  { id:34, slug:"collagen-powder", nameFa:"پودر کلاژن بیوتی", nameEn:"Collagen Powder", category:"سلامت", usd:55, image:"/collagen-powder-beauty.jpg", rating:4.8, reviewCount:176 },
  { id:35, slug:"vitamin-serum", nameFa:"سرم ویتامین", nameEn:"Vitamin Serum", category:"سلامت", usd:52, image:"/vitamin-serum-wellness.jpg", rating:4.9, reviewCount:203 },
  { id:36, slug:"hydration-tablets", nameFa:"قرص هیدراته", nameEn:"Hydration Tablets", category:"سلامت", usd:35, image:"/hydration-tablets-wellness.jpg", rating:4.6, reviewCount:145 },
  { id:37, slug:"skin-glow-capsules", nameFa:"کپسول اسکین گلو", nameEn:"Skin Glow Capsules", category:"سلامت", usd:62, image:"/skin-glow-capsules.jpg", rating:4.8, reviewCount:189 },
  { id:38, slug:"bio-serum", nameFa:"سرم بایو اکتیو", nameEn:"Bio Serum", category:"سلامت", usd:45, image:"/bio-serum-wellness.jpg", rating:4.7, reviewCount:132 },
  { id:39, slug:"antioxidant-blend", nameFa:"ترکیب آنتی‌اکسیدان", nameEn:"Antioxidant Blend", category:"سلامت", usd:58, image:"/antioxidant-blend-wellness.jpg", rating:4.9, reviewCount:167 },
  { id:40, slug:"youth-complex", nameFa:"کمپلکس جوانی", nameEn:"Youth Complex", category:"سلامت", usd:70, image:"/youth-complex-supplement.jpg", rating:4.8, reviewCount:154 },
  { id:41, slug:"skincare-starter-set", nameFa:"ست شروع مراقبت پوست", nameEn:"Skincare Starter Set", category:"ست‌ها", usd:89, image:"/skincare-starter-set.jpg", rating:4.9, reviewCount:267 },
  { id:42, slug:"makeup-essentials-bundle", nameFa:"باندل ضروری آرایش", nameEn:"Makeup Essentials Bundle", category:"ست‌ها", usd:125, image:"/makeup-essentials-bundle.jpg", rating:4.8, reviewCount:312 },
  { id:43, slug:"luxury-travel-set", nameFa:"ست سفر لوکس", nameEn:"Luxury Travel Set", category:"ست‌ها", usd:79, image:"/luxury-travel-set.jpg", rating:4.7, reviewCount:198 },
  { id:44, slug:"date-night-set", nameFa:"ست دیت نایت", nameEn:"Date Night Set", category:"ست‌ها", usd:95, image:"/date-night-makeup-set.jpg", rating:4.8, reviewCount:276 },
  { id:45, slug:"glow-getter-set", nameFa:"ست گلو گتر", nameEn:"Glow Getter Set", category:"ست‌ها", usd:110, image:"/glow-getter-set.jpg", rating:4.9, reviewCount:287 },
  { id:46, slug:"wellness-bundle", nameFa:"باندل ولنس", nameEn:"Wellness Bundle", category:"ست‌ها", usd:135, image:"/wellness-bundle-set.jpg", rating:4.8, reviewCount:234 },
  { id:47, slug:"complete-beauty-set", nameFa:"ست کامل زیبایی", nameEn:"Complete Beauty Set", category:"ست‌ها", usd:150, image:"/complete-beauty-set.jpg", rating:4.9, reviewCount:298 },
  { id:48, slug:"signature-collection", nameFa:"کالکشن سیگنیچر", nameEn:"Signature Collection", category:"ست‌ها", usd:180, image:"/signature-collection-set.jpg", rating:4.9, reviewCount:324 },
  { id:49, slug:"volumizing-shampoo", nameFa:"شامپو حجم‌دهنده", nameEn:"Volumizing Shampoo", category:"مو", usd:32, image:"/volumizing-shampoo-haircare.jpg", rating:4.7, reviewCount:156 },
  { id:50, slug:"deep-conditioner", nameFa:"نرم‌کننده عمیق", nameEn:"Deep Conditioner", category:"مو", usd:38, image:"/deep-conditioner-haircare.jpg", rating:4.8, reviewCount:189 },
  { id:51, slug:"hair-growth-serum", nameFa:"سرم رشد مو", nameEn:"Hair Growth Serum", category:"مو", usd:48, image:"/hair-growth-serum.jpg", rating:4.9, reviewCount:214 },
  { id:52, slug:"silk-hair-mask", nameFa:"ماسک ابریشمی مو", nameEn:"Silk Hair Mask", category:"مو", usd:42, image:"/silk-hair-mask-treatment.jpg", rating:4.8, reviewCount:167 },
  { id:53, slug:"keratin-treatment", nameFa:"درمان کراتین", nameEn:"Keratin Treatment", category:"مو", usd:55, image:"/keratin-treatment-haircare.jpg", rating:4.9, reviewCount:245 },
  { id:54, slug:"anti-frizz-spray", nameFa:"اسپری ضد وز", nameEn:"Anti-Frizz Spray", category:"مو", usd:28, image:"/anti-frizz-spray-haircare.jpg", rating:4.7, reviewCount:132 },
  { id:55, slug:"hair-oil-elixir", nameFa:"روغن الیکسیر مو", nameEn:"Hair Oil Elixir", category:"مو", usd:35, image:"/hair-oil-elixir.jpg", rating:4.8, reviewCount:178 },
  { id:56, slug:"scalp-therapy-shampoo", nameFa:"شامپو درمان پوست سر", nameEn:"Scalp Therapy Shampoo", category:"مو", usd:36, image:"/scalp-therapy-shampoo.jpg", rating:4.6, reviewCount:145 }
];

const priceOverrides: Record<number, number> = {
  1: 2740000,
  15: 1890000,
  18: 2240000,
  24: 4980000
};

const shadeFamilies: Record<number, Shade[]> = {
  15: [
    { id:"rose", nameFa:"رز خاموش", hex:"#A85B67" },
    { id:"berry", nameFa:"بری عمیق", hex:"#6B263B" },
    { id:"nude", nameFa:"نود گرم", hex:"#B77B68" }
  ],
  18: [
    { id:"champagne", nameFa:"شامپاین", hex:"#D4B184" },
    { id:"bronze", nameFa:"برنز", hex:"#8B5C42" },
    { id:"plum", nameFa:"آلوئی", hex:"#684252" }
  ],
  19: [
    { id:"petal", nameFa:"پتال", hex:"#C77B82" },
    { id:"peach", nameFa:"هلویی", hex:"#D58B72" }
  ],
  21: [
    { id:"light", nameFa:"روشن", hex:"#E8C3A8" },
    { id:"medium", nameFa:"متوسط", hex:"#C88E6C" },
    { id:"deep", nameFa:"تیره", hex:"#8C5A43" }
  ],
  23: [
    { id:"mauve", nameFa:"موو", hex:"#92556B" },
    { id:"red", nameFa:"قرمز کلاسیک", hex:"#9C273A" },
    { id:"nude", nameFa:"نود", hex:"#B87967" }
  ]
};

const toToman = (usd: number) => Math.round((usd * 62000) / 10000) * 10000;

export const products: Product[] = rawProducts.map((raw) => ({
  id: "veloura-" + raw.id,
  slug: raw.slug,
  nameFa: raw.nameFa,
  nameEn: raw.nameEn,
  brand: "VELOURA",
  category: raw.category,
  price: priceOverrides[raw.id] ?? toToman(raw.usd),
  rating: raw.rating,
  reviewCount: raw.reviewCount,
  badge: raw.reviewCount >= 280 ? "پرفروش" : raw.rating >= 4.9 ? "محبوب" : undefined,
  image: raw.image,
  imageAlt: raw.nameFa + " از ولورا",
  shades: shadeFamilies[raw.id]
}));

export const categories = ["همه", "پوست", "آرایش", "عطر", "مو", "ست‌ها", "سلامت"] as const;
