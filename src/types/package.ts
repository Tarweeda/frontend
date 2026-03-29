export interface SupperPackage {
  id: string;
  slug: string;
  icon: string;
  name: string;
  price_pence: number;
  guests: number;
  inclusions: string;
  is_featured: boolean;
  is_enquiry: boolean;
  sort_order: number;
}
