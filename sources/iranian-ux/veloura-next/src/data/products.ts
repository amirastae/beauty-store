export type Shade = {
  id: string;
  nameFa: string;
  hex: string;
};

export type Product = {
  id: string;
  slug: string;
  nameFa: string;
  nameEn: string;
  brand: string;
  category: "لب" | "پوست" | "عطر" | "چشم";
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  badge?: string;
  image: string;
  imageAlt: string;
  shades?: Shade[];
};

export const products: Product[] = [
  {
    id: "lip-velvet-01",
    slug: "velvet-cloud-lip",
    nameFa: "رژ لب مخملی کلود",
    nameEn: "Velvet Cloud Lip",
    brand: "FATIKHAN",
    category: "لب",
    price: 1890000,
    compareAtPrice: 2190000,
    rating: 4.9,
    reviewCount: 328,
    badge: "پرفروش",
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1200&q=88",
    imageAlt: "رژ لب لوکس FATIKHAN",
    shades: [
      { id: "rose", nameFa: "رز خاموش", hex: "#A85B67" },
      { id: "berry", nameFa: "بری عمیق", hex: "#6B263B" },
      { id: "nude", nameFa: "نود گرم", hex: "#B77B68" }
    ]
  },
  {
    id: "serum-01",
    slug: "pearl-barrier-serum",
    nameFa: "سرم سد دفاعی پرل",
    nameEn: "Pearl Barrier Serum",
    brand: "FATIKHAN",
    category: "پوست",
    price: 2740000,
    rating: 4.8,
    reviewCount: 211,
    badge: "جدید",
    image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=1200&q=88",
    imageAlt: "سرم مراقبت پوست لوکس"
  },
  {
    id: "perfume-01",
    slug: "afterlight-eau-de-parfum",
    nameFa: "ادوپرفیوم افترلایت",
    nameEn: "Afterlight Eau de Parfum",
    brand: "FATIKHAN",
    category: "عطر",
    price: 4980000,
    rating: 4.9,
    reviewCount: 184,
    badge: "امضای FATIKHAN",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=88",
    imageAlt: "شیشه عطر لوکس FATIKHAN"
  },
  {
    id: "eye-01",
    slug: "luminous-eye-veil",
    nameFa: "سایه چشم لومینوس ویل",
    nameEn: "Luminous Eye Veil",
    brand: "FATIKHAN",
    category: "چشم",
    price: 2240000,
    rating: 4.7,
    reviewCount: 97,
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=88",
    imageAlt: "پالت سایه چشم لوکس",
    shades: [
      { id: "champagne", nameFa: "شامپاین", hex: "#D4B184" },
      { id: "bronze", nameFa: "برنز", hex: "#8B5C42" },
      { id: "plum", nameFa: "آلوئی", hex: "#684252" }
    ]
  }
];

export const categories = ["همه", "لب", "پوست", "عطر", "چشم"] as const;
