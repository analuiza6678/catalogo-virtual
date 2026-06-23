export type Store = {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  banner_url: string | null;
  description: string;
  whatsapp_number: string;
  whatsapp_default_message: string | null;
  primary_color: string;
  address: string | null;
  business_hours: string | null;
  instagram_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  store_id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  store_id: string;
  category_id: string;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  price: number;
  compare_price: number | null;
  image_url: string;
  gallery_urls: string[];
  sku: string | null;
  is_available: boolean;
  is_featured: boolean;
  is_promotion: boolean;
  is_new?: boolean;
  material?: string | null;
  color?: string | null;
  size?: string | null;
  notes?: string | null;
  tags?: string[];
  whatsapp_message?: string | null;
  stock?: number | null;
  created_at: string;
  updated_at: string;
};

export type ProductWithCategory = Product & {
  category?: Category | null;
};
