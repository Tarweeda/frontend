export interface Product {
  id: string;
  slug: string;
  category: 'staples' | 'pantry';
  name: string;
  description: string;
  tagline: string;
  price_pence: number;
  unit: string;
  tag: string;
  image_path: string | null;
  in_stock: boolean;
  sort_order: number;
}

export interface CartItem extends Product {
  qty: number;
}
