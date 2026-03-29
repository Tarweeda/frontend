export interface GiftHamper {
  id: string;
  slug: string;
  name: string;
  description: string;
  price_pence: number;
  contents: string;
  image_path: string | null;
  sort_order: number;
  in_stock: boolean;
}
