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
  ingredients: string[];
  usageFa: string;
  benefitsFa: string[];
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
  ingredients: string[];
};

const rawProducts: RawProduct[] = [
  { id:1, slug:"pearl-barrier-serum", nameFa:"سرم آبرسان پرل", nameEn:"Hydrating Face Serum", category:"پوست", usd:45, image:"/hydrating-face-serum.jpg", rating:4.8, reviewCount:211, ingredients:["Hyaluronic Acid","Vitamin E","Aloe Vera Extract","Green Tea Extract"] },
  { id:2, slug:"eye-cream", nameFa:"کرم دور چشم لیفت", nameEn:"Eye Cream", category:"پوست", usd:52, image:"/eye-cream-luxury.jpg", rating:4.9, reviewCount:89, ingredients:["Retinol","Peptides","Caffeine","Hyaluronic Acid"] },
  { id:3, slug:"moisturizer-spf", nameFa:"مرطوب‌کننده روزانه SPF", nameEn:"Moisturizer SPF", category:"پوست", usd:62, image:"/moisturizer-spf-sunscreen.jpg", rating:4.7, reviewCount:156, ingredients:["SPF 30","Jojoba Oil","Niacinamide","Ceramides"] },
  { id:4, slug:"facial-cleanser", nameFa:"شوینده لطیف صورت", nameEn:"Facial Cleanser", category:"پوست", usd:38, image:"/facial-cleanser-luxury.jpg", rating:4.8, reviewCount:201, ingredients:["Chamomile Extract","Glycerin","Sodium Cocoyl Isethionate","Vitamin B5"] },
  { id:5, slug:"night-cream", nameFa:"کرم شب بازساز", nameEn:"Night Cream", category:"پوست", usd:58, image:"/night-cream-moisturizer.jpg", rating:4.6, reviewCount:98, ingredients:["Shea Butter","Retinol","Squalane","Peptides"] },
  { id:6, slug:"face-mask", nameFa:"ماسک پاکسازی صورت", nameEn:"Face Mask", category:"پوست", usd:42, image:"/luxury-face-mask-skincare.jpg", rating:4.9, reviewCount:167, ingredients:["Kaolin Clay","Green Tea","Charcoal","Lavender Oil"] },
  { id:7, slug:"toner", nameFa:"تونر رز بالانس", nameEn:"Toner", category:"پوست", usd:35, image:"/face-toner-skincare.jpg", rating:4.7, reviewCount:142, ingredients:["Rose Water","Witch Hazel","Glycerin","Niacinamide"] },
  { id:8, slug:"retinol-treatment", nameFa:"درمان رتینول شب", nameEn:"Retinol Treatment", category:"پوست", usd:68, image:"/retinol-treatment-skincare.jpg", rating:4.8, reviewCount:178, ingredients:["Retinol","Peptides","Squalane","Vitamin E"] },
  { id:9, slug:"silk-serum", nameFa:"سرم ابریشمی بنفش", nameEn:"Silk Serum", category:"پوست", usd:49.99, image:"/luxury-purple-cosmetic-serum-bottle.jpg", rating:4.8, reviewCount:124, ingredients:["Silk Protein","Hyaluronic Acid","Rose Hip Oil","Vitamin C"] },
  { id:10, slug:"lavender-mask", nameFa:"ماسک اسطوخودوس", nameEn:"Lavender Mask", category:"پوست", usd:39.99, image:"/luxury-purple-face-mask-jar.jpg", rating:4.9, reviewCount:89, ingredients:["Lavender Extract","Aloe Vera","Chamomile","Glycerin"] },
  { id:11, slug:"pearl-cream", nameFa:"کرم مروارید", nameEn:"Pearl Cream", category:"پوست", usd:59.99, image:"/luxury-white-pearl-cream-jar.jpg", rating:4.7, reviewCount:156, ingredients:["Pearl Powder","Shea Butter","Gold Leaf","Hyaluronic Acid"] },
  { id:12, slug:"rose-oil", nameFa:"روغن رز الیکسیر", nameEn:"Rose Oil", category:"پوست", usd:44.99, image:"/luxury-rose-oil-bottle.jpg", rating:4.8, reviewCount:201, ingredients:["Rose Hip Oil","Jojoba Oil","Argan Oil","Vitamin E"] },
  { id:13, slug:"glow-toner", nameFa:"تونر گلو", nameEn:"Glow Toner", category:"پوست", usd:34.99, image:"/luxury-purple-toner-bottle.jpg", rating:4.6, reviewCount:98, ingredients:["Niacinamide","Glycerin","Witch Hazel","Vitamin B3"] },
  { id:14, slug:"night-elixir", nameFa:"الیکسیر شب", nameEn:"Night Elixir", category:"پوست", usd:54.99, image:"/luxury-night-serum-bottle.jpg", rating:4.9, reviewCount:167, ingredients:["Retinol","Squalane","Peptides","Lavender Oil"] },
  { id:15, slug:"velvet-cloud-lip", nameFa:"رژ لب مخملی کلود", nameEn:"Luxury Lipstick", category:"آرایش", usd:38, image:"/luxury-lipstick-makeup.jpg", rating:4.8, reviewCount:328, ingredients:["Beeswax","Jojoba Oil","Vitamin E","Color Pigments"] },
  { id:16, slug:"foundation-primer", nameFa:"پرایمر فاندیشن", nameEn:"Foundation Primer", category:"آرایش", usd:35, image:"/foundation-primer-makeup.jpg", rating:4.7, reviewCount:132, ingredients:["Silicones","Glycerin","Vitamin E","Mineral Pigments"] },
  { id:17, slug:"mascara-pro", nameFa:"ریمل پرو", nameEn:"Mascara Pro", category:"آرایش", usd:32, image:"/mascara-professional-makeup.jpg", rating:4.9, reviewCount:189, ingredients:["Waxes","Film-forming Agents","Pigments","Oils"] },
  { id:18, slug:"luminous-eye-veil", nameFa:"سایه چشم لومینوس ویل", nameEn:"Eye Shadow Palette", category:"آرایش", usd:55, image:"/eyeshadow-palette-makeup.jpg", rating:4.8, reviewCount:97, ingredients:["Mica","Talc","Iron Oxides","Titanium Dioxide"] },
  { id:19, slug:"blush", nameFa:"رژگونه مخملی", nameEn:"Blush", category:"آرایش", usd:28, image:"/blush-makeup-product.jpg", rating:4.6, reviewCount:118, ingredients:["Talc","Mica","Color Pigments","Oils"] },
  { id:20, slug:"eyeliner", nameFa:"خط چشم دقیق", nameEn:"Eyeliner", category:"آرایش", usd:22, image:"/eyeliner-makeup.jpg", rating:4.7, reviewCount:154, ingredients:["Waxes","Film-formers","Pigments","Emollients"] },
  { id:21, slug:"foundation", nameFa:"فاندیشن اسکین ویل", nameEn:"Foundation", category:"آرایش", usd:48, image:"/foundation-makeup-product.jpg", rating:4.8, reviewCount:203, ingredients:["Water","Silicones","Pigments","Preservatives"] },
  { id:22, slug:"highlighter", nameFa:"هایلایتر لومینوس", nameEn:"Highlighter", category:"آرایش", usd:32, image:"/highlighter-makeup-product.jpg", rating:4.9, reviewCount:176, ingredients:["Mica","Silica","Color Pigments","Binders"] },
  { id:23, slug:"liquid-lipstick", nameFa:"رژ لب مایع", nameEn:"Liquid Lipstick", category:"آرایش", usd:29.99, image:"/liquid-lipstick-makeup.jpg", rating:4.7, reviewCount:142, ingredients:["Film-formers","Resins","Pigments","Emollients"] },
  { id:24, slug:"afterlight-eau-de-parfum", nameFa:"ادوپرفیوم افترلایت", nameEn:"Floral Fragrance", category:"عطر", usd:85, image:"/floral-fragrance-perfume.jpg", rating:4.8, reviewCount:184, ingredients:["Rose","Jasmine","Peony","Vanilla"] },
  { id:25, slug:"vanilla-fragrance", nameFa:"عطر وانیلا امبر", nameEn:"Vanilla Fragrance", category:"عطر", usd:75, image:"/vanilla-fragrance-perfume.jpg", rating:4.7, reviewCount:165, ingredients:["Vanilla","Caramel","Amber","Musk"] },
  { id:26, slug:"citrus-splash", nameFa:"عطر سیتروس اسپلش", nameEn:"Citrus Splash", category:"عطر", usd:68, image:"/citrus-splash-perfume.jpg", rating:4.9, reviewCount:178, ingredients:["Lemon","Orange","Bergamot","Grapefruit"] },
  { id:27, slug:"woody-essence", nameFa:"عطر وودی اسنس", nameEn:"Woody Essence", category:"عطر", usd:92, image:"/woody-essence-perfume.jpg", rating:4.8, reviewCount:142, ingredients:["Sandalwood","Cedarwood","Vetiver","Patchouli"] },
  { id:28, slug:"ocean-breeze", nameFa:"عطر اوشن بریز", nameEn:"Ocean Breeze", category:"عطر", usd:72, image:"/ocean-breeze-perfume.jpg", rating:4.6, reviewCount:154, ingredients:["Sea Salt","Aquatic Notes","Driftwood","Seaweed"] },
  { id:29, slug:"rose-garden", nameFa:"عطر رز گاردن", nameEn:"Rose Garden", category:"عطر", usd:88, image:"/rose-garden-perfume.jpg", rating:4.9, reviewCount:201, ingredients:["Rose","Gardenia","Lily","Green Notes"] },
  { id:30, slug:"musk-elegance", nameFa:"عطر ماسک الگانس", nameEn:"Musk Elegance", category:"عطر", usd:78, image:"/musk-elegance-perfume.jpg", rating:4.7, reviewCount:167, ingredients:["Musk","Amber","Vanilla","Sandalwood"] },
  { id:31, slug:"jasmine-night", nameFa:"عطر جاسمین نایت", nameEn:"Jasmine Night", category:"عطر", usd:82, image:"/jasmine-night-perfume.jpg", rating:4.8, reviewCount:189, ingredients:["Jasmine","Tuberose","Ylang Ylang","Tonka"] },
  { id:32, slug:"lavender-essence", nameFa:"عطر لاوندر اسنس", nameEn:"Lavender Essence", category:"عطر", usd:64.99, image:"/lavender-essence-perfume.jpg", rating:4.8, reviewCount:132, ingredients:["Lavender","Chamomile","Eucalyptus","Bergamot"] },
  { id:33, slug:"hair-growth-supplement", nameFa:"مکمل رشد مو", nameEn:"Hair Growth Supplement", category:"سلامت", usd:48, image:"/hair-growth-supplement.jpg", rating:4.7, reviewCount:118, ingredients:["Biotin","Collagen","Keratin","Vitamins B & C"] },
  { id:34, slug:"collagen-powder", nameFa:"پودر کلاژن بیوتی", nameEn:"Collagen Powder", category:"سلامت", usd:55, image:"/collagen-powder-beauty.jpg", rating:4.8, reviewCount:176, ingredients:["Hydrolyzed Collagen","Vitamin C","Hyaluronic Acid","Biotin"] },
  { id:35, slug:"vitamin-serum", nameFa:"سرم ویتامین", nameEn:"Vitamin Serum", category:"سلامت", usd:52, image:"/vitamin-serum-wellness.jpg", rating:4.9, reviewCount:203, ingredients:["Vitamin C","Vitamin E","Vitamin B Complex","Antioxidants"] },
  { id:36, slug:"hydration-tablets", nameFa:"قرص هیدراته", nameEn:"Hydration Tablets", category:"سلامت", usd:35, image:"/hydration-tablets-wellness.jpg", rating:4.6, reviewCount:145, ingredients:["Electrolytes","Coconut Water","Vitamin B","Minerals"] },
  { id:37, slug:"skin-glow-capsules", nameFa:"کپسول اسکین گلو", nameEn:"Skin Glow Capsules", category:"سلامت", usd:62, image:"/skin-glow-capsules.jpg", rating:4.8, reviewCount:189, ingredients:["Astaxanthin","Lutein","Selenium","Vitamin A"] },
  { id:38, slug:"bio-serum", nameFa:"سرم بایو اکتیو", nameEn:"Bio Serum", category:"سلامت", usd:45, image:"/bio-serum-wellness.jpg", rating:4.7, reviewCount:132, ingredients:["Bioactive Peptides","Marine Extract","Hyaluronic Acid","CoQ10"] },
  { id:39, slug:"antioxidant-blend", nameFa:"ترکیب آنتی‌اکسیدان", nameEn:"Antioxidant Blend", category:"سلامت", usd:58, image:"/antioxidant-blend-wellness.jpg", rating:4.9, reviewCount:167, ingredients:["Green Tea Extract","Resveratrol","Quercetin","Polyphenols"] },
  { id:40, slug:"youth-complex", nameFa:"کمپلکس جوانی", nameEn:"Youth Complex", category:"سلامت", usd:70, image:"/youth-complex-supplement.jpg", rating:4.8, reviewCount:154, ingredients:["NAD+","Telomerase Activators","Mitochondrial Support","Anti-Aging Complex"] },
  { id:41, slug:"skincare-starter-set", nameFa:"ست شروع مراقبت پوست", nameEn:"Skincare Starter Set", category:"ست‌ها", usd:89, image:"/skincare-starter-set.jpg", rating:4.9, reviewCount:267, ingredients:["Multiple skincare actives"] },
  { id:42, slug:"makeup-essentials-bundle", nameFa:"باندل ضروری آرایش", nameEn:"Makeup Essentials Bundle", category:"ست‌ها", usd:125, image:"/makeup-essentials-bundle.jpg", rating:4.8, reviewCount:312, ingredients:["Various makeup pigments and binders"] },
  { id:43, slug:"luxury-travel-set", nameFa:"ست سفر لوکس", nameEn:"Luxury Travel Set", category:"ست‌ها", usd:79, image:"/luxury-travel-set.jpg", rating:4.7, reviewCount:198, ingredients:["Travel-size luxury products"] },
  { id:44, slug:"date-night-set", nameFa:"ست دیت نایت", nameEn:"Date Night Set", category:"ست‌ها", usd:95, image:"/date-night-makeup-set.jpg", rating:4.8, reviewCount:276, ingredients:["Glamorous makeup and fragrance"] },
  { id:45, slug:"glow-getter-set", nameFa:"ست گلو گتر", nameEn:"Glow Getter Set", category:"ست‌ها", usd:110, image:"/glow-getter-set.jpg", rating:4.9, reviewCount:287, ingredients:["Glowing skincare and makeup"] },
  { id:46, slug:"wellness-bundle", nameFa:"باندل ولنس", nameEn:"Wellness Bundle", category:"ست‌ها", usd:135, image:"/wellness-bundle-set.jpg", rating:4.8, reviewCount:234, ingredients:["Complete wellness products"] },
  { id:47, slug:"complete-beauty-set", nameFa:"ست کامل زیبایی", nameEn:"Complete Beauty Set", category:"ست‌ها", usd:150, image:"/complete-beauty-set.jpg", rating:4.9, reviewCount:298, ingredients:["Full beauty collection"] },
  { id:48, slug:"signature-collection", nameFa:"کالکشن سیگنیچر", nameEn:"Signature Collection", category:"ست‌ها", usd:180, image:"/signature-collection-set.jpg", rating:4.9, reviewCount:324, ingredients:["Premium signature products"] },
  { id:49, slug:"volumizing-shampoo", nameFa:"شامپو حجم‌دهنده", nameEn:"Volumizing Shampoo", category:"مو", usd:32, image:"/volumizing-shampoo-haircare.jpg", rating:4.7, reviewCount:156, ingredients:["Volumizing Polymers","Wheat Protein","Panthenol","Biotin"] },
  { id:50, slug:"deep-conditioner", nameFa:"نرم‌کننده عمیق", nameEn:"Deep Conditioner", category:"مو", usd:38, image:"/deep-conditioner-haircare.jpg", rating:4.8, reviewCount:189, ingredients:["Keratin","Argan Oil","Shea Butter","Silk Proteins"] },
  { id:51, slug:"hair-growth-serum", nameFa:"سرم رشد مو", nameEn:"Hair Growth Serum", category:"مو", usd:48, image:"/hair-growth-serum.jpg", rating:4.9, reviewCount:214, ingredients:["Minoxidil","Caffeine","Biotin","Plant Extracts"] },
  { id:52, slug:"silk-hair-mask", nameFa:"ماسک ابریشمی مو", nameEn:"Silk Hair Mask", category:"مو", usd:42, image:"/silk-hair-mask-treatment.jpg", rating:4.8, reviewCount:167, ingredients:["Silk Proteins","Hyaluronic Acid","Panthenol","Vitamin E"] },
  { id:53, slug:"keratin-treatment", nameFa:"درمان کراتین", nameEn:"Keratin Treatment", category:"مو", usd:55, image:"/keratin-treatment-haircare.jpg", rating:4.9, reviewCount:245, ingredients:["Brazilian Keratin","Collagen","Amino Acids","Formaldehyde-free"] },
  { id:54, slug:"anti-frizz-spray", nameFa:"اسپری ضد وز", nameEn:"Anti-Frizz Spray", category:"مو", usd:28, image:"/anti-frizz-spray-haircare.jpg", rating:4.7, reviewCount:132, ingredients:["Silicone Oil","Argan Oil","Vitamin E","UV Protectant"] },
  { id:55, slug:"hair-oil-elixir", nameFa:"روغن الیکسیر مو", nameEn:"Hair Oil Elixir", category:"مو", usd:35, image:"/hair-oil-elixir.jpg", rating:4.8, reviewCount:178, ingredients:["Argan Oil","Coconut Oil","Jojoba Oil","Lavender Essential Oil"] },
  { id:56, slug:"scalp-therapy-shampoo", nameFa:"شامپو درمان پوست سر", nameEn:"Scalp Therapy Shampoo", category:"مو", usd:36, image:"/scalp-therapy-shampoo.jpg", rating:4.6, reviewCount:145, ingredients:["Salicylic Acid","Tea Tree Oil","Zinc Pyrithione","Aloe Vera"] }
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

function usageFa(raw: RawProduct): string {
  const n = raw.nameEn.toLowerCase();
  if (raw.category === "عطر") return "۲ تا ۳ اسپری روی نقاط نبض مثل مچ و گردن بزن. برای ماندگاری بهتر، روی پوست تمیز استفاده کن و عطر را روی پوست نمال.";
  if (raw.category === "مو") {
    if (n.includes("shampoo")) return "روی مو و پوست سر خیس ماساژ بده و سپس کامل آبکشی کن. دفعات مصرف را با نیاز مو و پوست سر تنظیم کن.";
    if (n.includes("conditioner") || n.includes("mask")) return "پس از شست‌وشو روی ساقه و نوک مو پخش کن، چند دقیقه مکث بده و سپس آبکشی کن.";
    return "مقدار کمی روی مو یا پوست سر استفاده کن و مطابق نوع محصول به‌آرامی پخش یا ماساژ بده.";
  }
  if (raw.category === "آرایش") {
    if (n.includes("lip")) return "روی لب تمیز از مرکز به سمت گوشه‌ها بزن. برای دقت بیشتر می‌توانی از خط لب استفاده کنی.";
    if (n.includes("mascara")) return "برس را از ریشه مژه به سمت نوک حرکت بده و در صورت نیاز یک لایه دیگر اضافه کن.";
    if (n.includes("eyeliner")) return "در امتداد خط مژه با فشار کنترل‌شده بکش و شدت خط را مرحله‌ای بیشتر کن.";
    if (n.includes("foundation") || n.includes("primer")) return "روی پوست آماده و مرطوب‌شده مقدار کمی بزن و با اسفنج، براش یا انگشت یکنواخت پخش کن.";
    return "با مقدار کم شروع کن و محصول را مرحله‌ای روی ناحیه موردنظر پخش و محو کن.";
  }
  if (raw.category === "پوست") {
    if (n.includes("cleanser")) return "روی پوست مرطوب ماساژ بده و با آب ولرم کامل آبکشی کن. از تماس مستقیم با چشم خودداری کن.";
    if (n.includes("mask")) return "یک لایه یکنواخت روی پوست تمیز بزن، مدت کوتاهی مکث بده و سپس با آب ولرم آبکشی کن.";
    if (n.includes("retinol")) return "شب‌ها با دفعات کم شروع کن و در صورت سازگاری پوست به‌تدریج بیشتر کن. روزها ضدآفتاب استفاده کن.";
    if (n.includes("toner")) return "پس از شست‌وشو روی پوست تمیز با دست یا پد به‌آرامی پخش کن و سپس سرم یا مرطوب‌کننده بزن.";
    return "روی پوست تمیز مقدار کمی بزن و به‌آرامی ماساژ بده تا جذب شود. برای روتین صبح یا شب قابل استفاده است.";
  }
  if (raw.category === "ست‌ها") return "محصولات ست را بر اساس ترتیب روتین و دستور هر محصول استفاده کن. از مصرف هم‌زمان ترکیبات ناسازگار خودداری کن.";
  return "طبق دستور روی بسته‌بندی و نیاز شخصی استفاده کن. اگر محصول خوراکی یا مکمل است، اطلاعات رسمی محصول و نظر متخصص را مبنا قرار بده.";
}

function benefitsFa(raw: RawProduct): string[] {
  if (raw.category === "عطر") return ["رایحه لایه‌مند", "مناسب استفاده روزانه یا مناسبتی", "طراحی پریمیوم"];
  if (raw.category === "مو") return ["مراقبت از ظاهر و حس مو", "استفاده آسان در روتین", "فرمول متناسب با دسته محصول"];
  if (raw.category === "آرایش") return ["پخش و کنترل آسان", "قابل لایه‌سازی", "مناسب استایل روزانه و حرفه‌ای"];
  if (raw.category === "پوست") return ["مناسب روتین منظم", "بافت کاربردی", "ترکیبات شناخته‌شده در مراقبت پوست"];
  if (raw.category === "ست‌ها") return ["روتین هماهنگ", "انتخاب سریع‌تر", "مناسب هدیه یا شروع روتین"];
  return ["استفاده ساده", "اطلاعات شفاف محصول", "مناسب تکمیل روتین شخصی"];
}

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
  shades: shadeFamilies[raw.id],
  ingredients: raw.ingredients,
  usageFa: usageFa(raw),
  benefitsFa: benefitsFa(raw)
}));

export const categories = ["همه", "پوست", "آرایش", "عطر", "مو", "ست‌ها", "سلامت"] as const;
